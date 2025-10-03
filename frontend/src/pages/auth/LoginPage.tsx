import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authStore } from '@/lib/auth'
import { useAuth } from '@/hooks/api'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'  
import { authService } from '@/lib/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { HeartHandshake } from 'lucide-react'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const { notify } = useToast()
  const { login, isLoginLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  // If already authenticated, never show the login form again – go straight to dashboard
  useEffect(() => {
    const token = authStore.getAccessToken()
    console.log('LoginPage useEffect: checking auth, token exists:', !!token)
    if (token) {
      console.log('LoginPage useEffect: user is authenticated, navigating to /app')
      navigate('/app', { replace: true })
    }
  }, [navigate])

  const onSubmit = (values: FormValues) => {
    login(values)
  }

  // Check if user came from email verification
  useEffect(() => {
    const unverified = searchParams.get('unverified')
    if (unverified === 'true') {
      setShowResendVerification(true)
    }
  }, [searchParams])

  // Resend verification email mutation
  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      return authService.resendEmailVerification(email)
    },
    onSuccess: () => {
      notify({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
        variant: 'success'
      })
      setShowResendVerification(false)
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later.'
      notify({
        title: 'Failed to send verification email',
        description: errorMessage,
        variant: 'error'
      })
    }
  })

  const handleResendVerification = () => {
    if (resendEmail) {
      resendVerificationMutation.mutate(resendEmail)
    }
  }

  // Google OAuth mutation with compact error handling
  const googleAuthMutation = useMutation({
    mutationFn: () => authService.getGoogleAuthUrl(),
    onSuccess: (data) => {
      const url = data?.google_oauth_url
      if (url) window.location.href = url
      else notify({ title: 'Google Sign-in Error', description: 'No auth URL received from server', variant: 'error' })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { status?: number }; message?: string }
      const fallback = 'Failed to start Google sign-in'
      const errorMessage = err.response?.status === 404
        ? 'Google OAuth is not configured on this server. Please use email/password sign-in.'
        : (err.message || fallback)
      notify({ title: 'Google Sign-in Error', description: errorMessage, variant: 'error' })
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Wave Accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-8">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,200 Q400,150 800,200 T1200,250 V600 H0 Z" fill="url(#loginWave1)" />
            <defs>
              <linearGradient id="loginWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-6">
          <svg className="absolute top-40 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,400 Q600,350 1200,400 V600 H0 Z" fill="url(#loginWave2)" />
            <defs>
              <linearGradient id="loginWave2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-emerald-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue making a difference</p>
          </div>

          {/* Error Messages */}
          {googleAuthMutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm shadow-sm" role="alert">
              Google sign-in isn't available right now. Try email/password, or check if Google OAuth is configured.
            </div>
          )}

          {showResendVerification && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
              <p className="text-sm text-gray-700 mb-4">
                Your email needs to be verified before you can sign in. Check your email for a verification link, or resend it below.
              </p>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="flex-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <Button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending || !resendEmail}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {resendVerificationMutation.isPending ? 'Sending...' : 'Resend'}
                </Button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-xs text-red-500 mt-2">{errors.password.message}</p>}
              </div>

              <Button
                disabled={isLoginLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {isLoginLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in…
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              onClick={() => googleAuthMutation.mutate()}
              className="w-full border-2 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200"
              disabled={googleAuthMutation.isPending}
            >
              {googleAuthMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </div>
              )}
            </Button>

            {/* Footer Links */}
            <div className="flex items-center justify-between text-sm mt-6 pt-6 border-t border-gray-100">
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                Create account
              </Link>
              <Link to="/password-reset" className="text-gray-600 hover:text-gray-800 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}