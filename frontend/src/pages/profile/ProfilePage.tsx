import { useRef, useState, useMemo, useEffect } from 'react'
import { useUserProfile, WithdrawalAddress } from '@/hooks/useUserProfile'

type FieldStatus = 'idle' | 'saving' | 'saved'

export function ProfilePage() {
  const { data, updateProfile, updateUser, isLoading, isError } = useUserProfile()
  const composed = useMemo(() => {
    if (!data) return null
    return {
      id: data.profile.id,
      full_name: data.profile.full_name,
      bio: data.profile.bio ?? '',
      profile_picture: data.profile.profile_picture,
      phone_number: data.profile.phone_number ?? '',
  address: data.profile.address ?? '',
  updated_at: data.profile.updated_at,
  user_id: data.profile.user,
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      withdrawal_address: data.profile.withdrawal_address as WithdrawalAddress | null
    }
  }, [data])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [withdrawal, setWithdrawal] = useState<WithdrawalAddress | null>(null)

  useEffect(() => {
    if (composed) {
      setFirstName(composed.first_name || '')
      setLastName(composed.last_name || '')
      setBio(composed.bio || '')
      setPhone(composed.phone_number || '')
      setAddress(composed.address || '')
      setWithdrawal(composed.withdrawal_address || { payment_method: 'bank_transfer' })
    }
  }, [composed])

  const [fieldStatus, setFieldStatus] = useState<Record<string, FieldStatus>>({})
  function mark(field: string, value: FieldStatus) {
    setFieldStatus(s => ({ ...s, [field]: value }))
    if (value === 'saved') setTimeout(() => setFieldStatus(s2 => s2[field] === 'saved' ? { ...s2, [field]: 'idle' } : s2), 1800)
  }

  function debounce<F extends (...p: Parameters<F>) => void>(fn: F, delay = 600) {
    let timer: ReturnType<typeof setTimeout>
    return (...args: Parameters<F>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
  }
  interface UserPatch { first_name?: string; last_name?: string }
  interface ProfilePatch { [k: string]: unknown }
  const debouncedUserPatch = useMemo(() => debounce((payload: UserPatch, field: string) => {
    updateUser.mutate(payload, { onSuccess: () => mark(field, 'saved'), onError: () => mark(field, 'idle') })
  }, 650), [updateUser])
  const debouncedProfilePatch = useMemo(() => debounce((payload: ProfilePatch, field: string) => {
    updateProfile.mutate(payload, { onSuccess: () => mark(field, 'saved'), onError: () => mark(field, 'idle') })
  }, 650), [updateProfile])

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const url = URL.createObjectURL(file); setPreview(url)
    const fd = new FormData(); fd.append('profile_picture', file)
    mark('profile_picture','saving')
    updateProfile.mutate(fd, { onSuccess: () => mark('profile_picture','saved'), onError: () => mark('profile_picture','idle') })
  }

  if (isLoading) return <div>Loading profile…</div>
  if (isError || !composed) return <div className="text-red-600">Failed to load profile.</div>

  function handleWithdrawalChange<K extends keyof WithdrawalAddress>(key: K, value: WithdrawalAddress[K]) {
    if (!withdrawal) return
    const next = { ...withdrawal, [key]: value }
    setWithdrawal(next)
    mark('withdrawal_address','saving')
    debouncedProfilePatch({ withdrawal_address: next }, 'withdrawal_address')
  }
  const currentMethod = withdrawal?.payment_method || 'bank_transfer'
  const requiredMobile = ['phone_number','provider','country'] as const
  const requiredBank = ['bank_code','account_number','account_name'] as const
  const requiredKeys = currentMethod === 'mobile_money' ? requiredMobile : requiredBank
  const missing = requiredKeys.filter(k => !withdrawal || !withdrawal[k])
  const withdrawalComplete = missing.length === 0
  const badge = (field: string) => {
    const st = fieldStatus[field]
    if (st === 'saving') return <span className="ml-2 text-[10px] text-amber-600">Saving…</span>
    if (st === 'saved') return <span className="ml-2 text-[10px] text-emerald-600">Saved</span>
    return null
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={preview || composed.profile_picture || '/profile_pictures/default.jpg'} alt={composed.full_name} className="h-24 w-24 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          <button type="button" onClick={()=> fileRef.current?.click()} className="absolute bottom-1 right-1 rounded bg-emerald-600 text-white text-xs px-2 py-1 shadow">Change</button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
          {badge('profile_picture')}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-slate-500">Manage your personal information and avatar.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 rounded-lg border p-4">
            <h2 className="font-medium mb-2">Details</h2>
            <label className="block text-xs mb-1" htmlFor="full_name">Full name</label>
            <input id="full_name" value={composed.full_name} readOnly className="w-full rounded-md border px-3 py-2 bg-slate-100 dark:bg-slate-900/40 cursor-not-allowed" />
            <label className="block text-xs mb-1 mt-3" htmlFor="email">Email</label>
            <input id="email" defaultValue={composed.email || ''} readOnly className="w-full rounded-md border px-3 py-2 bg-slate-50 dark:bg-slate-900/40" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs mb-1" htmlFor="first_name">First name {badge('first_name')}</label>
                <input id="first_name" value={firstName} onChange={(e)=> { setFirstName(e.target.value); mark('first_name','saving'); debouncedUserPatch({ first_name: e.target.value }, 'first_name') }} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs mb-1" htmlFor="last_name">Last name {badge('last_name')}</label>
                <input id="last_name" value={lastName} onChange={(e)=> { setLastName(e.target.value); mark('last_name','saving'); debouncedUserPatch({ last_name: e.target.value }, 'last_name') }} className="w-full rounded-md border px-3 py-2" />
              </div>
            </div>
            <label className="block text-xs mb-1" htmlFor="phone_number">Phone {badge('phone_number')}</label>
            <input id="phone_number" value={phone} onChange={(e)=> setPhone(e.target.value)} onBlur={(e)=> { mark('phone_number','saving'); updateProfile.mutate({ phone_number: e.target.value }, { onSuccess: () => mark('phone_number','saved'), onError: () => mark('phone_number','idle') }) }} className="w-full rounded-md border px-3 py-2" />
            <label className="block text-xs mb-1" htmlFor="address">Address {badge('address')}</label>
            <input id="address" value={address} onChange={(e)=> setAddress(e.target.value)} onBlur={(e)=> { mark('address','saving'); updateProfile.mutate({ address: e.target.value }, { onSuccess: () => mark('address','saved'), onError: () => mark('address','idle') }) }} className="w-full rounded-md border px-3 py-2" />
            <div className="mt-4 text-[11px] text-slate-500 space-y-1">
              <p><span className="font-semibold">Profile ID:</span> {composed.id}</p>
              <p><span className="font-semibold">User ID:</span> {composed.user_id}</p>
              <p><span className="font-semibold">Updated:</span> {composed.updated_at ? new Date(composed.updated_at).toLocaleString() : '—'}</p>
            </div>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="font-medium mb-2">Bio {badge('bio')}</h2>
          <textarea value={bio} onChange={(e)=> setBio(e.target.value)} onBlur={(e)=> { mark('bio','saving'); updateProfile.mutate({ bio: e.target.value }, { onSuccess: () => mark('bio','saved'), onError: () => mark('bio','idle') }) }} className="w-full h-40 resize-none rounded-md border px-3 py-2" placeholder="Tell supporters about yourself" />
          <p className="text-xs text-slate-500">Changes auto-save on blur.</p>
        </div>
        <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
          <div className="flex items-center gap-2"><h2 className="font-medium">Withdrawal Info</h2> {badge('withdrawal_address')}</div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs mb-1">Method</label>
              <select className="w-full rounded-md border px-2 py-2" value={currentMethod} onChange={(e)=> handleWithdrawalChange('payment_method', e.target.value as WithdrawalAddress['payment_method'])}>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
            {currentMethod === 'bank_transfer' && (<>
              <div>
                <label className="block text-xs mb-1">Bank Code</label>
                <input className="w-full rounded-md border px-2 py-2" value={withdrawal?.bank_code || ''} onChange={(e)=> handleWithdrawalChange('bank_code', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Account Number</label>
                <input className="w-full rounded-md border px-2 py-2" value={withdrawal?.account_number || ''} onChange={(e)=> handleWithdrawalChange('account_number', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Account Name</label>
                <input className="w-full rounded-md border px-2 py-2" value={withdrawal?.account_name || ''} onChange={(e)=> handleWithdrawalChange('account_name', e.target.value)} />
              </div>
            </>)}
            {currentMethod === 'mobile_money' && (<>
              <div>
                <label className="block text-xs mb-1">Phone Number</label>
                <input className="w-full rounded-md border px-2 py-2" value={withdrawal?.phone_number || ''} onChange={(e)=> handleWithdrawalChange('phone_number', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Provider</label>
                <input className="w-full rounded-md border px-2 py-2" value={withdrawal?.provider || ''} onChange={(e)=> handleWithdrawalChange('provider', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Country</label>
                <input className="w-full rounded-md border px-2 py-2" value={withdrawal?.country || ''} onChange={(e)=> handleWithdrawalChange('country', e.target.value)} />
              </div>
            </>)}
          </div>
          <div className="text-xs mt-2">{withdrawalComplete ? <span className="text-emerald-600 font-medium">Withdrawal info complete</span> : <span className="text-amber-600">Missing: {missing.join(', ')}</span>}</div>
        </div>
      </div>
    </div>
  )
}
