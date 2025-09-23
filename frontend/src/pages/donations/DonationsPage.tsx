import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Pagination, Donation } from '@/types/api'
import { mapDonation, mapPagination } from '@/lib/mappers'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/components/ui/toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Pagination as UIPagination } from '@/components/ui/pagination'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useEffect } from 'react'
import { Empty } from '@/components/ui/empty'

export function DonationsPage() {
  const { notify } = useToast()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const status = params.get('status') || ''
  const search = params.get('search') || ''

  const { data, isLoading, isError } = useQuery({
    queryKey: ['donations', { page, status, search }],
    queryFn: async () => {
      const { data } = await api.get<Pagination<Donation>>('/donations/', {
        params: {
          page,
          status: status || undefined,
          search: search || undefined,
          ordering: '-donated_at'
        }
      })
  return mapPagination(data, mapDonation)
    }
  })

  useEffect(() => {
    if (isError) notify({ title: 'Failed to load donations', variant: 'error' })
  }, [isError, notify])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Donations</h1>
      <div className="flex gap-2 items-center">
        <Select
          // Radix Select does not support empty string values; use a sentinel 'all'
          value={status || 'all'}
          onValueChange={(val)=>{
            const p=new URLSearchParams(params)
            if(val && val !== 'all') p.set('status', val)
            else p.delete('status')
            p.set('page','1')
            setParams(p)
          }}
        >
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <form
          onSubmit={(e)=>{e.preventDefault(); const form=new FormData(e.currentTarget); const q=String(form.get('q')??''); const p=new URLSearchParams(params); if(q) p.set('search',q); else p.delete('search'); p.set('page','1'); setParams(p)}}
          className="flex gap-2"
        >
          <input name="q" defaultValue={search} placeholder="Search by cause" className="rounded-md border px-3 py-2 bg-white dark:bg-slate-900" />
          <button className="rounded-md border px-3 py-2">Search</button>
        </form>
      </div>

      {isLoading && (
        <div className="rounded-lg border divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-3 w-14 mt-2 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      )}
      {isError && <div className="text-red-600">Failed to load donations.</div>}

      {data && data.results.length > 0 ? (
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
          {data?.results.map(d => (
            <TableRow key={d.id}>
              <TableCell>{new Date(d.donated_at).toLocaleString()}</TableCell>
              <TableCell>{d.cause.title}</TableCell>
              <TableCell className="text-right">₵{d.amount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                {d.status==='completed' && <Badge variant="success">completed</Badge>}
                {d.status==='pending' && <Badge variant="warning">pending</Badge>}
                {d.status!=='completed' && d.status!=='pending' && <Badge variant="destructive">{d.status}</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      ) : (
        !isLoading && !isError && (
          <Empty title="No donations yet" description="Your donations will appear here." />
        )
      )}

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
 
