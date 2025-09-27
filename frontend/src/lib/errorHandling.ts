import { AxiosError } from 'axios'
import { authStore } from './auth'

/**
 * Enhanced error handling utilities with retry logic and user-friendly messages
 */

export interface ApiError {
  message: string
  code?: string
  status?: number
  field?: string
  retryable?: boolean
}

export interface RetryConfig {
  maxRetries: number
  delayMs: number
  backoffMultiplier: number
  retryCondition?: (error: any) => boolean
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600)
  }
}

/**
 * Transform axios error to user-friendly error message
 */
export function transformError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const data = error.response?.data

    // Handle specific error codes
    switch (status) {
      case 400:
        return {
          message: extractValidationMessage(data) || 'Invalid request. Please check your input.',
          status,
          retryable: false
        }
      
      case 401:
        return {
          message: 'Your session has expired. Please log in again.',
          status,
          retryable: false
        }
      
      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          status,
          retryable: false
        }
      
      case 404:
        return {
          message: 'The requested resource was not found.',
          status,
          retryable: false
        }
      
      case 429:
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          status,
          retryable: true
        }
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: 'Server error. Please try again in a moment.',
          status,
          retryable: true
        }
      
      default:
        if (!error.response) {
          return {
            message: 'Network error. Please check your connection and try again.',
            retryable: true
          }
        }
        
        return {
          message: data?.message || 'An unexpected error occurred.',
          status,
          retryable: status ? status >= 500 : true
        }
    }
  }

  // Handle non-axios errors
  if (error instanceof Error) {
    return {
      message: error.message,
      retryable: false
    }
  }

  return {
    message: 'An unknown error occurred.',
    retryable: false
  }
}

/**
 * Extract validation message from error response
 */
function extractValidationMessage(data: any): string | null {
  if (!data) return null

  // Handle Django REST framework validation errors
  if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
    return data.non_field_errors[0]
  }

  // Handle field-specific errors
  const fieldErrors = Object.entries(data)
    .filter(([key]) => key !== 'non_field_errors')
    .map(([field, errors]) => {
      const errorArray = Array.isArray(errors) ? errors : [errors]
      return errorArray.length > 0 ? `${field}: ${errorArray[0]}` : null
    })
    .filter(Boolean)

  if (fieldErrors.length > 0) {
    return fieldErrors[0] as string
  }

  // Handle simple error messages
  if (typeof data.error === 'string') {
    return data.error
  }

  if (typeof data.message === 'string') {
    return data.message
  }

  return null
}

/**
 * Retry wrapper for async operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: any
  
  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      // Don't retry on the last attempt or if not retryable
      if (attempt === finalConfig.maxRetries || !finalConfig.retryCondition!(error)) {
        break
      }
      
      // Wait before retrying
      const delay = finalConfig.delayMs * Math.pow(finalConfig.backoffMultiplier, attempt)
      await sleep(delay)
    }
  }
  
  throw lastError
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandlers() {
  // Handle unhandledrejection events
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Transform and log the error
    const apiError = transformError(event.reason)
    console.error('Transformed error:', apiError)
    
    // Prevent default browser behavior
    event.preventDefault()
  })

  // Handle error events
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    // Transform and log the error
    const apiError = transformError(event.error)
    console.error('Transformed error:', apiError)
  })
}

/**
 * Error boundary error handler
 */
export function handleBoundaryError(error: Error, errorInfo: { componentStack: string }) {
  console.error('Error boundary caught an error:', error)
  console.error('Component stack:', errorInfo.componentStack)
  
  // Log additional context
  const user = authStore.getUser()
  const context = {
    user: user ? { id: user.id, email: user.email } : null,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  console.error('Error context:', context)
  
  // Here you could send error to external logging service
  // trackError(error, { ...errorInfo, ...context })
}

/**
 * Network status utilities
 */
export const networkStatus = {
  isOnline: () => navigator.onLine,
  
  onStatusChange: (callback: (online: boolean) => void) => {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }
}