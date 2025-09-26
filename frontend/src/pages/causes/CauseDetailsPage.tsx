import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CauseDetails, PaymentInitResponse } from '@/types/api'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'

export function CauseDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number>(50)
  const { notify } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cause', id],
    queryFn: async () => {
      const { data } = await api.get<CauseDetails>(`/causes/${id}/`)
      return data
    }
  })

  const donate = useMutation({
    mutationFn: async () => {
      // 1) Create donation
      const { data: donation } = await api.post('/donations/', { cause_id: id, amount })
      // 2) Initialize payment
      const { data: pay } = await api.post<PaymentInitResponse>('/payments/initialize/', {
        donation_id: donation.id,
        amount,
        email: donation.donor?.email,
        callback_url: window.location.origin + '/payment/callback'
      })
      return pay
    },
    onSuccess: (res) => {
      const url = res.data?.authorization_url
      if (res.status && url) {
        window.location.href = url
      } else {
        notify({ title: 'Payment initialization incomplete' })
      }
    },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { error?: string }, status?: number } } | undefined
      notify({ title: 'Payment init failed', description: err?.response?.data?.error || 'Try again', variant: 'error' })
      if (!err?.response?.status) navigate('/login')
    }
  })

  const addToCart = useMutation({
    mutationFn: async () => {
      // Attempt to include current cart_id if available to keep continuity for anonymous users
      let cart_id: string | undefined
      try {
        const { data: current } = await api.get('/cart/')
        if (typeof current?.cart_id === 'string') cart_id = current.cart_id
      } catch { /* ignore */ }
      await api.post('/cart/add/', { cause_id: id, amount, ...(cart_id ? { cart_id } : {}) })
    },
    onSuccess: () => notify({ title: 'Added to cart', variant: 'success' }),
    onError: () => notify({ title: 'Failed to add to cart', variant: 'error' })
  })

  if (isLoading) return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <div className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
    </div>
  )
  if (isError || !data) return <div className="text-red-600">Could not load cause.</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {data.featured_image && (
          <img
            src={data.featured_image}
            alt={data.title ? `Image for ${data.title}` : 'Cause image'}
            className="w-full rounded-lg"
          />
        )}
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{data.description}</p>
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border p-4 bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Progress</div>
          <div className="text-lg font-medium">₵{data.current_amount.toLocaleString()} / ₵{data.target_amount.toLocaleString()}</div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2" aria-label={`Progress ${Math.round(data.progress_percentage)}%`}>
            <div className="h-full bg-emerald-500" style={{ width: `${data.progress_percentage}%` }} />
          </div>
        </div>
        <div className="rounded-lg border p-4 bg-white dark:bg-slate-900 space-y-3">
          <label className="block text-sm" htmlFor="amount">Donation Amount (GHS)</label>
          <Input id="amount" type="number" min={1} value={amount} onChange={(e)=> setAmount(Number(e.target.value))} />
          <Button onClick={()=> donate.mutate()} disabled={donate.isPending} className="w-full">{donate.isPending? 'Processing…':'Donate Now'}</Button>
          <Button onClick={()=> addToCart.mutate()} disabled={addToCart.isPending} className="w-full" variant="outline">Add to Cart</Button>
        </div>
      </aside>
    </div>
  )
}
