import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { ShoppingCart } from 'lucide-react'

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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-gray-600">Here's a quick overview of your activity.</p>
          </div>
          <Link 
            to="/app/cart" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-600 border hover:border-green-300 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>
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
  )
}
