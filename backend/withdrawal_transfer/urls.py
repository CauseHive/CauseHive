from django.urls import path
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
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


# Compatibility alias for frontend POST /withdrawals/request/
class WithdrawalRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        viewset = WithdrawalRequestViewSet.as_view({'post': 'create'})
        return viewset(request)


urlpatterns += [
    path('request/', WithdrawalRequestCreateView.as_view(), name='withdrawal_request_create'),
]