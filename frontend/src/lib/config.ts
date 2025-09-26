/*
Runtime + build-time config abstraction.

Priority order (highest wins when defined):
1. window.__RUNTIME_CONFIG__ injected via /config.json fetched at boot (optional, enables single image multi-env deploys)
2. Vite build-time env variables (import.meta.env.VITE_*)
3. Sensible defaults
*/

// Declare global shape for TypeScript
declare global {
		interface Window { // eslint-disable-line @typescript-eslint/consistent-type-definitions
			__RUNTIME_CONFIG__?: Record<string, unknown>
	}
}

const isDev = import.meta.env.DEV

export interface AppRuntimeConfig {
	apiBaseUrl: string
	sentryDsn?: string
	environment: string
	enableRQDevtools: boolean
}

// Build-time values
const defaultProdApiBase = 'https://causehive-monolithic-production.up.railway.app/api'

const buildConfig: Partial<AppRuntimeConfig> = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || (isDev ? '/api' : defaultProdApiBase),
	sentryDsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.MODE || (isDev ? 'development' : 'production'),
	enableRQDevtools: !!import.meta.env.VITE_ENABLE_RQ_DEVTOOLS && isDev,
}

// Merge runtime config if present (runtime overrides build)
function composeConfig(): AppRuntimeConfig {
	const runtimeRaw: unknown = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {}
	const runtime = (typeof runtimeRaw === 'object' && runtimeRaw !== null) ? runtimeRaw as Record<string, unknown> : {}
	const pickString = (key: string, fallback?: string): string | undefined => {
		const v = runtime[key]
		return typeof v === 'string' ? v : fallback
	}
	const pickBool = (key: string, fallback: boolean): boolean => {
		const v = runtime[key]
		return typeof v === 'boolean' ? v : fallback
	}
	return {
		apiBaseUrl: pickString('apiBaseUrl', buildConfig.apiBaseUrl) || (isDev ? '/api' : defaultProdApiBase),
		sentryDsn: pickString('sentryDsn', buildConfig.sentryDsn),
		environment: pickString('environment', buildConfig.environment) || 'production',
		enableRQDevtools: pickBool('enableRQDevtools', buildConfig.enableRQDevtools ?? false),
	}
}

export const RUNTIME_CONFIG: AppRuntimeConfig = composeConfig()
export const API_BASE_URL = RUNTIME_CONFIG.apiBaseUrl
export const ENABLE_RQ_DEVTOOLS = RUNTIME_CONFIG.enableRQDevtools
export const SENTRY_DSN = RUNTIME_CONFIG.sentryDsn
export const APP_ENV = RUNTIME_CONFIG.environment

export async function loadRuntimeConfig(): Promise<void> {
	// Only attempt once and only in browser
	if (typeof window === 'undefined') return
	if (window.__RUNTIME_CONFIG__) return
	try {
		const res = await fetch('/config.json', { cache: 'no-store' })
		if (res.ok) {
			const json = await res.json()
			window.__RUNTIME_CONFIG__ = json
		}
	// eslint-disable-next-line no-empty
	} catch {}
}
