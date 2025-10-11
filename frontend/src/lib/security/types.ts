/**
 * Security and authentication type definitions
 * Enterprise-grade SaaS security implementation
 */

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
  user?: User
  tenant?: TenantContext
  requires_mfa?: boolean
  mfa_challenge?: MFAChallenge
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  roles?: UserRole[]
  tenant?: TenantContext
  mfaEnabled?: boolean
  lastPasswordChange?: string
  lastLogin?: string
}

export interface PasswordStrengthResult {
  score: number
  feedback: string[]
  isValid: boolean
}

export interface SessionConfig {
  timeout: number
  refreshThreshold: number
  maxSessions: number
  rememberMeDuration: number
}

export interface TotpConfig {
  issuer: string
  digits: number
  period: number
}

export interface MFAConfig {
  enabled: boolean
  required: boolean
  backupCodes: number
  totpConfig: TotpConfig
}

export interface AuditConfig {
  enabled: boolean
  logLevel: 'info' | 'warn' | 'error'
  retention: number
  events: string[]
}

export interface RateLimitingPolicy {
  enabled: boolean
  maxAttempts: number
  windowMs: number
  blockDuration: number
}

export interface SecurityConfig {
  tokenRefreshThreshold?: number
  maxLoginAttempts?: number
  lockoutDuration?: number
  sessionTimeout?: number
  passwordMinLength?: number
  mfaRequired?: boolean
  auditLogging?: boolean
  passwordPolicy: PasswordPolicy
  sessionConfig: SessionConfig
  mfaConfig: MFAConfig
  auditConfig: AuditConfig
  rateLimiting: RateLimitingPolicy
}

export interface UserRole {
  id: string
  name: string
  permissions: Permission[]
  isSystemRole: boolean
}

export interface Permission {
  id: string
  resource: string
  action: string
  conditions?: Record<string, unknown>
}

export interface TenantContext {
  id: string
  name: string
  plan: 'starter' | 'professional' | 'enterprise'
  settings: TenantSettings
  quotas: TenantQuotas
}

export interface TenantSettings {
  branding?: {
    logo?: string
    primaryColor?: string
    domain?: string
  }
  security: {
    mfaRequired: boolean
    passwordPolicy: PasswordPolicy
    sessionTimeout: number
    ipWhitelist?: string[]
  }
  features: {
    apiAccess: boolean
    webhooks: boolean
    advancedAnalytics: boolean
    customIntegrations: boolean
  }
}

export interface TenantQuotas {
  maxUsers: number
  maxCauses: number
  maxDonationsPerMonth: number
  storageLimit: number // MB
  apiCallsPerMonth: number
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventReuse: number // Number of previous passwords to check
  maxAge: number // Days before password expires
}

export interface MFAChallenge {
  challengeId: string
  type: 'totp' | 'sms' | 'email'
  maskedDestination?: string
  expiresAt: string
}

export interface SecurityAuditLog {
  id: string
  userId: string
  tenantId: string
  action: string
  resource: string
  timestamp: string
  ip: string
  userAgent: string
  outcome: 'success' | 'failure'
  details?: Record<string, unknown>
}

export interface LoginAttempt {
  email: string
  timestamp: number
  ip: string
  success: boolean
}

export interface DeviceInfo {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  lastUsed: string
  trusted: boolean
}

export interface SessionInfo {
  id: string
  userId: string
  deviceId: string
  ip: string
  createdAt: string
  expiresAt: string
  lastActivity: string
  active: boolean
}

export interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  permissions: Permission[]
  createdAt: string
  expiresAt?: string
  lastUsed?: string
  revokedAt?: string
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipOnSuccess?: boolean
  keyGenerator?: (req: Request) => string
}

export interface CSRFProtection {
  token: string
  expiresAt: string
}

export interface EncryptionConfig {
  algorithm: string
  keyRotationInterval: number // Days
  backupKeys: number // Number of old keys to keep
}