import { BaseService } from './base'

export interface UpdateProfileData {
  full_name?: string
  bio?: string
  phone_number?: string
  address?: string
  profile_picture?: File
  withdrawal_address?: {
    payment_method: string
    phone_number?: string
    provider?: string
  }
  withdrawal_wallet?: string
}

export interface UserProfileResponse {
  id: string
  full_name: string
  bio: string
  profile_picture: string
  phone_number: string
  address: string
  withdrawal_address: {
    payment_method: string
    phone_number?: string
    provider?: string
  }
  withdrawal_wallet: string
  updated_at: string
  user: string
}

export interface UserDetailsResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  date_joined: string
  last_login: string
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
   * Get user details
   */
  async getDetails(): Promise<UserDetailsResponse> {
    return this.get<UserDetailsResponse>('/details/')
  }

  /**
   * Delete user account permanently
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    return this.post<{ message: string }>('/delete/', { password })
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
      } else if (key === 'withdrawal_address' && typeof value === 'object') {
        formData.append(key, JSON.stringify(value))
      } else if (typeof value === 'string') {
        formData.append(key, value)
      }
    })

    return formData
  }
}

export const userService = new UserService()