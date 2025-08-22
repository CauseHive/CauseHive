"""
Django settings for causehive_monolith project.

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

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment variables setup
env = environ.Env()
env_file = BASE_DIR / ".env"
environ.Env.read_env(str(env_file))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY', default='django-insecure-build-time-key-replace-in-production')
ADMIN_SERVICE_API_KEY = env('ADMIN_SERVICE_API_KEY', default='admin-api-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=False)

# Railway deployment settings
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['127.0.0.1', 'localhost', '*.railway.app', 'causehive.tech', 'www.causehive.tech'])

# Frontend and external URLs
FRONTEND_URL = env('FRONTEND_URL', default='https://causehive.tech')

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
    'login': '5/m',
    'login_failed': '5/m',
    'signup': '3/h',
    'password_reset': '2/h',
}

# Application definition - Combined from all services
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
]

THIRD_PARTY_APPS = [
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
]

# Local apps from all services
LOCAL_APPS = [
    # User service apps
    'users_n_auth',
    
    # Cause service apps
    'causes',
    'categories',
    
    # Donation processing service apps
    'donations',
    'cart',
    'payments',
    'withdrawal_transfer',
    
    # Admin reporting service apps
    'admin_auth',
    'dashboard',
    'auditlog',
    'notifications',
    'management',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS + ['channels',]
ASGI_APPLICATION = 'causehive_monolith.asgi.application'
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

ROOT_URLCONF = 'causehive_monolith.urls'

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

WSGI_APPLICATION = 'causehive_monolith.wsgi.application'

# Database configuration with connection strings
DATABASES = {
    # Default -> user service
    'default': dj_database_url.parse(
        env('USER_SERVICE_DATABASE_URL', default='postgresql://user:pass@localhost:5432/user_db'),
        conn_max_age=600,
        conn_health_checks=True,
    ),
    # Causes
    'causes_db': dj_database_url.parse(
        env('CAUSE_SERVICE_DATABASE_URL', default='postgresql://user:pass@localhost:5432/cause_db'),
        conn_max_age=600,
        conn_health_checks=True,
    ),
    # Donations
    'donations_db': dj_database_url.parse(
        env('DONATION_SERVICE_DATABASE_URL', default='postgresql://user:pass@localhost:5432/donation_db'),
        conn_max_age=600,
        conn_health_checks=True,
    ),
    # Admin
    'admin_db': dj_database_url.parse(
        env('ADMIN_SERVICE_DATABASE_URL', default='postgresql://user:pass@localhost:5432/admin_db'),
        conn_max_age=600,
        conn_health_checks=True,
    ),
}

# Database routing configuration
DATABASE_ROUTERS = ['causehive_monolith.db_router.DatabaseRouter']

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

# Social Account Settings
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['email', 'profile'],
        'AUTH_PARAMS': {'access_type': 'offline'},
        'OAUTH_PKCE_ENABLED': True,
    }
}

# Celery Configuration for background tasks
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default='redis://localhost:6379/1')

# Celery beat schedule (from admin service)
CELERY_BEAT_SCHEDULE = {
    'aggregate-reports-every-hour': {
        'task': 'dashboard.tasks.generate_fresh_report',
        'schedule': 3600  # every hour
    },
    'poll-new-pending-causes-every-3-mins': {
        'task': 'dashboard.tasks.poll_new_pending_causes',
        'schedule': 180  # every 3 minutes
    }
}

# Paystack Configuration (for donations)
PAYSTACK_PUBLIC_KEY = env('PAYSTACK_PUBLIC_KEY', default='')
PAYSTACK_SECRET_KEY = env('PAYSTACK_SECRET_KEY', default='')
PAYSTACK_BASE_URL = "https://api.paystack.co"

# CORS settings for frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.causehive.tech",
    "https://causehive.tech",
]

# CORS settings for Railway deployment
CORS_ALLOW_CREDENTIALS = True

# CSRF trusted origins (include production domain)
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[
    'https://www.causehive.tech',
    'https://causehive.tech',
])

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

# Security settings for production
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_REDIRECT_EXEMPT = []
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
