from django.db.models import Sum, Count
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.status import HTTP_201_CREATED
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView

from .permissions import IsAdminService
from .models import Donation
from .serializers import DonationSerializer

class DonationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Create your views here.
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()  # Base queryset for router
    serializer_class = DonationSerializer
<<<<<<< HEAD:backend/monolithic_app/donations/views.py
    pagination_class = DonationPagination
    # Allow any user to view donations
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
=======
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = DonationPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'cause_id']
    search_fields = ['cause_id__name']
    ordering_fields = ['donated_at', 'amount']
    ordering = ['-donated_at']

    def get_queryset(self):
        """
        Return only donations made by the authenticated user
        """
        if self.request.user.is_authenticated:
            return Donation.objects.select_related('user_id', 'cause_id', 'recipient_id').filter(
                user_id=self.request.user.id
            )
        return Donation.objects.none()
>>>>>>> 7eb695c02e4e74012421654c5943d53b9cb98af9:backend/donations/views.py

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # Set the user_id to the authenticated user
        data['user_id'] = request.user.id
        # Set recipient_id to the cause organizer
        cause_id = data.get('cause_id')
        if cause_id:
            from causes.models import Causes
            try:
                cause = Causes.objects.get(id=cause_id)
                data['recipient_id'] = cause.organizer_id.id
            except Causes.DoesNotExist:
                return Response({'error': 'Cause not found'}, status=400)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=HTTP_201_CREATED)

<<<<<<< HEAD:backend/monolithic_app/donations/views.py
    def get_queryset(self):
        user = self.request.user
        if user and hasattr(user, 'id') and user.is_authenticated:
            # For authenticated users, return their donations
            return Donation.objects.filter(user_id=user.id)
        else:
            # For anonymous users, return recent public donations (limited for privacy)
            return Donation.objects.filter(status='completed').order_by('-donated_at')[:50]

=======
>>>>>>> 7eb695c02e4e74012421654c5943d53b9cb98af9:backend/donations/views.py
    @action(detail=False, methods=['get'])
    @method_decorator(cache_page(60))  # Cache statistics for 1 minute
    def statistics(self, request):
        user = self.request.user
        if user and hasattr(user, 'id') and user.is_authenticated:
            queryset = Donation.objects.filter(user_id=user.id)
        else:
            queryset = Donation.objects.filter(status='completed')
        
        total_donations = queryset.count()
        total_amount = queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        return Response({
            'total_amount': total_amount,
            'total_donations': total_donations,
        })

class AdminDonationListView(generics.ListAPIView):
    queryset = Donation.objects.select_related('user_id', 'cause_id', 'recipient_id').all()
    serializer_class = DonationSerializer
    permission_classes = [IsAdminService]
    pagination_class = DonationPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_id', 'cause_id', 'status', 'donated_at']
    search_fields = ['user_id__email', 'cause_id__name', 'transaction_id']
    ordering_fields = ['donated_at', 'amount']
    ordering = ['-donated_at']

class AdminDonationStatisticsView(APIView):
    permission_classes = [IsAdminService]

    def get(self, request):
        total_donations = Donation.objects.count()
        total_amount = Donation.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        total_users = Donation.objects.values('user_id').distinct().count()
        total_causes = Donation.objects.values('cause_id').distinct().count()

        return Response({
            'total_donations': total_donations,
            'total_amount': total_amount,
            'total_users': total_users,
            'total_causes': total_causes,
        })
