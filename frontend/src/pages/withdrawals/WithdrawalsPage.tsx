import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination as UIPagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import type { Pagination, Withdrawal } from '@/types/api'
import { Empty } from '@/components/ui/empty'

export function WithdrawalsPage() {
  const { notify } = useToast()
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')

  type WithdrawalMethod = 'bank_transfer' | 'mobile_money'
  type BankDetails = { bank_code: string; account_number: string; account_name: string }
  type MoMoDetails = { phone_number: string; provider: 'MTN' | 'Vodafone' | 'AirtelTigo' }
  type WithdrawalRequest = {
    amount: number
    withdrawal_method: WithdrawalMethod
    account_details: BankDetails | MoMoDetails
  }

  const [amount, setAmount] = useState<number>(100)
  const [method, setMethod] = useState<WithdrawalMethod>('bank_transfer')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountName, setAccountName] = useState('')
  const [moMoPhone, setMoMoPhone] = useState('')
  const [moMoProvider, setMoMoProvider] = useState('MTN')

  const { data, isLoading } = useQuery({
    queryKey: ['withdrawals', { page }],
    queryFn: async () => {
      const { data } = await api.get<Pagination<Withdrawal>>('/withdrawals/', { params: { page, ordering: '-created_at' } })
      return data
    }
  })

  const requestWithdrawal = useMutation({
    mutationFn: async () => {
      const payload: WithdrawalRequest =
        method === 'bank_transfer'
          ? {
              amount,
              withdrawal_method: method,
              account_details: {
                bank_code: bankCode,
                account_number: accountNumber,
                account_name: accountName
              }
            }
          : {
              amount,
              withdrawal_method: method,
              account_details: {
                phone_number: moMoPhone,
                provider: moMoProvider as MoMoDetails['provider']
              }
            }
      const { data } = await api.post('/withdrawals/request/', payload)
      return data as unknown
    },
    onSuccess: () => {
      notify({ title: 'Withdrawal requested', variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] })
    },
    onError: (e: AxiosError<{ error?: string }>) =>
      notify({ title: 'Withdrawal failed', description: e.response?.data?.error, variant: 'error' })
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Withdrawals</h1>

      <div className="rounded-lg border border-slate-700 p-4 space-y-3 bg-slate-900">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">Amount (GHS)
            <Input type="number" min={1} value={amount} onChange={(e)=> setAmount(Number(e.target.value))} />
          </label>
          <label className="text-sm">Method
            <select
              className="w-full rounded-md border bg-transparent p-2"
              value={method}
              onChange={(e)=> setMethod(e.target.value as WithdrawalMethod)}
            >
              <option value="bank_transfer">Bank transfer</option>
              <option value="mobile_money">Mobile money</option>
            </select>
          </label>
          {method === 'bank_transfer' ? (
            <>
              <label className="text-sm">Bank code
                <Input value={bankCode} onChange={(e)=> setBankCode(e.target.value)} />
              </label>
              <label className="text-sm">Account number
                <Input value={accountNumber} onChange={(e)=> setAccountNumber(e.target.value)} />
              </label>
              <label className="text-sm sm:col-span-2">Account name
                <Input value={accountName} onChange={(e)=> setAccountName(e.target.value)} />
              </label>
            </>
          ) : (
            <>
              <label className="text-sm">Phone number
                <Input value={moMoPhone} onChange={(e)=> setMoMoPhone(e.target.value)} />
              </label>
              <label className="text-sm">Provider
                <select className="w-full rounded-md border bg-transparent p-2" value={moMoProvider} onChange={(e)=> setMoMoProvider(e.target.value)}>
                  <option value="MTN">MTN</option>
                  <option value="Vodafone">Vodafone</option>
                  <option value="AirtelTigo">AirtelTigo</option>
                </select>
              </label>
            </>
          )}
        </div>
        <Button onClick={()=> requestWithdrawal.mutate()} disabled={requestWithdrawal.isPending}>
          {requestWithdrawal.isPending? 'Submitting…':'Request withdrawal'}
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">History</h2>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64 mt-2" />
              </div>
            ))}
          </div>
        )}
        <div className="rounded-lg border divide-y">
          {data && Array.isArray(data.results) && data.results.length === 0 && !isLoading && (
            <div className="p-4">
              <Empty title="No withdrawals yet" description="Your withdrawal requests will show up here." />
            </div>
          )}
          {Array.isArray(data?.results) && data?.results.map(w => (
            <div key={w.id} className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">₵{w.amount.toFixed(2)} <span className="ml-2 text-xs uppercase text-slate-500">{w.withdrawal_method.replace('_',' ')}</span></div>
                <div className="text-xs text-slate-500 mt-1">Requested {new Date(w.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${w.status==='completed'?'text-emerald-600': w.status==='pending'?'text-amber-600':'text-red-600'}`}>{w.status}</div>
                {typeof w.net_amount==='number' && <div className="text-xs text-slate-500">Net ₵{w.net_amount.toFixed(2)}</div>}
              </div>
            </div>
          ))}
        </div>

        {data && (
          <UIPagination
            page={page}
            hasPrev={!!data.previous}
            hasNext={!!data.next}
            onPrev={()=>{const p=new URLSearchParams(params); p.set('page', String(Math.max(1, page-1))); setParams(p)}}
            onNext={()=>{const p=new URLSearchParams(params); p.set('page', String(page+1)); setParams(p)}}
          />
        )}
      </div>
    </div>
  )
}

export default WithdrawalsPage
