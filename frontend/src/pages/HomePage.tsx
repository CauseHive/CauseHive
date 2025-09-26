import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { api } from '@/lib/api'
import { mapCategory, mapCauseListItem } from '@/lib/mappers'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, HeartHandshake, Zap, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function HomePage() {
  const NEW_DAYS = Number(import.meta.env.VITE_NEW_DAYS ?? 14)
  const ENDING_SOON_DAYS = Number(import.meta.env.VITE_ENDING_SOON_DAYS ?? 7)
  type CategoryItem = { id: number | string, name: string; cause_count?: number | null }
  type CategoryWithCount = CategoryItem & { cause_count?: number | null }
  type CauseItem = {
    id: number | string
    title?: string
    featured_image?: string
    target_amount?: number | string
    current_amount?: number | string
    progress_percentage?: number
    created_at?: string
    deadline?: string
    category?: { id?: number | string, name?: string }
  }
  const { data: categories } = useQuery<CategoryItem[]>({
    queryKey: ['home-categories'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/categories/', { params: { page_size: 6 } })
        return Array.isArray(data?.results) ? data.results.slice(0, 6).map(mapCategory) as CategoryItem[] : []
      } catch (err) {
        const axiosErr = err as AxiosError
        if (axiosErr.response?.status === 404) {
          return []
        }
        throw err
      }
    }
  })
  const { data: featured } = useQuery<CauseItem[]>({
    queryKey: ['home-featured-causes'],
    queryFn: async () => {
      const { data } = await api.get('/causes/list/', { params: { status: 'live', ordering: '-created_at', page_size: 6 } })
      return Array.isArray(data?.results) ? data.results.slice(0, 6).map(mapCauseListItem) as CauseItem[] : []
    }
  })
  // Fetch more causes for category aggregation fallback
  const { data: causesForAgg } = useQuery<CauseItem[]>({
    queryKey: ['home-causes-agg'],
    queryFn: async () => {
      const { data } = await api.get('/causes/list/', { params: { status: 'live', ordering: '-created_at', page_size: 50 } })
      return Array.isArray(data?.results) ? data.results.map(mapCauseListItem) as CauseItem[] : []
    }
  })
  const { data: liveCausesCount } = useQuery<number>({
    queryKey: ['home-live-causes-count'],
    queryFn: async () => {
      const { data } = await api.get('/causes/list/', { params: { status: 'live', page_size: 1 } })
      return Number(data?.count ?? 0)
    }
  })
  const { data: categoriesCount } = useQuery<number>({
    queryKey: ['home-categories-count'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/categories/', { params: { page_size: 1 } })
        return Number(data?.count ?? 0)
      } catch (err) {
        const axiosErr = err as AxiosError
        if (axiosErr.response?.status === 404) {
          return 0
        }
        throw err
      }
    }
  })
  const { data: donationsCount } = useQuery<number | null>({
    queryKey: ['home-donations-count'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/donations/', { params: { page_size: 1 } })
        return Number(data?.count ?? 0)
      } catch {
        // Not authenticated or endpoint not public; hide this metric
        return null
      }
    }
  })
  // Attempt to fetch platform-wide totals; hide if not exposed or restricted
  const { data: platformTotals } = useQuery<{ total_amount: number; total_donations: number } | null>({
    queryKey: ['home-platform-totals'],
    queryFn: async () => {
      try {
        // Prefer alias /api/admin/platform-metrics/ first (public-safe)
        const { data } = await api.get('/admin/platform-metrics/')
        if (typeof data?.total_amount === 'number' && typeof data?.total_donations === 'number') {
          return { total_amount: data.total_amount, total_donations: data.total_donations }
        }
        // Fallback (protected): admin donation statistics
        const { data: adm } = await api.get('/donations/admin/donations/statistics/')
        return { total_amount: Number(adm?.total_amount ?? 0), total_donations: Number(adm?.total_donations ?? 0) }
      } catch {
        // Try original admin path (non-alias) in case alias missing
        try {
          const { data: orig } = await api.get('/admin/platform-metrics/')
          if (typeof orig?.total_amount === 'number' && typeof orig?.total_donations === 'number') {
            return { total_amount: orig.total_amount, total_donations: orig.total_donations }
          }
        } catch { /* swallow */ }
        return null
      }
    }
  })

  const fallbackCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories
    if (!causesForAgg) return []
    const counts: Record<string, CategoryWithCount> = {}
    causesForAgg.forEach((cause) => {
      const key = String(cause.category?.id ?? cause.category?.name ?? '')
      if (!key) return
      const existing = counts[key]
      if (existing) {
        existing.cause_count = Number(existing.cause_count ?? 0) + 1
      } else {
        counts[key] = {
          id: cause.category?.id ?? key,
          name: cause.category?.name ?? key,
          cause_count: 1
        }
      }
    })
    return Object.values(counts)
  }, [categories, causesForAgg])
  return (
    <div className="space-y-12">
      <section className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Empower Causes. Amplify Impact.</h1>
          <p className="text-slate-600 dark:text-slate-300">Discover vetted causes across Ghana and donate with confidence using secure mobile money and card payments.</p>
          <div className="flex gap-3">
            <Link to="/causes" className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Explore Causes</Link>
            <Link to="/how-it-works" className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700">How it works</Link>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-slate-200 dark:border-slate-800 p-10" aria-hidden="true" />
      </section>

      {/* Value props */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{
          icon: ShieldCheck,
          title: 'Secure payments',
          desc: 'Pay with trusted mobile money and cards.'
        }, {
          icon: HeartHandshake,
          title: 'Vetted causes',
          desc: 'Transparent campaigns and real impact.'
        }, {
          icon: Zap,
          title: 'Fast & reliable',
          desc: 'Snappy experience with real-time updates.'
        }, {
          icon: CheckCircle2,
          title: 'Simple & clear',
          desc: 'No clutter—just donate and track easily.'
        }].map((p, i) => (
          <div key={i} className="rounded-lg border p-4 flex items-start gap-3">
            <p.icon className="h-5 w-5 text-emerald-600 mt-1" />
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{p.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Impact stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformTotals === undefined ? (
          <div className="rounded-lg border p-4"><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-24 mt-2" /></div>
        ) : platformTotals ? (
          <div className="rounded-lg border p-4">
            <div className="text-3xl font-semibold">₵{platformTotals.total_amount.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Total raised</div>
          </div>
        ) : null}
        {liveCausesCount === undefined ? (
          <div className="rounded-lg border p-4"><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-24 mt-2" /></div>
        ) : (
          <div className="rounded-lg border p-4">
            <div className="text-3xl font-semibold">{liveCausesCount.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Live causes</div>
          </div>
        )}
        {categoriesCount === undefined ? (
          <div className="rounded-lg border p-4"><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-24 mt-2" /></div>
        ) : (
          <div className="rounded-lg border p-4">
            <div className="text-3xl font-semibold">{categoriesCount.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Categories</div>
          </div>
        )}
        {donationsCount === undefined ? (
          <div className="rounded-lg border p-4"><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-24 mt-2" /></div>
        ) : donationsCount !== null ? (
          <div className="rounded-lg border p-4">
            <div className="text-3xl font-semibold">{donationsCount.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Your donations</div>
          </div>
        ) : null}
      </section>

      {/* Top categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Top categories</h2>
        <div className="flex gap-3 overflow-x-auto">
          {/* skeletons */}
          {!categories && !causesForAgg && Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-32" />
          ))}
          {/* Use cause_count when available */}
          {(() => {
            const cats: CategoryWithCount[] = (categories ?? []) as CategoryWithCount[]
            const hasCounts = cats.some((c) => typeof c.cause_count === 'number')
            if (!hasCounts) return null
            return cats
              .slice()
              .sort((a, b) => (Number(b.cause_count ?? 0) - Number(a.cause_count ?? 0)))
              .slice(0, 8)
              .map((c) => (
                <Link key={c.id} to={`/causes?category=${c.id}`} className="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 whitespace-nowrap">
                  {c.name} <span className="text-xs text-slate-500">({Number(c.cause_count ?? 0)})</span>
                </Link>
              ))
          })()}
          {/* Fallback: aggregate from causes list */}
          {(() => {
            const cats = fallbackCategories
            const top = cats.slice().sort((a, b) => Number(b.cause_count ?? 0) - Number(a.cause_count ?? 0)).slice(0, 8)
            if (top.length === 0) return null
            return top.map((c, i) => (
              <Link key={i} to={c.id ? `/causes?category=${c.id}` : `/causes?search=${encodeURIComponent(c.name)}`}
                className="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 whitespace-nowrap">
                {c.name} <span className="text-xs text-slate-500">({Number(c.cause_count ?? 0)})</span>
              </Link>
            ))
          })()}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Browse by Category</h2>
        <div className="flex gap-3 overflow-x-auto">
          {!categories && Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28" />
          ))}
          {(categories && categories.length > 0 ? categories : fallbackCategories).map((c) => (
            <Link key={c.id} to={`/causes?category=${c.id}`} className="px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900 whitespace-nowrap">{c.name}</Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured causes</h2>
          <Link to="/causes" className="text-sm text-emerald-700">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!featured && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
          {featured?.map((cause) => {
            const now = new Date()
            const created = cause.created_at ? new Date(cause.created_at) : undefined
            const deadline = cause.deadline ? new Date(cause.deadline) : undefined
            const isNew = created ? ((now.getTime() - created.getTime()) / (1000*60*60*24)) <= NEW_DAYS : false
            const daysLeft = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000*60*60*24)) : undefined
            const endingSoon = typeof daysLeft === 'number' && daysLeft >= 0 && daysLeft <= ENDING_SOON_DAYS
            const target = Number(cause.target_amount ?? 0) || 0
            const current = Number(cause.current_amount ?? 0) || 0
            const progress = typeof cause.progress_percentage === 'number'
              ? Math.max(0, Math.min(100, cause.progress_percentage))
              : (target > 0 ? Math.max(0, Math.min(100, (current/target)*100)) : 0)
            return (
              <div key={cause.id} className="rounded-lg border overflow-hidden bg-white dark:bg-slate-900">
                <Link to={`/causes/${cause.id}`} aria-label={`View cause: ${cause.title ?? 'Cause'}`}>
                  {cause.featured_image && (
                    <img
                      src={cause.featured_image}
                      alt={cause.title ? `Image for ${cause.title}` : 'Cause image'}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  )}
                </Link>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Category chip with optional color style if exposed */}
                    <div className="text-xs">
                      <span
                        className="inline-flex items-center rounded-full border px-2 py-0.5"
                        style={(() => {
                          // If backend exposes color (hex), apply as subtle background with accessible text
                          const color = (cause.category as unknown as { color?: string } | undefined)?.color
                          if (typeof color === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(color)) {
                            return { backgroundColor: color + '20', borderColor: color, color: color }
                          }
                          return {}
                        })()}
                        aria-label={`Category: ${cause.category?.name ?? ''}`}
                      >
                        {cause.category?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isNew && <span title="Created within the last 14 days"><Badge variant="success">new</Badge></span>}
                      {endingSoon && <span title="Deadline within 7 days"><Badge variant="warning">ending soon{typeof daysLeft==='number' ? ` (${daysLeft}d)` : ''}</Badge></span>}
                    </div>
                  </div>
                  <Link to={`/causes/${cause.id}`} className="block font-medium line-clamp-2" aria-label={`Go to cause ${cause.title ?? ''}`}>{cause.title}</Link>
                  {target > 0 && (
                    <div className="space-y-1" aria-label={`Progress ${Math.round(progress)}%`}>
                      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>₵{current.toLocaleString()} raised</span>
                        <span>₵{target.toLocaleString()} target</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
