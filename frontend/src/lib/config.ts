const isDev = import.meta.env.DEV
// In development, prefer a relative base URL so Vite can proxy to the backend.
// In production, require VITE_API_BASE_URL or fall back to localhost:8000 for local builds.
export const API_BASE_URL = isDev
	? (import.meta.env.VITE_API_BASE_URL ?? '/api')
	: (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api')
