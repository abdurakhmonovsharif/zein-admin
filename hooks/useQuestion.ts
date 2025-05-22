import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Define Choice and Question types
export interface Choice {
  id: number
  text: string
  is_correct: boolean
}

export interface Question {
  id: number
  topic_id: number|null
  text: string
  explanation?: string
  image?: string
  created_at?: string
  updated_at?: string
  choices: Choice[] // Changed from optional to required
}

// 1. Fetch Questions (with choices included)
const fetchQuestions = async (): Promise<Question[]> => {
  const res = await api.get("/questions/")
  return res.data
}

// 2. Add Question (with choices)
const addQuestion = async (newQuestion: Partial<Question>): Promise<Question> => {
  // Make sure we're sending the complete question data including choices
  const res = await api.post("/questions/", newQuestion)
  return res.data
}

// 3. Update Question
const updateQuestion = async (updatedQuestion: Question): Promise<Question> => {
  // Ensure we're sending the complete question data including choices
  const res = await api.put(`/questions/${updatedQuestion.id}/`, updatedQuestion)
  return res.data
}

// 4. Delete Question
const deleteQuestion = async (id: number): Promise<void> => {
  await api.delete(`/questions/${id}/`)
}

// 5. useQuestions hook
export function useQuestions() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  })

  const addQuestionMutation = useMutation<Question, Error, Partial<Question>, { previousQuestions?: Question[] }>({
    mutationFn: addQuestion,
    onMutate: async (newQuestion) => {
      await queryClient.cancelQueries({ queryKey: ["questions"] })
      const previousQuestions = queryClient.getQueryData<Question[]>(["questions"])
      queryClient.setQueryData<Question[]>(["questions"], (old = []) => [...old, newQuestion as Question])
      return { previousQuestions }
    },
    onError: (_err, _new, context) => {
      if (context?.previousQuestions) {
        queryClient.setQueryData(["questions"], context.previousQuestions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })

  const updateQuestionMutation = useMutation<Question, Error, Question, { previousQuestions?: Question[] }>({
    mutationFn: updateQuestion,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["questions"] })
      const previousQuestions = queryClient.getQueryData<Question[]>(["questions"])
      queryClient.setQueryData<Question[]>(["questions"], (old = []) =>
        old.map((q) => (q.id === updated.id ? updated : q)),
      )
      return { previousQuestions }
    },
    onError: (_err, _updated, context) => {
      if (context?.previousQuestions) {
        queryClient.setQueryData(["questions"], context.previousQuestions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })

  const deleteQuestionMutation = useMutation<void, Error, number, { previousQuestions?: Question[] }>({
    mutationFn: deleteQuestion,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["questions"] })
      const previousQuestions = queryClient.getQueryData<Question[]>(["questions"])
      queryClient.setQueryData<Question[]>(["questions"], (old = []) => old.filter((q) => q.id !== id))
      return { previousQuestions }
    },
    onError: (_err, _id, context) => {
      if (context?.previousQuestions) {
        queryClient.setQueryData(["questions"], context.previousQuestions)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    addQuestionMutation,
    updateQuestionMutation,
    deleteQuestionMutation,
  }
}
