import { BaseService, type QueryParams } from './base'

export interface WithdrawalFilters extends QueryParams {
  status?: 'pending' | 'completed' | 'failed'
}

export interface CreateWithdrawalData {
  amount: number
  withdrawal_method: 'bank_transfer' | 'mobile_money'
  account_details: {
    bank_code?: string
    account_number?: string
    account_name?: string
    phone_number?: string
    provider?: string
  }
}

export interface WithdrawalResponse {
  id: string
  amount: number
  status: string
  withdrawal_method: string
  account_details: {
    bank_code?: string
    account_number?: string
    account_name?: string
    phone_number?: string
    provider?: string
  }
  created_at: string
  processed_at?: string
  processing_fee: number
  net_amount: number
  reference?: string
}

export interface WithdrawalListResponse {
  count: number
  next: string | null
  previous: string | null
  results: WithdrawalResponse[]
}

/**
 * Withdrawals service that handles withdrawal requests and management
 */
class WithdrawalsService extends BaseService {
  protected basePath = '/withdrawals'

  /**
   * Request a new withdrawal
   */
  async requestWithdrawal(data: CreateWithdrawalData): Promise<{
    id: string
    amount: number
    status: string
    withdrawal_method: string
    account_details: any
    created_at: string
    processing_fee: number
    net_amount: number
  }> {
    return this.post<{
      id: string
      amount: number
      status: string
      withdrawal_method: string
      account_details: any
      created_at: string
      processing_fee: number
      net_amount: number
    }>('/request/', data)
  }

  /**
   * Get user's withdrawal history
   */
  async getWithdrawals(params?: WithdrawalFilters): Promise<WithdrawalListResponse> {
    return this.getPaginated<WithdrawalResponse>('/', params)
  }

  /**
   * Get withdrawal details by ID
   */
  async getById(id: string): Promise<WithdrawalResponse> {
    return this.get<WithdrawalResponse>(`/${id}/`)
  }
}

export const withdrawalsService = new WithdrawalsService()