import { BaseService } from './base'
import type { PaymentInitResponse } from '@/types/api'

export interface InitiatePaymentData {
  amount: number
  currency?: string
  callback_url: string
  metadata?: Record<string, any>
  cart_id?: string
  cause_id?: string
}

export interface PaymentVerificationData {
  reference: string
}

export interface PaymentTransaction {
  id: string
  reference: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  gateway: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

/**
 * Payments service that handles payment processing through Paystack
 */
class PaymentsService extends BaseService {
  protected basePath = '/payments'

  /**
   * Initiate a payment transaction
   */
  async initiate(data: InitiatePaymentData): Promise<PaymentInitResponse> {
    return this.post<PaymentInitResponse>('/initiate/', data)
  }

  /**
   * Verify payment status
   */
  async verify(data: PaymentVerificationData): Promise<PaymentTransaction> {
    return this.post<PaymentTransaction>('/verify/', data)
  }

  /**
   * Get payment transaction by ID
   */
  async getTransaction(id: string): Promise<PaymentTransaction> {
    return this.get<PaymentTransaction>(`/transactions/${id}/`)
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(params?: {
    page?: number
    status?: string
    date_from?: string
    date_to?: string
  }): Promise<{ results: PaymentTransaction[], count: number }> {
    return this.get<any>('/transactions/', params)
  }

  /**
   * Handle payment callback from Paystack
   */
  async handleCallback(reference: string): Promise<{
    status: 'success' | 'failed'
    message: string
    donation_ids?: string[]
  }> {
    return this.post<any>('/callback/', { reference })
  }

  /**
   * Get supported payment methods
   */
  async getPaymentMethods(): Promise<Array<{
    name: string
    code: string
    active: boolean
    available_for: string[]
  }>> {
    return this.get<any>('/methods/')
  }
}

export const paymentsService = new PaymentsService()