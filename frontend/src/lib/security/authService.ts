/**
 * Enhanced Authentication Service with Multi-Factor Authentication
 * Enterprise-grade security implementation
 */
import { secureApi } from './apiClient'
import { secureAuthStore } from './authStore'
import type { 
  LoginCredentials, 
  SignupData, 
  MFAChallenge,
  DeviceInfo,
  TenantContext,
  User
} from './types'

interface EnhancedLoginCredentials extends LoginCredentials {
  mfaCode?: string
  rememberDevice?: boolean
  deviceName?: string
}

interface MFASetupResponse {
  qrCode: string
  backupCodes: string[]
  secret: string
}

interface PasswordStrengthResult {
  score: number // 0-4
  feedback: string[]
  isValid: boolean
}

interface SessionData {
  id: string
  device_name: string
  ip: string
  created_at: string
  last_activity: string
  is_current: boolean
}

interface LoginAttemptResult {
  success: boolean
  requiresMFA: boolean
  mfaChallenge?: MFAChallenge
  lockoutRemaining?: number
  user?: User
  tokens?: {
    access: string
    refresh: string
  }
}

class EnhancedAuthService {
  private baseUrl = '/user/auth'
  private maxLoginAttempts = 5
  private lockoutDuration = 15 * 60 * 1000 // 15 minutes

  /**
   * Enhanced login with MFA support
   */
  async login(credentials: EnhancedLoginCredentials): Promise<LoginAttemptResult> {
    try {
      // Check for account lockout
      if (this.isAccountLocked(credentials.email)) {
        throw new Error('Account temporarily locked due to too many failed attempts')
      }

      const response = await secureApi.getInstance().post(`${this.baseUrl}/login/`, {
        email: credentials.email,
        password: credentials.password,
        mfa_code: credentials.mfaCode,
        remember_device: credentials.rememberDevice,
        device_name: credentials.deviceName || this.getDeviceName()
      })

      const data = response.data

      // Handle MFA challenge
      if (data.requires_mfa && !credentials.mfaCode) {
        return {
          success: false,
          requiresMFA: true,
          mfaChallenge: data.mfa_challenge
        }
      }

      // Successful login
      if (data.access && data.refresh) {
        // Clear failed attempts
        this.clearFailedAttempts(credentials.email)
        
        // Store tokens and user data
        secureAuthStore.setTokens(data.access, data.refresh)
        if (data.user) {
          secureAuthStore.setUser(data.user)
        }
        if (data.tenant) {
          secureAuthStore.setTenant(data.tenant)
        }

        return {
          success: true,
          requiresMFA: false,
          user: data.user,
          tokens: {
            access: data.access,
            refresh: data.refresh
          }
        }
      }

      throw new Error('Invalid response from server')
    } catch (error: unknown) {
      // Record failed attempt
      this.recordFailedAttempt(credentials.email)
      
      // Check if account should be locked
      const failedAttempts = this.getFailedAttempts(credentials.email)
      if (failedAttempts >= this.maxLoginAttempts) {
        this.lockAccount(credentials.email)
        throw new Error('Account locked due to too many failed attempts')
      }

      throw error
    }
  }

  /**
   * Register new user with enhanced validation
   */
  async signup(userData: SignupData): Promise<{ message: string; user: User }> {
    // Validate password strength
    const passwordStrength = this.checkPasswordStrength(userData.password)
    if (!passwordStrength.isValid) {
      throw new Error(`Password too weak: ${passwordStrength.feedback.join(', ')}`)
    }

    // Check for disposable email domains
    if (this.isDisposableEmail(userData.email)) {
      throw new Error('Disposable email addresses are not allowed')
    }

    const response = await secureApi.getInstance().post(`${this.baseUrl}/signup/`, {
      ...userData,
      device_info: this.getDeviceInfo()
    })

    return response.data
  }

  /**
   * Setup Multi-Factor Authentication
   */
  async setupMFA(): Promise<MFASetupResponse> {
    const response = await secureApi.getInstance().post(`${this.baseUrl}/mfa/setup/`)
    return response.data
  }

  /**
   * Verify MFA setup
   */
  async verifyMFASetup(code: string): Promise<{ success: boolean; backupCodes: string[] }> {
    const response = await secureApi.getInstance().post(`${this.baseUrl}/mfa/verify-setup/`, {
      code
    })
    return response.data
  }

