import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Pagination, CauseListItem, Category } from '@/types/api'
import { mapCategory, mapCauseListItem, mapPagination } from '@/lib/mappers'
import { Link, useSearchParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Pagination as UIPagination } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { useEffect } from 'react'
import { Empty } from '@/components/ui/empty'

export function CausesPage() {
  const { notify } = useToast()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Pagination<Category>>('/categories/')
      return Array.isArray(data?.results) ? data.results.map(mapCategory) : []
    }
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['causes', { page, search, category }],
    queryFn: async () => {
      const { data } = await api.get<Pagination<CauseListItem>>('/causes/', {
        params: {
          page,
          search: search || undefined,
          category: category || undefined,
          status: 'live',
          ordering: '-created_at'
        }
      })
      return mapPagination(data, mapCauseListItem)
    }
  })

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const s = String(form.get('q') ?? '')
    const next = new URLSearchParams(params)
    if (s) next.set('search', s); else next.delete('search')
    next.set('page', '1')
    setParams(next)
  }

  useEffect(() => {
    if (isError) {
      notify({ title: 'Failed to load causes', variant: 'error' })
    }
  }, [isError, notify])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover Causes</h1>
        <form onSubmit={onSearch} className="flex gap-2">
          <input name="q" defaultValue={search} placeholder="Search causes" className="rounded-md border px-3 py-2 w-64 bg-white dark:bg-slate-900" />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        <button onClick={()=>{const p=new URLSearchParams(params);p.delete('category');p.set('page','1');setParams(p)}} className={`px-3 py-1 rounded-full border ${!category? 'bg-emerald-600 text-white border-emerald-600':'border-slate-300'}`}>All</button>
        {categoriesLoading && Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
        {categories?.map(c => (
          <button key={c.id} onClick={()=>{const p=new URLSearchParams(params);p.set('category', String(c.id));p.set('page','1');setParams(p)}} className={`px-3 py-1 rounded-full border ${String(c.id)===category? 'bg-emerald-600 text-white border-emerald-600':'border-slate-300'}`}>{c.name}</button>
        ))}
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!isLoading && data && data.results.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <Empty title="No causes found" description="Try adjusting your search or category filters." />
          </div>
        )}
        {data?.results.map(cause => (
          <Card key={cause.id}>
            <Link to={`/causes/${cause.id}`}>
              {cause.featured_image && (
                <img
                  src={cause.featured_image}
                  alt={cause.title ? `Image for ${cause.title}` : 'Cause image'}
                  className="w-full h-44 object-cover rounded-t-lg"
                  loading="lazy"
                />
              )}
            </Link>
            <CardContent className="space-y-2">
              <Badge>{cause.category.name}</Badge>
              <Link to={`/causes/${cause.id}`} className="block" aria-label={`Go to cause ${cause.title}`}>
                <h3 className="font-medium line-clamp-2">{cause.title}</h3>
              </Link>
              <div className="text-xs text-slate-500">Target: ₵{cause.target_amount.toLocaleString()}</div>
              <Progress value={cause.progress_percentage} />
            </CardContent>
          </Card>
        ))}
      </div>

      {data && (
        <UIPagination
          page={page}
          hasPrev={!!data.previous}
          hasNext={!!data.next}
          onPrev={()=>{const p=new URLSearchParams(params);p.set('page', String(Math.max(1, page-1)));setParams(p)}}
          onNext={()=>{const p=new URLSearchParams(params);p.set('page', String(page+1));setParams(p)}}
        />
      )}
    </div>
  )
}
