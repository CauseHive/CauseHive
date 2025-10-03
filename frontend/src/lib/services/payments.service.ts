import { BaseService } from './base'

export interface InitiatePaymentData {
  donation_id: string
  amount: number
  email: string
  callback_url: string
}

export interface PaymentInitResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaymentVerificationResponse {
  status: boolean
  message: string
  data: {
    reference: string
    amount: number
    status: string
    donation_id: string
    transaction_date: string
  }
}

export interface BankResponse {
  status: string
  data: Array<{
    id: number
    name: string
    code: string
    longcode: string
    gateway: string
    pay_with_bank: boolean
    active: boolean
    is_deleted: boolean
    country: string
    currency: string
    type: string
  }>
}

export interface MobileMoneyResponse {
  status: string
  data: Array<{
    id: number
    name: string
    code: string
    longcode: string
    gateway: string
    pay_with_bank: boolean
    active: boolean
    is_deleted: boolean
    country: string
    currency: string
    type: string
  }>
}

export interface AccountValidationData {
  bank_code: string
  account_number: string
}

export interface AccountValidationResponse {
  status: string
  data: {
    account_name: string
    account_number: string
    bank_id: number
  }
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
    return this.post<PaymentInitResponse>('/initialize/', data)
  }

  /**
   * Verify payment status
   */
  async verify(reference: string): Promise<PaymentVerificationResponse> {
    return this.get<PaymentVerificationResponse>(`/verify/${reference}/`)
  }

  /**
   * Get list of supported banks
   */
  async getBanks(): Promise<BankResponse> {
    return this.get<BankResponse>('/banks/')
  }

  /**
   * Get list of mobile money providers
   */
  async getMobileMoneyProviders(): Promise<MobileMoneyResponse> {
    return this.get<MobileMoneyResponse>('/mobile-money/')
  }

  /**
   * Validate bank account details
   */
  async validateAccount(data: AccountValidationData): Promise<AccountValidationResponse> {
    return this.post<AccountValidationResponse>('/validate-account/', data)
  }
}

export const paymentsService = new PaymentsService()