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
    localStorage.setItem(ACCESS, access)
    if (refresh) localStorage.setItem(REFRESH, refresh)
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
    const refresh = authStore.getRefreshToken()
    if (!refresh) return null
    try {
      const { data } = await axios.post(`${API_BASE_URL}/user/auth/token/refresh/`, { refresh })
      const access = data?.access as string | undefined
      if (access) {
        localStorage.setItem(ACCESS, access)
        return access
      }
      return null
    } catch {
      return null
    }
  }
}
