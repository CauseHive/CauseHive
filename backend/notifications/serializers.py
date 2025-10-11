from rest_framework import serializers

from .models import AdminNotification


class NotificationSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='notification_type', read_only=True)
    data = serializers.SerializerMethodField()

    class Meta:
        model = AdminNotification
        fields = [
            'id',
            'title',
            'message',
            'type',
            'priority',
            'is_read',
            'is_archived',
            'created_at',
            'read_at',
            'data',
        ]
        read_only_fields = fields

    def get_data(self, obj):
        payload = {}
        if obj.cause_id:
            payload['cause_id'] = str(obj.cause_id)
        if obj.donation_id:
            payload['donation_id'] = str(obj.donation_id)
        if obj.user_id:
            payload['user_id'] = str(obj.user_id)
        return payload or None
