from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .serializers import AdminNotificationSerializer
from .models import AdminNotification

# Create your views here.
class AdminNotificationListView(generics.ListAPIView):
    queryset = AdminNotification.objects.all().order_by('-created_at')
    serializer_class = AdminNotificationSerializer
    permissions_classes = [permissions.IsAuthenticated]

class AdminNotificationMarkReadView(generics.UpdateAPIView):
    queryset = AdminNotification.objects.all()
    serializer_class = AdminNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response({"success": True, "message": "Notification marked as read"}, status=status.HTTP_200_OK)