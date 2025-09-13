"""
URL configuration for causehive_monolith project.

This combines URLs from all microservices:
- User Service: /api/user/
- Cause Service: /api/causes/
- Donation Processing Service: /api/donations/, /api/payments/, /api/cart/, /api/withdrawals/
- Admin Reporting Service: /api/admin/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .health_views import health_check, readiness_check
from rest_framework.routers import DefaultRouter

# Import viewsets for API router - handle gracefully if not available
DonationViewSet = None
PaymentTransactionViewSet = None
WithdrawalRequestViewSet = None

try:
    from donations.views import DonationViewSet
except ImportError:
    pass

try:
    from payments.views import PaymentTransactionViewSet
except ImportError:
    pass

try:
    from withdrawal_transfer.views import WithdrawalRequestViewSet
except ImportError:
    pass

# Create API router for RESTful endpoints
router = DefaultRouter()

# Add donation service routes if available
if DonationViewSet:
    router.register(r'donations', DonationViewSet)
if PaymentTransactionViewSet:
    router.register(r'payments', PaymentTransactionViewSet, basename='paymenttransaction')
if WithdrawalRequestViewSet:
    router.register(r'withdrawals', WithdrawalRequestViewSet, basename='withdrawalrequest')

urlpatterns = [
    # Health check endpoints for Railway
    path('api/health/', health_check, name='health_check'),
    path('api/ready/', readiness_check, name='readiness_check'),
    
    # Django admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    
    # User service endpoints
    path('api/user/', include('users_n_auth.urls')),
    path('api/user/accounts/', include('allauth.urls')),
    
    # Cause service endpoints
    path('api/causes/', include('causes.urls')),
    
    # Donation processing service endpoints
    path('api/donations/', include('donations.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/withdrawals/', include('withdrawal_transfer.urls')),
    
    # Admin reporting service endpoints
    path('api/admin/', include('admin_auth.urls')),
    path('api/admin/auditlog/', include('auditlog.urls')),
    path('api/admin/dashboard/', include('dashboard.urls')),
    path('api/admin/management/', include('management.urls')),
    path('api/admin/notifications/', include('notifications.urls')),
    
    # Blog/Content endpoints
    path('api/', include('blog.urls')),
    path('api/', include('newsletter.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
