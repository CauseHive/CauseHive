import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/api'
import { useNavigate, Link } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/lib/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HeartHandshake } from 'lucide-react'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string().min(8, 'Confirm password must be at least 8 characters')
}).refine((d)=> d.password === d.password2, { path: ['password2'], message: 'Passwords must match' })

type FormValues = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const { signup, isSignupLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ 
    resolver: zodResolver(schema) 
  })

  // Block accessing signup when already authenticated
  useEffect(() => {
    if (authStore.getAccessToken()) {
      navigate('/app', { replace: true })
    }
  }, [navigate])

  const onSubmit = (values: FormValues) => {
    signup(values)
  }

  // Google OAuth URL fetching
  const { data: googleUrl, error: googleUrlError, isLoading: googleUrlLoading } = useQuery({
    queryKey: ['google-oauth-url'],
    queryFn: async () => {
      try {
        const result = await authService.getGoogleAuthUrl()
        return result.google_oauth_url
      } catch (err) {
        console.warn('Failed to fetch Google OAuth URL for signup', err)
        return ''
      }
    },
    placeholderData: ''
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Wave Accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-8">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,200 Q400,150 800,200 T1200,250 V600 H0 Z" fill="url(#signupWave1)" />
            <defs>
              <linearGradient id="signupWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-6">
          <svg className="absolute top-40 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,400 Q600,350 1200,400 V600 H0 Z" fill="url(#signupWave2)" />
            <defs>
              <linearGradient id="signupWave2" x1="0%" y1="0%" x2="100%" y2="100%">
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
              Join CauseHive
            </h1>
            <p className="text-gray-600">Create your account to start making a difference</p>
          </div>

          {/* Error Messages */}
          {googleUrlError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm shadow-sm" role="alert">
              Google sign-up isn't available right now. Try email/password, or contact the admin to configure Google OAuth.
            </div>
          )}

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">First name</Label>
                  <Input
                    id="first_name"
                    {...register('first_name')}
                    aria-invalid={!!errors.first_name}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                    placeholder="First name"
                  />
                  {errors.first_name && <p className="text-xs text-red-500 mt-2">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">Last name</Label>
                  <Input
                    id="last_name"
                    {...register('last_name')}
                    aria-invalid={!!errors.last_name}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                    placeholder="Last name"
                  />
                  {errors.last_name && <p className="text-xs text-red-500 mt-2">{errors.last_name.message}</p>}
                </div>
              </div>

              {/* Email Field */}
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

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                    placeholder="Password"
                  />
                  {errors.password && <p className="text-xs text-red-500 mt-2">{errors.password.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password2" className="text-sm font-medium text-gray-700 mb-2 block">Confirm password</Label>
                  <Input
                    id="password2"
                    type="password"
                    {...register('password2')}
                    aria-invalid={!!errors.password2}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                    placeholder="Confirm password"
                  />
                  {errors.password2 && <p className="text-xs text-red-500 mt-2">{errors.password2.message}</p>}
                </div>
              </div>

              <Button
                disabled={isSignupLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {isSignupLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account…
                  </div>
                ) : (
                  'Create account'
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

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              onClick={() => { if (googleUrl) window.location.href = googleUrl }}
              className="w-full border-2 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200"
              disabled={googleUrlLoading || !googleUrl}
            >
              {googleUrlLoading ? (
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

            {/* Footer Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Have an account?{' '}
                <Link to="/login" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}