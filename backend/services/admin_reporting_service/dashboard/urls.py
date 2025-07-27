from django.urls import path
from .views import DashboardMetricsView, AdminCausesListView, AdminPaymentsListView, AdminDonationsListView, \
    RefreshReportView, AdminUserListView

urlpatterns = [
    path('metrics/', DashboardMetricsView.as_view(), name='dashboard_metrics'),
    path('users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('donations/', AdminDonationsListView.as_view(), name='admin_donations_list'),
    path('causes/', AdminCausesListView.as_view(), name='admin_causes_list'),
    path('payments/', AdminPaymentsListView.as_view(), name='admin_payments_list'),
    path('refresh/', RefreshReportView.as_view(), name='dashboard_refresh'),
]