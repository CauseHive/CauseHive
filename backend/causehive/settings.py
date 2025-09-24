"""
Django settings for causehive project.

This monolithic application combines all CauseHive microservices:
- User Service
- Cause Service  
- Donation Processing Service
- Admin Reporting Service

Each service maintains its own Supabase database while sharing the same application.
"""

import os
from pathlib import Path
from datetime import timedelta
import environ
import dj_database_url
from django.core.exceptions import ImproperlyConfigured
try:
    from corsheaders.defaults import default_headers  # type: ignore
except Exception:
    default_headers = None

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment variables setup
env = environ.Env()
env_file = BASE_DIR / ".env"
environ.Env.read_env(str(env_file))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')
# ADMIN_SERVICE_API_KEY = env('ADMIN_SERVICE_API_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=True)

# Railway deployment settings
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[
    '127.0.0.1',
    'localhost',
    '*.railway.app',
    'causehive.tech',
    'www.causehive.tech',
    'causehive-monolithic-production.up.railway.app',
])

# Frontend and external URLs
FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:5173')
BACKEND_URL = env('BACKEND_URL', default='http://localhost:8000')

REDIS_HOST = env('REDIS_HOST', default='localhost')
REDIS_PORT = env('REDIS_PORT', default=6379)

# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f'redis://{REDIS_HOST}:{REDIS_PORT}/2',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'causehive',
        'TIMEOUT': 300,  # 5 minutes default
    }
}

# Session storage in Redis
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# # Service URLs for microservice communication
# CAUSE_SERVICE_URL = env('CAUSE_SERVICE_URL', default='http://localhost:8001')

# Payment service configuration
PAYSTACK_BASE_URL = env('PAYSTACK_BASE_URL', default='https://api.paystack.co')
PAYSTACK_SECRET_KEY = env('PAYSTACK_SECRET_KEY')

# User and authentication settings
AUTH_USER_MODEL = 'users_n_auth.User'

# Account settings for allauth
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']
EMAIL_VERIFICATION = 'optional'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3
ACCOUNT_LOGOUT_ON_PASSWORD_CHANGE = True
ACCOUNT_SESSION_REMEMBER = True

# Rate limiting settings
ACCOUNT_RATE_LIMITS = {
    'login': '5/h',
    'login_failed': '5/m',
    'signup': '3/h',
    'password_reset': '2/h',
}

# Application definition - Combined from all services

INSTALLED_APPS = [

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.humanize',

    'django_extensions',
    'django_filters',

    # CORS headers
    'corsheaders',

    # Authentication apps
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    # REST Framework
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

    # Registration
    'dj_rest_auth.registration',

    # Background tasks
    'celery',

    # Static files
    'whitenoise',

    'users_n_auth',

    'causes',
    'categories',

    'donations',
    'cart',
    'payments',
    'withdrawal_transfer',
    'notifications',

    'channels',

]


ASGI_APPLICATION = 'causehive.asgi.application'
# Django sites framework
SITE_ID = 1

# Middleware
MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'causehive.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'causehive.wsgi.application'


DATABASES = {
    'default': {
        **dj_database_url.parse(env('DATABASE_URL')),
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 300,  # Keep connections alive for 5 minutes (Supabase optimized)
        'OPTIONS': {
            'connect_timeout': 30,  # Longer timeout for Supabase
            'options': '-c default_transaction_isolation=read_committed -c statement_timeout=30000 -c idle_in_transaction_session_timeout=300000'
        }
    }
}
# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# Database routing configuration
# DATABASE_ROUTERS = ['causehive.db_router.DatabaseRouter']

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '5/minute',
        'user': '10/minute',
        'admin_action': '20/minute',
        'password_reset': '3/hour',
    },
    'USER_ID_FIELD': 'id',
}

# JWT Configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "TOKEN_TYPE_CLAIM": "token_type",
    "AUTH_TOKEN_CLASSES": ('rest_framework_simplejwt.tokens.AccessToken',),
}

# Google OAuth credentials
GOOGLE_OAUTH2_CLIENT_ID = env('GOOGLE_OAUTH2_CLIENT_ID', default='set_the_client_id_dumbo')
GOOGLE_OAUTH2_SECRET = env('GOOGLE_OAUTH2_SECRET', default='set_the_secrett_dumbo')

