import { default as api } from '@/lib/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface AdminUser {
  id: number
  full_name: string
  username: string
  date_joined: string
  role: string
}

export interface AdminUserCreate {
  full_name: string
  username: string
  password: string
}

export interface AdminUserUpdate {
  full_name?: string
  username?: string
}

export const useAdmins = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await api.get('/admins/')
      return response.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (newAdmin: AdminUserCreate) => {
      const response = await api.post('/admins/', newAdmin)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: AdminUserUpdate }) => {
      const response = await api.patch(`/admins/${id}/`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admins/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ id, newPassword }: { id: number, newPassword: string }) => {
      await api.post(`/auth/dev/reset-password/${id}/`, {
        new_password: newPassword
      })
    }
  })

  return {
    admins: data as AdminUser[] | undefined,
    isLoading,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
    resetPasswordMutation
  }
}
