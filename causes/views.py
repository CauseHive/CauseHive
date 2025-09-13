from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Causes
from .permissions import IsAdminService
from .serializers import CausesSerializer


# Create your views here.
class CauseCreateView(generics.CreateAPIView):
    queryset = Causes.objects.all()
    serializer_class = CausesSerializer

class CauseListView(generics.ListAPIView):
    serializer_class = CausesSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Causes.objects.exclude(status__in=['under_review', 'rejected'])

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                return Response({"message": "There are no active causes to display.", "results": []}, status=status.HTTP_200_OK)
            return super().list(request, *args, **kwargs)
        except Exception as e:
            # Log the error and return a fallback response
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in CauseListView: {str(e)}")
            
            # Return empty results with error message
            return Response({
                "message": "Unable to load causes at this time.", 
                "results": [],
                "count": 0,
                "next": None,
                "previous": None
            }, status=status.HTTP_200_OK)

class CauseDetailView(generics.RetrieveAPIView):
    queryset = Causes.objects.all()
    serializer_class = CausesSerializer
    lookup_field = 'id'

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