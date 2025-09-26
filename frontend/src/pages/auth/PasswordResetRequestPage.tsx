import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'

const schema = z.object({ email: z.string().email() })
type FormValues = z.infer<typeof schema>

export function PasswordResetRequestPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { notify } = useToast()

  const onSubmit = async (values: FormValues) => {
    setMessage(null); setError(null)
    try {
  const { data } = await api.post('/user/password-reset/', values)
      setMessage(data?.message ?? 'If the email exists, a reset link has been sent.')
      notify({ title: 'Reset link sent', variant: 'success' })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } }
      setError(err?.response?.data?.error || 'Failed to request password reset')
      notify({ title: 'Password reset failed', description: err?.response?.data?.error, variant: 'error' })
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Reset your password</h1>
      {message && <div className="mb-3 text-emerald-700 text-sm">{message}</div>}
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <Button disabled={isSubmitting} className="w-full">Send reset link</Button>
      </form>
    </div>
  )
}
