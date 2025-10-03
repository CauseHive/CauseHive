import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { ShoppingCart, Award, Activity } from 'lucide-react'

type Donation = {
  amount?: string | number
  cause?: { id?: string }
}

type Cause = {
  id: string
  title: string
  goal_amount?: string | number
}

export default function DashboardPage() {
  const { data: donations, isLoading: donationsLoading, error: donationsError } = useQuery({
    queryKey: ['dashboard-donations'],
    queryFn: async () => {
      const { data } = await api.get('/donations/', { params: { page_size: 5 } })
      return data
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const { data: causes, isLoading: causesLoading } = useQuery({
    queryKey: ['dashboard-causes'],
    queryFn: async () => {
      const { data } = await api.get('/causes/', { params: { page_size: 10 } })
      return data
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
                <p className="text-lg text-gray-600">Here's your impact dashboard and latest activity.</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Activity className="w-4 h-4" />
                    <span>Active this month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Award className="w-4 h-4" />
                    <span>Top donor</span>
                  </div>
                </div>
              </div>
              <Link
                to="/app/cart"
                className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>View Cart</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </div>
          </div>
        </div>
      
      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="text-sm text-gray-600">Recent donations</div>
          <div className="mt-2 text-3xl font-semibold">
            {donationsLoading ? '…' : (donations?.count ?? 0)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total impact</div>
          <div className="mt-2 text-3xl font-semibold text-green-600">
            ₵{donations?.results?.reduce((sum: number, d: Donation) => sum + Number(d.amount || 0), 0)?.toLocaleString() ?? '0'}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-600">Causes supported</div>
          <div className="mt-2 text-3xl font-semibold">
            {new Set(donations?.results?.map((d: Donation) => d.cause?.id)).size ?? 0}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-600">Available causes</div>
          <div className="mt-2 text-3xl font-semibold">
            {causes?.count ?? 0}
          </div>
        </div>
      </div>

      {donationsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-red-800">
            Unable to load donations. Please refresh the page.
          </div>
        </div>
      )}

      {!causesLoading && causes?.results && causes.results.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium">Available causes</div>
            <Link to="/causes" className="text-sm text-green-600 hover:text-green-800 transition-colors">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {causes.results.slice(0, 3).map((cause: Cause) => (
              <Link 
                key={cause.id} 
                to={'/causes/' + cause.id}
                className="block p-3 border rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="font-medium text-sm">{cause.title}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Goal: ₵{Number(cause.goal_amount || 0).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
