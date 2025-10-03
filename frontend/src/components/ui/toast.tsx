/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'

type ToastVariant = 'default' | 'success' | 'error'

export const ToastContext = React.createContext<{
  notify: (opts: { title?: string; description?: string; variant?: ToastVariant; duration?: number }) => void
} | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <Toaster/>')
  return ctx
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<{ title?: string; description?: string; variant?: ToastVariant; duration?: number }>({})

  const notify = React.useCallback((opts: { title?: string; description?: string; variant?: ToastVariant; duration?: number }) => {
    setState(opts)
    setOpen(false)
    // Allow closing/reopening to retrigger animation
    setTimeout(() => setOpen(true), 10)
  }, [])

  React.useEffect(() => {
    type ToastEvent = CustomEvent<{ title?: string; description?: string; variant?: ToastVariant; duration?: number }>
    const handler = (e: Event) => {
      const ce = e as ToastEvent
      if (ce.detail) notify(ce.detail)
    }
    window.addEventListener('app:toast', handler as EventListener)
    return () => window.removeEventListener('app:toast', handler as EventListener)
  }, [notify])

  return (
    <ToastContext.Provider value={{ notify }}>
      <ToastPrimitives.Provider duration={state.duration ?? 3000}>
        {children}
        <ToastPrimitives.Root
          open={open}
          onOpenChange={setOpen}
          className={cn('fixed bottom-4 right-4 z-[100] w-80 rounded-lg border bg-white p-4 shadow-lg',
            state.variant === 'success' && 'border-emerald-600',
            state.variant === 'error' && 'border-red-600')}
          aria-live="polite"
          role="status"
        >
          {state.title && <ToastPrimitives.Title className="text-sm font-medium">{state.title}</ToastPrimitives.Title>}
          {state.description && <ToastPrimitives.Description className="text-sm text-slate-600">{state.description}</ToastPrimitives.Description>}
          <ToastPrimitives.Close className="absolute right-2 top-2 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100">Close</ToastPrimitives.Close>
        </ToastPrimitives.Root>
        <ToastPrimitives.Viewport className="fixed bottom-0 right-0 z-[100] m-0 flex max-h-screen w-80 flex-col gap-2 p-4 outline-none" />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  )
}
