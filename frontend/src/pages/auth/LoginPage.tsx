import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authStore } from '@/lib/auth'
import { useAuth } from '@/hooks/api'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'  
import { authService } from '@/lib/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
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

  // Google OAuth URL fetching using the new service layer
  const { data: googleUrl, error: googleUrlError, isLoading: googleUrlLoading } = useQuery({
    queryKey: ['google-oauth-url'],
    queryFn: async () => {
      try {
        const result = await authService.getGoogleAuthUrl()
        return result.auth_url
      } catch {
        return ''
      }
    },
    placeholderData: ''
  })

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      {googleUrlError && (
        <div className="mb-4 text-amber-700 text-sm" role="alert">
          Google sign-in isn't available right now. Try email/password, or contact the admin to configure Google OAuth.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <Button disabled={isLoginLoading} className="w-full">
          {isLoginLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-4 space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => { if (googleUrl) window.location.href = googleUrl }}
          className="w-full"
          disabled={googleUrlLoading || !googleUrl}
        >
          Continue with Google
        </Button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/signup" className="text-emerald-700">Create account</Link>
          <Link to="/password-reset" className="text-slate-600">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}