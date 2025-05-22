import { default as api } from '@/lib/axios'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  full_name: string
  username: string
  date_joined: string
  role: 'dev' | 'super_admin' | 'admin'
}

interface ProfileUpdate {
  full_name?: string
  username?: string
}

interface PasswordUpdate {
  old_password?: string
  new_password: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  getMe: () => Promise<void>
  updateProfile: (data: ProfileUpdate) => Promise<void>
  changePassword: (data: PasswordUpdate) => Promise<void>
  isDevRole: () => boolean
  isSuperAdminRole: () => boolean
  isAdminRole: () => boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          const response = await api.post('/auth/login/', {
            username,
            password,
          })

          const { access, user } = response.data

          // Set the token in axios defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`

          // Set the token in cookies (expires in 7 days)
          Cookies.set('token', access, { expires: 7, path: '/' })

          // Update state
          set({
            user,
            token: access,
            isAuthenticated: true,
          })

          // Store token in localStorage as backup
          localStorage.setItem('token', access)
          } catch (error) {
    // Only log detailed errors in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error('Login error:', error)

      // Log the full error response to help with debugging
      if (error instanceof AxiosError && error.response) {
        console.log('Login error response:', error.response.data)
      }
    }

    // Enhance error handling without logging in production
    if (error instanceof AxiosError) {
      // If it's a 400 Bad Request
      if (error.response?.status === 400) {
        // Check if there's specific error detail
        const errorDetail = error.response.data?.detail || error.response.data?.error || "Неверный запрос"
        throw new Error(errorDetail)
      }
    }

    throw error
        }
      },
      getMe: async () => {
        try {
          const response = await api.get('/auth/get-me/')
          set({
            user: response.data,
            isAuthenticated: true,
          })
        } catch (error: unknown) {
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.error('Get me error:', error)
          }

          // If unauthorized, logout
          if (error instanceof AxiosError && error.response?.status === 401) {
            get().logout()
          }
        }
      },
      updateProfile: async (data: ProfileUpdate) => {
        try {
          const response = await api.put('/auth/profile/', data)
          set((state) => ({
            ...state,
            user: {
              ...state.user!,
              ...response.data
            }
          }))
          return response.data
        } catch (error) {
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.error('Update profile error:', error)
          }
          throw error
        }
      },
      changePassword: async (data: PasswordUpdate) => {
        const state = get()
        try {
          if (state.isDevRole() && state.user) {
            // For dev users, use the dev reset password endpoint
            await api.post(`/auth/dev/reset-password/${state.user.id}/`, {
              new_password: data.new_password
            })
          } else {
            // For regular users, use the normal reset password endpoint
            await api.post('/auth/reset-password/', data)
          }
        } catch (error) {
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.error('Change password error:', error)
          }
          throw error
        }
      },
      logout: () => {
        // Clear token from axios defaults
        delete api.defaults.headers.common['Authorization']

        // Clear cookies
        Cookies.remove('token', { path: '/' })

        // Clear state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })

        // Clear localStorage
        localStorage.removeItem('token')
      },
      isDevRole: () => {
        const state = get()
        return state.user?.role === 'dev'
      },
      isSuperAdminRole: () => {
        const state = get()
        return state.user?.role === 'super_admin'
      },
      isAdminRole: () => {
        const state = get()
        return state.user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
