import { BaseService } from './base'

export interface AddToCartData {
  cause_id: string
  amount: number
}

export interface CartItemResponse {
  id: string
  cause: {
    id: string
    title: string
    featured_image: string
  }
  amount: number
  created_at: string
}

export interface CartSummaryResponse {
  items: CartItemResponse[]
  total_amount: number
  item_count: number
}

/**
 * Cart service that handles shopping cart functionality for donations
 */
class CartService extends BaseService {
  protected basePath = '/cart'

  /**
   * Add item to cart
   */
  async addItem(data: AddToCartData): Promise<{ message: string; cart_item: CartItemResponse }> {
    return this.post<{ message: string; cart_item: CartItemResponse }>('/add/', data)
  }

  /**
   * Get current user's cart
   */
  async getCart(): Promise<CartSummaryResponse> {
    return this.get<CartSummaryResponse>('/')
  }

  /**
   * Update cart item amount
   */
  async updateItem(itemId: string, amount: number): Promise<{ message: string; cart_item: CartItemResponse }> {
    return this.patch<{ message: string; cart_item: CartItemResponse }>(`/${itemId}/`, { amount })
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/${itemId}/`)
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<{ message: string }> {
    return this.delete<{ message: string }>('/clear/')
  }
}

export const cartService = new CartService()