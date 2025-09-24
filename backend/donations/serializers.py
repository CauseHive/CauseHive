from rest_framework import serializers
from .models import Donation
from users_n_auth.models import User
from causes.models import Causes

class DonationSerializer(serializers.ModelSerializer):
    # Nested serializers for better API responses
    cause = serializers.SerializerMethodField()
    donor = serializers.SerializerMethodField()
    recipient = serializers.SerializerMethodField()
    
    class Meta:
        model = Donation
        fields = [
            'id', 'amount', 'currency', 'status', 'donated_at', 
            'transaction_id', 'cause', 'donor', 'recipient'
        ]
        read_only_fields = ['id', 'donated_at', 'status', 'transaction_id', 'currency']

    def get_cause(self, obj):
        """Return cause details"""
        if obj.cause_id:
            return {
                'id': str(obj.cause_id.id),
                'title': obj.cause_id.name,
                'creator': {
                    'id': str(obj.cause_id.organizer_id.id),
                    'full_name': obj.cause_id.organizer_id.get_full_name(),
                }
            }
        return None

    def get_donor(self, obj):
        """Return donor details"""
        if obj.user_id:
            return {
                'id': str(obj.user_id.id),
                'full_name': obj.user_id.get_full_name(),
                'email': obj.user_id.email,
            }
        return None

    def get_recipient(self, obj):
        """Return recipient details"""
        if obj.recipient_id:
            return {
                'id': str(obj.recipient_id.id),
                'full_name': obj.recipient_id.get_full_name(),
            }
        return None

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Donation amount must be greater than zero.')
        return value

    def create(self, validated_data):
        # The user_id and recipient_id are set in the view
        return super().create(validated_data)