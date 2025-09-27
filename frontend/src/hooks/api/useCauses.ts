import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { causesService, categoriesService, type CauseFilters, type CreateCauseData } from '@/lib/services'
import { mapCauseListItem, mapPagination, mapCategory } from '@/lib/mappers'
import { useToast } from '@/components/ui/toast'
import { useEffect } from 'react'

/**
 * Custom hook for causes data fetching and management
 */
export function useCauses(filters?: CauseFilters) {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['causes', filters],
    queryFn: async () => {
      const data = await causesService.getAll(filters)
      return mapPagination(data, mapCauseListItem)
    }
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load causes',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for fetching a single cause by ID
 */
export function useCause(id: string) {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['cause', id],
    queryFn: () => causesService.getById(id),
    enabled: !!id
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load cause details',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for fetching user's own causes
 */
export function useMyCauses(filters?: Omit<CauseFilters, 'organizer_id'>) {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['my-causes', filters],
    queryFn: async () => {
      const data = await causesService.getMyCauses(filters)
      return mapPagination(data, mapCauseListItem)
    }
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load your causes',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for fetching featured causes
 */
export function useFeaturedCauses(limit?: number) {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['featured-causes', limit],
    queryFn: async () => {
      const causes = await causesService.getFeatured(limit)
      return causes.map(mapCauseListItem)
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load featured causes',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}

/**
 * Hook for cause mutations (create, update, delete)
 */
export function useCauseMutations() {
  const queryClient = useQueryClient()
  const { notify } = useToast()

  const createMutation = useMutation({
    mutationFn: (data: CreateCauseData) => causesService.create(data),
    onSuccess: (newCause) => {
      queryClient.invalidateQueries({ queryKey: ['causes'] })
      queryClient.invalidateQueries({ queryKey: ['my-causes'] })
      notify({
        title: 'Cause created',
        description: 'Your cause has been submitted for review.',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create cause'
      notify({
        title: 'Creation failed',
        description: message,
        variant: 'error'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCauseData> }) => 
      causesService.update(id, data),
    onSuccess: (updatedCause) => {
      queryClient.invalidateQueries({ queryKey: ['causes'] })
      queryClient.invalidateQueries({ queryKey: ['cause', updatedCause.id] })
      queryClient.invalidateQueries({ queryKey: ['my-causes'] })
      notify({
        title: 'Cause updated',
        description: 'Your cause has been updated successfully.',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update cause'
      notify({
        title: 'Update failed',
        description: message,
        variant: 'error'
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => causesService.deleteCause(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['causes'] })
      queryClient.invalidateQueries({ queryKey: ['my-causes'] })
      notify({
        title: 'Cause deleted',
        description: 'Your cause has been deleted successfully.',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete cause'
      notify({
        title: 'Deletion failed',
        description: message,
        variant: 'error'
      })
    }
  })

  return {
    createCause: createMutation.mutate,
    updateCause: updateMutation.mutate,
    deleteCause: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

/**
 * Hook for fetching categories
 */
export function useCategories() {
  const { notify } = useToast()

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await categoriesService.getAll()
      return categories.map(mapCategory)
    },
    staleTime: 10 * 60 * 1000 // 10 minutes - categories don't change often
  })

  useEffect(() => {
    if (query.isError) {
      notify({
        title: 'Failed to load categories',
        variant: 'error'
      })
    }
  }, [query.isError, notify])

  return query
}