from .views import PaystackWebhookView, InitiatePaymentView, VerifyPaymentView, AdminPaymentTransactionListView
from django.urls import path

urlpatterns = [
    path('webhook/', PaystackWebhookView.as_view(), name='paystack_webhook'),
    path('initiate/', InitiatePaymentView.as_view(), name='initiate_payment'),
    # Compatibility alias for frontend expecting 'initialize'
    path('initialize/', InitiatePaymentView.as_view(), name='initialize_payment'),
    path('verify/<str:reference>/', VerifyPaymentView.as_view(), name='verify_payment'),
    # path('admin/transactions/', AdminPaymentTransactionListView.as_view(), name='admin_payment_transaction_list'),
]