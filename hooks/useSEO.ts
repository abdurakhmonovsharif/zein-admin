import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface SEO {
  id?: number
  metaTitle: string
  metaDescription: string
  keywords: string
  ogImage: File | string | null
}

export const useSEO = () => {
  const queryClient = useQueryClient()

  // Fetch SEO settings
  const { data, isLoading, error } = useQuery({
    queryKey: ["seo"],
    queryFn: async () => {
      const response = await api.get("/seo/")
      return response.data
    },
  })

  // Update SEO settings
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.put(`/seo/${formData.get('id')}/`, formData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo"] })
    },
  })

  // Create SEO settings
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/seo/", formData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    updateMutation,
    createMutation,
  }
}
