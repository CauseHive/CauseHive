import type { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/toast'

export function PaymentCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { notify } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const reference = params.get('reference') || params.get('trxref')
    if (!reference) {
      navigate('/donations', { replace: true })
      return
    }
    (async () => {
      try {
        const { data } = await api.get<{ status?: boolean; message?: string; data?: { status?: string } }>(`/payments/verify/${reference}/`)
        const status = data?.data?.status
        if (data?.status && (status === 'success' || status === 'completed')) {
          notify({ title: 'Payment verified', variant: 'success' })
        } else {
          notify({ title: 'Payment status', description: status || data?.message || 'Unknown', variant: 'default' })
        }
        navigate('/donations', { replace: true })
      } catch (e: unknown) {
        const isAxios = (val: unknown): val is AxiosError =>
          Boolean(val) && typeof val === 'object' && Object.prototype.hasOwnProperty.call(val, 'isAxiosError')
        if (isAxios(e)) {
          // Optional: we could surface e.response?.data details here
        }
        notify({ title: 'Payment verification failed', variant: 'error' })
        navigate('/donations', { replace: true })
      }
    })()
  }, [location.search, navigate, notify])

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-semibold mb-2">Verifying payment…</h1>
      <p className="text-slate-600">Please wait while we confirm your transaction.</p>
    </div>
  )
}
