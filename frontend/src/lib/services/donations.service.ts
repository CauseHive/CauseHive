import { BaseService, type QueryParams } from './base'
import type { Pagination, Donation } from '@/types/api'

export interface DonationFilters extends QueryParams {
  status?: 'pending' | 'completed' | 'failed'
  cause_id?: string
  date_from?: string
  date_to?: string
}

export interface CreateDonationData {
  cause_id: string
  amount: number
  currency?: string
  anonymous?: boolean
  message?: string
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
  async getMyDonations(params?: DonationFilters): Promise<Pagination<Donation>> {
    return this.getPaginated<Donation>('/', {
      ...params,
      ordering: params?.ordering || '-donated_at'
    })
  }

  /**
   * Get donation by ID
   */
  async getById(id: string): Promise<Donation> {
    return this.get<Donation>(`/${id}/`)
  }

  /**
   * Create a new donation (typically used for direct donations)
   */
  async create(data: CreateDonationData): Promise<Donation> {
    return this.post<Donation>('/', data)
  }

  /**
   * Get donations for a specific cause (admin/organizer view)
   */
  async getByCause(causeId: string, params?: Omit<DonationFilters, 'cause_id'>): Promise<Pagination<Donation>> {
    return this.getPaginated<Donation>('/', { ...params, cause_id: causeId })
  }

  /**
   * Get donation statistics for user
   */
  async getMyStats(): Promise<{
    total_donated: number
    donation_count: number
    causes_supported: number
    monthly_donations: Array<{ month: string; amount: number; count: number }>
  }> {
    return this.get<any>('/stats/')
  }

  /**
   * Get donation receipt/details for download
   */
  async getReceipt(id: string): Promise<{
    donation: Donation
    receipt_url?: string
    tax_deductible?: boolean
  }> {
    return this.get<any>(`/${id}/receipt/`)
  }

  /**
   * Cancel a pending donation
   */
  async cancel(id: string): Promise<void> {
    return this.post<void>(`/${id}/cancel/`)
  }

  /**
   * Resend donation confirmation email
   */
  async resendConfirmation(id: string): Promise<void> {
    return this.post<void>(`/${id}/resend-confirmation/`)
  }
}

export const donationsService = new DonationsService()