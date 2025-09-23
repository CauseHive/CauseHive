# CauseHive Frontend

React + Vite + TypeScript app with Tailwind, React Router, React Query.

## Env

Create `.env` (or `.env.local`):

```bash
VITE_API_BASE_URL=http://127.0.0.1:9000/api
```

Production example (`env.production`):

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
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

## Deployment Guide

### Netlify Hosting (Recommended for static SPA)

1. Set site base directory to `frontend/` (if deploying from monorepo) and publish directory to `frontend/dist`.
2. Build command: `npm run build` (Netlify will run `npm install` automatically).
3. Add environment variables in Netlify UI (Site Settings → Build & Deploy → Environment):
   - `VITE_API_BASE_URL` = `https://api.yourdomain.com/api`
   - `VITE_SENTRY_DSN` (optional)
   - (Optional) If you want dynamic config.json, skip VITE_ vars and instead generate a file in a post-build command.
4. Include the provided `netlify.toml` (already added) to handle:
   - SPA fallback (all routes → `index.html`)
   - Security headers & CSP
   - Immutable caching for hashed assets (`/assets/*`)
   - No-cache for HTML / service worker / health page
5. (Optional) Runtime config approach:
   - Add a command after build: `echo '{"apiBaseUrl":"'$API_BASE_URL'","environment":"production"}' > dist/config.json`
   - Remove `VITE_API_BASE_URL` so build-time constant isn’t baked in.
6. Verify health page at `<your-site>/health` or `<your-site>/health.html`.

Backend CORS reminder: add your Netlify domain (e.g. `https://your-site.netlify.app`) or custom domain to the backend environment variable `CORS_ALLOWED_EXTRA`.

If using a custom domain via Netlify, ensure DNS + HTTPS is active before rolling out clients; otherwise early 308/redirects might affect first-load metrics.

### 1. Build

Local production build:

```bash
npm ci
npm run build
```

Artifacts output to `dist/`.

### 2. Docker Image

The provided `Dockerfile` performs a multi‑stage build (Node 20 -> nginx). Build & run:

```bash
docker build -t causehive-frontend --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/api .
docker run -p 8080:80 causehive-frontend
```

Visit <http://localhost:8080>

### 3. Environment Variables

Set `VITE_API_BASE_URL` at build time for static embedding. If you need runtime configurability (e.g., same image across environments), you can inject a `/config.json` fetched at app start; see "Runtime Config" below.

### 4. Reverse Proxy / TLS

Recommended to front nginx container with a TLS terminator (e.g., Caddy, Traefik, or nginx ingress). Sample Caddyfile:

```caddyfile
app.yourdomain.com {
	reverse_proxy 127.0.0.1:8080
}
```

### 5. Cache Strategy

The Dockerfile sets long‑term caching for hashed JS/CSS and short cache for HTML. If you introduce non‑hashed assets, adjust `nginx` rules to avoid serving stale versions.

### 6. Health Check

Add a container health check (compose example):

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost/index.html"]
  interval: 30s
  timeout: 3s
  retries: 3
```

### 7. Runtime Config (Optional)

If you need to change API base without rebuilding, serve a `/config.json` and load before app mount:

1. Place `config.template.json` in image and copy to `/usr/share/nginx/html/config.json` via entrypoint.
2. Replace tokens using envsubst in an entrypoint shell script.
3. Read it in `src/main.tsx` before rendering (fetch + assign to a window global).

### 8. Security Headers

The nginx config sets baseline security headers and a conservative CSP. If you add external CDNs, update the CSP `script-src`, `style-src`, or `img-src` directives accordingly.

### 9. Observability

Add basic access/error logging collection by binding `/var/log/nginx` or forwarding logs to structured logging stack (ELK, Loki). Frontend errors can be captured by adding a global `window.onerror` reporter tied to your backend or a service (Sentry, etc.).

### 10. CI/CD Outline

1. Lint & test: `npm ci && npm run lint && npm test`
2. Build: `npm run build`
3. Docker build & push: tag with commit SHA
4. Deploy: update service (Kubernetes / container app / VM) and run a smoke test hitting `/`.

## Checklist Before Deploy

- [x] API base URL set via build ARG or env file
- [x] Backend CORS allows your frontend origin
- [x] Tokens stored securely (localStorage — consider future migration to HttpOnly cookies if threat model changes)
- [x] 404 fallback verified (direct refresh on nested route works)
- [x] Long‑term asset caching validated (hashes present in filenames)
- [x] CSP updated for any external fonts, analytics, or media domains
- [x] Health endpoint or simple GET `/` check integrated into deployment pipeline

## Next Hardening Steps (Optional)

- Introduce SRI hashes if serving any third‑party scripts.
- Add a service worker for offline shell & pre‑cache (Workbox) if needed.
- Implement runtime configuration loader if multiple environments share one image.
- Add internationalization layer if future multilingual support planned.

## SEO & Favicon

Replace the placeholder `public/logo.png` and `public/favicon.ico` with your brand assets before deploy.

Quick checklist:

- Update `index.html` meta description, OG tags and Twitter tags to match your copy.
- Replace `/logo.png` with a 512x512 PNG or SVG and `/favicon.ico` with a standard ICO (multi-size). The app references these from the root.
- Update `public/sitemap.xml` with your canonical domain or generate it during CI with a script.
- Verify `public/robots.txt` allows crawlers and points to your sitemap.


## Runtime Configuration

The app attempts to fetch `/config.json` on startup before mounting. Any keys here override build‑time `VITE_` values. Example `public/config.example.json`:

```json
{
  "apiBaseUrl": "/api",
  "environment": "production",
  "sentryDsn": "https://example.ingest.sentry.io/123456",
  "enableRQDevtools": false
}
```

Serve a different `config.json` per environment without rebuilding the image.

## Sentry Integration

Provide `VITE_SENTRY_DSN` at build time or via `config.json` to enable Sentry. Without a DSN the code path is tree‑shaken (dynamic import never runs).

## Service Worker

A minimal `service-worker.js` provides an offline shell for `index.html` + `health.html`. Expand with Workbox if you need smarter runtime caching or version management. To disable offline behavior simply remove the registration block in `src/main.tsx`.
