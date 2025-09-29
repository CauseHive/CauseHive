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
    if (token) {
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

  // Google OAuth mutation with enhanced error handling
  const googleAuthMutation = useMutation({
    mutationFn: () => {
      console.log('Initiating Google OAuth from login page...')
      return authService.getGoogleAuthUrl()
    },
    onSuccess: (data) => {
      console.log('Got Google OAuth URL, redirecting...', data.auth_url)
      if (data.auth_url) {
        window.location.href = data.auth_url
      } else {
        throw new Error('No auth URL received from server')
      }
    },
    onError: (error: unknown) => {
      console.error('Google OAuth initiation failed:', error)
      const err = error as { response?: { status?: number }; message?: string }
      
      let errorMessage = 'Failed to start Google sign-in'
      if (err.response?.status === 404) {
        errorMessage = 'Google OAuth is not configured on this server. Please use email/password sign-in.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      notify({
        title: 'Google Sign-in Error',
        description: errorMessage,
        variant: 'error'
      })
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-600">Sign in to continue making a difference</p>
        </div>
        {googleAuthMutation.isError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm" role="alert">
            Google sign-in isn't available right now. Try email/password, or check if Google OAuth is configured.
          </div>
        )}
        {showResendVerification && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">
            Your email needs to be verified before you can sign in. Check your email for a verification link, or resend it below.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending || !resendEmail}
              size="sm"
            >
              {resendVerificationMutation.isPending ? 'Sending...' : 'Resend'}
            </Button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>
        <Button disabled={isLoginLoading} className="w-full">
          {isLoginLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-4 space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => googleAuthMutation.mutate()}
          className="w-full"
          disabled={googleAuthMutation.isPending}
        >
          {googleAuthMutation.isPending ? 'Connecting...' : 'Continue with Google'}
        </Button>
          <div className="flex items-center justify-between text-sm">
            <Link to="/signup" className="text-green-600 hover:text-green-800 transition-colors">Create account</Link>
            <Link to="/password-reset" className="text-gray-600 hover:text-gray-800 transition-colors">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  )
}