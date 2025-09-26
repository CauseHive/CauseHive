from django.urls import path
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination

from .models import AdminNotification
from .serializers import AdminNotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            unread_only = request.query_params.get('unread_only') in {True, 'true', '1', 'True'}
            qs = AdminNotification.objects.all()
            # Scope notifications: those for the user or global (user is null)
            qs = qs.filter(user=request.user) | qs.filter(user__isnull=True)
            if unread_only:
                qs = qs.filter(is_read=False)
            paginator = NotificationPagination()
            page = paginator.paginate_queryset(qs.order_by('-created_at'), request)
            serializer = AdminNotificationSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({'count': 0, 'next': None, 'previous': None, 'results': [], 'error': str(e)})


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            # Only allow marking notifications belonging to the user or global ones
            n = AdminNotification.objects.filter(id=id).filter(user=request.user) | AdminNotification.objects.filter(id=id, user__isnull=True)
            n = n.first()
            if not n:
                return Response({'error': 'Notification not found'}, status=404)
            if not n.is_read:
                n.is_read = True
                n.read_at = timezone.now()
                n.save()
            return Response({'status': 'ok'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            qs = AdminNotification.objects.all()
            qs = qs.filter(user=request.user) | qs.filter(user__isnull=True)
            qs.filter(is_read=False).update(is_read=True, read_at=timezone.now())
            return Response({'status': 'ok'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)


urlpatterns = [
    path('', NotificationListView.as_view(), name='notifications_list'),
    path('<int:id>/read/', NotificationMarkReadView.as_view(), name='notifications_mark_read'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='notifications_mark_all_read'),
]