  /**
   * Disable MFA
   */
  async disableMFA(password: string): Promise<{ success: boolean }> {
    const response = await secureApi.getInstance().post(`${this.baseUrl}/mfa/disable/`, {
      password
    })
    return response.data
  }

  /**
   * Generate backup codes
   */
  async generateBackupCodes(): Promise<{ codes: string[] }> {
    const response = await secureApi.getInstance().post(`${this.baseUrl}/mfa/backup-codes/`)
    return response.data
  }

  /**
   * Enhanced logout with session cleanup
   */
  async logout(): Promise<void> {
    try {
      await secureApi.getInstance().post(`${this.baseUrl}/logout/`)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local state
      secureAuthStore.clear()
    }
  }

  /**
   * Refresh tokens with enhanced security
   */
  async refreshTokens(): Promise<{ access: string; refresh?: string }> {
    const refreshToken = secureAuthStore.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await secureApi.getInstance().post(`${this.baseUrl}/token/refresh/`, {
      refresh: refreshToken,
      device_id: this.getDeviceId(),
      device_info: this.getDeviceInfo()
    })

    const { access, refresh } = response.data
    secureAuthStore.setTokens(access, refresh)

    return { access, refresh }
  }

  /**
   * Change password with validation
   */
  async changePassword(
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean }> {
    // Validate new password strength
    const passwordStrength = this.checkPasswordStrength(newPassword)
    if (!passwordStrength.isValid) {
      throw new Error(`New password too weak: ${passwordStrength.feedback.join(', ')}`)
    }

    const response = await secureApi.getInstance().post(`${this.baseUrl}/change-password/`, {
      current_password: currentPassword,
      new_password: newPassword
    })

    return response.data
  }

  /**
   * Request password reset with enhanced security
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await secureApi.getInstance().post(`${this.baseUrl}/password-reset/`, {
      email,
      device_info: this.getDeviceInfo()
    })
    return response.data
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(
    token: string, 
    password: string
  ): Promise<{ success: boolean }> {
    // Validate password strength
    const passwordStrength = this.checkPasswordStrength(password)
    if (!passwordStrength.isValid) {
      throw new Error(`Password too weak: ${passwordStrength.feedback.join(', ')}`)
    }

    const response = await secureApi.getInstance().post(`${this.baseUrl}/password-reset-confirm/`, {
      token,
      password
    })

    return response.data
  }

  /**
   * Get active sessions
   */
  async getActiveSessions(): Promise<SessionData[]> {
    const response = await secureApi.getInstance().get(`${this.baseUrl}/sessions/`)
    return response.data
  }

