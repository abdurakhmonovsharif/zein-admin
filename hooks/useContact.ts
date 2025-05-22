import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface Contact {
  id?: number
  phone: string
  email: string
  hero_banner: string | null
  telegram: string
  instagram: string
}

// Fetch contact
const fetchContact = async (): Promise<Contact> => {
  const response = await api.get("/contacts/")
  // If the response is an array, take the first contact
  if (Array.isArray(response.data)) {
    return response.data[0] || null;
  }
  return response.data
}

// Update contact
const updateContact = async (formData: FormData): Promise<Contact> => {
  const id = formData.get('id')
  const response = await api.put(`/contacts/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Create contact
const createContact = async (formData: FormData): Promise<Contact> => {
  const response = await api.post("/contacts/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export function useContact() {
  const queryClient = useQueryClient()

  // Fetch contact
  const { data, isLoading, error } = useQuery<Contact>({
    queryKey: ["contact"],
    queryFn: fetchContact,
  })

  // Update contact
  const updateMutation = useMutation<Contact, Error, FormData>({
    mutationFn: updateContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] })
    },
  })

  // Create contact if doesn't exist
  const createMutation = useMutation<Contact, Error, FormData>({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] })
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
