import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService, type LoginCredentials, type SignupData } from '@/lib/services'
import { authStore } from '@/lib/auth'
import { postAuth } from '@/lib/postAuth'
import { useToast } from '@/components/ui/toast'

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
      postAuth({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
        navigate,
        notify,
        welcomeTitle: 'Welcome back',
        welcomeDescription: data.user.first_name ? `Welcome back, ${data.user.first_name}!` : undefined
      })
      // Invalidate all queries to refresh user-specific data
      queryClient.invalidateQueries()
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Login failed. Please check your credentials.'
      notify({ 
        title: 'Login Failed', 
        description: message, 
        variant: 'error' 
      })
    }
  })

  const signupMutation = useMutation({
    mutationFn: async (userData: SignupData) => {
      await authService.signup(userData)
      // Auto-login after signup
      return authService.login({ 
        email: userData.email, 
        password: userData.password 
      })
    },
    onSuccess: (data) => {
      postAuth({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
        navigate,
        notify,
        welcomeTitle: 'Welcome to CauseHive',
        welcomeDescription: 'Your account has been created successfully!'
      })
      queryClient.invalidateQueries()
    },
    onError: (error: any) => {
      const errorData = error.response?.data
      let message = 'Signup failed. Please try again.'
      
      if (errorData) {
        if (errorData.email) {
          message = 'This email is already registered.'
        } else if (errorData.password) {
          message = 'Password requirements not met.'
        } else if (errorData.non_field_errors) {
          message = errorData.non_field_errors[0]
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
      const refresh = authStore.getRefreshToken()
      try {
        await authService.logout(refresh || undefined)
      } catch {
        // Ignore logout errors - clear local state anyway
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