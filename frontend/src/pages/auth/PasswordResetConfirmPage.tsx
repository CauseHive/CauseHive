import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'

const schema = z.object({
  password: z.string().min(8),
  confirm_password: z.string().min(8)
}).refine((d)=> d.password === d.confirm_password, { path: ['confirm_password'], message: 'Passwords do not match' })

type FormValues = z.infer<typeof schema>

export function PasswordResetConfirmPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const uid = params.get('uid') || ''
  const route = useParams()
  const effToken = route.token || token
  const effUid = route.uid || uid
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const { notify } = useToast()

  const onSubmit = async (values: FormValues) => {
    setError(null); setMessage(null)
    try {
  if (!effUid || !effToken) throw new Error('Missing token')
  const { data } = await api.post(`/user/password-reset/confirm/${effUid}/${effToken}/`, { password: values.password })
      setMessage(data?.message ?? 'Password updated')
      notify({ title: 'Password updated', variant: 'success' })
      setTimeout(()=> navigate('/login'), 1200)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } }
      setError(err?.response?.data?.error || 'Failed to reset password')
      notify({ title: 'Failed to reset password', description: err?.response?.data?.error, variant: 'error' })
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Set a new password</h1>
      {message && <div className="mb-3 text-emerald-700 text-sm">{message}</div>}
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
  {(!effToken || !effUid) && <div className="mb-3 text-amber-700 text-sm">Missing token. Request a new link <Link className="underline" to="/password-reset">here</Link>.</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm password</Label>
          <Input id="confirm_password" type="password" {...register('confirm_password')} aria-invalid={!!errors.confirm_password} />
          {errors.confirm_password && <p className="text-xs text-red-600 mt-1">{errors.confirm_password.message}</p>}
        </div>
        <Button disabled={isSubmitting || !token} className="w-full">Update password</Button>
      </form>
    </div>
  )
}
