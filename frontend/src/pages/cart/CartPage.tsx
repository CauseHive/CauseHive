import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CartSummary } from '@/types/api'
import { mapCartSummary } from '@/lib/mappers'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty } from '@/components/ui/empty'

export function CartPage() {
  const qc = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
  const { data } = await api.get<CartSummary>('/cart/')
  return mapCartSummary(data)
    }
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => api.patch(`/cart/update/${id}/`, { amount, ...(data?.cart_id ? { cart_id: data.cart_id } : {}) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] })
  })
  const removeItem = useMutation({
    mutationFn: async (id: string) => api.delete(`/cart/remove/${id}/`, { params: data?.cart_id ? { cart_id: data.cart_id } : undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] })
  })
  const clearCart = useMutation({
    mutationFn: async () => api.delete('/cart/delete/', { params: data?.cart_id ? { cart_id: data.cart_id } : undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] })
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Donation Cart</h1>
        <div className="rounded-lg border divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24 mt-2" />
                <Skeleton className="h-8 w-32 mt-3" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (isError || !data) return <div className="text-red-600">Failed to load cart.</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Donation Cart</h1>
      {data.items.length === 0 ? (
        <Empty title="Your cart is empty" description="Add donations to your cart from a cause page." />
      ) : (
      <div className="rounded-lg border divide-y">
        {data.items.map(item => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            {item.cause.featured_image && <img src={item.cause.featured_image} alt="" className="w-16 h-16 rounded object-cover" />}
            <div className="flex-1">
              <div className="font-medium">{item.cause.title}</div>
              <div className="text-sm text-slate-500">Amount (GHS)</div>
              <input type="number" min={1} defaultValue={item.amount} onBlur={(e)=> updateItem.mutate({ id: item.id, amount: Number(e.target.value) })} className="mt-1 w-32 rounded-md border px-2 py-1" />
            </div>
            <button onClick={()=> removeItem.mutate(item.id)} className="px-3 py-2 rounded-md border">Remove</button>
          </div>
        ))}
      </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Items: {data.item_count}</div>
        <div className="text-lg font-medium">Total: ₵{data.total_amount.toFixed(2)}</div>
      </div>
      <div className="flex gap-3">
        <button onClick={()=> clearCart.mutate()} className="px-4 py-2 rounded-md border">Clear Cart</button>
      </div>
    </div>
  )
}
