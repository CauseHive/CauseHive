import { cn } from '@/lib/utils'

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'destructive'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs',
      variant === 'default' && 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
      variant === 'success' && 'border-emerald-600 bg-emerald-50 text-emerald-700',
      variant === 'warning' && 'border-amber-600 bg-amber-50 text-amber-700',
      variant === 'destructive' && 'border-red-600 bg-red-50 text-red-700',
      className)}>{children}</span>
  )
}
