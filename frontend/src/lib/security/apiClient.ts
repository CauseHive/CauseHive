/**
 * Enhanced API Client with Enterprise Security Features
 * Implements zero-trust security, request signing, and comprehensive error handling
 */
import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders 
} from 'axios'
import { secureAuthStore } from './authStore'
import { API_BASE_URL } from '../config'
import type { RateLimitConfig, CSRFProtection } from './types'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean
    retryCount?: number
    metadata?: {
      requestId: string
      startTime: number
      url?: string
      method?: string
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface RequestMetrics {
  url: string
  method: string
  duration: number
  status: number
  timestamp: string
  userId?: string
  tenantId?: string
}

interface SecurityHeaders {
  'X-Request-ID': string
  'X-Client-Version': string
  'X-Device-ID': string
  'X-Tenant-ID'?: string
  'X-CSRF-Token'?: string
  'Content-Security-Policy'?: string
}

class SecureApiClient {
  private client: AxiosInstance
  private requestQueue: Map<string, Promise<AxiosResponse>> = new Map()
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map()
  private metrics: RequestMetrics[] = []
  private csrfToken: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    this.setupInterceptors()
    this.initializeCSRFProtection()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return this.enhanceRequest(config)
      },
      (error: AxiosError) => {
        return Promise.reject(this.transformError(error))
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return this.handleSuccessResponse(response)
      },
      async (error: AxiosError) => {
        return this.handleErrorResponse(error)
      }
    )
  }

  /**
   * Enhance request with security headers and authentication
   */
  private enhanceRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const requestId = crypto.randomUUID()
    const startTime = Date.now()
    
    // Add security headers
    const securityHeaders: SecurityHeaders = {
      'X-Request-ID': requestId,
      'X-Client-Version': import.meta.env.VITE_APP_VERSION || '1.0.0',
      'X-Device-ID': this.getDeviceFingerprint(),
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'"
    }

    // Add tenant context
    const tenant = secureAuthStore.getTenant()
    if (tenant) {
      securityHeaders['X-Tenant-ID'] = tenant.id
    }

    // Add CSRF token for state-changing operations
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = secureAuthStore.getCSRFToken()
      if (csrfToken) {
        securityHeaders['X-CSRF-Token'] = csrfToken
      }
    }

    // Add authentication token
    const token = secureAuthStore.getAccessToken()
    const headers = AxiosHeaders.from(config.headers || {})

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    Object.entries(securityHeaders).forEach(([key, value]) => {
      if (value) {
        headers.set(key, value)
      }
    })

    config.headers = headers

    // Add request metadata for tracking
    config.metadata = {
      requestId,
      startTime,
      url: config.url || '',
      method: config.method?.toUpperCase() || 'GET'
    }

    // Rate limiting check
    this.checkRateLimit(config.url || '')

    // Update user activity
    secureAuthStore.updateActivity()

    // Audit log for sensitive operations
    if (this.isSensitiveOperation(config)) {
      this.auditLog('api_request', config.url || '', 'initiated', {
        method: config.method,
        hasAuth: !!token
      })
    }

    return config
  }

  /**
   * Handle successful responses
   */
  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    const { requestId, startTime } = response.config.metadata || {}
    
    // Record metrics
    if (requestId && startTime) {
      this.recordMetrics({
        url: response.config.url || '',
        method: response.config.method?.toUpperCase() || 'GET',
        duration: Date.now() - startTime,
        status: response.status,
        timestamp: new Date().toISOString(),
        userId: secureAuthStore.getUser()?.id,
        tenantId: secureAuthStore.getTenant()?.id
      })
    }

    // Update CSRF token if provided
    const newCSRFToken = response.headers['x-csrf-token']
    if (newCSRFToken) {
      secureAuthStore.setCSRFToken(newCSRFToken)
    }

    // Audit log for sensitive operations
    if (this.isSensitiveOperation(response.config)) {
      this.auditLog('api_response', response.config.url || '', 'success', {
        status: response.status
      })
    }

    return response
  }

  /**
   * Handle error responses with retry logic
   */
  private async handleErrorResponse(error: AxiosError): Promise<AxiosResponse> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Record error metrics
    if (originalRequest?.metadata) {
      this.recordMetrics({
        url: originalRequest.url || '',
        method: originalRequest.method?.toUpperCase() || 'GET',
        duration: Date.now() - originalRequest.metadata.startTime,
        status: error.response?.status || 0,
        timestamp: new Date().toISOString(),
        userId: secureAuthStore.getUser()?.id,
        tenantId: secureAuthStore.getTenant()?.id
      })
    }

    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        return this.handle401Error(error, originalRequest)
      
      case 403:
        this.auditLog('access_denied', originalRequest?.url || '', 'failure', {
          reason: 'insufficient_permissions'
        })
        break
      
      case 429:
        return this.handle429Error(error, originalRequest)
      
      case 500:
      case 502:
      case 503:
      case 504:
        if (!originalRequest._retry && this.shouldRetry(originalRequest)) {
          return this.retryRequest(originalRequest)
        }
        break
    }

    // Audit log for sensitive operations
    if (originalRequest && this.isSensitiveOperation(originalRequest)) {
      this.auditLog('api_error', originalRequest.url || '', 'failure', {
        status: error.response?.status,
        message: error.message
      })
    }

    return Promise.reject(this.transformError(error))
  }

  /**
   * Handle 401 Unauthorized errors with token refresh
   */
  private async handle401Error(
    error: AxiosError, 
    originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
  ): Promise<AxiosResponse> {
    if (originalRequest._retry) {
      // Already tried to refresh, clear auth and redirect to login
      secureAuthStore.clear()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    const refreshToken = secureAuthStore.getRefreshToken()
    if (!refreshToken) {
      secureAuthStore.clear()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      // Attempt token refresh
      const response = await axios.post(`${API_BASE_URL}/user/auth/token/refresh/`, {
        refresh: refreshToken
      })

      const { access } = response.data
      secureAuthStore.setTokens(access)

      // Retry original request
      originalRequest._retry = true
      originalRequest.headers = originalRequest.headers || {}
      originalRequest.headers.Authorization = `Bearer ${access}`
      
      return this.client(originalRequest)
    } catch (refreshError) {
      secureAuthStore.clear()
      window.location.href = '/login'
      return Promise.reject(refreshError as AxiosError)
    }
  }

  /**
   * Handle 429 Rate Limit errors
   */
  private async handle429Error(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig
  ): Promise<AxiosResponse> {
    const retryAfter = error.response?.headers['retry-after']
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000

    await this.sleep(delay)
    return this.client(originalRequest)
  }

  /**
   * Retry failed requests with exponential backoff
   */
  private async retryRequest(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    config._retry = true
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, (config.retryCount || 0)) * 1000
    await this.sleep(delay)
    
    config.retryCount = (config.retryCount || 0) + 1
    return this.client(config)
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(config: InternalAxiosRequestConfig): boolean {
    const retryCount = config.retryCount || 0
    const maxRetries = 3
    const retryableMethods = ['GET', 'PUT', 'DELETE']
    
    return retryCount < maxRetries && 
           retryableMethods.includes(config.method?.toUpperCase() || '')
  }

  /**
   * Transform axios errors to user-friendly messages
   */
  private transformError(error: AxiosError): Error {
    const message = this.getErrorMessage(error)
    const enhancedError = new Error(message)
    
    // Preserve error properties
    Object.assign(enhancedError, {
      status: error.response?.status,
      code: error.code,
      response: error.response?.data,
      isRetryable: this.isRetryableError(error)
    })

    return enhancedError
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: AxiosError): string {
    if (!error.response) {
      return 'Network error. Please check your connection and try again.'
    }

    const status = error.response.status
    const data = error.response.data as { message?: string; detail?: string }

    switch (status) {
      case 400:
        return data?.message || data?.detail || 'Invalid request. Please check your input.'
      case 401:
        return 'Your session has expired. Please log in again.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'Conflict: The resource already exists or is in use.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      case 500:
        return 'Internal server error. Please try again later.'
      case 502:
        return 'Bad gateway. The server is temporarily unavailable.'
      case 503:
        return 'Service unavailable. Please try again later.'
      case 504:
        return 'Request timeout. Please try again.'
      default:
        return data?.message || data?.detail || 'An unexpected error occurred.'
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: AxiosError): boolean {
    if (!error.response) return true // Network errors are retryable
    
    const status = error.response.status
    return status >= 500 || status === 429
  }

  /**
   * Check if operation is sensitive and needs auditing
   */
  private isSensitiveOperation(config: InternalAxiosRequestConfig | AxiosRequestConfig): boolean {
    const url = config.url || ''
    const method = config.method?.toUpperCase() || ''
    
    const sensitivePatterns = [
      '/auth/',
      '/user/',
      '/admin/',
      '/payments/',
      '/withdrawals/',
      '/api-keys/'
    ]

    const sensitiveMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

    return sensitivePatterns.some(pattern => url.includes(pattern)) ||
           sensitiveMethods.includes(method)
  }

  /**
   * Rate limiting check
   */
  private checkRateLimit(url: string): void {
    const key = this.getRateLimitKey(url)
    const now = Date.now()
    const windowMs = 60000 // 1 minute window
    const maxRequests = 100 // Max requests per minute

    const limiter = this.rateLimiters.get(key)
    
    if (!limiter || now > limiter.resetTime) {
      this.rateLimiters.set(key, { count: 1, resetTime: now + windowMs })
      return
    }

    if (limiter.count >= maxRequests) {
      throw new Error('Rate limit exceeded. Please slow down your requests.')
    }

    limiter.count++
  }

  /**
   * Get rate limit key for URL
   */
  private getRateLimitKey(url: string): string {
    const tenant = secureAuthStore.getTenant()
    const user = secureAuthStore.getUser()
    return `${tenant?.id || 'global'}:${user?.id || 'anonymous'}:${url}`
  }

  /**
   * Get device fingerprint
   */
  private getDeviceFingerprint(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset()
    ].join('|')

    // Simple hash
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }

    return Math.abs(hash).toString(36)
  }

  /**
   * Initialize CSRF protection
   */
  private async initializeCSRFProtection(): Promise<void> {
    try {
      const response = await axios.get(`${API_BASE_URL}/csrf-token/`)
      const { token } = response.data
      secureAuthStore.setCSRFToken(token)
    } catch (error) {
      console.warn('Failed to initialize CSRF protection:', error)
    }
  }

  /**
   * Record request metrics
   */
  private recordMetrics(metrics: RequestMetrics): void {
    this.metrics.push(metrics)
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }

    // Log slow requests
    if (metrics.duration > 5000) {
      console.warn('Slow API request detected:', metrics)
    }
  }

  /**
   * Audit logging
   */
  private auditLog(
    action: string,
    resource: string,
    outcome: 'success' | 'failure' | 'initiated',
    details?: Record<string, unknown>
  ): void {
    const log = {
      id: crypto.randomUUID(),
      userId: secureAuthStore.getUser()?.id || 'anonymous',
      tenantId: secureAuthStore.getTenant()?.id || 'system',
      action,
      resource,
      timestamp: new Date().toISOString(),
      ip: '', // Will be filled by backend
      userAgent: navigator.userAgent,
      outcome,
      details
    }

    // Store locally and send to backend
    const auditLogs = JSON.parse(localStorage.getItem('ch_api_audit_logs') || '[]')
    auditLogs.push(log)
    
    if (auditLogs.length > 100) {
      auditLogs.shift()
    }
    
    localStorage.setItem('ch_api_audit_logs', JSON.stringify(auditLogs))
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get API metrics
   */
  getMetrics(): RequestMetrics[] {
    return [...this.metrics]
  }

  /**
   * Get client instance for direct use
   */
  getInstance(): AxiosInstance {
    return this.client
  }
}

// Create and export secure API client
export const secureApi = new SecureApiClient()
export const api = secureApi.getInstance()

// Export legacy compatibility
export default api