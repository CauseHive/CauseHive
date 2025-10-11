from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AdminNotification
from .serializers import NotificationSerializer

class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination

    def get_queryset(self):
        user = self.request.user
        queryset = AdminNotification.objects.filter(
            Q(user=user) | Q(user__isnull=True),
            is_archived=False,
        ).order_by('-created_at')

        unread_only = self.request.query_params.get('unread_only')
        if unread_only is not None and str(unread_only).lower() in {'1', 'true', 'yes'}:
            queryset = queryset.filter(is_read=False)

        return queryset


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk: int, *args, **kwargs):
        notification = get_object_or_404(
            AdminNotification,
            pk=pk,
            is_archived=False,
        )

        if notification.user and notification.user != request.user and not request.user.is_staff:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=['is_read', 'read_at'])

        serializer = NotificationSerializer(notification)
        return Response({'message': 'Notification marked as read.', 'notification': serializer.data}, status=status.HTTP_200_OK)


class NotificationMarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        updated = AdminNotification.objects.filter(
            Q(user=request.user) | Q(user__isnull=True),
            is_archived=False,
            is_read=False,
        ).update(is_read=True, read_at=timezone.now())

        return Response({'message': 'Notifications marked as read.', 'updated_count': updated}, status=status.HTTP_200_OK)
