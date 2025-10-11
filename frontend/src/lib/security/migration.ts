/**
 * Migration utilities for transitioning from legacy authentication to enterprise security
 * Ensures backward compatibility while gradually adopting new security features
 */

import { authStore as legacyAuthStore } from '@/lib/auth'
import { secureAuthStore } from './authStore'
import type { User, SecurityConfig } from './types'

export class SecurityMigration {
  private static instance: SecurityMigration | null = null

  static getInstance(): SecurityMigration {
    if (!this.instance) {
      this.instance = new SecurityMigration()
    }
    return this.instance
  }

  /**
   * Migrate existing user session to enhanced security store
   */
  async migrateSession(): Promise<boolean> {
    try {
      const legacyToken = legacyAuthStore.getAccessToken()
      const legacyUser = legacyAuthStore.getUser()

      if (!legacyToken || !legacyUser) {
        return false
      }

      // Convert legacy user to enhanced user format
      const legacyUserData = legacyUser as Partial<User>

      const legacyId = legacyUser.id
      const legacyEmail = legacyUser.email

      if (!legacyId || !legacyEmail) {
        console.warn('SecurityMigration: legacy user missing id or email, skipping migration')
        return false
      }

      const enhancedUser: User = {
        id: legacyId,
        email: legacyEmail,
        first_name: legacyUser.first_name || '',
        last_name: legacyUser.last_name || '',
        is_active: legacyUser.is_active ?? true,
        mfaEnabled: legacyUserData.mfaEnabled ?? false,
        roles: legacyUserData.roles,
        tenant: legacyUserData.tenant,
        lastPasswordChange: legacyUserData.lastPasswordChange,
        lastLogin: legacyUserData.lastLogin
      }

      // Initialize enhanced session
      secureAuthStore.setUser(enhancedUser)
      const refreshToken = legacyAuthStore.getRefreshToken?.()
      secureAuthStore.setTokens(legacyToken, refreshToken || undefined)

      console.log('Session migrated to enhanced security store')
      return true
    } catch (error) {
      console.error('Failed to migrate session:', error)
      return false
    }
  }

  /**
   * Check if user needs security upgrades
   */
  async checkSecurityUpgrades(): Promise<{
    needsMFA: boolean
    needsPasswordUpdate: boolean
    needsDeviceRegistration: boolean
    recommendations: string[]
  }> {
    const user = secureAuthStore.getUser()
    if (!user) {
      return {
        needsMFA: false,
        needsPasswordUpdate: false,
        needsDeviceRegistration: false,
        recommendations: ['Please log in to check security status']
      }
    }

    const recommendations: string[] = []
    const needsMFA = !user.mfaEnabled
    const needsPasswordUpdate = this.isPasswordOld(user.lastPasswordChange)
    const needsDeviceRegistration = !(await secureAuthStore.getCurrentDevice())

    if (needsMFA) {
      recommendations.push('Enable multi-factor authentication for better security')
    }

    if (needsPasswordUpdate) {
      recommendations.push('Update your password - it has been a while since your last change')
    }

    if (needsDeviceRegistration) {
      recommendations.push('Register this device for secure access')
    }

    if (recommendations.length === 0) {
      recommendations.push('Your security settings are up to date!')
    }

    return {
      needsMFA,
      needsPasswordUpdate,
      needsDeviceRegistration,
      recommendations
    }
  }

  /**
   * Generate default security configuration for migrated users
   */
  getDefaultSecurityConfig(): SecurityConfig {
    return {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90, // days
        preventReuse: 5
      },
      sessionConfig: {
        timeout: 30 * 60 * 1000, // 30 minutes
        refreshThreshold: 5 * 60 * 1000, // 5 minutes
        maxSessions: 3,
        rememberMeDuration: 30 * 24 * 60 * 60 * 1000 // 30 days
      },
      mfaConfig: {
        enabled: false, // Start disabled for migrated users
        required: false,
        backupCodes: 10,
        totpConfig: {
          issuer: 'CauseHive',
          digits: 6,
          period: 30
        }
      },
      auditConfig: {
        enabled: true,
        logLevel: 'info',
        retention: 90, // days
        events: [
          'login',
          'logout',
          'password_change',
          'mfa_setup',
          'device_registration'
        ]
      },
      rateLimiting: {
        enabled: true,
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDuration: 15 * 60 * 1000 // 15 minutes
      }
    }
  }

  /**
   * Gradually enable security features
   */
  async enableSecurityFeature(feature: 'mfa' | 'audit' | 'device-tracking'): Promise<boolean> {
    try {
      const config = this.getDefaultSecurityConfig()
      
      switch (feature) {
        case 'mfa':
          config.mfaConfig.enabled = true
          break
        case 'audit':
          config.auditConfig.enabled = true
          break
        case 'device-tracking':
          // Enable device fingerprinting
          await secureAuthStore.registerDevice()
          break
      }

      // Store updated config
      localStorage.setItem('ch_security_config', JSON.stringify(config))
      console.log(`Security feature '${feature}' enabled`)
      return true
    } catch (error) {
      console.error(`Failed to enable security feature '${feature}':`, error)
      return false
    }
  }

  /**
   * Clean up legacy authentication data after successful migration
   */
  cleanupLegacyData(): void {
    try {
      // Only clear if migration was successful
      const hasEnhancedSession = secureAuthStore.isAuthenticated()
      if (hasEnhancedSession) {
        console.log('Cleaning up legacy authentication data')
        // Legacy data will be automatically cleaned up when new tokens are set
      }
    } catch (error) {
      console.error('Failed to cleanup legacy data:', error)
    }
  }

  private isPasswordOld(lastPasswordChange?: string): boolean {
    if (!lastPasswordChange) {
      return true
    }

    const changeDate = new Date(lastPasswordChange)
    if (Number.isNaN(changeDate.getTime())) {
      return true
    }

    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return changeDate < threeMonthsAgo
  }
}

// Export singleton instance
export const securityMigration = SecurityMigration.getInstance()

// Auto-migrate on app startup
export async function initializeSecurityMigration(): Promise<void> {
  try {
    console.log('Initializing security migration...')
    
    // Check if we have a legacy session to migrate
    const migrated = await securityMigration.migrateSession()
    
    if (migrated) {
      console.log('Legacy session migrated successfully')
      
      // Enable gradual security features
      await securityMigration.enableSecurityFeature('audit')
      
      // Check for security upgrades
      const upgrades = await securityMigration.checkSecurityUpgrades()
      if (upgrades.recommendations.length > 0) {
        console.log('Security recommendations:', upgrades.recommendations)
      }
    }
  } catch (error) {
    console.error('Security migration initialization failed:', error)
  }
}