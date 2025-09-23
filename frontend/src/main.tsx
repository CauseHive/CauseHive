/* eslint-disable import/default */
import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import ErrorBoundary from '@/components/common/ErrorBoundary'
import { emitToast } from '@/lib/notify'
import { prefetchRoutes } from '@/lib/prefetchRoutes'
import { loadRuntimeConfig, SENTRY_DSN, APP_ENV } from '@/lib/config'

// Lazy import Sentry only if DSN provided (avoid bundle cost otherwise)
async function initSentry() {
  if (!SENTRY_DSN) return
  const Sentry = await import('@sentry/react')
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    tracesSampleRate: 0.1,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
  })
}
 
import { router } from './routes/router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  },
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      emitToast({ title: 'Request failed', description: message, variant: 'error' })
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      emitToast({ title: 'Action failed', description: message, variant: 'error' })
    },
    onSuccess: () => {
      // keep success toasts local to pages unless globally desirable
    }
  })
})

export function Boot() {
  useEffect(() => {
    // Prefetch most visited routes; can be tuned based on analytics.
    prefetchRoutes(['/causes', '/donations', '/profile'])
  }, [])
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

async function start() {
  await loadRuntimeConfig()
  await initSentry()
  const container = document.getElementById('root')!
  // Register a basic service worker for offline shell if available
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js')
    // eslint-disable-next-line no-empty
    } catch {}
  }
  // Prevent duplicate createRoot during HMR by caching the root on the element
  // @ts-expect-error - attach a custom marker
  if (!container._root) {
    const root = ReactDOM.createRoot(container)
    // @ts-expect-error - attach a custom marker
    container._root = root
    root.render(
      <React.StrictMode>
        <Boot />
      </React.StrictMode>
    )
  }
}

void start()
