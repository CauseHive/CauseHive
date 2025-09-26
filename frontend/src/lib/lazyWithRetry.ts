import React from 'react'

export function lazyWithRetry<T extends { default: React.ComponentType<unknown> }>(
  factory: () => Promise<T>,
  options?: { retries?: number; retryDelayMs?: number }
) {
  const retries = options?.retries ?? 1
  const retryDelayMs = options?.retryDelayMs ?? 1200

  async function tryImport(attempt = 0): Promise<T> {
    try {
      return await factory()
    } catch (err) {
      if (attempt >= retries) throw err
      await new Promise((r) => setTimeout(r, retryDelayMs))
      return tryImport(attempt + 1)
    }
  }

  return React.lazy(() => tryImport())
}
