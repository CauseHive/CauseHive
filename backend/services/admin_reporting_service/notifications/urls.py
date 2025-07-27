from django.urls import path

from .views import AdminNotificationListView, AdminNotificationMarkReadView

urlpatterns = [
    path('', AdminNotificationListView.as_view(), name='admin_notification_list'),
    path('<uuid:id>/mark-read/', AdminNotificationMarkReadView.as_view(), name='admin_notification_mark_read'),
]