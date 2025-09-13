from rest_framework import serializers
from .models import Donation
from users_n_auth.models import User
from causes.models import Causes
class DonationSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    cause_id = serializers.PrimaryKeyRelatedField(queryset=Causes.objects.all(), required=True)
    recipient_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)

    class Meta:
        model = Donation
        fields = ['id', 'user_id', 'amount', 'cause_id', 'recipient_id', 'donated_at']
        read_only_fields = ['id', 'donated_at', 'status']

    def validate_user_id(self, value):
        if value is not None and not User.objects.filter(id=value.id, is_active=True).exists():
            raise serializers.ValidationError('User id is not valid.')
        return value

    def validate_cause_id(self, value):
        if not Causes.objects.filter(id=value.id).exists():
            raise serializers.ValidationError('Cause id is not valid.')
        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Donation amount must be greater than zero.')
        return value