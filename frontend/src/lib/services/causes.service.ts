import { BaseService, type CrudService, type QueryParams } from './base'
import type { Pagination, CauseListItem, CauseDetails, Category } from '@/types/api'

export interface CauseFilters extends QueryParams {
  category?: string
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'live' | 'completed' | 'paused'
  featured?: boolean
  organizer_id?: string
}

export interface CreateCauseData {
  name: string
  description: string
  target_amount: number
  category?: string
  deadline?: string
  featured_image?: File
  gallery?: File[]
  tags?: string[]
  organizer_id: string
}

export interface UpdateCauseData extends Partial<CreateCauseData> {
  status?: CauseFilters['status']
}

/**
 * Causes service that handles all cause-related API calls
 * Provides CRUD operations and specialized cause management methods
 */
class CausesService extends BaseService implements CrudService<CauseListItem, CreateCauseData, UpdateCauseData> {
  protected basePath = '/causes'

  /**
   * Get paginated list of causes with filtering
   */
  async getAll(params?: CauseFilters): Promise<Pagination<CauseListItem>> {
    return this.getPaginated<CauseListItem>('/', params)
  }

  /**
   * Get cause details by ID
   */
  async getById(id: string): Promise<CauseDetails> {
    return this.get<CauseDetails>(`/details/${id}/`)
  }

  /**
   * Create a new cause
   */
  async create(data: CreateCauseData): Promise<CauseListItem> {
    const formData = this.createFormData(data)
    return this.post<CauseListItem>('/create/', formData)
  }

  /**
   * Update an existing cause
   */
  async update(id: string, data: UpdateCauseData): Promise<CauseListItem> {
    const formData = this.createFormData(data)
    return this.patch<CauseListItem>(`/${id}/`, formData)
  }

  /**
   * Delete a cause
   */
  async deleteCause(id: string): Promise<void> {
    return this.deleteRequest<void>(`/${id}/`)
  }

  /**
   * Get featured causes
   */
  async getFeatured(limit?: number): Promise<CauseListItem[]> {
    const params = limit ? { featured: true, page_size: limit } : { featured: true }
    const response = await this.getPaginated<CauseListItem>('/', params)
    return response.results
  }

  /**
   * Get causes by category
   */
  async getByCategory(categoryId: string, params?: Omit<CauseFilters, 'category'>): Promise<Pagination<CauseListItem>> {
    return this.getPaginated<CauseListItem>('/', { ...params, category: categoryId })
  }

  /**
   * Get user's own causes
   */
  async getMyCauses(params?: Omit<CauseFilters, 'organizer_id'>): Promise<Pagination<CauseListItem>> {
    return this.getPaginated<CauseListItem>('/my/', params)
  }

  /**
   * Search causes by text
   */
  async search(query: string, params?: Omit<CauseFilters, 'search'>): Promise<Pagination<CauseListItem>> {
    return this.getPaginated<CauseListItem>('/', { ...params, search: query })
  }

  /**
   * Get cause statistics
   */
  async getStats(id: string): Promise<{
    total_donations: number
    donation_count: number
    progress_percentage: number
    days_remaining?: number
  }> {
    return this.get<any>(`/${id}/stats/`)
  }

  /**
   * Get cause updates/posts
   */
  async getUpdates(id: string): Promise<Array<{
    id: string
    title: string
    description: string
    created_at: string
  }>> {
    return this.get<any>(`/${id}/updates/`)
  }

  /**
   * Add an update to a cause
   */
  async addUpdate(id: string, update: { title: string; description: string }): Promise<void> {
    return this.post<void>(`/${id}/updates/`, update)
  }

  /**
   * Helper method to create FormData for file uploads
   */
  private createFormData(data: CreateCauseData | UpdateCauseData): FormData {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (key === 'featured_image' && value instanceof File) {
        formData.append(key, value)
      } else if (key === 'gallery' && Array.isArray(value)) {
        value.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`gallery[${index}]`, file)
          }
        })
      } else if (key === 'tags' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value.toString())
      }
    })

    return formData
  }
}

/**
 * Categories service for cause categories
 */
class CategoriesService extends BaseService {
  protected basePath = '/categories'

  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await this.getPaginated<Category>('/')
      return response.results
    } catch (error) {
      // Handle 404 gracefully - return empty array if no categories found
      if ((error as any)?.response?.status === 404) {
        return []
      }
      throw error
    }
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category> {
    return this.get<Category>(`/${id}/`)
  }

  /**
   * Get categories with cause counts
   */
  async getWithCounts(): Promise<Category[]> {
    return this.get<Category[]>('/with-counts/')
  }
}

export const causesService = new CausesService()
export const categoriesService = new CategoriesService()