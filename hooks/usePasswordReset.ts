import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { useToast } from './use-toast'
import { useAuth } from './useAuth'

interface PasswordResetData {
  old_password?: string
  new_password: string
  user_id?: number
}

export const usePasswordReset = () => {
  const { toast } = useToast()
  const { user, isDevRole, isSuperAdminRole } = useAuth()

  const resetPassword = useMutation({
    mutationFn: async (data: PasswordResetData) => {
      // If dev role, use dev endpoint
      if (isDevRole()) {
        const response = await api.post('/auth/dev-reset-password/', {
          new_password: data.new_password,
          user_id: data.user_id,
        })
        return response.data
      }

      // If super admin resetting other admin's password
      if (isSuperAdminRole() && data.user_id && data.user_id !== user?.id) {
        const response = await api.post('/auth/admin-reset-password/', {
          new_password: data.new_password,
          user_id: data.user_id,
        })
        return response.data
      }

      // Regular password reset with old password
      const response = await api.post('/auth/reset-password/', {
        old_password: data.old_password,
        new_password: data.new_password,
      })
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Пароль успешно обновлен.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Не удалось обновить пароль.',
        variant: 'destructive',
      })
    },
  })

  return { resetPassword }
}
