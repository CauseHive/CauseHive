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
 
import { router } from '@/routes/router'
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
  try {
    // Clear any cached modules on startup to fix dynamic import issues
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames
            .filter(name => name.includes('js') || name.includes('module'))
            .map(name => caches.delete(name))
        )
      } catch (error) {
        console.warn('Failed to clear module caches:', error)
      }
    }

    await loadRuntimeConfig()
    await initSentry()
    
    const container = document.getElementById('root')!
    
    // Register a basic service worker for offline shell if available
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js')
        
        // Update service worker if available
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
        
        // Listen for SW updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available, show update notification
                emitToast({ 
                  title: 'Update available', 
                  description: 'A new version is available. Please refresh to update.',
                  variant: 'default'
                })
              }
            })
          }
        })
      } catch (error) {
        console.warn('Service worker registration failed:', error)
      }
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
  } catch (error) {
    console.error('Failed to initialize app:', error)
    emitToast({ 
      title: 'Application Error', 
      description: 'Failed to start the application. Please refresh the page.',
      variant: 'error'
    })
    
    // Show a fallback UI
    const container = document.getElementById('root')!
    container.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: system-ui, sans-serif;">
        <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Something went wrong while starting the application.</p>
        <button 
          onclick="window.location.reload()" 
          style="padding: 12px 24px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
        >
          Refresh Page
        </button>
      </div>
    `
  }
}

void start()
