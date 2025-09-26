from rest_framework import serializers
from .models import AdminNotification


class AdminNotificationSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='notification_type', read_only=True)

    class Meta:
        model = AdminNotification
        fields = [
            'id', 'title', 'message', 'type', 'priority', 'is_read', 'is_archived', 'created_at'
        ]
