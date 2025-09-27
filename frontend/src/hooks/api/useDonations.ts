import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { donationsService, type DonationFilters, type CreateDonationData } from '@/lib/services'
import { mapDonation, mapPagination } from '@/lib/mappers'
import { useToast } from '@/components/ui/toast'
import { useEffect } from 'react'

/**
 * Hook for fetching user's donation history
 */
export function useDonations(filters?: DonationFilters) {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['donations', filters],
    queryFn: async () => {
      const data = await donationsService.getMyDonations(filters)
      return mapPagination(data, mapDonation)
    }
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load donations',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for fetching a single donation by ID
 */
export function useDonation(id: string) {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationsService.getById(id),
    enabled: !!id
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load donation details',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for fetching user's donation statistics
 */
export function useDonationStats() {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['donation-stats'],
    queryFn: () => donationsService.getMyStats(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load donation statistics',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for donation mutations (create, cancel)
 */
export function useDonationMutations() {
  const queryClient = useQueryClient()
  const { notify } = useToast()

  const createMutation = useMutation({
    mutationFn: (data: CreateDonationData) => donationsService.create(data),
    onSuccess: (newDonation) => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] })
      queryClient.invalidateQueries({ queryKey: ['causes'] }) // Refresh cause amounts
      notify({
        title: 'Donation created',
        description: 'Your donation has been processed successfully.',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to process donation'
      notify({
        title: 'Donation failed',
        description: message,
        variant: 'error'
      })
    }
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => donationsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] })
      notify({
        title: 'Donation cancelled',
        description: 'Your donation has been cancelled successfully.',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to cancel donation'
      notify({
        title: 'Cancellation failed',
        description: message,
        variant: 'error'
      })
    }
  })

  const resendConfirmationMutation = useMutation({
    mutationFn: (id: string) => donationsService.resendConfirmation(id),
    onSuccess: () => {
      notify({
        title: 'Confirmation sent',
        description: 'Donation confirmation email has been resent.',
        variant: 'success'
      })
    },
    onError: () => {
      notify({
        title: 'Failed to resend',
        description: 'Unable to resend confirmation email.',
        variant: 'error'
      })
    }
  })

  return {
    createDonation: createMutation.mutate,
    cancelDonation: cancelMutation.mutate,
    resendConfirmation: resendConfirmationMutation.mutate,
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isResending: resendConfirmationMutation.isPending,
  }
}