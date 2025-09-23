# CauseHive Frontend

React + Vite + TypeScript app with Tailwind, React Router, React Query.

## Env

Create `.env` (or `.env.local`):

```
VITE_API_BASE_URL=http://127.0.0.1:9000/api
```

## Scripts

- dev: start dev server
- build: production build
- preview: preview production build

## Notes
- Authentication uses JWT (login returns access/refresh). Tokens are stored in localStorage.
- API endpoints are based on backend `API_DOCUMENTATION.md`.
- Update the base URL as needed for production.

## UX & performance features

- Route lazy-loading with Suspense fallbacks using a shared `LoadingScreen` for consistent UX.
- Route-level error boundary (`RouteErrorBoundary`) plus a global `ErrorBoundary` wrapper to catch non-route render errors.
- Top navigation progress bar via `nprogress`, driven by React Router transition state; theme overridden in `src/index.css`.
- Smooth scroll-to-top after each completed navigation for better page-perception.
- Module prefetch for common routes (Causes, Donations, Profile) after app mount via `prefetchRoutes`.
- Retryable lazy imports with `lazyWithRetry` to mitigate transient dynamic import failures.
- Global toast notifications and React Query global error handlers for network/operation feedback.
- 404 route: `NotFoundPage` is lazy-loaded and registered under `*`.

### Customization points

- Progress bar color: adjust CSS in `src/index.css` under the `#nprogress` rules.
- Prefetch targets: edit `src/lib/prefetchRoutes.ts` to add/remove modules you want to warm up.
- Lazy import retry behavior: tweak retries/delay in `src/lib/lazyWithRetry.ts`.
- Error UIs: update copy and styles in `src/routes/RouteErrorBoundary.tsx` and `src/components/common/ErrorBoundary.tsx`.

## Bundle analysis (optional)

We ship optional bundle analysis using `rollup-plugin-visualizer`. Enable it per-build.

Windows PowerShell:

```powershell
$env:ANALYZE = "1"
npm run build
Remove-Item Env:ANALYZE
```

Then open `dist/stats.html` in your browser.

## File map (key items)

- `src/routes/router.tsx` — lazy routes, Suspense fallbacks, route error element.
- `src/components/ui/loading-screen.tsx` — shared route loading UI.
- `src/components/common/ErrorBoundary.tsx` — global error boundary wrapper.
- `src/components/layout/AppLayout.tsx` — header/nav, nprogress integration, smooth scroll restore.
- `src/lib/prefetchRoutes.ts` — module preloading for common routes.
- `src/lib/lazyWithRetry.ts` — retry wrapper for dynamic imports.
- `src/lib/api.ts` — axios client with auth header injection and safe retry header handling.
