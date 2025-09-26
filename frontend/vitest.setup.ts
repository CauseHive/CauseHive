import '@testing-library/jest-dom/vitest'

// Polyfill for fetch if needed by components using it during tests
if (!globalThis.fetch) {
  import('undici').then(({ fetch, Headers, Request, Response }) => {
    Object.assign(globalThis, { fetch, Headers, Request, Response })
  })
}
