import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Define the Subject type to match your backend
export interface Subject {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at?: string;
  topic_count?:number;
}


// 1. Fetch Subjects
const fetchSubjects = async (): Promise<Subject[]> => {
  const res = await api.get("/subjects/");
  return res.data;
};

// 2. Add Subject
const addSubject = async (newSubject: Subject): Promise<Subject> => {
  const res = await api.post("/subjects/", newSubject);
  return res.data;
};

// 3. Update Subject
const updateSubject = async (updatedSubject: Subject): Promise<Subject> => {
  const res = await api.put(`/subjects/${updatedSubject.id}/`, updatedSubject);
  return res.data;
};

// 4. Delete Subject
const deleteSubject = async (id: number): Promise<void> => {
  await api.delete(`/subjects/${id}/`);
};

// 5. useSubjects hook
export function useSubjects() {
  const queryClient = useQueryClient();

  // Fetching
  const {
    data,
    isLoading,
    error,
  } = useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  // Add Subject
  const addSubjectMutation = useMutation<Subject, Error, Subject, { previousSubjects?: Subject[] }>({
    mutationFn: addSubject,
    onMutate: async (newSubject) => {
      await queryClient.cancelQueries({ queryKey: ["subjects"] });
      const previousSubjects = queryClient.getQueryData<Subject[]>(["subjects"]);

      queryClient.setQueryData<Subject[]>(["subjects"], (oldSubjects = []) => [...oldSubjects, newSubject]);

      return { previousSubjects };
    },
    onError: (_err, _newSubject, context) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(["subjects"], context.previousSubjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  // Update Subject
  const updateSubjectMutation = useMutation<Subject, Error, Subject, { previousSubjects?: Subject[] }>({
    mutationFn: updateSubject,
    onMutate: async (updatedSubject) => {
      await queryClient.cancelQueries({ queryKey: ["subjects"] });
      const previousSubjects = queryClient.getQueryData<Subject[]>(["subjects"]);

      queryClient.setQueryData<Subject[]>(["subjects"], (oldSubjects = []) =>
        oldSubjects.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject))
      );

      return { previousSubjects };
    },
    onError: (_err, _updatedSubject, context) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(["subjects"], context.previousSubjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  // Delete Subject
  const deleteSubjectMutation = useMutation<void, Error, number, { previousSubjects?: Subject[] }>({
    mutationFn: deleteSubject,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["subjects"] });
      const previousSubjects = queryClient.getQueryData<Subject[]>(["subjects"]);

      queryClient.setQueryData<Subject[]>(["subjects"], (oldSubjects = []) =>
        oldSubjects.filter((subject) => subject.id !== id)
      );

      return { previousSubjects };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSubjects) {
        queryClient.setQueryData(["subjects"], context.previousSubjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,
  };
}
