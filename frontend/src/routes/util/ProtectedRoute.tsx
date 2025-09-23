import { Navigate, useLocation } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{ role?: 'admin' | 'user' }>

export function ProtectedRoute({ children }: Props) {
  const token = authStore.getAccessToken()
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
