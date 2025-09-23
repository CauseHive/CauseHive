import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useToast } from '@/components/ui/toast'
import { authStore } from '@/lib/auth'
import { postAuth } from '@/lib/postAuth'
import { useEffect } from 'react'

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
  const { notify } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, clearErrors } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // Block accessing signup when already authenticated
  useEffect(() => {
    if (authStore.getAccessToken()) {
      navigate('/app', { replace: true })
    }
  }, [navigate])

  const onSubmit = async (values: FormValues) => {
    clearErrors()
    try {
      await api.post('/user/auth/signup/', values)
      // Auto-login immediately after successful signup
      const { data } = await api.post('/user/auth/login/', { email: values.email, password: values.password })
      postAuth({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
        navigate,
        notify,
        welcomeTitle: 'Welcome to CauseHive',
        welcomeDescription: 'Your account is ready.'
      })
    } catch (err) {
      const ax = err as AxiosError<Record<string, unknown>>
      const data = ax.response?.data as Record<string, unknown> | undefined
      // DRF usually returns field errors as { field: ["message"] }
      if (data && typeof data === 'object') {
        const fieldMap: Array<keyof FormValues> = ['first_name','last_name','email','password','password2']
        let hasFieldError = false
        for (const f of fieldMap) {
          const msgArr = data[f]
          if (Array.isArray(msgArr) && msgArr.length) {
            hasFieldError = true
            setError(f, { type: 'server', message: String((msgArr as unknown[])[0]) })
          }
        }
        if (!hasFieldError) {
          const topLevel = (data.error as string | undefined) || (data.detail as string | undefined) || 'Signup failed'
          notify({ title: 'Signup failed', description: String(topLevel), variant: 'error' })
        }
      } else {
        notify({ title: 'Signup failed', description: ax.message || 'Please try again.', variant: 'error' })
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1" htmlFor="first_name">First name</label>
            <input id="first_name" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900" {...register('first_name')} />
            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="last_name">Last name</label>
            <input id="last_name" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900" {...register('last_name')} />
            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900" {...register('password')} />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password2">Confirm password</label>
            <input id="password2" type="password" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900" {...register('password2')} />
            {errors.password2 && <p className="text-xs text-red-600 mt-1">{errors.password2.message}</p>}
          </div>
        </div>
        <button disabled={isSubmitting} className="w-full rounded-md bg-emerald-600 text-white py-2 hover:bg-emerald-700 disabled:opacity-60">{isSubmitting ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="text-sm mt-4">Have an account? <Link to="/login" className="text-emerald-700">Sign in</Link></p>
    </div>
  )
}
