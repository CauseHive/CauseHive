import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Pagination, Notification } from '@/types/api'
import { useSearchParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination as UIPagination } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { useEffect } from 'react'
import { Empty } from '@/components/ui/empty'

export function NotificationsPage() {
  const { notify } = useToast()
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const unreadOnly = params.get('unread_only') === 'true'
  const type = params.get('type') || ''

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications', { page, unreadOnly, type }],
    queryFn: async () => {
      const { data } = await api.get<Pagination<Notification>>('/notifications/', {
        params: {
          page,
          unread_only: unreadOnly || undefined,
          type: type || undefined,
          ordering: '-created_at'
        }
      })
      return data
    }
  })

  useEffect(() => { if (isError) notify({ title: 'Failed to load notifications', variant: 'error' }) }, [isError, notify])

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    }
  })

  const markAll = useMutation({
    mutationFn: async () => {
      await api.post('/notifications/mark-all-read/')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      notify({ title: 'All notifications marked as read', variant: 'success' })
    },
    onError: () => notify({ title: 'Failed to mark all as read', variant: 'error' })
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e)=>{const p=new URLSearchParams(params); if(e.target.checked) p.set('unread_only','true'); else p.delete('unread_only'); p.set('page','1'); setParams(p)}}
            />
            Unread only
          </label>
          <Button variant="outline" onClick={()=> markAll.mutate()} disabled={markAll.isPending}>Mark all read</Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64 mt-2" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {data && data.results.length === 0 && !isLoading && (
          <Empty title="No notifications" description="You're all caught up." />
        )}
        {data?.results.map(n => (
          <div key={n.id} className="rounded-lg border p-4 bg-white dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{n.title}</h3>
                  {!n.is_read && <Badge variant="warning">new</Badge>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                <div className="text-xs text-slate-500 mt-2">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                {!n.is_read && <Button size="sm" onClick={()=> markRead.mutate(n.id)} disabled={markRead.isPending}>Mark read</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data && (
        <UIPagination
          page={page}
          hasPrev={!!data.previous}
          hasNext={!!data.next}
          onPrev={()=>{const p=new URLSearchParams(params); p.set('page', String(Math.max(1, page-1))); setParams(p)}}
          onNext={()=>{const p=new URLSearchParams(params); p.set('page', String(page+1)); setParams(p)}}
        />
      )}
    </div>
  )
}

export default NotificationsPage
