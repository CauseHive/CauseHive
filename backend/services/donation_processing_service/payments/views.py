from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, generics
from rest_framework.views import APIView
from donations.tasks import publish_donation_completed_event

from .models import PaymentTransaction
from .paystack import Paystack
from .serializers import PaymentTransactionSerializer
from .permissions import IsAdminService

# Create your views here.
class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.AllowAny]


class InitiatePaymentView(APIView):
    def post(self, request):
        email = request.data.get('email')
        amount = request.data.get('amount')
        user_id = request.data.get('user_id')
        donation_id = request.data.get('donation_id')

        if not all([email, amount, user_id, donation_id]):
            return Response({'error': 'Email, amount, user_id, and donation_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        paystack_response = Paystack.initialize_payment(email, amount)
        if paystack_response['status']:
            data = paystack_response['data']

            PaymentTransaction.objects.create(
                transaction_id=data['reference'],
                amount=amount,
                currency=data['currency'],
                email=email,
                user_id=user_id,
                donation_id=donation_id,
                status='pending',
                payment_method='Paystack'
            )
            return Response({'authorization_url': data['authorization_url']})
        return Response({'error': paystack_response['message']}, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(APIView):
    def get(self, request, reference):
        paystack_response = Paystack.verify_payment(reference)
        if paystack_response['status']:
            data = paystack_response['data']
            try:
                payment = PaymentTransaction.objects.get(transaction_id=reference)
                if data['status'] == 'success':
                    payment.status = 'completed'
                    payment.save()

                    if payment.donation:
                        payment.donation.status = 'completed'
                        payment.donation.save()
                        publish_donation_completed_event.delay(payment.donation.cause_id, payment.donation.amount)

                    # Might send confirmation mails here. Later. ✨

                    return Response({'message': 'Payment verified and updated successfully'}, status=status.HTTP_200_OK)
                else:
                    payment.status = data['status']
                    payment.save()
                    return Response({'error': 'Payment not successful'}, status=status.HTTP_400_BAD_REQUEST)

            except PaymentTransaction.DoesNotExist:
                return Response({'error': 'Payment not successful'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': paystack_response['message']}, status=status.HTTP_400_BAD_REQUEST)



class PaystackWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        event = request.data('event')
        data = request.data('data', {})
        reference = data.get('reference')

        if not reference:
            return Response({'error': 'Reference not provided'}, status=status.HTTP_400_BAD_REQUEST)

        verification = Paystack.verify_payment(reference)
        if not verification.get('status'):
            return Response({'error': verification.get('message', 'Verification failed')}, status=status.HTTP_400_BAD_REQUEST)

        payment_status = verification['data']['status']

        try:
            payment = PaymentTransaction.objects.get(transaction_id=reference)
            if payment_status == 'success':
                payment.status = 'completed'

                if payment.donation:
                    payment.donation.status = 'completed'
                    payment.donation.save()
                    publish_donation_completed_event.delay(payment.donation.cause_id, payment.donation.amount)

            elif payment_status == 'failed':
                payment.status = 'failed'

                if payment.donation:
                    payment.donation.status = 'failed'
                    payment.donation.save()
            else:
                payment.status = payment_status
            payment.save()
        except PaymentTransaction.DoesNotExist:
            return Response({'error': 'Payment record not found'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class AdminPaymentTransactionListView(generics.ListAPIView):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAdminService]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'transaction_date', 'user_id']
    search_fields = ['transaction_id', 'email']
    ordering_fields = ['transaction_date', 'amount']