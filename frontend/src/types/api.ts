export type Pagination<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type User = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  is_active?: boolean
}

export type Profile = {
  id: string
  full_name: string
  bio?: string
  profile_picture?: string
  phone_number?: string
  address?: string
  updated_at: string
  user: string
}

export type Category = {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  cause_count?: number
}

export type CauseListItem = {
  id: string
  title: string
  description: string
  target_amount: number
  current_amount: number
  progress_percentage: number
  status: string
  category: Category
  creator: { id: string; full_name: string; profile_picture?: string }
  created_at: string
  updated_at: string
  deadline?: string
  featured_image?: string
  donation_count: number
  is_featured: boolean
  organizer_id?: string
}

export type CauseDetails = CauseListItem & {
  gallery?: string[]
  tags?: string[]
  updates?: Array<{ id: string; title: string; description: string; created_at: string }>
}

export type CartItem = {
  id: string
  cause: { id: string; title: string; featured_image?: string }
  amount: number
  created_at: string
}

export type CartSummary = {
  cart_id?: string
  items: CartItem[]
  total_amount: number
  item_count: number
}

export type Donation = {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  donated_at: string
  transaction_id: string | null
  cause: { id: string; title: string; creator: { id: string; full_name: string } }
  donor: { id: string; full_name: string; email: string }
  recipient: { id: string; full_name: string }
}

export type PaymentInitResponse = {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export type Notification = {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  data?: Record<string, unknown>
}

export type Withdrawal = {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  withdrawal_method: 'bank_transfer' | 'mobile_money' | string
  created_at: string
  processed_at?: string
  processing_fee?: number
  net_amount?: number
}
