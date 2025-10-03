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
import { ShoppingCart } from 'lucide-react'

// Mock data for demonstration
const mockCauses = [
  {
    id: '1',
    title: 'Rural School Library Project',
    description: 'Building educational futures in Northern Ghana with a comprehensive library for over 200 students.',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    target_amount: 12000,
    current_amount: 8500,
    progress_percentage: 71,
    category: { id: '1', name: 'Education' },
    is_featured: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Community Health Clinic',
    description: 'Establishing a modern health clinic in rural Eastern Region to serve 500+ families.',
    featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    target_amount: 25000,
    current_amount: 18750,
    progress_percentage: 75,
    category: { id: '2', name: 'Healthcare' },
    is_featured: false,
    created_at: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Clean Water Initiative',
    description: 'Installing borehole wells and water purification systems for three villages in the Volta Region.',
    featured_image: 'https://images.unsplash.com/photo-1541544537156-7627a7ce10c6?w=400&h=300&fit=crop',
    target_amount: 15000,
    current_amount: 9200,
    progress_percentage: 61,
    category: { id: '3', name: 'Water & Sanitation' },
    is_featured: true,
    created_at: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    title: 'Women\'s Entrepreneurship Program',
    description: 'Empowering 50 women in Accra with skills training and startup capital for sustainable businesses.',
    featured_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    target_amount: 8000,
    current_amount: 6400,
    progress_percentage: 80,
    category: { id: '4', name: 'Economic Development' },
    is_featured: false,
    created_at: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'Youth Sports Complex',
    description: 'Building a modern sports facility for underprivileged youth in Tema to promote healthy lifestyles.',
    featured_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    target_amount: 30000,
    current_amount: 15600,
    progress_percentage: 52,
    category: { id: '5', name: 'Youth Development' },
    is_featured: true,
    created_at: '2024-01-05T11:20:00Z'
  },
  {
    id: '6',
    title: 'Agricultural Training Center',
    description: 'Creating a training facility to teach modern farming techniques to 100+ farmers in Ashanti Region.',
    featured_image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop',
    target_amount: 18000,
    current_amount: 11200,
    progress_percentage: 62,
    category: { id: '6', name: 'Agriculture' },
    is_featured: false,
    created_at: '2024-01-03T13:10:00Z'
  }
]

const mockCategories = [
  { id: '1', name: 'Education', cause_count: 15 },
  { id: '2', name: 'Healthcare', cause_count: 12 },
  { id: '3', name: 'Water & Sanitation', cause_count: 8 },
  { id: '4', name: 'Economic Development', cause_count: 10 },
  { id: '5', name: 'Youth Development', cause_count: 6 },
  { id: '6', name: 'Agriculture', cause_count: 9 }
]

export function CausesPage() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''

  const { data: categories } = useCategories()
  const { data, isLoading } = useCauses({
    page,
    search: search || undefined,
    category: category || undefined,
    status: 'live',
    ordering: '-created_at'
  })

  // Use mock data if API fails or no data
  const displayCauses = useMemo(() => {
    if (data?.results && data.results.length > 0) {
      return data.results
    }
    // Filter mock data based on search and category
    let filtered = mockCauses
    if (search) {
      filtered = filtered.filter(cause =>
        cause.title.toLowerCase().includes(search.toLowerCase()) ||
        cause.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (category) {
      filtered = filtered.filter(cause => cause.category.id === category)
    }
    return filtered
  }, [data?.results, search, category])

  const displayCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories
    return mockCategories
  }, [categories])

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const s = String(form.get('q') ?? '')
    const next = new URLSearchParams(params)
    if (s) next.set('search', s); else next.delete('search')
    next.set('page', '1')
    setParams(next)
  }

  const onCategoryChange = (catId: string) => {
    const next = new URLSearchParams(params)
    if (catId) next.set('category', catId); else next.delete('category')
    next.set('page', '1')
    setParams(next)
  }

  const onPageChange = (p: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(p))
    setParams(next)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-emerald-50 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Support Ghanaian Causes
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Join us in making a difference. Discover impactful projects that are transforming communities across Ghana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-emerald-700 hover:bg-emerald-50 border-white hover:text-emerald-400">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Donating
              </Button>
              <Button size="lg" variant="outline" className="border-white text-emerald-700 hover:text-emerald-400">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                name="q"
                placeholder="Search causes..."
                defaultValue={search}
                className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Search
            </Button>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={category === '' ? 'default' : 'outline'}
              onClick={() => onCategoryChange('')}
              className={category === '' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              All Categories
            </Button>
            {displayCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id ? 'default' : 'outline'}
                onClick={() => onCategoryChange(cat.id)}
                className={category === cat.id ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {cat.name}
                {cat.cause_count && (
                  <Badge variant="default" className="ml-2">
                    {cat.cause_count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Causes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayCauses.length === 0 ? (
          <Empty
            title="No causes found"
            description={search || category ? "Try adjusting your search or filters" : "Check back later for new causes"}
            action={
              <Button onClick={() => setParams(new URLSearchParams())}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayCauses.map((cause) => (
                <Card key={cause.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative">
                    <img
                      src={cause.featured_image || '/placeholder-cause.jpg'}
                      alt={cause.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {cause.is_featured && (
                      <Badge className="absolute top-3 left-3 bg-emerald-600">
                        Featured
                      </Badge>
                    )}
                    <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800">
                      {cause.category?.name}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {cause.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {cause.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{cause.progress_percentage}%</span>
                      </div>
                      <Progress value={cause.progress_percentage} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">
                          ₵{cause.current_amount?.toLocaleString() ?? 0}
                        </p>
                        <p className="text-sm text-gray-500">
                          of ₵{cause.target_amount?.toLocaleString() ?? 0}
                        </p>
                      </div>
                      <Link to={`/causes/${cause.id}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          Donate Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data?.count && data.count > 12 && (
              <UIPagination
                page={page}
                hasPrev={page > 1}
                hasNext={page < Math.ceil(data.count / 12)}
                onPrev={() => onPageChange(page - 1)}
                onNext={() => onPageChange(page + 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}