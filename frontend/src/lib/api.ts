import axios from 'axios'

import { authStore } from './auth'
import { API_BASE_URL } from './config'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = authStore.getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    
    // Log API errors for debugging
    console.error('API Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    })
    
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((token) => {
            if (token) {
              original.headers = original.headers ?? {}
              original.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(original))
          })
        })
      }
      try {
        isRefreshing = true
        const newToken = await authStore.refreshToken()
        pendingQueue.forEach((cb) => cb(newToken))
        pendingQueue = []
        if (newToken) {
          original.headers = original.headers ?? {}
          original.headers.Authorization = `Bearer ${newToken}`
          return api(original)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        authStore.clear()
        
        // Only redirect if we're not already on auth pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/signup') &&
            !window.location.pathname.includes('/verify-email')) {
          window.location.href = '/login'
        }
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
