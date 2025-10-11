/**
 * Enhanced Authentication Store with Enterprise Security Features
 * Multi-tenancy, session management, and security audit logging
 */
import { jwtDecode } from 'jwt-decode'
import type { 
  TenantContext, 
  UserRole, 
  SecurityAuditLog, 
  SessionInfo, 
  DeviceInfo
} from './types'

interface User {
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
  preferences?: UserPreferences
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

interface JWTPayload {
  user_id: string
  email: string
  tenant_id: string
  roles: string[]
  permissions: string[]
  exp: number
  iat: number
  jti: string
  device_id?: string
}

interface AuthState {
  user: User | null
  tenant: TenantContext | null
  accessToken: string | null
  refreshToken: string | null
  sessionInfo: SessionInfo | null
  deviceInfo: DeviceInfo | null
  csrfToken: string | null
  lastActivity: number
  isAuthenticated: boolean
  mfaPending: boolean
}

// Storage keys with versioning for migration support
const STORAGE_VERSION = '2.0'
const STORAGE_PREFIX = `ch_v${STORAGE_VERSION}`
const ACCESS_TOKEN_KEY = `${STORAGE_PREFIX}_access`
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}_refresh`
const USER_KEY = `${STORAGE_PREFIX}_user`
const TENANT_KEY = `${STORAGE_PREFIX}_tenant`
const SESSION_KEY = `${STORAGE_PREFIX}_session`
const DEVICE_KEY = `${STORAGE_PREFIX}_device`
const CSRF_KEY = `${STORAGE_PREFIX}_csrf`

class SecureAuthStore {
  private state: AuthState = {
    user: null,
    tenant: null,
    accessToken: null,
    refreshToken: null,
    sessionInfo: null,
    deviceInfo: null,
    csrfToken: null,
    lastActivity: Date.now(),
    isAuthenticated: false,
    mfaPending: false
  }

  private listeners: Array<(state: AuthState) => void> = []
  private sessionCheckInterval: NodeJS.Timeout | null = null
  private inactivityTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.initializeFromStorage()
    this.startSessionMonitoring()
    this.setupInactivityDetection()
  }

  /**
   * Initialize auth state from secure storage
   */
  private initializeFromStorage(): void {
    try {
      const accessToken = this.getSecureItem(ACCESS_TOKEN_KEY)
      const refreshToken = this.getSecureItem(REFRESH_TOKEN_KEY)
      const userStr = this.getSecureItem(USER_KEY)
      const tenantStr = this.getSecureItem(TENANT_KEY)
      const sessionStr = this.getSecureItem(SESSION_KEY)
      const deviceStr = this.getSecureItem(DEVICE_KEY)
      const csrfToken = this.getSecureItem(CSRF_KEY)

      if (accessToken && this.isTokenValid(accessToken)) {
        this.state.accessToken = accessToken
        this.state.refreshToken = refreshToken
        this.state.user = userStr ? JSON.parse(userStr) : null
        this.state.tenant = tenantStr ? JSON.parse(tenantStr) : null
        this.state.sessionInfo = sessionStr ? JSON.parse(sessionStr) : null
        this.state.deviceInfo = deviceStr ? JSON.parse(deviceStr) : null
        this.state.csrfToken = csrfToken
        this.state.isAuthenticated = true
      } else {
        this.clearAuthState()
      }
    } catch (error) {
      console.error('Failed to initialize auth state from storage:', error)
      this.clearAuthState()
    }
  }

  /**
   * Set authentication tokens and user data
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    try {
      if (!this.isTokenValid(accessToken)) {
        throw new Error('Invalid access token')
      }

      const payload = this.decodeToken(accessToken)
      
      this.state.accessToken = accessToken
      this.state.refreshToken = refreshToken || this.state.refreshToken
      this.state.isAuthenticated = true
      this.state.lastActivity = Date.now()

      // Store securely
      this.setSecureItem(ACCESS_TOKEN_KEY, accessToken)
      if (refreshToken) {
        this.setSecureItem(REFRESH_TOKEN_KEY, refreshToken)
      }

      // Generate session info
      this.generateSessionInfo(payload)
      
      this.notifyListeners()
      this.auditLog('token_set', 'authentication', 'success')
    } catch (error) {
      console.error('Failed to set tokens:', error)
      this.auditLog('token_set', 'authentication', 'failure', { error: (error as Error).message })
      throw error
    }
  }

  /**
   * Set user data with validation
   */
  setUser(user: User): void {
    if (!user.id || !user.email) {
      throw new Error('Invalid user data: missing required fields')
    }

    this.state.user = user
    this.setSecureItem(USER_KEY, JSON.stringify(user))
    this.notifyListeners()
    this.auditLog('user_set', 'user_management', 'success')
  }

  /**
   * Set tenant context
   */
  setTenant(tenant: TenantContext): void {
    this.state.tenant = tenant
    this.setSecureItem(TENANT_KEY, JSON.stringify(tenant))
    this.notifyListeners()
    this.auditLog('tenant_set', 'tenant_management', 'success')
  }

  /**
   * Set CSRF token
   */
  setCSRFToken(token: string): void {
    this.state.csrfToken = token
    this.setSecureItem(CSRF_KEY, token)
  }

  /**
   * Get current authentication state
   */
  getState(): AuthState {
    return { ...this.state }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.state.accessToken
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.state.refreshToken
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.state.user
  }

  /**
   * Get current tenant
   */
  getTenant(): TenantContext | null {
    return this.state.tenant
  }

  /**
   * Get current registered device information
   */
  async getCurrentDevice(): Promise<DeviceInfo | null> {
    if (this.state.deviceInfo) {
      return this.state.deviceInfo
    }

    const stored = this.getSecureItem(DEVICE_KEY)
    if (!stored) {
      return null
    }

    try {
      const device = JSON.parse(stored) as DeviceInfo
      this.state.deviceInfo = device
      return device
    } catch (error) {
      console.error('Failed to parse stored device info:', error)
      return null
    }
  }

  /**
   * Register or refresh trusted device information
   */
  async registerDevice(): Promise<DeviceInfo> {
    const device: DeviceInfo = {
      id: this.state.deviceInfo?.id || this.generateDeviceId(),
      name: navigator.userAgent,
      type: this.detectDeviceType(),
      os: navigator.platform || 'unknown',
      browser: navigator.userAgent,
      lastUsed: new Date().toISOString(),
      trusted: true
    }

    this.state.deviceInfo = device
    this.setSecureItem(DEVICE_KEY, JSON.stringify(device))
    this.notifyListeners()
    this.auditLog('device_registered', 'device_management', 'success', { deviceId: device.id })
    return device
  }

  /**
   * Get CSRF token
   */
  getCSRFToken(): string | null {
    return this.state.csrfToken
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated && 
           !!this.state.accessToken && 
           this.isTokenValid(this.state.accessToken)
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(resource: string, action: string): boolean {
    if (!this.state.user?.roles) return false

    return this.state.user.roles.some(role =>
      role.permissions.some(permission =>
        permission.resource === resource && permission.action === action
      )
    )
  }

  /**
   * Check if user has any of the specified roles
   */
  hasRole(roleNames: string[]): boolean {
    if (!this.state.user?.roles) return false

    return this.state.user.roles.some(role =>
      roleNames.includes(role.name)
    )
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    this.state.lastActivity = Date.now()
    this.resetInactivityTimeout()
  }

  /**
   * Clear all authentication data
   */
  clear(): void {
    this.clearAuthState()
    this.clearStorage()
    this.stopSessionMonitoring()
    this.notifyListeners()
    this.auditLog('auth_cleared', 'authentication', 'success')
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Private: Validate JWT token
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = jwtDecode<JWTPayload>(token)
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  /**
   * Private: Decode JWT token
   */
  private decodeToken(token: string): JWTPayload {
    return jwtDecode<JWTPayload>(token)
  }

  /**
   * Private: Generate session information
   */
  private generateSessionInfo(payload: JWTPayload): void {
    const sessionInfo: SessionInfo = {
      id: payload.jti,
      userId: payload.user_id,
      deviceId: payload.device_id || this.generateDeviceId(),
      ip: '', // Will be set by backend
      createdAt: new Date(payload.iat * 1000).toISOString(),
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      lastActivity: new Date().toISOString(),
      active: true
    }

    this.state.sessionInfo = sessionInfo
    this.setSecureItem(SESSION_KEY, JSON.stringify(sessionInfo))
  }

  /**
   * Private: Generate device fingerprint
   */
  private generateDeviceId(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Device fingerprint', 2, 2)
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|')

    // Simple hash function
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36)
  }

  private detectDeviceType(): DeviceInfo['type'] {
    const ua = navigator.userAgent.toLowerCase()
    if (/mobile|iphone|android/.test(ua)) {
      return 'mobile'
    }
    if (/ipad|tablet/.test(ua)) {
      return 'tablet'
    }
    return 'desktop'
  }

  /**
   * Private: Start session monitoring
   */
  private startSessionMonitoring(): void {
    this.sessionCheckInterval = setInterval(() => {
      if (this.state.accessToken && !this.isTokenValid(this.state.accessToken)) {
        this.auditLog('session_expired', 'authentication', 'failure')
        this.clear()
      }
    }, 60000) // Check every minute
  }

  /**
   * Private: Stop session monitoring
   */
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }
  }

  /**
   * Private: Setup inactivity detection
   */
  private setupInactivityDetection(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const resetActivity = () => {
      this.updateActivity()
    }

    events.forEach(event => {
      document.addEventListener(event, resetActivity, true)
    })

    this.resetInactivityTimeout()
  }

  /**
   * Private: Reset inactivity timeout
   */
  private resetInactivityTimeout(): void {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout)
    }

    const timeout = this.state.tenant?.settings.security.sessionTimeout || 30 // minutes
    
    this.inactivityTimeout = setTimeout(() => {
      this.auditLog('session_timeout', 'authentication', 'failure')
      this.clear()
    }, timeout * 60 * 1000)
  }

  /**
   * Private: Clear auth state
   */
  private clearAuthState(): void {
    this.state = {
      user: null,
      tenant: null,
      accessToken: null,
      refreshToken: null,
      sessionInfo: null,
      deviceInfo: null,
      csrfToken: null,
      lastActivity: Date.now(),
      isAuthenticated: false,
      mfaPending: false
    }
  }

  /**
   * Private: Clear all storage
   */
  private clearStorage(): void {
    const keys = [
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_KEY,
      TENANT_KEY,
      SESSION_KEY,
      DEVICE_KEY,
      CSRF_KEY
    ]

    keys.forEach(key => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
  }

  /**
   * Private: Secure item storage with encryption
   */
  private setSecureItem(key: string, value: string): void {
    try {
      // In production, implement actual encryption here
      const encrypted = btoa(value) // Basic encoding, replace with AES encryption
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('Failed to store secure item:', error)
    }
  }

  /**
   * Private: Secure item retrieval with decryption
   */
  private getSecureItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      
      // In production, implement actual decryption here
      return atob(encrypted) // Basic decoding, replace with AES decryption
    } catch (error) {
      console.error('Failed to retrieve secure item:', error)
      return null
    }
  }

  /**
   * Private: Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState())
      } catch (error) {
        console.error('Error in auth state listener:', error)
      }
    })
  }

  /**
   * Private: Audit logging for security events
   */
  private auditLog(
    action: string, 
    resource: string, 
    outcome: 'success' | 'failure',
    details?: Record<string, unknown>
  ): void {
    const log: SecurityAuditLog = {
      id: crypto.randomUUID(),
      userId: this.state.user?.id || 'anonymous',
      tenantId: this.state.tenant?.id || 'system',
      action,
      resource,
      timestamp: new Date().toISOString(),
      ip: '', // Will be filled by backend
      userAgent: navigator.userAgent,
      outcome,
      details
    }

    // Store locally for offline capability
    const auditLogs = JSON.parse(localStorage.getItem('ch_audit_logs') || '[]')
    auditLogs.push(log)
    
    // Keep only last 100 logs locally
    if (auditLogs.length > 100) {
      auditLogs.splice(0, auditLogs.length - 100)
    }
    
    localStorage.setItem('ch_audit_logs', JSON.stringify(auditLogs))

    // TODO: Send to backend audit service
    console.log('Security Audit Log:', log)
  }
}

export const secureAuthStore = new SecureAuthStore()

// Legacy compatibility - gradually migrate to secureAuthStore
export const authStore = {
  getAccessToken: () => secureAuthStore.getAccessToken(),
  getRefreshToken: () => secureAuthStore.getRefreshToken(),
  setTokens: (access: string, refresh?: string) => secureAuthStore.setTokens(access, refresh),
  setUser: (user: User) => secureAuthStore.setUser(user),
  getUser: () => secureAuthStore.getUser(),
  clear: () => secureAuthStore.clear(),
  isAuthenticated: () => secureAuthStore.isAuthenticated(),
  
  // Enhanced methods
  hasPermission: (resource: string, action: string) => secureAuthStore.hasPermission(resource, action),
  hasRole: (roles: string[]) => secureAuthStore.hasRole(roles),
  getTenant: () => secureAuthStore.getTenant(),
  getCurrentDevice: () => secureAuthStore.getCurrentDevice(),
  registerDevice: () => secureAuthStore.registerDevice(),
  updateActivity: () => secureAuthStore.updateActivity(),
  subscribe: (listener: (state: AuthState) => void) => secureAuthStore.subscribe(listener)
}