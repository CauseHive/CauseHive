from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from .models import Causes
from .permissions import IsAdminService
from .serializers import CausesSerializer


# Create your views here.
class CauseCreateView(generics.CreateAPIView):
    queryset = Causes.objects.all()
    serializer_class = CausesSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Automatically set the organizer to the current authenticated user
        serializer.save(organizer_id=self.request.user)

class CauseListView(generics.ListAPIView):
    serializer_class = CausesSerializer
    permission_classes = [AllowAny]

    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        # Optimize queryset: select_related/prefetch_related if organizer/category exist
        return Causes.objects.exclude(status__in=['under_review', 'rejected']) \
            .select_related('organizer_id') \
            .only('id', 'name', 'description', 'category', 'organizer_id', 'status', 'created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"message": "There are no active causes to display.", "results": []}, status=status.HTTP_200_OK)
        return super().list(request, *args, **kwargs)

class CauseDetailView(generics.RetrieveAPIView):
    queryset = Causes.objects.select_related('organizer_id').only('id', 'title', 'description', 'category', 'organizer_id', 'status', 'created_at')
    serializer_class = CausesSerializer
    lookup_field = 'id'

    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

class CauseDeleteView(generics.DestroyAPIView):
    queryset = Causes.objects.all()
    serializer_class = CausesSerializer
    lookup_field = 'id'  # Assuming you want to delete by 'id'

class AdminCauseListView(generics.ListAPIView):
    queryset = Causes.objects.all()
    serializer_class = CausesSerializer
    permission_classes = [IsAdminService]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'created_at', 'organizer_id']
    search_fields = ['title', 'category', 'description']
    ordering_fields = ['created_at', 'title']

class AdminCauseUpdateView(generics.UpdateAPIView):
    queryset = Causes.objects.all()
    serializer_class = CausesSerializer
    permission_classes = [IsAdminService]
    lookup_field = 'id'

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'rejected' and instance.rejection_reason:
            # Send notification to the organizer
            pass
        if instance.status == 'approved':
            instance.status = 'ongoing'
            instance.save()
            # Send notification to the organizer about approval

class AdminCauseApproveView(generics.UpdateAPIView):
    permission_classes = [IsAdminService]

    def post(self, request, id):
        try:
            cause = Causes.objects.get(id=id)
            cause.status = 'approved'
            cause.save()
            return Response({'status': 'approved'})
        except Causes.DoesNotExist:
            return Response({'error': 'Cause not found'}, status=404)

# Ensure status, organizer_id, and category fields are indexed in the Causes model for optimal performance.
