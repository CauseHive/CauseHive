import { useMemo } from 'react'
import { useCauses, useCategories } from '@/hooks/api'
import { Link, useSearchParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Pagination as UIPagination } from '@/components/ui/pagination'
import { Empty } from '@/components/ui/empty'

export function CausesPage() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''

  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data, isLoading, isError } = useCauses({ 
    page, 
    search: search || undefined, 
    category: category || undefined, 
    status: 'live',
    ordering: '-created_at'
  })

  // Derive categories from causes if categories aren't loaded
  const derivedCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories
    const list = data?.results ?? []
    const map = new Map<string, any>()
    list.forEach((cause) => {
      const cat = cause.category
      if (!cat?.id) return
      if (!map.has(cat.id)) {
        map.set(cat.id, {
          id: cat.id,
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          color: cat.color,
          cause_count: undefined
        })
      }
    })
    return Array.from(map.values())
  }, [categories, data?.results])

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const s = String(form.get('q') ?? '')
    const next = new URLSearchParams(params)
    if (s) next.set('search', s); else next.delete('search')
    next.set('page', '1')
    setParams(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover Causes</h1>
        <form onSubmit={onSearch} className="flex gap-2">
          <input 
            name="q" 
            defaultValue={search} 
            placeholder="Search causes" 
            className="rounded-md border px-3 py-2 w-64 bg-white dark:bg-slate-900" 
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        <button 
          onClick={() => {
            const p = new URLSearchParams(params)
            p.delete('category')
            p.set('page', '1')
            setParams(p)
          }} 
          className={`px-3 py-1 rounded-full border ${!category 
            ? 'bg-emerald-600 text-white border-emerald-600' 
            : 'border-slate-300'
          }`}
        >
          All
        </button>
        {categoriesLoading && Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
        {derivedCategories.map(c => (
          <button 
            key={c.id} 
            onClick={() => {
              const p = new URLSearchParams(params)
              p.set('category', String(c.id))
              p.set('page', '1')
              setParams(p)
            }} 
            className={`px-3 py-1 rounded-full border ${String(c.id) === category 
              ? 'bg-emerald-600 text-white border-emerald-600' 
              : 'border-slate-300'
            }`}
          >
            {c.name}
          </button>
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

      {isError && (
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load causes. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && data && (
        <>
          {data.results.length === 0 ? (
            <Empty title="No causes found" description="Try adjusting your search or category filters" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.results.map(cause => (
                <Card key={cause.id} className="overflow-hidden">
                  <Link to={`/causes/${cause.id}`}>
                    {cause.featured_image && (
                      <img 
                        src={cause.featured_image} 
                        alt={cause.title} 
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="text-xs">
                          {cause.category.name}
                        </Badge>
                        {cause.is_featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {cause.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {cause.description}
                      </p>
                      <div className="space-y-2">
                        <Progress value={cause.progress_percentage} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            ${cause.current_amount.toLocaleString()} raised
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {cause.progress_percentage}%
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Goal: ${cause.target_amount.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {data.count > 20 && (
            <div className="flex justify-center">
              <UIPagination
                page={page}
                hasPrev={page > 1}
                hasNext={page < Math.ceil(data.count / 20)}
                onPrev={() => {
                  const next = new URLSearchParams(params)
                  next.set('page', String(page - 1))
                  setParams(next)
                }}
                onNext={() => {
                  const next = new URLSearchParams(params)
                  next.set('page', String(page + 1))
                  setParams(next)
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}