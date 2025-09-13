from django.urls import path
from .views import (
    WithdrawalRequestViewSet,
    AdminWithdrawalRequestListView,
    AdminWithdrawalStatisticsView,
    RetryFailedWithdrawalView
)

urlpatterns = [
    path('admin/requests/', AdminWithdrawalRequestListView.as_view(), name='admin-withdrawal-list'),
    path('admin/statistics/', AdminWithdrawalStatisticsView.as_view(), name='admin-withdrawal-statistics'),
    path('admin/requests/<uuid:request_id>/retry/', RetryFailedWithdrawalView.as_view(), name='admin-withdrawal-retry'),
]