import { BaseService, type QueryParams } from './base'
import type { Pagination, Notification } from '@/types/api'

export interface NotificationFilters extends QueryParams {
  unread_only?: boolean
  type?: string
  date_from?: string
  date_to?: string
}

/**
 * Notifications service that handles user notifications
 */
class NotificationsService extends BaseService {
  protected basePath = '/notifications'

  /**
   * Get paginated notifications for current user
   */
  async getNotifications(params?: NotificationFilters): Promise<Pagination<Notification>> {
    return this.getPaginated<Notification>('/', params)
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return this.get<{ count: number }>('/', { unread_only: true, page_size: 1 })
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    return this.patch<void>(`/${id}/`, { is_read: true })
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    return this.post<void>('/mark-all-read/')
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    return this.delete<void>(`/${id}/`)
  }

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    return this.delete<void>('/clear-all/')
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<{
    email_notifications: boolean
    push_notifications: boolean
    donation_updates: boolean
    cause_updates: boolean
    system_announcements: boolean
  }> {
    return this.get<any>('/preferences/')
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: any): Promise<void> {
    return this.patch<void>('/preferences/', preferences)
  }
}

export const notificationsService = new NotificationsService()