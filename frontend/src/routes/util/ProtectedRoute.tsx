import { Navigate, useLocation } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { PropsWithChildren, useEffect, useState } from 'react'
import LoadingScreen from '@/components/ui/loading-screen'

type Props = PropsWithChildren<{ role?: 'admin' | 'user' }>

export function ProtectedRoute({ children }: Props) {
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const validateAuth = async () => {
      const token = authStore.getAccessToken()
      
      if (!token) {
        setIsAuthenticated(false)
        setIsValidating(false)
        return
      }

      // Try to refresh token if we have one, to validate it's still good
      try {
        const refreshed = await authStore.refreshToken()
        setIsAuthenticated(!!refreshed || !!token)
      } catch (err) {
        // If refresh fails, but we have a token, still try to use it
        // The API interceptor will handle invalid tokens. Log for diagnostics.
        console.warn('Token refresh during ProtectedRoute validation failed', err)
        setIsAuthenticated(!!token)
      }
      
      setIsValidating(false)
    }

    validateAuth()
  }, [])

  if (isValidating) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
