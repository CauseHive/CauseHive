from rest_framework import serializers
from causes.models import Causes
from users_n_auth.models import User

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    cause_id = serializers.UUIDField()  # Change to UUIDField
    amount = serializers.DecimalField(source='donation_amount', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cause_id', 'donation_amount', 'quantity', 'amount']
        read_only_fields = ['id']
        extra_kwargs = {
            'cart': {'read_only': True},
            'quantity': {'required': False, 'default': 1},
        }

    def validate_cause_id(self, value):
        try:
            cause = Causes.objects.get(id=value)
            return value  # Return the UUID, not the cause object
        except Causes.DoesNotExist:
            raise serializers.ValidationError('Cause not found')

    def create(self, validated_data):
        # Ensure we're passing the UUID to create
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Map nested cause fields expected by frontend
        try:
            from causes.models import Causes
            cause = Causes.objects.only('id', 'name', 'cover_image').get(id=instance.cause_id)
            data['cause'] = {
                'id': str(cause.id),
                'title': cause.name,
                'featured_image': cause.cover_image.url if cause.cover_image else None,
            }
        except Exception:
            data['cause'] = {
                'id': str(instance.cause_id),
                'title': '',
                'featured_image': None,
            }
        # Ensure 'amount' key is present
        data['amount'] = str(instance.donation_amount)
        return data


class CartSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source=User.objects.all(), read_only=True)
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user_id', 'status', 'created_at', 'updated_at', 'items']
        read_only_fields = ['id', 'user_id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        # Handle the case where the instance is None
        if instance is None:
            return {
                "id": None,
                "user_id": None,
                "status": None,
                "created_at": None,
                "updated_at": None,
                "items": []
            }
        return super().to_representation(instance)