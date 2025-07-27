from rest_framework import serializers

class CauseStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["approved", "rejected", "under_review", "upcoming", "ongoing", "completed", "cancelled"])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)