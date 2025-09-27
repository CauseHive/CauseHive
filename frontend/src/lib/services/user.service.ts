import { BaseService } from './base'
import type { User, Profile } from '@/types/api'

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  bio?: string
  phone_number?: string
  address?: string
  profile_picture?: File
}

export interface UserProfileResponse {
  user: User
  profile: Profile
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
  confirm_password: string
}

/**
 * User service that handles user profile and account management
 */
class UserService extends BaseService {
  protected basePath = '/user'

  /**
   * Get current user's profile information
   */
  async getProfile(): Promise<UserProfileResponse> {
    return this.get<UserProfileResponse>('/profile/')
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfileResponse> {
    const formData = this.createFormData(data)
    return this.patch<UserProfileResponse>('/profile/', formData)
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    return this.post<void>('/change-password/', data)
  }

  /**
   * Deactivate user account
   */
  async deactivateAccount(): Promise<void> {
    return this.post<void>('/deactivate/')
  }

  /**
   * Delete user account permanently
   */
  async deleteAccount(password: string): Promise<void> {
    return this.post<void>('/delete-account/', { password })
  }

  /**
   * Get user's account settings/preferences
   */
  async getSettings(): Promise<{
    email_notifications: boolean
    marketing_emails: boolean
    two_factor_enabled: boolean
    privacy_settings: {
      profile_visibility: 'public' | 'private'
      show_donation_history: boolean
    }
  }> {
    return this.get<any>('/settings/')
  }

  /**
   * Update user account settings
   */
  async updateSettings(settings: any): Promise<void> {
    return this.patch<void>('/settings/', settings)
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<{ profile_picture: string }> {
    const formData = new FormData()
    formData.append('profile_picture', file)
    return this.post<any>('/profile-picture/', formData)
  }

  /**
   * Remove profile picture
   */
  async removeProfilePicture(): Promise<void> {
    return this.delete<void>('/profile-picture/')
  }

  /**
   * Helper method to create FormData for file uploads
   */
  private createFormData(data: UpdateProfileData): FormData {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (key === 'profile_picture' && value instanceof File) {
        formData.append(key, value)
      } else if (typeof value === 'string') {
        formData.append(key, value)
      }
    })

    return formData
  }
}

export const userService = new UserService()