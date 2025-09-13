from django.urls import path
from .views import AdminDonationListView, AdminDonationStatisticsView

urlpatterns = [
    # path('admin/donations/', AdminDonationListView.as_view(), name='admin-donation-list'),
    # path('admin/donations/statistics/', AdminDonationStatisticsView.as_view(), name='admin-donation-statistics'),
]