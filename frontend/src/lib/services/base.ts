import { api } from '../api'
import { withRetry, transformError, type RetryConfig } from '../errorHandling'
import type { Pagination } from '@/types/api'

/**
 * Base API service class that provides common functionality for all services
 * Includes error handling, retry logic, and request/response transformation
 */
export abstract class BaseService {
  protected abstract basePath: string

  /**
   * Generic GET request with automatic error handling and retry logic
   */
  protected async get<T>(endpoint: string = '', params?: Record<string, any>, retryConfig?: Partial<RetryConfig>): Promise<T> {
    return withRetry(async () => {
      try {
        const { data } = await api.get(`${this.basePath}${endpoint}`, { params })
        return data
      } catch (error) {
        this.handleError(error, 'GET', endpoint)
        throw error
      }
    }, retryConfig)
  }

  /**
   * Generic POST request with automatic error handling
   */
  protected async post<T>(endpoint: string = '', payload?: any, retryConfig?: Partial<RetryConfig>): Promise<T> {
    return withRetry(async () => {
      try {
        const { data } = await api.post(`${this.basePath}${endpoint}`, payload)
        return data
      } catch (error) {
        this.handleError(error, 'POST', endpoint)
        throw error
      }
    }, { ...retryConfig, retryCondition: (error) => error.response?.status >= 500 })
  }

  /**
   * Generic PUT request with automatic error handling
   */
  protected async put<T>(endpoint: string = '', payload?: any, retryConfig?: Partial<RetryConfig>): Promise<T> {
    return withRetry(async () => {
      try {
        const { data } = await api.put(`${this.basePath}${endpoint}`, payload)
        return data
      } catch (error) {
        this.handleError(error, 'PUT', endpoint)
        throw error
      }
    }, { ...retryConfig, retryCondition: (error) => error.response?.status >= 500 })
  }

  /**
   * Generic PATCH request with automatic error handling
   */
  protected async patch<T>(endpoint: string = '', payload?: any, retryConfig?: Partial<RetryConfig>): Promise<T> {
    return withRetry(async () => {
      try {
        const { data } = await api.patch(`${this.basePath}${endpoint}`, payload)
        return data
      } catch (error) {
        this.handleError(error, 'PATCH', endpoint)
        throw error
      }
    }, { ...retryConfig, retryCondition: (error) => error.response?.status >= 500 })
  }

  /**
   * Generic DELETE request with automatic error handling
   */
  protected async delete<T>(endpoint: string = '', retryConfig?: Partial<RetryConfig>): Promise<T> {
    return withRetry(async () => {
      try {
        const { data } = await api.delete(`${this.basePath}${endpoint}`)
        return data
      } catch (error) {
        this.handleError(error, 'DELETE', endpoint)
        throw error
      }
    }, { ...retryConfig, retryCondition: (error) => error.response?.status >= 500 })
  }

  /**
   * Alias for delete method to avoid conflicts with class method names
   */
  protected async deleteRequest<T>(endpoint: string = '', retryConfig?: Partial<RetryConfig>): Promise<T> {
    return this.delete<T>(endpoint, retryConfig)
  }

  /**
   * Helper method for paginated requests
   */
  protected async getPaginated<T>(
    endpoint: string = '',
    params?: Record<string, any>,
    retryConfig?: Partial<RetryConfig>
  ): Promise<Pagination<T>> {
    return this.get<Pagination<T>>(endpoint, params, retryConfig)
  }

  /**
   * Centralized error handling for all service requests
   */
  private handleError(error: any, method: string, endpoint: string): void {
    const fullPath = `${this.basePath}${endpoint}`
    const apiError = transformError(error)
    
    // Log error for debugging
    console.error(`API Error [${method} ${fullPath}]:`, {
      originalError: error,
      transformedError: apiError,
      timestamp: new Date().toISOString()
    })

    // Add additional context for specific errors
    if (apiError.status === 401) {
      console.warn('Authentication error - token may need refresh')
    } else if (apiError.status === 403) {
      console.warn('Authorization error - insufficient permissions')
    } else if (apiError.status && apiError.status >= 500) {
      console.error('Server error - backend may be experiencing issues')
    }
  }
}

/**
 * Interface for standard CRUD operations
 */
export interface CrudService<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  getAll(params?: Record<string, any>): Promise<Pagination<T>>
  getById(id: string): Promise<T>
  create(data: CreateData): Promise<T>
  update(id: string, data: UpdateData): Promise<T>
  deleteCause?(id: string): Promise<void>
}

/**
 * Utility type for API query parameters
 */
export type QueryParams = {
  page?: number
  page_size?: number
  search?: string
  ordering?: string
  [key: string]: any
}

/**
 * Standard API response wrapper for consistent error handling
 */
export type ApiResponse<T> = {
  data: T
  message?: string
  status: 'success' | 'error'
}