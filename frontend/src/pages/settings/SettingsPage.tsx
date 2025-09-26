import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useToast } from '@/components/ui/toast'

const schema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().email(),
})

type FormValues = z.infer<typeof schema>

export default function SettingsPage() {
  const { notify } = useToast()
  const { data, updateUser } = useUserProfile()
  const isLoading = !data

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), values: (data as Partial<FormValues>) as FormValues | undefined })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = { first_name: values.first_name, last_name: values.last_name }
      await updateUser.mutateAsync(payload)
      return payload
    },
    onSuccess: () => notify({ title: 'Settings saved', variant: 'success' })
  })

  if (isLoading && !data) return <div>Loading settings…</div>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Account settings</h1>
      <form onSubmit={handleSubmit(v => mutation.mutate(v))} className="space-y-4">
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
          <label className="block text-sm mb-1" htmlFor="email">Email (read-only)</label>
          <input id="email" type="email" disabled className="w-full rounded-md border px-3 py-2 bg-slate-100 dark:bg-slate-800/40" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <button disabled={mutation.isPending} className="rounded-md bg-emerald-600 text-white px-4 py-2">{mutation.isPending ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  )
}
