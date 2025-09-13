from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Causes
from categories.models import Category
from .utils import validate_organizer_id_with_service


class CausesSerializer(serializers.ModelSerializer):
    organizer_id = serializers.UUIDField(source='organizer_id.id', read_only=True)  # Display the actual user ID
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    category_data = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = Causes
        fields = '__all__'

    def validate_organizer_id(self, value):
        try:
            validate_organizer_id_with_service(value)
            return value
        except serializers.ValidationError as e:
            raise serializers.ValidationError(str(e))

    def create(self, validated_data):
        category_data = validated_data.pop('category_data', None)
        
        # Get organizer from context (set in view's perform_create)
        organizer = validated_data.pop('organizer_id', None)
        if not organizer:
            raise serializers.ValidationError({'organizer_id': 'Organizer is required.'})
            
        validated_data['organizer_id'] = organizer
        
        if category_data:
            category, _ = Category.objects.get_or_create(
                name=category_data.get('name'),
                defaults={'description': category_data.get('description', '')}
            )
            validated_data['category'] = category
        return super().create(validated_data)
