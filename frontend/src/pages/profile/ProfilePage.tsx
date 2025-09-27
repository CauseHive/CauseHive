import { useRef, useState, useMemo, useEffect } from 'react'
import { useUserProfile, WithdrawalAddress } from '@/hooks/useUserProfile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Camera, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  Clock,
  Mail,
  Calendar
} from 'lucide-react'

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
    if (st === 'saving') return (
      <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-600">
        <Clock className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    )
    if (st === 'saved') return (
      <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-600">
        <CheckCircle className="h-3 w-3" />
        Saved
      </span>
    )
    return null
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <div className="relative">
              <img 
                src={preview || composed.profile_picture || '/profile_pictures/default.jpg'} 
                alt={composed.full_name} 
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg bg-white" 
              />
              <Button
                size="sm"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 rounded-full h-10 w-10 p-0 bg-emerald-600 hover:bg-emerald-700 shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
            </div>
            <div className="flex-1 sm:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{composed.full_name || 'Anonymous User'}</h1>
                {badge('profile_picture')}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {composed.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {composed.updated_at ? new Date(composed.updated_at).toLocaleDateString() : 'Recently'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="flex items-center gap-1">
                  First name {badge('first_name')}
                </Label>
                <Input 
                  id="first_name" 
                  value={firstName} 
                  onChange={(e) => { 
                    setFirstName(e.target.value); 
                    mark('first_name','saving'); 
                    debouncedUserPatch({ first_name: e.target.value }, 'first_name') 
                  }} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="flex items-center gap-1">
                  Last name {badge('last_name')}
                </Label>
                <Input 
                  id="last_name" 
                  value={lastName} 
                  onChange={(e) => { 
                    setLastName(e.target.value); 
                    mark('last_name','saving'); 
                    debouncedUserPatch({ last_name: e.target.value }, 'last_name') 
                  }} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                defaultValue={composed.email || ''} 
                disabled
                className="bg-slate-50 dark:bg-slate-900/40"
              />
              <p className="text-xs text-slate-500">Email cannot be changed. Contact support if needed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone number {badge('phone_number')}
              </Label>
              <Input 
                id="phone_number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                onBlur={(e) => { 
                  mark('phone_number','saving'); 
                  updateProfile.mutate({ phone_number: e.target.value }, { 
                    onSuccess: () => mark('phone_number','saved'), 
                    onError: () => mark('phone_number','idle') 
                  }) 
                }} 
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Address {badge('address')}
              </Label>
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                onBlur={(e) => { 
                  mark('address','saving'); 
                  updateProfile.mutate({ address: e.target.value }, { 
                    onSuccess: () => mark('address','saved'), 
                    onError: () => mark('address','idle') 
                  }) 
                }} 
                placeholder="Enter your address"
              />
            </div>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Details</h4>
              <div className="text-xs text-slate-500 space-y-1">
                <p><span className="font-semibold">Profile ID:</span> {composed.id}</p>
                <p><span className="font-semibold">User ID:</span> {composed.user_id}</p>
                <p><span className="font-semibold">Last updated:</span> {composed.updated_at ? new Date(composed.updated_at).toLocaleString() : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              About Me {badge('bio')}
            </CardTitle>
            <CardDescription>
              Tell supporters about yourself and your causes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea 
                id="bio"
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                onBlur={(e) => { 
                  mark('bio','saving'); 
                  updateProfile.mutate({ bio: e.target.value }, { 
                    onSuccess: () => mark('bio','saved'), 
                    onError: () => mark('bio','idle') 
                  }) 
                }} 
                className="w-full h-40 resize-none rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                placeholder="Tell supporters about yourself, your passions, and what drives you to support causes..."
              />
              <p className="text-xs text-slate-500">Changes are saved automatically when you finish editing.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Withdrawal Information {badge('withdrawal_address')}
          </CardTitle>
          <CardDescription>
            Configure how you want to receive donations and withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <select 
                id="payment_method"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                value={currentMethod} 
                onChange={(e) => handleWithdrawalChange('payment_method', e.target.value as WithdrawalAddress['payment_method'])}
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>

            {currentMethod === 'bank_transfer' && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_code">Bank Code</Label>
                  <Input 
                    id="bank_code"
                    value={withdrawal?.bank_code || ''} 
                    onChange={(e) => handleWithdrawalChange('bank_code', e.target.value)} 
                    placeholder="Enter bank code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input 
                    id="account_number"
                    value={withdrawal?.account_number || ''} 
                    onChange={(e) => handleWithdrawalChange('account_number', e.target.value)} 
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input 
                    id="account_name"
                    value={withdrawal?.account_name || ''} 
                    onChange={(e) => handleWithdrawalChange('account_name', e.target.value)} 
                    placeholder="Enter account holder name"
                  />
                </div>
              </div>
            )}

            {currentMethod === 'mobile_money' && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input 
                    id="phone_number"
                    value={withdrawal?.phone_number || ''} 
                    onChange={(e) => handleWithdrawalChange('phone_number', e.target.value)} 
                    placeholder="Enter mobile money phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input 
                    id="provider"
                    value={withdrawal?.provider || ''} 
                    onChange={(e) => handleWithdrawalChange('provider', e.target.value)} 
                    placeholder="e.g., MTN, Vodafone, AirtelTigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country"
                    value={withdrawal?.country || ''} 
                    onChange={(e) => handleWithdrawalChange('country', e.target.value)} 
                    placeholder="Enter country"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              {withdrawalComplete ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Withdrawal information is complete</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span>Missing required fields: {missing.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
