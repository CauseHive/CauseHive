import axios from 'axios'
import { API_BASE_URL } from './config'
import { secureAuthStore } from './security/authStore'

const ACCESS = 'ch_access'
const REFRESH = 'ch_refresh'
const USER = 'ch_user'

type SecureUser = Parameters<typeof secureAuthStore.setUser>[0]
type LegacyUser = Partial<SecureUser>

const toLegacyUser = (user: SecureUser): LegacyUser => ({
  ...user
})

const getLegacyUser = (): LegacyUser | null => {
  try {
    const raw = localStorage.getItem(USER)
    return raw ? (JSON.parse(raw) as LegacyUser) : null
  } catch (error) {
    console.error('authStore: Failed to parse legacy user payload', error)
    localStorage.removeItem(USER)
    return null
  }
}

const persistLegacyTokens = (access?: string | null, refresh?: string | null) => {
  if (access) {
    localStorage.setItem(ACCESS, access)
  } else {
    localStorage.removeItem(ACCESS)
  }

  if (refresh) {
    localStorage.setItem(REFRESH, refresh)
  } else {
    localStorage.removeItem(REFRESH)
  }
}

const persistLegacyUser = (user?: LegacyUser | null) => {
  if (!user) {
    localStorage.removeItem(USER)
    return
  }
  try {
    localStorage.setItem(USER, JSON.stringify(user))
  } catch (error) {
    console.error('authStore: Failed to persist legacy user', error)
  }
}

const clearLegacyStorage = () => {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
  localStorage.removeItem(USER)
}

const migrateLegacySession = () => {
  const secureToken = secureAuthStore.getAccessToken()
  const legacyAccess = localStorage.getItem(ACCESS)
  const legacyRefresh = localStorage.getItem(REFRESH)

  if (!secureToken && legacyAccess) {
    try {
      secureAuthStore.setTokens(legacyAccess, legacyRefresh || undefined)
    } catch (error) {
      console.warn('authStore: Unable to migrate legacy token to secure store', error)
      clearLegacyStorage()
    }
  }

  const secureUser = secureAuthStore.getUser()
  if (!secureUser) {
    const legacyUser = getLegacyUser()
    if (legacyUser?.id && legacyUser.email) {
      try {
        secureAuthStore.setUser({ ...(legacyUser as SecureUser) })
      } catch (error) {
        console.warn('authStore: Unable to migrate legacy user to secure store', error)
      }
    }
  }
}

const syncLegacyFromSecure = () => {
  const access = secureAuthStore.getAccessToken()
  const refresh = secureAuthStore.getRefreshToken()
  const user = secureAuthStore.getUser()

  persistLegacyTokens(access, refresh)
  if (user) {
    persistLegacyUser(toLegacyUser(user))
  }
}

export const authStore = {
  getAccessToken: (): string | null => {
    migrateLegacySession()
    const token = secureAuthStore.getAccessToken()
    if (token) {
      persistLegacyTokens(token, secureAuthStore.getRefreshToken())
      return token
    }
    return localStorage.getItem(ACCESS)
  },
  getRefreshToken: (): string | null => {
    migrateLegacySession()
    const refresh = secureAuthStore.getRefreshToken()
    if (refresh) {
      persistLegacyTokens(secureAuthStore.getAccessToken(), refresh)
      return refresh
    }
    return localStorage.getItem(REFRESH)
  },
  setTokens: (access: string, refresh?: string) => {
    try {
      secureAuthStore.setTokens(access, refresh)
      syncLegacyFromSecure()
    } catch (error) {
      console.error('authStore: Failed to set tokens in secure store', error)
      persistLegacyTokens(access, refresh ?? null)
    }
  },
  setUser: (user: LegacyUser) => {
    const existing = secureAuthStore.getUser()
    const mergedUser = {
      ...(existing || {}),
      ...user
    } as LegacyUser

    persistLegacyUser(mergedUser)

    const candidate = mergedUser as SecureUser

    if (candidate.id && candidate.email) {
      try {
        secureAuthStore.setUser(candidate)
        syncLegacyFromSecure()
      } catch (error) {
        console.warn('authStore: Failed to sync user with secure store', error)
      }
    }
  },
  getUser: (): LegacyUser | null => {
    migrateLegacySession()
    const user = secureAuthStore.getUser()
    if (user) {
      const legacyUser = toLegacyUser(user)
      persistLegacyUser(legacyUser)
      return legacyUser
    }
    return getLegacyUser()
  },
  clear: () => {
    secureAuthStore.clear()
    clearLegacyStorage()
  },
  refreshToken: async (): Promise<string | null> => {
    migrateLegacySession()
    const refreshToken = secureAuthStore.getRefreshToken() || localStorage.getItem(REFRESH)

    if (!refreshToken) {
      authStore.clear()
      return null
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/user/auth/token/refresh/`, { refresh: refreshToken })

      if (!data?.access) {
        throw new Error('No access token in refresh response')
      }

      authStore.setTokens(data.access, refreshToken)
      return data.access
    } catch (error: unknown) {
      console.error('authStore: Token refresh failed', error)
      const err = error as { response?: { status?: number } }

      if (err.response?.status === 401 || err.response?.status === 403) {
        authStore.clear()
      }

      return null
    }
  },
  isAuthenticated: () => {
    migrateLegacySession()
    if (secureAuthStore.isAuthenticated()) {
      syncLegacyFromSecure()
      return true
    }

    const accessToken = localStorage.getItem(ACCESS)
    const user = getLegacyUser()
    return !!(accessToken && user)
  }
}
