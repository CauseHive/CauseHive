import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/lib/services'
import { useToast } from '@/components/ui/toast'
import { authStore } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { notify } = useToast()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')

  const googleAuthMutation = useMutation({
    mutationFn: async ({ code, state }: { code: string; state?: string }) => {
      console.log('Completing Google OAuth with code:', code.substring(0, 10) + '...')
      return authService.completeGoogleAuth(code, state)
    },
    onSuccess: (data) => {
      setStatus('success')
      // persist tokens and user once via authStore
      authStore.setTokens(data.access, data.refresh)
      authStore.setUser(data.user)
      notify({ title: 'Welcome to CauseHive!', description: `Signed in as ${data.user.email}.`, variant: 'success' })
      setTimeout(() => navigate('/app', { replace: true }), 1200)
    },
    onError: (error: unknown) => {
      setStatus('error')
      const err = error as { response?: { status?: number; data?: { error?: string; detail?: string } }; message?: string }
      const detail = err.response?.data?.error || err.response?.data?.detail || err.message || 'Google sign-in failed. Please try again.'
      const message = err.response?.status === 404 ? 'Google OAuth is not configured on the server.' : detail
      notify({ title: 'Sign-in Failed', description: message, variant: 'error' })
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    }
  })

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      setStatus('error')
      notify({
        title: 'Google Sign-in Cancelled',
        description: 'You cancelled the Google sign-in process.',
        variant: 'error'
      })
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
      return
    }

    if (code) {
      googleAuthMutation.mutate({ code, state: state || undefined })
    } else {
      setStatus('error')
      notify({
        title: 'Invalid Request',
        description: 'Missing authorization code from Google.',
        variant: 'error'
      })
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    }
  }, [searchParams, googleAuthMutation, navigate, notify])

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      {status === 'processing' && (
        <div className="space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600" />
          <h1 className="text-xl font-semibold">Completing Google Sign-in</h1>
          <p className="text-slate-600">Please wait while we sign you in...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-emerald-600">Sign-in Successful!</h1>
          <p className="text-slate-600">Redirecting you to your dashboard...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-red-600">Sign-in Failed</h1>
          <p className="text-slate-600">Redirecting you back to the login page...</p>
        </div>
      )}
    </div>
  )
}