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
    queryset = Donation.objects.select_related('user', 'cause').only('id', 'user_id', 'cause_id', 'amount', 'status', 'donated_at')
    serializer_class = DonationSerializer
    # Allow any user to view donations
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        user_id = getattr(request, 'user_id', None)
        data['user_id'] = user_id # Caters for anonymous donations

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=HTTP_201_CREATED)

    def get_queryset(self):
        user = self.request.user
        if user and hasattr(user, 'id') and user.is_authenticated:
            return Donation.objects.select_related('user', 'cause').only('id', 'user_id', 'cause_id', 'amount', 'status', 'donated_at').filter(user_id=user.id)
        # Anonymous users have no history
        return Donation.objects.none()

    @action(detail=False, methods=['get'])
    @method_decorator(cache_page(60))  # Cache statistics for 1 minute
    def statistics(self, request):
        queryset = self.get_queryset()
        total_donations = queryset.count()
        total_amount = queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        return Response({
            'total_amount': total_amount,
            'total_donations': total_donations,
        })

class AdminDonationListView(generics.ListAPIView):
    queryset = Donation.objects.select_related('user', 'cause').only('id', 'user_id', 'cause_id', 'amount', 'status', 'donated_at')
    serializer_class = DonationSerializer
    permission_classes = [IsAdminService]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_id', 'cause_id', 'status', 'donated_at']
    search_fields = ['user_id', 'cause__name', 'user__email', 'cause_id']
    ordering_fields = ['donated_at', 'amount']

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
