import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Dashboard = {
  total_users: number
  total_causes: number
  total_donations: number
  total_amount_raised: number
  pending_causes: number
}

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<Dashboard>('/admin/api/dashboard/')
      return data
    }
  })

  if (isLoading) return <div>Loading admin data…</div>
  if (isError || !data) return <div className="text-red-600">Failed to load admin dashboard.</div>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card label="Total Users" value={data.total_users} />
      <Card label="Total Causes" value={data.total_causes} />
      <Card label="Total Donations" value={data.total_donations} />
      <Card label="Amount Raised (GHS)" value={data.total_amount_raised} />
      <Card label="Pending Causes" value={data.pending_causes} />
    </div>
  )
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-slate-900">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold">{typeof value === 'number' ? value.toLocaleString() : String(value)}</div>
    </div>
  )
}
