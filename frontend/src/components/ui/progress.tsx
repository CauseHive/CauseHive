import * as React from 'react'
import { cn } from '@/lib/utils'

export function Progress({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800', className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped}>
      <div className="h-full bg-emerald-500" style={{ width: `${clamped}%` }} />
    </div>
  )
}
