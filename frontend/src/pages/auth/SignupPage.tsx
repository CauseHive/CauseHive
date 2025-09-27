import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/api'
import { useNavigate, Link } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="first_name">First name</Label>
            <Input id="first_name" {...register('first_name')} aria-invalid={!!errors.first_name} />
            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="last_name">Last name</Label>
            <Input id="last_name" {...register('last_name')} aria-invalid={!!errors.last_name} />
            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="password2">Confirm password</Label>
            <Input id="password2" type="password" {...register('password2')} aria-invalid={!!errors.password2} />
            {errors.password2 && <p className="text-xs text-red-600 mt-1">{errors.password2.message}</p>}
          </div>
        </div>
        <Button disabled={isSignupLoading} className="w-full">
          {isSignupLoading ? 'Creating…' : 'Create account'}
        </Button>
      </form>
      <p className="text-sm mt-4">
        Have an account? <Link to="/login" className="text-emerald-700">Sign in</Link>
      </p>
    </div>
  )
}