import { useParams } from 'react-router-dom'
import { useCause } from '@/hooks/api'
import { Skeleton } from '@/components/ui/skeleton'

export function CauseDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useCause(id!)

  if (isLoading) return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <div className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
    </div>
  )

  if (isError || !data) return <div className="text-red-600">Could not load cause.</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {data.featured_image && (
          <img
            src={data.featured_image}
            alt={data.title ? `Image for ${data.title}` : 'Cause image'}
            className="w-full rounded-lg"
          />
        )}
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{data.description}</p>
        
        {/* Display updates if available */}
        {data.updates && data.updates.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Updates</h2>
            {data.updates.map((update) => (
              <div key={update.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{update.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{update.description}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(update.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border p-4 bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Progress</div>
          <div className="text-lg font-medium">₵{data.current_amount?.toLocaleString() || 0} / ₵{data.target_amount?.toLocaleString() || 0}</div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2" aria-label={`Progress ${Math.round(data.progress_percentage || 0)}%`}>
            <div className="h-full bg-emerald-500" style={{ width: `${data.progress_percentage || 0}%` }} />
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {data.progress_percentage?.toFixed(1) || 0}% funded
          </div>
        </div>
        
        <div className="rounded-lg border p-4 bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Category</div>
          <div className="font-medium">{data.category?.name}</div>
          {data.category?.description && (
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {data.category.description}
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4 bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Organizer</div>
          <div className="font-medium">{data.creator?.full_name || data.organizer_id || 'Anonymous'}</div>
          {data.creator?.profile_picture && (
            <img 
              src={data.creator.profile_picture} 
              alt={data.creator.full_name || 'Organizer'} 
              className="w-12 h-12 rounded-full mt-2"
            />
          )}
        </div>

        <div className="rounded-lg border p-4 bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Status</div>
          <div className="font-medium capitalize">{data.status}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Created {data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown'}
          </div>
          {data.deadline && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Deadline: {new Date(data.deadline).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Donation/Cart functionality will be added later */}
        <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Donation and cart functionality coming soon...
          </p>
        </div>
      </aside>
    </div>
  )
}
