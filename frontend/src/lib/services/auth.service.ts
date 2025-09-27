import { BaseService } from './base'
import type { User } from '@/types/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  first_name: string
  last_name: string
  email: string
  password: string
  password2: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  uidb64: string
  token: string
  new_password: string
  confirm_password: string
}

/**
 * Authentication service that handles all auth-related API calls
 * Provides a clean interface for login, signup, password reset, etc.
 */
class AuthService extends BaseService {
  protected basePath = '/user/auth'

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('/login/', credentials)
  }

  /**
   * Register a new user account
   */
  async signup(userData: SignupData): Promise<User> {
    return this.post<User>('/signup/', userData)
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.post<RefreshTokenResponse>('/token/refresh/', refreshData)
  }

  /**
   * Logout user (invalidate tokens on server)
   */
  async logout(refreshToken?: string): Promise<void> {
    return this.post<void>('/logout/', refreshToken ? { refresh: refreshToken } : undefined)
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    return this.post<void>('/password-reset/', { email })
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(resetData: PasswordResetConfirm): Promise<void> {
    return this.post<void>('/password-reset-confirm/', resetData)
  }

  /**
   * Verify email address
   */
  async verifyEmail(uidb64: string, token: string): Promise<void> {
    return this.post<void>('/verify-email/', { uidb64, token })
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string): Promise<void> {
    return this.post<void>('/resend-verification/', { email })
  }

  /**
   * Get Google OAuth login URL
   */
  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    return this.get<{ auth_url: string }>('/google/')
  }

  /**
   * Complete Google OAuth flow
   */
  async completeGoogleAuth(code: string, state?: string): Promise<LoginResponse> {
    return this.post<LoginResponse>('/google/callback/', { code, state })
  }
}

export const authService = new AuthService()