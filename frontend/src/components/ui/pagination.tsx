import { Button } from '@/components/ui/button'

export function Pagination({ page, hasPrev, hasNext, onPrev, onNext }: { page: number; hasPrev?: boolean; hasNext?: boolean; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" disabled={!hasPrev} onClick={onPrev}>Previous</Button>
      <div className="text-sm text-slate-500">Page {page}</div>
      <Button variant="outline" disabled={!hasNext} onClick={onNext}>Next</Button>
    </div>
  )
}
