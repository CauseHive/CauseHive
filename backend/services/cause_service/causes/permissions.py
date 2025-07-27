from rest_framework.permissions import BasePermission
from django.conf import settings

class IsAdminService(BasePermission):
    """
    Allows access only to requests from the admin service.
    """
    def has_permission(self, request, view):
        api_key = request.headers.get('X-ADMIN-SERVICE-API-KEY')
        return api_key == getattr(settings, 'ADMIN_SERVICE_API_KEY', None)