# Social Account Settings
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['email', 'profile'],
        'AUTH_PARAMS': {'access_type': 'offline'},
        'OAUTH_PKCE_ENABLED': True,
        'APP': {
            'client_id': GOOGLE_OAUTH2_CLIENT_ID,
            'secret': GOOGLE_OAUTH2_SECRET,
        }
    }
}

LOGIN_URL = '/api/user/login/'
LOGOUT_URL = '/api/user/logout/'
LOGIN_REDIRECT_URL = '/api/user/profile/'
ACCOUNT_LOGOUT_REDIRECT_URL = '/api/user/logout/'


# Email Backend Settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.zoho.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = f"CauseHive <{EMAIL_HOST_USER}>"
SUPPORT_EMAIL = env("SUPPORT_EMAIL")


# Celery Configuration for background tasks
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default='redis://localhost:6379/1')

# Celery beat schedule
CELERY_BEAT_SCHEDULE = {
    'verify-pending-withdrawals': {
        'task': 'withdrawal_transfer.tasks.verify_pending_withdrawals',
        'schedule': 60.0,  # Run every 60 seconds
    },
}

# Paystack Configuration (for donations)
PAYSTACK_PUBLIC_KEY = env('PAYSTACK_PUBLIC_KEY', default='')

# CORS settings for frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://causehive.tech",
    "https://causehive.app"
]

# Include production frontend/backend origins if provided
if FRONTEND_URL and FRONTEND_URL not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL)
if BACKEND_URL and BACKEND_URL not in CORS_ALLOWED_ORIGINS and BACKEND_URL.startswith('http'):
    # Allow same-origin API calls from the backend host if needed (e.g., admin tools)
    CORS_ALLOWED_ORIGINS.append(BACKEND_URL)

# Production frontend hosts (Netlify / custom domain)
PROD_FRONTEND_HOSTS = [
    'https://causehive.tech',
    'https://www.causehive.tech',
    'https://causehive.app',
    'https://www.causehive.app',
]
for origin in PROD_FRONTEND_HOSTS:
    if origin not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(origin)

# Railway backend host placeholder - replace with your actual Railway app host in Railway env
RAILWAY_BACKEND_HOST = env('RAILWAY_BACKEND_HOST', default='https://causehive-monolithic-production.up.railway.app')
if RAILWAY_BACKEND_HOST not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(RAILWAY_BACKEND_HOST)

# Common production domains (scheme required by Django for CSRF)
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[
    'https://causehive.tech',
    'https://www.causehive.tech',
    'https://causehive.app',
    'https://www.causehive.app',
    'https://causehive-monolithic-production.up.railway.app',
])

# CORS settings for Railway deployment
CORS_ALLOW_CREDENTIALS = True

# Allow common headers for cross-origin requests
CORS_ALLOW_HEADERS = list(default_headers) if default_headers is not None else [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Database performance optimizations
DATABASE_ROUTERS = []
DATABASE_APPS_MAPPING = {}

# Supabase-specific optimizations
DATABASES['default']['CONN_MAX_AGE'] = 600  # 10 minutes for Supabase (keep connections longer)
DATABASES['default']['CONN_HEALTH_CHECKS'] = True  # Enable connection health checks

# Force connection reuse
DATABASES['default']['ATOMIC_REQUESTS'] = False  # Disable atomic requests for better performance

# Additional Supabase optimizations
DATABASES['default']['OPTIONS'].update({
    'sslmode': 'require',  # Ensure SSL for Supabase
    'application_name': 'causehive_backend',  # Help with connection tracking
    'connect_timeout': 30,
    'options': '-c default_transaction_isolation=read_committed -c statement_timeout=30000 -c idle_in_transaction_session_timeout=300000 -c tcp_keepalives_idle=600 -c tcp_keepalives_interval=30 -c tcp_keepalives_count=3'
})

# Logging configuration for Railway
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# # Disable database query logging in production for performance
# if not DEBUG:
#     LOGGING['loggers']['django.db.backends'] = {
#         'handlers': ['console'],
#         'level': 'WARNING',
#         'propagate': False,
#     }

# Security settings for production
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_PRELOAD = True
    SECURE_REDIRECT_EXEMPT = []
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
else:
    # Development mode - disable HTTPS redirects and HSTS
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_HSTS_SECONDS = 0  # Disable HSTS in development
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False
    SECURE_PROXY_SSL_HEADER = None

# Ensure per-alias search_path is applied on each DB connection
# This registers a signal handler to SET search_path at runtime