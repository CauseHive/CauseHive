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
  // Debug: log outgoing request metadata (do not print token contents)
  try {
    // eslint-disable-next-line no-console
    console.debug('API Request:', { method: config.method?.toUpperCase(), url: config.url, hasToken: !!token })
  } catch {
    // ignore
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    
    // Log API errors for debugging in a consistent format
    try {
      // Safely stringify response data for clearer console output; trim very long payloads
      const rawData = error.response?.data
      let dataStr = ''
      try {
        dataStr = typeof rawData === 'string' ? rawData : JSON.stringify(rawData)
      } catch {
        dataStr = String(rawData)
      }
      if (dataStr.length > 1200) dataStr = dataStr.slice(0, 1200) + '... (truncated)'
      // eslint-disable-next-line no-console
      console.error('API Error:', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status: error.response?.status,
        data: dataStr,
        message: error.message
      })
    } catch {
      // ignore
    }
    
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
