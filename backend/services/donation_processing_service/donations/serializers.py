from rest_framework import serializers
from .models import Donation
from .utils import validate_cause_with_service, validate_user_id_with_service
class DonationSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(required=False, allow_null=True)
    cause_id = serializers.UUIDField(required=True)

    class Meta:
        model = Donation
        fields = ['id', 'user_id', 'amount', 'cause_id', 'donated_at']
        read_only_fields = ['id', 'donated_at', 'status']

    def validate_user_id(self, value):
        if value is not None and not validate_user_id_with_service(value):
            raise serializers.ValidationError('User id is not valid.')
        return value

    def validate_cause_id(self, value):
        if not validate_cause_with_service(value):
            raise serializers.ValidationError('Cause id is not valid.')
        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Donation amount must be greater than zero.')
        return value