import requests
from rest_framework import serializers

from .models import Cart, CartItem
from django.conf import settings

from .utils import validate_user_id_with_service


class CartItemSerializer(serializers.ModelSerializer):
    cause_id = serializers.UUIDField(required=True, write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cause_id', 'donation_amount', 'quantity']
        read_only_fields = ['id']
        extra_kwargs = {
            'cart': {'read_only': True},
            'quantity': {'required': False, 'default': 1},
        }

class CartSerializer(serializers.ModelSerializer):
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