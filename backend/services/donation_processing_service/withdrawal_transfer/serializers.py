from rest_framework import serializers
from .models import WithdrawalRequest

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(required=True)
    cause_id = serializers.UUIDField(required=True)

    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'user_id', 'cause_id', 'amount', 'currency', 'status',
            'payment_method', 'payment_details', 'transaction_id',
            'failure_reason', 'requested_at', 'completed_at'
        ]
        read_only_fields = ['id', 'user_id', 'status', 'transaction_id', 'failure_reason','requested_at', 'completed_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_payment_details(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Payment details must be a dictionary.")
        
        payment_method = self.initial_data.get('payment_method')
        if payment_method == 'bank_transfer':
            required_fields = ['account_number', 'bank_code', 'account_name']
        elif payment_method == 'mobile_money':
            required_fields = ['phone_number', 'provider']
        else:
            required_fields = ['recipient_code'] # For Paystack

        missing_fields = [field for field in required_fields if field not in value]
        if missing_fields:
            raise serializers.ValidationError(f"Missing required payment details for {payment_method}: {missing_fields}")
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
            'id', 'user_id', 'cause_id', 'amount', 'currency', 'payment_method',
            'payment_details', 'requested_at'
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