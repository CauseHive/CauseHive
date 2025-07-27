from django.urls import path

from .views import AuditLogViewSet

urlpatterns = [
    path('', AuditLogViewSet.as_view(), name='auditlog_list'),
]