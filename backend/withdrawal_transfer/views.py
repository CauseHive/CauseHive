from django.core.serializers import serialize
from django.db.models import Sum, Count, Avg
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator


from .models import WithdrawalRequest
from .serializers import (
    WithdrawalRequestSerializer,
    AdminWithdrawalRequestSerializer, WithdrawalStatisticsSerializer
)

from .permissions import IsAdminService
from .utils import validate_withdrawal_request
from .paystack_transfer import PaystackTransfer

class WithdrawalRequestViewSet(viewsets.ModelViewSet):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['transaction_id', 'cause_id']
    ordering_fields = ['requested_at', 'amount']

    def get_queryset(self):
        """Return only user's withdrawal requests."""
        if self.request.user.is_authenticated:
            return WithdrawalRequest.objects.only('id', 'user_id', 'cause_id', 'amount', 'status', 'requested_at', 'transaction_id').filter(user_id=self.request.user.id)
        return WithdrawalRequest.objects.none()

    def create(self, request, *args, **kwargs):
        """Create a withdrawal request with validation."""
        data = request.data.copy()
        user_id = request.user.id if request.user.is_authenticated else None

        if not user_id:
            return Response({"error": "User authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)

        data['user_id'] = user_id

        #validate withdrawal request
        try:
            validation_result = validate_withdrawal_request(
                user_id=data['user_id'],
                cause_id=data['cause_id'],
                amount=data['amount'],
                request=request
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Use the user's configured payment info from profile
        payment_info = validation_result['payment_info']
        data['payment_method'] = payment_info.get('payment_method')
        data['payment_details'] = payment_info

        # Create withdrawal request
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        withdrawal_request = serializer.save()

        # Initiate Paystack transfer asynchronously with Celery
        from .tasks import process_withdrawal_transfer
        process_withdrawal_transfer.delay(str(withdrawal_request.id))

        return Response(serializer.data, status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    @method_decorator(cache_page(60))  # Cache statistics for 1 minute
    def statistics(self, request):
        """Get withdrawal statistics."""
        queryset = self.get_queryset()
        total_withdrawals = queryset.count()
        total_amount = queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        completed_withdrawals = queryset.filter(status='completed').count()

        return Response({
            'total_withdrawals': total_withdrawals,
            'total_amount': total_amount,
            'completed_withdrawals': completed_withdrawals
        })

class AdminWithdrawalRequestListView(generics.ListAPIView):
    """Admin view for listing all withdrawal requests."""
    queryset = WithdrawalRequest.objects.only('id', 'user_id', 'cause_id', 'amount', 'status', 'requested_at', 'transaction_id')
    serializer_class = AdminWithdrawalRequestSerializer
    permission_classes = [IsAdminService]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['transaction_id', 'user_id', 'cause_id']
    ordering_fields = ['requested_at', 'amount', 'status']

class AdminWithdrawalStatisticsView(APIView):
    """Admin view for withdrawal statistics."""
    permission_classes = [IsAdminService]

    @method_decorator(cache_page(60))  # Cache for 1 minute
    def get(self, request):
        queryset = WithdrawalRequest.objects.all()

        total_withdrawals = queryset.count()
        total_amount = queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        completed_withdrawals = queryset.filter(status='completed').count()
        failed_withdrawals = queryset.filter(status='failed').count()
        processing_withdrawals = queryset.filter(status='processing').count()
        average_amount = queryset.aggregate(Avg('amount'))['amount__avg'] or 0

        success_rate = 0
        if total_withdrawals > 0:
            success_rate = (completed_withdrawals / total_withdrawals) * 100

        data = {
            'total_withdrawals': total_withdrawals,
            'total_amount': total_amount,
            'completed_withdrawals': completed_withdrawals,
            'failed_withdrawals': failed_withdrawals,
            'processing_withdrawals': processing_withdrawals,
            'average_amount': average_amount,
            'success_rate': success_rate
        }

        serializer = WithdrawalStatisticsSerializer(data)
        return Response(serializer.data)

class RetryFailedWithdrawalView(APIView):
    """Admin view to retry failed withdrawals."""
    permission_classes = [IsAdminService]

    def put(self, request, withdrawal_id):
        try:
            withdrawal_request = WithdrawalRequest.objects.get(id=withdrawal_id, status='failed')
        except WithdrawalRequest.DoesNotExist:
            return Response({
                "error": "Withdrawal request not found or not failed."
            }, status=status.HTTP_404_NOT_FOUND)

        # Reset the status to processing
        withdrawal_request.status = 'processing'
        withdrawal_request.failure_reason = None
        withdrawal_request.save()

        # Retry the transfer
        transfer_result = PaystackTransfer.initiate_transfer(withdrawal_request)

        if not transfer_result.get('status'):
            withdrawal_request.mark_as_failed(transfer_result.get('message'))
            return Response({
                'error': 'Retry failed', 'details': transfer_result.get('message')
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update with new transaction ID
        withdrawal_request.transaction_id = transfer_result['data']['reference']
        withdrawal_request.save()

        serializer = AdminWithdrawalRequestSerializer(withdrawal_request)
        return Response(serializer.data, status=status.HTTP_200_OK)