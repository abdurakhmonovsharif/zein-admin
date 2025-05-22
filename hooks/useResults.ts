import api from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Define the ExamResult type to match your backend
export interface ExamResult {
  id: number;
  user: string;
  language: string;
  proficiency_level: string;
  exam_type: string;
  exam_score: string;
  created_at: string;
  updated_at: string;
  details: Array<{ component: string, score: string }>;
  image: File | null;
}

// 1. Fetch ExamResults
const fetchExamResults = async (): Promise<ExamResult[]> => {
  const res = await api.get("/exam-results/")
  return res.data
}

// 2. Add ExamResult
const addExamResult = async (newExamResult: FormData): Promise<ExamResult> => {
  for (var pair of newExamResult.entries()) {
    if (pair[1] instanceof File) {
      console.log(`${pair[0]}:`, {
        name: pair[1].name,
        size: pair[1].size,
        type: pair[1].type
      });
    } else {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }
  const res = await api.post("/exam-results/", newExamResult)
  return res.data
}

const updateExamResult = async ({ formData, id }: { formData: FormData, id: string }): Promise<ExamResult> => {
  const res = await api.put(`/exam-results/${id}/`, formData)
  return res.data
}


// 4. Delete ExamResult
const deleteExamResult = async (id: number): Promise<void> => {
  await api.delete(`/exam-results/${id}/`)
}

// 5. useExamResults hook
export function useExamResults() {
  const queryClient = useQueryClient()

  // Fetching
  const {
    data,
    isLoading,
    error,
  } = useQuery<ExamResult[], Error>({
    queryKey: ["examResults"],
    queryFn: fetchExamResults,
  })

  // Add ExamResult
  const addExamResultMutation = useMutation<ExamResult, Error, FormData, { previousExamResults?: ExamResult[] }>({
    mutationFn: addExamResult,
    onMutate: async () => {
      console.log();

      await queryClient.cancelQueries({ queryKey: ["examResults"] })
      const previousExamResults = queryClient.getQueryData<ExamResult[]>(["examResults"])

      return { previousExamResults }
    },
    onError: (_err, _newExamResult, context) => {
      if (context?.previousExamResults) {
        queryClient.setQueryData(["examResults"], context.previousExamResults)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["examResults"] })
    },
  })
const updateExamResultMutation = useMutation<
  ExamResult,
  Error,
  { formData: FormData; id: string },
  { previousExamResults?: ExamResult[] }
>({
  mutationFn: updateExamResult,
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: ["examResults"] })
    const previousExamResults = queryClient.getQueryData<ExamResult[]>(["examResults"])
    return { previousExamResults }
  },
  onError: (_err, _updatedExamResult, context) => {
    if (context?.previousExamResults) {
      queryClient.setQueryData(["examResults"], context.previousExamResults)
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["examResults"] })
  },
})

  // Delete ExamResult
  const deleteExamResultMutation = useMutation<void, Error, number, { previousExamResults?: ExamResult[] }>({
    mutationFn: deleteExamResult,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["examResults"] })
      const previousExamResults = queryClient.getQueryData<ExamResult[]>(["examResults"])

      queryClient.setQueryData<ExamResult[]>(["examResults"], (oldExamResults = []) =>
        oldExamResults.filter((result) => result.id !== id)
      )

      return { previousExamResults }
    },
    onError: (_err, _id, context) => {
      if (context?.previousExamResults) {
        queryClient.setQueryData(["examResults"], context.previousExamResults)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["examResults"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    addExamResultMutation,
    updateExamResultMutation,
    deleteExamResultMutation,
  }
}
