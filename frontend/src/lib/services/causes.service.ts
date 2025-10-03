import { BaseService, type CrudService, type QueryParams } from './base'
import type { CauseListItem, Category } from '@/types/api'

export interface CauseFilters extends QueryParams {
  category?: string
  status?: 'draft' | 'pending' | 'live' | 'completed' | 'rejected'
  search?: string
  ordering?: string
}

export interface CreateCauseData {
  title: string
  description: string
  target_amount: number
  category: string
  deadline?: string
  featured_image?: File
  gallery?: File[]
  tags?: string[]
}

export interface UpdateCauseData extends Partial<CreateCauseData> {
  status?: CauseFilters['status']
}

export interface CauseListResponse {
  count: number
  next: string | null
  previous: string | null
  results: CauseListItem[]
}

export interface CauseDetailResponse {
  id: string
  title: string
  description: string
  target_amount: number
  current_amount: number
  progress_percentage: number
  status: string
  category: {
    id: string
    name: string
    description: string
  }
  creator: {
    id: string
    full_name: string
    profile_picture: string
  }
  created_at: string
  updated_at: string
  deadline: string
  featured_image: string
  gallery: string[]
  donation_count: number
  is_featured: boolean
  tags: string[]
  updates: Array<{
    id: string
    title: string
    description: string
    created_at: string
  }>
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
  async getAll(params?: CauseFilters): Promise<CauseListResponse> {
    return this.getPaginated<CauseListItem>('/', params)
  }

  /**
   * Get cause details by ID
   */
  async getById(id: string): Promise<CauseDetailResponse> {
    return this.get<CauseDetailResponse>(`/${id}/`)
  }

  /**
   * Create a new cause
   */
  async create(data: CreateCauseData): Promise<CauseListItem> {
    const formData = this.createFormData(data)
    return this.post<CauseListItem>('/', formData)
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
   * Submit cause for approval
   */
  async submitForApproval(id: string): Promise<{ message: string; status: string }> {
    return this.post<{ message: string; status: string }>(`/${id}/submit/`)
  }

  /**
   * Get featured causes
   */
  async getFeatured(limit?: number): Promise<CauseListItem[]> {
    const params = limit ? { is_featured: true, page_size: limit } : { is_featured: true }
    const response = await this.getAll(params)
    return response.results
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
  async getAll(): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: Category[]
  }> {
    return this.getPaginated<Category>('/')
  }

  /**
   * Get category by ID with causes
   */
  async getById(id: string): Promise<{
    id: string
    name: string
    description: string
    icon: string
    color: string
    cause_count: number
    created_at: string
    causes: CauseListItem[]
  }> {
    return this.get<{
      id: string
      name: string
      description: string
      icon: string
      color: string
      cause_count: number
      created_at: string
      causes: CauseListItem[]
    }>(`/${id}/`)
  }
}

export const causesService = new CausesService()
export const categoriesService = new CategoriesService()