from rest_framework import serializers
from .models import WithdrawalRequest
from users_n_auth.models import User
from causes.models import Causes

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    cause_id = serializers.PrimaryKeyRelatedField(queryset=Causes.objects.all())
    payment_method = serializers.CharField(required=False, allow_blank=True)
    payment_details = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'user_id', 'cause_id', 'amount', 'currency', 'status',
            'payment_method', 'payment_details', 'transaction_id',
            'failure_reason', 'requested_at', 'completed_at'
        ]
        read_only_fields = ['id', 'status', 'transaction_id', 'failure_reason','requested_at', 'completed_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_payment_details(self, value):
        # Payment details are optional - will be populated from user profile if not provided
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Payment details must be a dictionary.")
        return value


class AdminWithdrawalRequestSerializer(serializers.ModelSerializer):
    """Serializer for admin withdrawal operations"""

    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'user_id', 'cause_id', 'amount', 'currency', 'status',
            'payment_method', 'payment_details', 'transaction_id',
            'failure_reason', 'requested_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'user_id', 'status', 'transaction_id', 'failure_reason', 'requested_at', 'completed_at'
        ]

class WithdrawalStatisticsSerializer(serializers.Serializer):
    """Serializer for withdrawal statistics"""
    total_withdrawals = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    completed_withdrawals = serializers.IntegerField()
    failed_withdrawals = serializers.IntegerField()
    processing_withdrawals = serializers.IntegerField()
    average_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    success_rate = serializers.FloatField()