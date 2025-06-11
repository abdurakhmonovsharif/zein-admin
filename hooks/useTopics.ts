import api from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Subject } from "./useSubject";

export interface Topic {
  id: number;
  name_uz: string;
  name_ru: string;
  description: string;
  question_count: number;
  subject: Subject;
  subject_id: number;
  created_at:string
}
export interface CreateTopic {
  id: number;
  name_ru: string;
  name_uz: string;
  description: string;
  question_count: number;
  subject: number;
  created_at:string
}


// 1. Fetch Topics with optional subject filter
const fetchTopics = async (
  subjectId?: string,
  sortOrder: "asc" | "desc" = "asc"
): Promise<Topic[]> => {
  const params: any = {};
  if (subjectId) params.subject_id = subjectId;
  params.ordering = sortOrder === "asc" ? "created_at" : "-created_at";

  const res = await api.get("/topics/", { params });
  return res.data;
};
// 2. Add Topic
const addTopic = async (
  newTopic: Omit<CreateTopic, "id" | "question_count">
): Promise<Topic> => {
  const res = await api.post("/topics/", newTopic);
  return res.data;
};

// 3. Update Topic
const updateTopic = async (updatedTopic: CreateTopic): Promise<Topic> => {
  const res = await api.put(`/topics/${updatedTopic.id}/`, updatedTopic);
  return res.data;
};

// 4. Delete Topic
const deleteTopic = async (id: number): Promise<void> => {
  await api.delete(`/topics/${id}/`);
};

// ✅ 5. useTopics hook with filtering
export function useTopics(subjectId?: string,sortOrder: "asc" | "desc" = "asc") {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<Topic[], Error>({
    queryKey: ["topics", subjectId,sortOrder],
    queryFn: () => fetchTopics(subjectId,sortOrder),
  });

  const addTopicMutation = useMutation<
    Topic,
    Error,
    Omit<CreateTopic, "id" | "question_count">,
    { previousTopics?: Topic[] }
  >({
    mutationFn: addTopic,
    onMutate: async (newTopic) => {
      await queryClient.cancelQueries({ queryKey: ["topics", subjectId] });
      const previousTopics = queryClient.getQueryData<Topic[]>([
        "topics",
        subjectId,
      ]);

      queryClient.setQueryData<CreateTopic[]>(["topics", subjectId], (old = []) => [
        ...old,
        {
          ...newTopic,
          id: Math.random(),
          question_count: 0,
         
        },
      ]);

      return { previousTopics };
    },
    onError: (_err, _newTopic, context) => {
      if (context?.previousTopics) {
        queryClient.setQueryData(["topics", subjectId], context.previousTopics);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["topics", subjectId] });
    },
  });

  const updateTopicMutation = useMutation<
    Topic,
    Error,
    CreateTopic,
    { previousTopics?: Topic[] }
  >({
    mutationFn: updateTopic,
    onMutate: async (updatedTopic) => {
      await queryClient.cancelQueries({ queryKey: ["topics", subjectId] });
      const previousTopics = queryClient.getQueryData<Topic[]>([
        "topics",
        subjectId,
      ]);

      queryClient.setQueryData<CreateTopic[]>(["topics", subjectId], (old = []) =>
        old.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
      );

      return { previousTopics };
    },
    onError: (_err, _updatedTopic, context) => {
      if (context?.previousTopics) {
        queryClient.setQueryData(["topics", subjectId], context.previousTopics);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["topics", subjectId] });
    },
  });

  const deleteTopicMutation = useMutation<
    void,
    Error,
    number,
    { previousTopics?: Topic[] }
  >({
    mutationFn: deleteTopic,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["topics", subjectId] });
      const previousTopics = queryClient.getQueryData<Topic[]>([
        "topics",
        subjectId,
      ]);

      queryClient.setQueryData<Topic[]>(["topics", subjectId], (old = []) =>
        old.filter((t) => t.id !== id)
      );

      return { previousTopics };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTopics) {
        queryClient.setQueryData(["topics", subjectId], context.previousTopics);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["topics", subjectId] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addTopicMutation,
    updateTopicMutation,
    deleteTopicMutation,
  };
}
