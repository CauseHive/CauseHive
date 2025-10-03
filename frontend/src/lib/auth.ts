import axios from 'axios'
import { API_BASE_URL } from './config'

type User = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  is_active?: boolean
}

const ACCESS = 'ch_access'
const REFRESH = 'ch_refresh'
const USER = 'ch_user'

export const authStore = {
  getAccessToken: () => localStorage.getItem(ACCESS),
  getRefreshToken: () => localStorage.getItem(REFRESH),
  setTokens: (access: string, refresh?: string) => {
    console.log('authStore.setTokens called with:', { hasAccess: !!access, hasRefresh: !!refresh })
    localStorage.setItem(ACCESS, access)
    if (refresh) localStorage.setItem(REFRESH, refresh)
    console.log('authStore.setTokens: tokens stored in localStorage')
  },
  setUser: (user: User) => localStorage.setItem(USER, JSON.stringify(user)),
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER)
    return raw ? (JSON.parse(raw) as User) : null
  },
  clear: () => {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem(REFRESH)
    localStorage.removeItem(USER)
  },
  refreshToken: async (): Promise<string | null> => {
    const refreshToken = authStore.getRefreshToken()
    if (!refreshToken) {
      console.warn('No refresh token available')
      authStore.clear() 
      return null
    }

    try {
      console.log('Attempting to refresh token...')
      const { data } = await axios.post(`${API_BASE_URL}/user/auth/token/refresh/`, { refresh: refreshToken })
      
      if (data.access) {
        authStore.setTokens(data.access, refreshToken)
        // Also store in localStorage for persistence
        localStorage.setItem(ACCESS, data.access)
        console.log('Token refreshed successfully')
        return data.access
      } else {
        throw new Error('No access token in refresh response')
      }
    } catch (error: unknown) {
      console.error('Token refresh failed:', error)
      const err = error as { response?: { status?: number } }
      
      // Only clear if it's a real auth failure, not a network issue
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Refresh token expired, clearing auth state')
        authStore.clear()
      } else {
        console.log('Network error during token refresh, keeping existing tokens')
      }
      
      return null
    }
  },
  isAuthenticated: () => {
    const accessToken = authStore.getAccessToken()
    const user = authStore.getUser()
    return !!(accessToken && user)
  }
}
