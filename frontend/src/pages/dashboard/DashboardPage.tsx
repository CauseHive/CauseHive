import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Pagination, Donation } from '@/types/api'
import { ShoppingCart } from 'lucide-react'

type DashboardDonation = Donation & { cause_title?: string }

export default function DashboardPage() {
  const { data: donations, isLoading: donationsLoading } = useQuery<Pagination<DashboardDonation>>({
    queryKey: ['dashboard-donations'],
    queryFn: async () => {
      const { data } = await api.get<Pagination<DashboardDonation>>('/donations/', { params: { page_size: 5 } })
      return data
    }
  })
  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ['dashboard-cart'],
    queryFn: async () => {
      const { data } = await api.get('/cart/')
      return data
    }
  })
  const { data: donationStats } = useQuery<{ total_amount: number; total_donations: number }>({
    queryKey: ['dashboard-donation-stats'],
    queryFn: async () => {
      const { data } = await api.get('/donations/statistics/')
      return data
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Here’s a quick overview of your activity.</p>
      </div>
      <Link 
        to="/app/cart" className="flex items-center align-middle justify-end w-20 gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors" >
          <ShoppingCart className="h-4 w-4" />
            Cart
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-500">Recent donations</div>
          <div className="mt-2 text-3xl font-semibold">{donationsLoading ? '…' : (donations?.count ?? 0)}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-500">Items in cart</div>
          <div className="mt-2 text-3xl font-semibold">{cartLoading ? '…' : (Array.isArray(cart?.items) ? cart.items.length : (cart?.results?.length ?? 0))}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-500">Unread notifications</div>
          <UnreadBadge />
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-slate-500">Total donated</div>
          <div className="mt-2 text-3xl font-semibold">₵{Number(donationStats?.total_amount ?? 0).toLocaleString()}</div>
        </div>
      </div>
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Recent donations</div>
          <Link to="/app/donations" className="text-sm text-emerald-700">View all</Link>
        </div>
        {donationsLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        {!donationsLoading && (!donations || donations.count === 0) && (
          <div className="text-sm text-slate-500">No recent donations yet.</div>
        )}
        {!donationsLoading && Array.isArray(donations?.results) && donations.results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.results.slice(0, 5).map((d: DashboardDonation) => (
                <TableRow key={d.id}>
                  <TableCell>{d.donated_at ? new Date(d.donated_at).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    {d.cause?.id ? (
                      <Link to={`/causes/${d.cause.id}`} className="hover:underline">
                        {d.cause?.title || d.cause_title || 'Donation'}
                      </Link>
                    ) : (
                      d.cause_title || 'Donation'
                    )}
                  </TableCell>
                  <TableCell className="text-right">₵{Number(d.amount).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {d.status === 'completed' && <Badge variant="success">completed</Badge>}
                    {d.status === 'pending' && <Badge variant="warning">pending</Badge>}
                    {d.status !== 'completed' && d.status !== 'pending' && <Badge variant="destructive">{String(d.status)}</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

function UnreadBadge() {
  const { data } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/', { params: { unread_only: true, page_size: 1 } })
      return data.count as number
    }
  })
  return <div className="mt-2 text-3xl font-semibold">{data ?? 0}</div>
}
