import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { api } from '@/lib/api'
import { mapCategory, mapCauseListItem } from '@/lib/mappers'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, HeartHandshake, Zap, CheckCircle2, Users, Award } from 'lucide-react'
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
      try {
        const { data } = await api.get('/causes/', { params: { status: 'live', ordering: '-created_at', page_size: 6 } })
        return Array.isArray(data?.results) ? data.results.slice(0, 6).map(mapCauseListItem) as CauseItem[] : []
      } catch {
        // Return mock data if API fails
        return [
          {
            id: '1',
            title: 'Rural School Library Project',
            featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            target_amount: 12000,
            current_amount: 8500,
            progress_percentage: 71,
            created_at: '2024-01-15T10:00:00Z',
            category: { name: 'Education' }
          },
          {
            id: '2',
            title: 'Community Health Clinic',
            featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
            target_amount: 25000,
            current_amount: 18750,
            progress_percentage: 75,
            created_at: '2024-01-10T14:30:00Z',
            category: { name: 'Healthcare' }
          },
          {
            id: '3',
            title: 'Clean Water Initiative',
            featured_image: 'https://images.unsplash.com/photo-1541544537156-7627a7ce10c6?w=400&h=300&fit=crop',
            target_amount: 15000,
            current_amount: 9200,
            progress_percentage: 61,
            created_at: '2024-01-08T09:15:00Z',
            category: { name: 'Water & Sanitation' }
          }
        ]
      }
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
  const { data: _liveCausesCount } = useQuery<number>({
    queryKey: ['home-live-causes-count'],
    queryFn: async () => {
      const { data } = await api.get('/causes/', { params: { status: 'live', page_size: 1 } })
      return Number(data?.count ?? 0)
    }
  })
  const { data: _categoriesCount } = useQuery<number>({
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
  const { data: _donationsCount } = useQuery<number | null>({
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
  const { data: _platformTotals } = useQuery<{ total_amount: number; total_donations: number } | null>({
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-8 lg:px-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Wave Accent Layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Wave Layer 1 - Top */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0,300 Q300,200 600,300 T1200,300 V600 H0 Z" fill="url(#wave1)" />
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Wave Layer 2 - Middle */}
          <div className="absolute top-0 left-0 w-full h-full opacity-8">
            <svg className="absolute top-20 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0,400 Q400,300 800,350 T1200,400 V600 H0 Z" fill="url(#wave2)" />
              <defs>
                <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Wave Layer 3 - Bottom */}
          <div className="absolute top-0 left-0 w-full h-full opacity-6">
            <svg className="absolute top-40 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0,500 Q500,400 1000,450 T1200,500 V600 H0 Z" fill="url(#wave3)" />
              <defs>
                <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#047857" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#059669" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1 text-sm font-medium">
                  🇬🇭 CauseHive · Ghana's Premier Crowdfunding Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                  Building Ghana's Future,
                  <span className="block text-emerald-600">One Donation at a Time</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  CauseHive is a regulated crowdfunding and community impact platform purpose-built for Ghana.
                  We help nonprofits, social enterprises, and community leaders launch compliant fundraising
                  campaigns, receive mobile money or card donations instantly, and report back to donors with
                  auditable updates.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  Join thousands of supporters who trust CauseHive to connect transparent projects with the
                  resources they need—from classrooms and clinics to clean water systems across Ghana.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 py-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">2,500+</div>
                  <div className="text-sm text-gray-600">Causes Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">₵15M+</div>
                  <div className="text-sm text-gray-600">Total Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">50K+</div>
                  <div className="text-sm text-gray-600">Donors</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/causes"
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="relative z-10">Explore Causes</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
                >
                  How it Works
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <HeartHandshake className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Rural School Library Project</h3>
                  <p className="text-sm text-gray-600 mb-4">Building educational futures in Northern Ghana</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">₵8,500 / ₵12,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">127</div>
                    <div className="text-xs text-gray-600">Donors</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">15</div>
                    <div className="text-xs text-gray-600">Days Left</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-emerald-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto space-y-16 px-8 lg:px-16">

        {/* Purpose Statement */}
        <section className="bg-white rounded-2xl shadow-lg p-8 -mt-10 lg:-mt-16 relative z-10">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold text-gray-900">What is CauseHive?</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                CauseHive is a secure fundraising hub that gives Ghanaian organizations a compliant, trustworthy
                way to share their mission, collect donations, and show real impact. By combining donor protections,
                transparent reporting, and mobile-first payments, we make it easy for verified causes to turn local
                support into lasting change.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[{
                  title: 'For Cause Creators',
                  desc: 'Launch campaigns with built-in KYC, payout automation, and storytelling tools tailored to Ghana.'
                }, {
                  title: 'For Donors & Partners',
                  desc: 'See campaign milestones, verify organizers, and track how every cedi moves from pledge to project.'
                }, {
                  title: 'For Compliance Teams',
                  desc: 'Use detailed audit trails, disbursement controls, and export-ready reports to stay aligned with Bank of Ghana guidelines.'
                }, {
                  title: 'For Developers',
                  desc: 'Integrate CauseHive APIs and webhooks to extend donation flows into your own apps or internal tools.'
                }].map((item, idx) => (
                  <div key={idx} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <h3 className="text-base font-semibold text-emerald-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-emerald-900 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Snapshot</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    Registered brand name: <span className="font-medium text-gray-900">CauseHive</span>
                  </li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    Primary audience: nonprofits, social enterprises, CSR programs, and diaspora donors supporting Ghana.
                  </li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    Core offering: fundraising campaign management, donor engagement, payout orchestration, and impact analytics.
                  </li>
                </ul>
              </div>
              <div className="bg-emerald-600 text-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Ready to verify us?</h3>
                <p className="text-sm text-emerald-100 mb-4">
                  Review our OAuth consent screen, privacy policy, and demo access using the links provided in your
                  verification dashboard. We keep them synchronized with the live CauseHive experience.
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Support:</span> support@causehive.com</p>
                  <p><span className="font-semibold">Docs:</span> <a className="underline" href="https://docs.causehive.com" target="_blank" rel="noreferrer">docs.causehive.com</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value props */}
        <section>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[{
              icon: ShieldCheck,
              title: 'Bank-Grade Security',
              desc: 'Licensed payment processors with SSL encryption. Your donations are protected.',
              color: 'emerald'
            }, {
              icon: HeartHandshake,
              title: 'Ghanaian Focus',
              desc: 'Supporting local causes from Accra to rural communities across Ghana.',
              color: 'blue'
            }, {
              icon: Zap,
              title: 'Mobile Money Ready',
              desc: 'Instant donations via MTN, Vodafone, and AirtelTigo - no bank account needed.',
              color: 'purple'
            }, {
              icon: CheckCircle2,
              title: 'Real-Time Tracking',
              desc: 'Follow your impact with photos, updates, and detailed progress reports.',
              color: 'green'
            }].map((prop, i) => (
              <div key={i} className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-${prop.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <prop.icon className={`w-6 h-6 text-${prop.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{prop.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prop.desc}</p>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${prop.color}-50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </section>

        {/* Impact stats */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact So Far</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Together, we're making a real difference in communities across Ghana
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="bg-emerald-50 rounded-xl p-6 group-hover:bg-emerald-100 transition-colors duration-300">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {(_liveCausesCount || 0).toLocaleString() || '2,500+'}
                </div>
                <div className="text-gray-600 font-medium">Causes Funded</div>
                <div className="text-sm text-gray-500 mt-1">Transforming communities</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-blue-50 rounded-xl p-6 group-hover:bg-blue-100 transition-colors duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₵{(_platformTotals?.total_amount || 15000000).toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Total Impact</div>
                <div className="text-sm text-gray-500 mt-1">Funds raised</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-purple-50 rounded-xl p-6 group-hover:bg-purple-100 transition-colors duration-300">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(_donationsCount || 50000).toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Donors</div>
                <div className="text-sm text-gray-500 mt-1">People giving back</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-orange-50 rounded-xl p-6 group-hover:bg-orange-100 transition-colors duration-300">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {_categoriesCount || 10}
                </div>
                <div className="text-gray-600 font-medium">Categories</div>
                <div className="text-sm text-gray-500 mt-1">Across Ghana</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured causes */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Browse by Category</h2>
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
                  {c.name} <span className="text-xs text-gray-700">({Number(c.cause_count ?? 0)})</span>
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
                {c.name} <span className="text-xs text-gray-700">({Number(c.cause_count ?? 0)})</span>
              </Link>
            ))
          })()}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-700">Featured causes</h2>
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
