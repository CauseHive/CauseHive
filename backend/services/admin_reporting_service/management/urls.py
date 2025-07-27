from django.urls import path
from .views import AdminCauseListView, AdminCauseStatusUpdateView

urlpatterns = [
    path('causes/', AdminCauseListView.as_view(), name='admin_cause_list'),
    path('causes/<uuid:cause_id>/status/', AdminCauseStatusUpdateView.as_view(), name='admin_cause_status_update'),
]