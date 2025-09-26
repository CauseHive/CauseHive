import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { authStore } from '@/lib/auth'
import { postAuth } from '@/lib/postAuth'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  const [error, setError] = useState<string | null>(null)
  const { notify } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  // If already authenticated, never show the login form again – go straight to dashboard
  useEffect(() => {
    const token = authStore.getAccessToken()
    if (token) {
      navigate('/app', { replace: true })
    }
  }, [navigate])

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      const { data } = await api.post('/user/auth/login/', values)
      postAuth({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
        navigate,
        notify,
        welcomeTitle: 'Welcome back'
      })
    } catch (err: unknown) {
      const maybeAxios = err as { response?: { data?: { error?: string } } }
      const msg = maybeAxios?.response?.data?.error || 'Login failed'
      setError(msg)
      notify({ title: 'Login failed', description: msg, variant: 'error' })
    }
  }

  const { data: googleUrl, error: googleUrlError, isLoading: googleUrlLoading } = useQuery({
    queryKey: ['google-oauth-url'],
    queryFn: async () => {
      const { data } = await api.get<unknown>('/user/google/url/')
      const record = data as Record<string, unknown>
      const keys = ['google_oauth_url','url','googleUrl']
      for (const k of keys) {
        const val = record[k]
        if (typeof val === 'string' && val.startsWith('http')) return val
      }
      return ''
    },
    // Provide a defined initial value to avoid undefined data while loading
    placeholderData: ''
  })

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      {error && <div className="mb-4 text-red-600 text-sm" role="alert">{error}</div>}
      {googleUrlError && (
        <div className="mb-4 text-amber-700 text-sm" role="alert">
          Google sign-in isn’t available right now. Try email/password, or contact the admin to configure Google OAuth.
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
        <Button disabled={isSubmitting} className="w-full">{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
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
