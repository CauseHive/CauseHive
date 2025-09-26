import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Minimal shapes; extend as needed
export interface CombinedUser {
  id: number
  email: string
  first_name: string
  last_name: string
  date_joined?: string
}

export interface WithdrawalAddress {
  payment_method: 'bank_transfer' | 'mobile_money'
  bank_code?: string
  account_number?: string
  account_name?: string
  phone_number?: string
  provider?: string
  country?: string
}

export interface CombinedProfile {
  id: number
  full_name?: string
  bio?: string
  phone_number?: string
  address?: string
  profile_picture?: string | null
  withdrawal_address?: WithdrawalAddress | null
  updated_at?: string
  user?: number
}

interface CombinedResponse {
  user: CombinedUser
  profile: CombinedProfile
}

export function useUserProfile() {
  const qc = useQueryClient()
  const query = useQuery<CombinedResponse>({
    queryKey: ['user-combined'],
    queryFn: async () => {
      const { data } = await api.get<CombinedResponse>('/user/combined/')
      return data
    },
    staleTime: 60_000
  })

  const updateProfile = useMutation({
    mutationFn: async (payload: FormData | Partial<CombinedProfile>) => {
      if (payload instanceof FormData) {
        return api.patch('/user/profile/', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      return api.patch('/user/profile/', payload)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-combined'] })
  })

  const updateUser = useMutation({
    mutationFn: async (payload: Partial<CombinedUser>) => api.patch('/user/me/', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-combined'] })
  })

  return { ...query, updateProfile, updateUser }
}