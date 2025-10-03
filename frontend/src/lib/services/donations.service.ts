import { BaseService, type QueryParams } from './base'

export interface DonationFilters extends QueryParams {
  cause_id?: string
  status?: 'pending' | 'completed' | 'failed'
  search?: string
  ordering?: string
}

export interface CreateDonationData {
  cause_id: string
  amount: number
}

export interface DonationResponse {
  id: string
  amount: number
  currency: string
  status: string
  donated_at: string
  transaction_id: string | null
  cause: {
    id: string
    title: string
    creator: {
      id: string
      full_name: string
    }
  }
  donor: {
    id: string
    full_name: string
    email: string
  }
  recipient: {
    id: string
    full_name: string
  }
}

export interface DonationListResponse {
  count: number
  next: string | null
  previous: string | null
  results: DonationResponse[]
}

export interface DonationStatisticsResponse {
  total_donations: number
  total_amount: number
  average_donation: number
  this_month: {
    count: number
    amount: number
  }
  by_status: {
    completed: number
    pending: number
    failed: number
  }
  top_causes: Array<{
    cause_id: string
    title: string
    donation_count: number
    total_amount: number
  }>
}

/**
 * Donations service that handles all donation-related API calls
 * Provides donation history, creation, and management methods
 */
class DonationsService extends BaseService {
  protected basePath = '/donations'

  /**
   * Get user's donation history with filtering
   */
  async getMyDonations(params?: DonationFilters): Promise<DonationListResponse> {
    return this.getPaginated<DonationResponse>('/', {
      ...params,
      ordering: params?.ordering || '-donated_at'
    })
  }

  /**
   * Get donation by ID
   */
  async getById(id: string): Promise<DonationResponse> {
    return this.get<DonationResponse>(`/${id}/`)
  }

  /**
   * Create a new donation
   */
  async create(data: CreateDonationData): Promise<DonationResponse> {
    return this.post<DonationResponse>('/', data)
  }

  /**
   * Get donation statistics for user
   */
  async getStatistics(): Promise<DonationStatisticsResponse> {
    return this.get<DonationStatisticsResponse>('/statistics/')
  }
}

export const donationsService = new DonationsService()