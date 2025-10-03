import { BaseService } from './base'
import { api } from '../api'
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
  email: string
  first_name: string
  last_name: string
  user?: User // Keep optional for backward compatibility
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
  token: string
  password: string
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
    try {
      const response = await this.post<LoginResponse>('/login/', credentials)
      // Log non-sensitive metadata about the login response to help debug shape issues
      try {
        // eslint-disable-next-line no-console
        const resp = response as unknown as Record<string, unknown>
        console.debug('Login successful - response keys:', Object.keys(resp || {}), {
          hasAccess: !!resp['access'],
          hasRefresh: !!resp['refresh'],
          hasUser: !!resp['user']
        })
      } catch {
        // ignore
      }
      return response
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown }; message?: string }
      console.error('Login error:', err.response?.data || err.message)
      throw error
    }
  }

  /**
   * Register a new user account
   */
  async signup(userData: SignupData): Promise<{ message: string; user: User }> {
    try {
      const response = await this.post<{ message: string; user: User }>('/signup/', userData)
      console.log('Signup successful:', response)
      return response
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown }; message?: string }
      console.error('Signup error:', err.response?.data || err.message)
      throw error
    }
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
  async logout(): Promise<{ message: string }> {
    return this.post<{ message: string }>('/logout/')
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return this.post<{ message: string }>('/password-reset/', { email })
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(resetData: PasswordResetConfirm): Promise<{ message: string }> {
    return this.post<{ message: string }>('/password-reset-confirm/', resetData)
  }

  /**
   * Verify email address
   */
  async verifyEmail(uid: string, token: string): Promise<{ message: string; user: User }> {
    return this.get<{ message: string; user: User }>(`/verify/${uid}/${token}/`)
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string): Promise<{ message: string }> {
    return this.post<{ message: string }>('/resend-verification/', { email })
  }

  /**
   * Get Google OAuth login URL
   */
  async getGoogleAuthUrl(): Promise<{ google_oauth_url: string; message: string }> {
    try {
      // Using correct endpoint from API documentation: GET /api/user/google/url/
      const response = await api.get<{ google_oauth_url: string; message: string }>('/user/google/url/')
      return response.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown }; message?: string }
      console.error('Google Auth URL error:', err.response?.data || err.message)
      // Return a fallback URL structure if backend endpoint doesn't exist
      throw new Error('Google OAuth is not configured on the server')
    }
  }

  /**
   * Complete Google OAuth flow
   */
  async completeGoogleAuth(code: string, state?: string): Promise<LoginResponse> {
    try {
      // Using correct endpoint from API documentation: GET /api/user/google/callback/
      const response = await api.get<LoginResponse>(`/user/google/callback/?code=${code}${state ? `&state=${state}` : ''}`)
      console.log('Google OAuth completion successful:', response)
      return response.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown }; message?: string }
      console.error('Google OAuth completion error:', err.response?.data || err.message)
      throw error
    }
  }
}

export const authService = new AuthService()