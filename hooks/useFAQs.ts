import api from "@/lib/axios"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

// Define the FAQ type to match your backend
export interface FAQ {
  id: number
  question: string
  answer: string
  order: number
}

// 1. Fetch FAQs
const fetchFAQs = async (): Promise<FAQ[]> => {
  const res = await api.get("/faq/")
  return res.data
}

// 2. Add FAQ
const addFAQ = async (newFAQ: FAQ): Promise<FAQ> => {
  const res = await api.post("/faq/", newFAQ)
  return res.data
}

// 3. Update FAQ
const updateFAQ = async (updatedFAQ: FAQ): Promise<FAQ> => {
  const res = await api.put(`/faq/${updatedFAQ.id}/`, updatedFAQ)
  return res.data
}

// 4. Delete FAQ
const deleteFAQ = async (id: number): Promise<void> => {
  await api.delete(`/faq/${id}/`)
}

// 5. useFAQs hook
export function useFAQs() {
  const queryClient = useQueryClient()

  // Fetching
  const {
    data,
    isLoading,
    error,
  } = useQuery<FAQ[], Error>({
    queryKey: ["faqs"],
    queryFn: fetchFAQs,
  })

  // Add FAQ
  const addFAQMutation = useMutation<FAQ, Error, FAQ, { previousFAQs?: FAQ[] }>({
    mutationFn: addFAQ,
    onMutate: async (newFAQ) => {
      await queryClient.cancelQueries({ queryKey: ["faqs"] })
      const previousFAQs = queryClient.getQueryData<FAQ[]>(["faqs"])

      queryClient.setQueryData<FAQ[]>(["faqs"], (oldFAQs = []) => [...oldFAQs, newFAQ])

      return { previousFAQs }
    },
    onError: (_err, _newFAQ, context) => {
      if (context?.previousFAQs) {
        queryClient.setQueryData(["faqs"], context.previousFAQs)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
    },
  })

  // Update FAQ
  const updateFAQMutation = useMutation<FAQ, Error, FAQ, { previousFAQs?: FAQ[] }>({
    mutationFn: updateFAQ,
    onMutate: async (updatedFAQ) => {
      await queryClient.cancelQueries({ queryKey: ["faqs"] })
      const previousFAQs = queryClient.getQueryData<FAQ[]>(["faqs"])

      queryClient.setQueryData<FAQ[]>(["faqs"], (oldFAQs = []) =>
        oldFAQs.map((faq) => (faq.id === updatedFAQ.id ? updatedFAQ : faq))
      )

      return { previousFAQs }
    },
    onError: (_err, _updatedFAQ, context) => {
      if (context?.previousFAQs) {
        queryClient.setQueryData(["faqs"], context.previousFAQs)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
    },
  })

  // Delete FAQ
  const deleteFAQMutation = useMutation<void, Error, number, { previousFAQs?: FAQ[] }>({
    mutationFn: deleteFAQ,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["faqs"] })
      const previousFAQs = queryClient.getQueryData<FAQ[]>(["faqs"])

      queryClient.setQueryData<FAQ[]>(["faqs"], (oldFAQs = []) =>
        oldFAQs.filter((faq) => faq.id !== id)
      )

      return { previousFAQs }
    },
    onError: (_err, _id, context) => {
      if (context?.previousFAQs) {
        queryClient.setQueryData(["faqs"], context.previousFAQs)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    addFAQMutation,
    updateFAQMutation,
    deleteFAQMutation,
  }
}
