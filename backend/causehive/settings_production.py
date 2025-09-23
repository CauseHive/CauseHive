"""
Production-ready environment configuration for CauseHive backend.

This file contains settings and utilities for managing production deployments.
"""

import os
from .settings import *

# Override DEBUG for production
DEBUG = False

# Production-specific allowed hosts
ALLOWED_HOSTS = [
    'causehive.tech',
    'www.causehive.tech',
    'causehive-monolithic-production.up.railway.app',
    '*.railway.app',
]

# Enhanced security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Session security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

# Update logging for production
LOGGING['handlers']['error_file'] = {
    'class': 'logging.handlers.RotatingFileHandler',
    'filename': '/tmp/causehive_error.log',
    'maxBytes': 1024*1024*5,  # 5 MB
    'backupCount': 5,
    'formatter': 'verbose',
    'level': 'ERROR',
}

LOGGING['loggers']['causehive']['handlers'] = ['console', 'error_file']
LOGGING['loggers']['causehive']['level'] = 'INFO'

# Disable query logging in production
LOGGING['loggers']['django.db.backends'] = {
    'handlers': ['console'],
    'level': 'WARNING',
    'propagate': False,
}

# Static files optimization
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Email configuration for error notifications
if os.environ.get('EMAIL_HOST'):
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() == 'true'
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
    DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@causehive.tech')
    
    # Email error notifications
    ADMINS = [
        ('CauseHive Admin', os.environ.get('ADMIN_EMAIL', 'admin@causehive.tech')),
    ]
    
    # Add email handler for critical errors
    LOGGING['handlers']['mail_admins'] = {
        'class': 'django.utils.log.AdminEmailHandler',
        'level': 'ERROR',
        'formatter': 'verbose',
    }
    
    LOGGING['loggers']['causehive']['handlers'].append('mail_admins')

print("🚀 Production settings loaded - DEBUG=False, Enhanced security enabled")