  /**
   * Revoke session
   */
  async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await secureApi.getInstance().delete(`${this.baseUrl}/sessions/${sessionId}/`)
    return response.data
  }

  /**
   * Get trusted devices
   */
  async getTrustedDevices(): Promise<DeviceInfo[]> {
    const response = await secureApi.getInstance().get(`${this.baseUrl}/devices/`)
    return response.data
  }

  /**
   * Remove trusted device
   */
  async removeTrustedDevice(deviceId: string): Promise<{ success: boolean }> {
    const response = await secureApi.getInstance().delete(`${this.baseUrl}/devices/${deviceId}/`)
    return response.data
  }

  /**
   * Check if user has permission
   */
  hasPermission(resource: string, action: string): boolean {
    return secureAuthStore.hasPermission(resource, action)
  }

  /**
   * Check if user has role
   */
  hasRole(roles: string[]): boolean {
    return secureAuthStore.hasRole(roles)
  }

  /**
   * Get current tenant context
   */
  getTenantContext(): TenantContext | null {
    return secureAuthStore.getTenant()
  }

  /**
   * Switch tenant (for multi-tenant users)
   */
  async switchTenant(tenantId: string): Promise<{ success: boolean; tenant: TenantContext }> {
    const response = await secureApi.getInstance().post(`${this.baseUrl}/switch-tenant/`, {
      tenant_id: tenantId
    })

    if (response.data.success) {
      secureAuthStore.setTenant(response.data.tenant)
    }

    return response.data
  }

  /**
   * Private: Check password strength
   */
  private checkPasswordStrength(password: string): PasswordStrengthResult {
    let score = 0
    const feedback: string[] = []

    // Length check
    if (password.length >= 8) score++
    else feedback.push('Use at least 8 characters')

    if (password.length >= 12) score++

    // Character variety
    if (/[a-z]/.test(password)) score++
    else feedback.push('Include lowercase letters')

    if (/[A-Z]/.test(password)) score++
    else feedback.push('Include uppercase letters')

    if (/[0-9]/.test(password)) score++
    else feedback.push('Include numbers')

    if (/[^A-Za-z0-9]/.test(password)) score++
    else feedback.push('Include special characters')

    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
      score--
      feedback.push('Avoid repeated characters')
    }

    if (/^(password|123456|qwerty)/i.test(password)) {
      score = 0
      feedback.push('Avoid common passwords')
    }

    return {
      score: Math.max(0, Math.min(4, score)),
      feedback,
      isValid: score >= 3
    }
  }

  /**
   * Private: Check for disposable email domains
   */
  private isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'temp-mail.org'
    ]

    const domain = email.split('@')[1]?.toLowerCase()
    return domain ? disposableDomains.includes(domain) : false
  }

  /**
   * Private: Get device information
   */
  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile'
    }

    return {
      id: this.getDeviceId(),
      name: this.getDeviceName(),
      type: deviceType,
      os: this.getOS(),
      browser: this.getBrowser(),
      lastUsed: new Date().toISOString(),
      trusted: false
    }
  }

  /**
   * Private: Get device ID
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('ch_device_id')
    if (!deviceId) {
      deviceId = crypto.randomUUID()
      localStorage.setItem('ch_device_id', deviceId)
    }
    return deviceId
  }

  /**
   * Private: Get device name
   */
  private getDeviceName(): string {
    const userAgent = navigator.userAgent
    if (/Chrome/.test(userAgent)) return 'Chrome Browser'
    if (/Firefox/.test(userAgent)) return 'Firefox Browser'
    if (/Safari/.test(userAgent)) return 'Safari Browser'
    if (/Edge/.test(userAgent)) return 'Edge Browser'
    return 'Unknown Browser'
  }

  /**
   * Private: Get operating system
   */
  private getOS(): string {
    const userAgent = navigator.userAgent
    if (/Windows/.test(userAgent)) return 'Windows'
    if (/Mac/.test(userAgent)) return 'macOS'
    if (/Linux/.test(userAgent)) return 'Linux'
    if (/Android/.test(userAgent)) return 'Android'
    if (/iOS/.test(userAgent)) return 'iOS'
    return 'Unknown'
  }

  /**
   * Private: Get browser name
   */
  private getBrowser(): string {
    const userAgent = navigator.userAgent
    if (/Chrome/.test(userAgent)) return 'Chrome'
    if (/Firefox/.test(userAgent)) return 'Firefox'
    if (/Safari/.test(userAgent)) return 'Safari'
    if (/Edge/.test(userAgent)) return 'Edge'
    return 'Unknown'
  }

  /**
   * Private: Failed login attempt tracking
   */
  private recordFailedAttempt(email: string): void {
    const attempts = this.getFailedAttempts(email)
    const attemptsData = {
      count: attempts + 1,
      lastAttempt: Date.now()
    }
    localStorage.setItem(`ch_failed_${email}`, JSON.stringify(attemptsData))
  }

  private getFailedAttempts(email: string): number {
    const data = localStorage.getItem(`ch_failed_${email}`)
    if (!data) return 0
    
    const parsed = JSON.parse(data)
    // Reset if more than 1 hour has passed
    if (Date.now() - parsed.lastAttempt > 60 * 60 * 1000) {
      localStorage.removeItem(`ch_failed_${email}`)
      return 0
    }
    
    return parsed.count
  }

  private clearFailedAttempts(email: string): void {
    localStorage.removeItem(`ch_failed_${email}`)
  }

  private lockAccount(email: string): void {
    const lockData = {
      lockedAt: Date.now(),
      unlockAt: Date.now() + this.lockoutDuration
    }
    localStorage.setItem(`ch_locked_${email}`, JSON.stringify(lockData))
  }

  private isAccountLocked(email: string): boolean {
    const data = localStorage.getItem(`ch_locked_${email}`)
    if (!data) return false
    
    const parsed = JSON.parse(data)
    if (Date.now() > parsed.unlockAt) {
      localStorage.removeItem(`ch_locked_${email}`)
      this.clearFailedAttempts(email)
      return false
    }
    
    return true
  }
}

export const enhancedAuthService = new EnhancedAuthService()

// Export types
export type {
  EnhancedLoginCredentials,
  MFASetupResponse,
  PasswordStrengthResult,
  LoginAttemptResult,
  MFAChallenge,
  DeviceInfo,
  TenantContext
}