# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

All commands assume the repository root: D:\\repos\\CauseHive (PowerShell 7 on Windows). Use absolute paths if your CWD differs.

- Monolith (Django) — backend/monolithic_app
  - Create venv and install deps
    - python -m venv backend/monolithic_app/venv
    - backend/monolithic_app/venv/Scripts/Activate.ps1
    - pip install -r backend/monolithic_app/requirements.txt
  - Run dev server (uses causehive_monolith.settings)
    - python backend/monolithic_app/manage.py runserver 8000
  - Collect static files (dry-run useful locally)
    - python backend/monolithic_app/manage.py collectstatic --noinput --dry-run
  - Run migrations across all databases
    - python migrate_databases.py all
    - Migrate a specific app to a target DB
      - python migrate_databases.py app <app_label> <default|causes_db|donations_db|admin_db>
  - Celery
    - Worker: celery -A causehive_monolith worker -l info
    - Beat: celery -A causehive_monolith beat -l info
  - Health checks
    - GET http://localhost:8000/api/health/
    - GET http://localhost:8000/api/ready/

- Monolith build + deployment
  - Local build test (no DB required)
    - python test_build.py
  - Deployment readiness (needs env configured)
    - python test_deployment.py
  - Docker build (root Dockerfile builds monolith)
    - docker build -t causehive:local .
  - Railway (monolith)
    - See backend/monolithic_app/railway.json for startCommand
    - Start cmd used by Railway container:
      - python migrate_databases.py all && python manage.py collectstatic --noinput && gunicorn --bind 0.0.0.0:$PORT --workers 3 --timeout 120 --keep-alive 2 --max-requests 1000 --max-requests-jitter 50 causehive_monolith.wsgi:application

- Microservices (legacy dev mode retained under backend/services)
  - Each service is a standalone Django app with its own manage.py and requirements.txt
  - Typical pattern (example: user_service on 8000)
    - python -m venv backend/services/user_service/venv
    - backend/services/user_service/venv/Scripts/Activate.ps1
    - pip install -r backend/services/user_service/requirements.txt
    - python backend/services/user_service/manage.py runserver 8000
  - Convenience scripts
    - PowerShell: scripts/start_dev_environment.ps1 (launches 4 services + frontend)
    - Bash: scripts/start_dev_environment.sh

- Frontend (Create React App)
  - From frontend/
    - npm install
    - npm start (dev)
    - npm run build
    - npm test
    - Single test (Jest pattern): npm test -- <pattern>

- Tests (monolith)
  - Django checks (no DB): python backend/monolithic_app/manage.py check --deploy
  - Static collection dry-run: python backend/monolithic_app/manage.py collectstatic --noinput --dry-run
  - DB connection sanity (env must be set): python test_db_connections.py

## Architecture

