/**
 * Centralized API services export
 * All services should be imported from this file to maintain consistency
 */

export { BaseService, type CrudService, type QueryParams, type ApiResponse } from './base'
export { authService, type LoginCredentials, type SignupData, type LoginResponse } from './auth.service'
export { causesService, categoriesService, type CauseFilters, type CreateCauseData } from './causes.service'
export { donationsService, type DonationFilters, type CreateDonationData } from './donations.service'
export { userService, type UpdateProfileData, type UserProfileResponse } from './user.service'
export { cartService, type AddToCartData } from './cart.service'
export { paymentsService, type InitiatePaymentData, type PaymentTransaction } from './payments.service'
export { notificationsService, type NotificationFilters } from './notifications.service'

// Import all service instances
import { authService } from './auth.service'
import { causesService, categoriesService } from './causes.service'
import { donationsService } from './donations.service'
import { userService } from './user.service'
import { cartService } from './cart.service'
import { paymentsService } from './payments.service'
import { notificationsService } from './notifications.service'

// Export all services as a single object for easy access
export const apiServices = {
  auth: authService,
  causes: causesService,
  categories: categoriesService,
  donations: donationsService,
  user: userService,
  cart: cartService,
  payments: paymentsService,
  notifications: notificationsService,
}