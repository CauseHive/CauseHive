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
      const { data } = await api.get('/causes/', { params: { status: 'live', ordering: '-created_at', page_size: 6 } })
      return Array.isArray(data?.results) ? data.results.slice(0, 6).map(mapCauseListItem) as CauseItem[] : []
    }
  })
  // Fetch more causes for category aggregation fallback
  const { data: causesForAgg } = useQuery<CauseItem[]>({
    queryKey: ['home-causes-agg'],
    queryFn: async () => {
      const { data } = await api.get('/causes/', { params: { status: 'live', ordering: '-created_at', page_size: 50 } })
      return Array.isArray(data?.results) ? data.results.map(mapCauseListItem) as CauseItem[] : []
    }
  })
  const { data: liveCausesCount } = useQuery<number>({
    queryKey: ['home-live-causes-count'],
    queryFn: async () => {
      const { data } = await api.get('/causes/', { params: { status: 'live', page_size: 1 } })
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
      } catch (err) {
        // Not authenticated or endpoint not public; hide this metric but log for visibility
        console.warn('Failed to fetch donations count (possibly unauthenticated):', err)
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
        const { data: adm } = await api.get('/admin/platform-metrics/')
        return { total_amount: Number(adm?.total_amount ?? 0), total_donations: Number(adm?.total_donations ?? 0) }
      } catch (err) {
        // Try original admin path (non-alias) in case alias missing
        console.warn('Platform totals fetch failed; attempting fallback', err)
        try {
          const { data: orig } = await api.get('/admin/platform-metrics/')
          if (typeof orig?.total_amount === 'number' && typeof orig?.total_donations === 'number') {
            return { total_amount: orig.total_amount, total_donations: orig.total_donations }
          }
        } catch (fallbackErr) {
          // Swallowing here is intentional, but surface a console warning for visibility
          console.warn('Fallback platform metrics fetch failed', fallbackErr)
        }
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
    <div className="space-y-16 py-16">
      
      {/* Hero Section */}
      <section className="py-20 px-8 lg:px-16">
        <div className="grid gap-8 md:grid-cols-2 items-center max-w-7xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Building Ghana's Future, <span className="text-emerald-600">One Donation at a Time</span>
            </h1>
            <p className="text-lg text-gray-600">
              Join Ghana's premier crowdfunding platform connecting generous hearts with transformative causes.
              From rural education initiatives to urban healthcare projects, support initiatives that strengthen
              our communities and build a prosperous Ghana for generations to come.
            </p>
            <div className="flex gap-3">
              <Link 
                to="/causes" 
                className="px-6 py-3 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
              >
                Explore Causes
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-6 py-3 rounded-md border border-gray-300 text-gray-400 hover:border-emerald-300 font-medium"
              >
                How it works
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-10" aria-hidden="true">
            <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-gray-100 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto space-y-16 px-8 lg:px-16">

        {/* Value props */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              icon: ShieldCheck,
              title: 'Secure & Trusted',
              desc: 'Bank-grade security with licensed payment processors. Your donations reach their intended causes.'
            }, {
              icon: HeartHandshake,
              title: 'Ghanaian Impact',
              desc: 'Support causes that address real challenges in our communities, from Accra to rural villages.'
            }, {
              icon: Zap,
              title: 'Mobile Money Ready',
              desc: 'Instant donations via MTN Mobile Money, Vodafone Cash, and AirtelTigo Money - no bank account needed.'
            }, {
              icon: CheckCircle2,
              title: 'Transparent Tracking',
              desc: 'Real-time updates, photos, and stories showing exactly how your contribution creates change.'
            }].map((p, i) => (
              <div key={i} className="rounded-lg border border-gray-300 p-4 flex items-start gap-3">
                <p.icon className="h-5 w-5 text-emerald-500 mt-1" />
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-100">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* Impact stats */}
 

          {/* Top categories */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100">Browse by Category</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
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
                <Link key={c.id} to={`/causes?category=${c.id}`} className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-green-50 hover:border-green-300 transition-colors whitespace-nowrap">
                  {c.name} <span className="text-xs text-gray-500">({Number(c.cause_count ?? 0)})</span>
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
                className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-green-50 hover:border-green-300 transition-colors whitespace-nowrap">
                {c.name} <span className="text-xs text-gray-500">({Number(c.cause_count ?? 0)})</span>
              </Link>
            ))
          })()}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-100">Featured causes</h2>
              <Link to="/causes" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">View all</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!featured && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
              <Skeleton className="h-44 w-full bg-gray-200" />
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <Skeleton className="h-6 w-3/4 bg-gray-200" />
              <Skeleton className="h-2 w-full bg-gray-200" />
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
              <div key={cause.id} className="rounded-lg border border-slate-700 overflow-hidden bg-slate-800/50 hover:bg-slate-800/70 transition-colors shadow-lg">
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
                  <Link to={`/causes/${cause.id}`} className="block font-medium line-clamp-2 text-gray-900 hover:text-green-600 transition-colors" aria-label={`Go to cause ${cause.title ?? ''}`}>{cause.title}</Link>
                  {target > 0 && (
                    <div className="space-y-1" aria-label={`Progress ${Math.round(progress)}%`}>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
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
    </div>
  )
}
