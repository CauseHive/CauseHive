/**
 * API Client - Enhanced with Enterprise Security
 * This file now re-exports the secure API client for backward compatibility
 */

// Re-export the secure API client as the default
export { api, secureApi } from './security/apiClient'

// Re-export auth utilities for backward compatibility
export { authStore } from './auth'
