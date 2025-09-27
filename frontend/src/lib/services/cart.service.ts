import { BaseService } from './base'
import type { CartItem, CartSummary } from '@/types/api'

export interface AddToCartData {
  cause_id: string
  amount: number
}

/**
 * Cart service that handles shopping cart functionality for donations
 */
class CartService extends BaseService {
  protected basePath = '/cart'

  /**
   * Get current user's cart
   */
  async getCart(): Promise<CartSummary> {
    return this.get<CartSummary>('/')
  }

  /**
   * Add item to cart
   */
  async addItem(data: AddToCartData): Promise<CartItem> {
    return this.post<CartItem>('/add/', data)
  }

  /**
   * Update cart item amount
   */
  async updateItem(itemId: string, amount: number): Promise<CartItem> {
    return this.patch<CartItem>(`/items/${itemId}/`, { amount })
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<void> {
    return this.delete<void>(`/items/${itemId}/`)
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    return this.delete<void>('/clear/')
  }

  /**
   * Get cart item count (for navigation badge)
   */
  async getItemCount(): Promise<{ count: number }> {
    return this.get<{ count: number }>('/count/')
  }
}

export const cartService = new CartService()