import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')

  const { data: categories } = useQuery<CategoryLite[]>({
    queryKey: ['categories-basic'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/categories/')
        return Array.isArray(data?.results) ? data.results : []
      } catch (err) {
        const axiosErr = err as AxiosError
        if (axiosErr.response?.status === 404) return []
        throw err
      }
    }
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const file = fileRef.current?.files?.[0]
      setCreating(true)
      if (file) {
        const fd = new FormData()
        fd.append('name', name)
        if (description) fd.append('description', description)
        if (target) fd.append('target_amount', target)
        if (categoryId) fd.append('category', categoryId)
        else if (newCategory) {
          // send flat keys for multipart; backend should accept this or you can send JSON string
          fd.append('category_data[name]', newCategory)
          if (newCategoryDescription) fd.append('category_data[description]', newCategoryDescription)
        }
        fd.append('cover_image', file)
        return api.post('/causes/', fd)
      }

      // No file selected: send JSON so nested objects (category_data) are preserved
      const payload: Record<string, unknown> = { name }
      if (description) payload.description = description
      if (target) payload.target_amount = target
      if (categoryId) payload.category = categoryId
      else if (newCategory) payload.category_data = { name: newCategory, description: newCategoryDescription }
      return api.post('/causes/', payload)
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="max-w-3xl mx-auto mt-0">
      <Card className="bg-white mt-0 text-slate-900">
        <CardHeader>
          <CardTitle>Create a Cause</CardTitle>
          <CardDescription>Share your cause so donors can find and support it. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div>
              <Label htmlFor="name">Title *</Label>
              <Input id="name" value={name} onChange={(e)=> setName(e.target.value)} className="mt-1" placeholder="Cause title" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" value={description} onChange={(e)=> setDescription(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-2 text-sm h-40 resize-none" placeholder="Explain the purpose and impact" />
            </div>

            <div>
              <Label htmlFor="target_amount">Target Amount (NGN) *</Label>
              <Input id="target_amount" type="number" min="0" value={target} onChange={(e)=> setTarget(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
                {categories && categories.length > 0 ? (
                <div className="mt-1">
                  <Select onValueChange={(val) => setCategoryId(val)}>
                    <SelectTrigger className="w-full flex h-10 items-center justify-between rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-2 text-sm"><SelectValue placeholder="Select category (optional)" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2 mt-1">
                  <Input value={newCategory} onChange={(e)=> setNewCategory(e.target.value)} placeholder="Category name" />
                    <textarea value={newCategoryDescription} onChange={(e)=> setNewCategoryDescription(e.target.value)} placeholder="Category description (optional)" className="w-full rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-2 h-20 resize-none text-sm" />
                    <p className="text-xs text-slate-500">No categories available yet. Provide a new category name and optional description.</p>
                </div>
              )}
            </div>

            <div>
              <Label>Cover Image</Label>
              <input ref={fileRef} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> {
                const file = e.target.files?.[0]
                if (file) {
                  const url = URL.createObjectURL(file)
                  if (previewUrl) URL.revokeObjectURL(previewUrl)
                  setPreviewUrl(url)
                } else {
                  if (previewUrl) URL.revokeObjectURL(previewUrl)
                  setPreviewUrl(null)
                }
              }} type="file" accept="image/*" className="mt-1 block w-full text-sm text-slate-700 file:border file:border-slate-300 file:bg-slate-50 file:text-slate-900 file:rounded-md file:px-3 file:py-2" />
              <p className="text-xs text-slate-600 mt-2">Upload an image that represents the cause. Max size depends on backend limits.</p>

              <div className="mt-3">
                <Label>Preview</Label>
                <div className="mt-1 h-40 w-full rounded-md border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {previewUrl ? <img src={previewUrl} alt="cover preview" className="object-cover h-full w-full" /> : <span className="text-sm text-slate-500">No image selected</span>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Button disabled={disabled || creating} onClick={()=> mutation.mutate()} className="w-full">
              {creating? 'Creating…':'Submit for Review'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
//This is a random update