- Big picture
  - The repository provides two operational modes:
    1) Monolith (primary): backend/monolithic_app combines all service domains into a single Django project causehive_monolith with multiple logical apps and a multi-database routing strategy.
    2) Legacy microservices (secondary for development/demo): backend/services/* retain the original per-service Django projects.

- Monolith composition (causehive_monolith)
  - Apps (from LOCAL_APPS in settings):
    - users_n_auth (User domain)
    - causes, categories (Cause domain)
    - donations, cart, payments, withdrawal_transfer (Donations/Payments domain)
    - admin_auth, dashboard, auditlog, notifications, management (Admin domain)
  - URL layout (causehive_monolith/urls.py)
    - /api/user/ → users_n_auth
    - /api/causes/ → causes
    - /api/donations/, /api/payments/, /api/cart/, /api/withdrawals/ → donations/payments/cart/withdrawal_transfer
    - /api/admin/..., including /api/admin/dashboard/, /api/admin/auditlog/, /api/admin/management/, /api/admin/notifications/
    - Health: /api/health/ and /api/ready/
  - Database topology (multi-db)
    - A single PostgreSQL instance is used with schema-based separation in settings.py (causehive_monolith/settings.py):
      - default → search_path=causehive_users,public (users_n_auth)
      - causes_db → search_path=causehive_causes,public (causes, categories)
      - donations_db → search_path=causehive_donations,public (donations, cart, payments, withdrawal_transfer)
      - admin_db → search_path=causehive_admin,public (admin_auth, dashboard, auditlog, notifications, management)
    - DatabaseRouter (causehive_monolith/db_router.py) routes reads/writes/migrations by app label to the correct DB alias.
  - Background processing
    - Celery app at causehive_monolith/celery.py; broker/result default to Redis via CELERY_BROKER_URL and CELERY_RESULT_BACKEND.
    - Celery Beat schedules (settings.py) include hourly reporting (dashboard.tasks.generate_fresh_report) and polling for pending causes.
  - AuthN/Z
    - Custom user model users_n_auth.User; JWT via djangorestframework-simplejwt; allauth/dj-rest-auth integrated for registration and social auth (Google provider declared).
  - Static/media
    - WhiteNoise enabled; STATIC_ROOT staticfiles/ and MEDIA_ROOT media/.
  - Deployment
    - Railway: backend/monolithic_app/railway.json defines the container start command, healthcheck path, and restart policy. The top-level Dockerfile also builds the monolith and runs migrate_databases.py before Gunicorn.

- Legacy microservices (backend/services)
  - Each service (user_service, cause_service, donation_processing_service, admin_reporting_service) remains a Django project with its own settings, requirements, and Dockerfile for standalone runs. The repository keeps these for local multi-service development, reference, and parity with pre-monolith architecture.

- Frontend
  - React (CRA) in frontend/ with API base set by REACT_APP_API_URL (defaults to http://localhost:8000). The monolith exposes REST endpoints under /api/… consumed by src/services/apiService.js.

## Source-of-truth notes

- Readme highlights
  - Root README.md and backend/monolithic_app/README.md describe the consolidation of services into a monolith, the four logical domains, Supabase-backed DB separation, Celery usage, and Railway deployment.
  - For environment variables and detailed Railway setup, see RAILWAY_SETUP.md, RAILWAY_DEPLOYMENT.md, and backend/monolithic_app/.env.production.

- Important scripts/files
  - migrate_databases.py (root and backend/monolithic_app) orchestrates per-app migrations routed to the correct DB aliases; prefer the root version with schema-based SUPABASE_DATABASE_URL in settings.
  - test_build.py and test_deployment.py provide fast checks for build and deployment readiness.
  - backend/monolithic_app/railway.json defines the production startCommand used by Railway.
  - scripts/start_dev_environment.ps1|.sh spin up legacy microservices and the frontend for local multi-service testing.

## Environment configuration

- Monolith database configuration is driven by SUPABASE_DATABASE_URL (preferred) or per-domain URLs (USER_SERVICE_DATABASE_URL, CAUSE_SERVICE_DATABASE_URL, DONATION_SERVICE_DATABASE_URL, ADMIN_SERVICE_DATABASE_URL) for local/dev fallback.
- Required keys commonly referenced by settings and docs:
  - SECRET_KEY, DEBUG, ALLOWED_HOSTS
  - SUPABASE_DATABASE_URL (preferred for monolith), or per-service DATABASE_URLs as above
  - CELERY_BROKER_URL, CELERY_RESULT_BACKEND (Redis)
  - PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY
  - FRONTEND_URL (for CORS/CSRF)

## Gotchas

- If collectstatic fails during Docker build, the top-level Dockerfile is resilient (skips on failure). Locally, prefer dry-run first.
- When using schema-based SUPABASE_DATABASE_URL, ensure the search_path schemas exist (causehive_users, causehive_causes, causehive_donations, causehive_admin) and the DB user has privileges.
- test_deployment.py requires environment variables to be set; run it only after preparing a .env (see backend/monolithic_app/.env.production for a template).
- Frontend defaults to hitting http://localhost:8000; set REACT_APP_API_URL if the backend runs elsewhere.

