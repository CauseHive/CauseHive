import { useState, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/toast'

interface CategoryLite { id: number; name: string }
interface ApiError { response?: { data?: { error?: string } } }

export default function CreateCausePage() {
  const { notify } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const fileRef = useRef<HTMLInputElement|null>(null)
  const [creating, setCreating] = useState(false)

  const { data: categories } = useQuery<CategoryLite[]>({
    queryKey: ['categories-basic'],
    queryFn: async () => (await api.get('/categories/')).data?.results || []
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append('name', name)
      if (description) fd.append('description', description)
      if (target) fd.append('target_amount', target)
      if (categoryId) fd.append('category', categoryId)
      const file = fileRef.current?.files?.[0]
      if (file) fd.append('cover_image', file)
      setCreating(true)
      return api.post('/causes/create/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: (res) => {
      notify({ title: 'Cause submitted', description: 'Awaiting review', variant: 'success' })
      const id = res.data?.id
      if (id) navigate(`/causes/${id}`)
    },
    onError: (err: ApiError) => {
      const msg = err?.response?.data?.error || 'Failed to create cause'
      notify({ title: 'Create failed', description: msg, variant: 'error' })
    },
    onSettled: () => setCreating(false)
  })

  const disabled = !name || !target

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create a Cause</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-xs mb-1" htmlFor="name">Title</label>
          <input id="name" value={name} onChange={(e)=> setName(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="Cause title" />
        </div>
        <div>
          <label className="block text-xs mb-1" htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e)=> setDescription(e.target.value)} className="w-full h-40 rounded-md border px-3 py-2 resize-none" placeholder="Explain the purpose and impact" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs mb-1" htmlFor="target_amount">Target Amount</label>
            <input id="target_amount" type="number" min="0" value={target} onChange={(e)=> setTarget(e.target.value)} className="w-full rounded-md border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs mb-1" htmlFor="category">Category</label>
            <select id="category" value={categoryId} onChange={(e)=> setCategoryId(e.target.value)} className="w-full rounded-md border px-3 py-2">
              <option value="">Select category (optional)</option>
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs mb-1">Cover Image</label>
          <input ref={fileRef} type="file" accept="image/*" />
        </div>
        <Button disabled={disabled || creating} onClick={()=> mutation.mutate()} className="w-full">
          {creating? 'Creating…':'Submit for Review'}
        </Button>
      </div>
    </div>
  )
}