import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: "https://zein-edtech-server.onrender.com",
  // baseURL: "http://localhost:8000",
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first, then localStorage as fallback
    const token = Cookies.get('token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Clear invalid tokens
        Cookies.remove('token', { path: '/' })
        localStorage.removeItem('token')

        // Redirect to login
        window.location.href = '/login?redirect=' + window.location.pathname
        return Promise.reject(error)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
