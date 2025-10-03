import { BaseService, type QueryParams } from './base'

export interface NotificationFilters extends QueryParams {
  unread_only?: boolean
  type?: string
}

export interface NotificationResponse {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  data?: {
    donation_id?: string
    amount?: number
    cause_id?: string
  }
}

export interface NotificationListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NotificationResponse[]
}

/**
 * Notifications service that handles user notifications
 */
class NotificationsService extends BaseService {
  protected basePath = '/notifications'

  /**
   * Get paginated notifications for current user
   */
  async getNotifications(params?: NotificationFilters): Promise<NotificationListResponse> {
    return this.getPaginated<NotificationResponse>('/', params)
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<{ message: string; is_read: boolean }> {
    return this.patch<{ message: string; is_read: boolean }>(`/${id}/read/`)
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string; updated_count: number }> {
    return this.post<{ message: string; updated_count: number }>('/mark-all-read/')
  }
}

export const notificationsService = new NotificationsService()