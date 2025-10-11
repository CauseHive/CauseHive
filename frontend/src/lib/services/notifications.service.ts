import { BaseService, type QueryParams } from './base'
import type { Pagination } from '@/types/api'

export interface NotificationFilters extends QueryParams {
  unread_only?: boolean
  type?: string
}

export interface NotificationResponse {
  id: string
  title: string
  message: string
  type: string
  priority?: string
  is_read: boolean
  is_archived?: boolean
  created_at: string
  read_at?: string | null
  data?: Record<string, unknown> | null
}

/**
 * Notifications service that handles user notifications
 */
class NotificationsService extends BaseService {
  protected basePath = '/notifications'

  /**
   * Get paginated notifications for current user
   */
  async getNotifications(params?: NotificationFilters): Promise<Pagination<NotificationResponse>> {
    const response = await this.getPaginated<NotificationResponse>('/', params)
    response.results = (response.results ?? []).map((notification) => ({
      ...notification,
      id: String(notification.id),
    }))
    return response
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string | number): Promise<{ message: string; notification: NotificationResponse }> {
    const response = await this.patch<{ message: string; notification: NotificationResponse }>(`/${id}/read/`)
    return {
      ...response,
      notification: {
        ...response.notification,
        id: String(response.notification.id),
      },
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string; updated_count: number }> {
    return this.post<{ message: string; updated_count: number }>('/read-all/')
  }
}

export const notificationsService = new NotificationsService()