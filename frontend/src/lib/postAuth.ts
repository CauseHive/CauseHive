// Centralized post-authentication helper to ensure all auth flows
// (email/password login, signup auto-login, OAuth callbacks, future SSO)
// funnel through a single function for consistency.
// Responsibilities:
//  - Persist access (and optionally refresh) tokens
//  - Persist user object if provided
//  - Optionally emit a toast / notification
//  - Navigate to the dashboard (/app) by default
//  - Allow callers to override redirect path
//  - Keep side effects minimal & synchronous
// NOTE: We intentionally do NOT handle refresh token retrieval here beyond storage,
// nor do we fetch the user if it isn't supplied (keeps this lean; caller can fetch).

import { authStore } from './auth'

type ToastPayload = { title?: string; description?: string; variant?: 'default' | 'success' | 'error'; duration?: number }
type ToastFn = (opts: ToastPayload) => void

interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

export interface PostAuthParams {
  access: string
  refresh?: string
  user?: AuthUser
  navigate?: (path: string, options?: { replace?: boolean }) => void
  notify?: ToastFn
  welcomeTitle?: string
  welcomeDescription?: string
  redirectPath?: string
  replace?: boolean
}

export function postAuth({
  access,
  refresh,
  user,
  navigate,
  notify,
  welcomeTitle = 'Signed in',
  welcomeDescription,
  redirectPath = '/app',
  replace = true
}: PostAuthParams) {
  if (!access) {
    console.error('postAuth: No access token provided!')
    throw new Error('Access token is required')
  }

  authStore.setTokens(access, refresh)
  if (user) authStore.setUser(user)
  if (navigate) navigate(redirectPath, { replace })
  if (notify) {
    notify({
      title: welcomeTitle,
      description: welcomeDescription ?? (user?.first_name ? `Welcome ${user.first_name}!` : undefined),
      variant: 'success'
    })
  }
}
