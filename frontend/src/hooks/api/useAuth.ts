import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService, type LoginCredentials, type SignupData } from '@/lib/services'
import { authStore } from '@/lib/auth'
import { postAuth } from '@/lib/postAuth'
import { useToast } from '@/components/ui/toast'

interface ApiError {
  response?: {
    data?: {
      error?: string
      detail?: string
      email?: string | string[]
      password?: string | string[]
      non_field_errors?: string[]
    }
  }
}

/**
 * Custom hook for authentication operations
 * Provides login, signup, logout with proper error handling and state management
 */
export function useAuth() {
  const navigate = useNavigate()
  const { notify } = useToast()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('useAuth login onSuccess called with data:', JSON.stringify(data, null, 2))
      try {
        console.log('useAuth login: calling postAuth with tokens')
        postAuth({
          access: data.access,
          refresh: data.refresh,
          user: data.user,
          navigate,
          notify,
          welcomeTitle: 'Welcome back',
          welcomeDescription: data.user.first_name ? `Welcome back, ${data.user.first_name}!` : undefined
        })
        console.log('useAuth login: postAuth completed successfully')
        // Invalidate all queries to refresh user-specific data
        queryClient.invalidateQueries()
      } catch (error) {
        console.error('useAuth login: Error in onSuccess callback:', error)
        notify({ 
          title: 'Login Error', 
          description: 'Authentication succeeded but failed to complete login process.', 
          variant: 'error' 
        })
      }
    },
    onError: (error: unknown) => {
      const errorData = (error as ApiError)?.response?.data
      let message = 'Login failed. Please check your credentials.'
      let isVerificationError = false
      
      if (errorData?.error) {
        message = errorData.error
        // Check if this is an email verification error
        if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('unverified')) {
          isVerificationError = true
        }
      } else if (errorData?.detail) {
        message = errorData.detail
        if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('unverified')) {
          isVerificationError = true
        }
      } else if (errorData?.non_field_errors?.[0]) {
        message = errorData.non_field_errors[0]
        if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('unverified')) {
          isVerificationError = true
        }
      }
      
      if (isVerificationError) {
        navigate('/login?unverified=true')
        notify({ 
          title: 'Email Not Verified', 
          description: 'Please verify your email address before signing in.', 
          variant: 'error' 
        })
      } else {
        notify({ 
          title: 'Login Failed', 
          description: message, 
          variant: 'error' 
        })
      }
    }
  })

  const signupMutation = useMutation({
    mutationFn: async (userData: SignupData) => {
      // Just signup, don't auto-login - user needs to verify email first
      return authService.signup(userData)
    },
    onSuccess: () => {
      notify({
        title: 'Account Created',
        description: 'Please check your email to verify your account before signing in.',
        variant: 'success'
      })
      navigate('/login?unverified=true')
    },
    onError: (error: unknown) => {
      const errorData = (error as ApiError)?.response?.data
      let message = 'Signup failed. Please try again.'
      
      if (errorData) {
        if (errorData.email) {
          message = Array.isArray(errorData.email) ? (errorData.email[0] || 'This email is already registered.') : 'This email is already registered.'
        } else if (errorData.password) {
          message = Array.isArray(errorData.password) ? (errorData.password[0] || 'Password requirements not met.') : 'Password requirements not met.'
        } else if (errorData.non_field_errors) {
          message = errorData.non_field_errors[0] || 'Signup failed'
        } else if (errorData.detail) {
          message = errorData.detail
        }
      }
      
      notify({ 
        title: 'Signup Failed', 
        description: message, 
        variant: 'error' 
      })
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authService.logout()
      } catch {
        // Log logout failure for diagnostics, but continue to clear local state
        console.warn('Logout request failed in useAuth.logout()')
      }
    },
    onSuccess: () => {
      authStore.clear()
      queryClient.clear() // Clear all cached data
      navigate('/', { replace: true })
      notify({ 
        title: 'Logged out', 
        description: 'You have been successfully logged out.',
        variant: 'success' 
      })
    }
  })

  const passwordResetMutation = useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onSuccess: () => {
      notify({
        title: 'Password reset sent',
        description: 'Check your email for password reset instructions.',
        variant: 'success'
      })
    },
    onError: () => {
      notify({
        title: 'Password reset failed',
        description: 'Unable to send password reset email. Please try again.',
        variant: 'error'
      })
    }
  })

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    requestPasswordReset: passwordResetMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isPasswordResetLoading: passwordResetMutation.isPending,
  }
}