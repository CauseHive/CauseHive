import requests

from rest_framework import serializers

from .models import Causes
from categories.models import Category
from .utils import validate_organizer_id_with_service


class CausesSerializer(serializers.ModelSerializer):
    organizer_id = serializers.UUIDField(required=True) # You were the problem.
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    category_data = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = Causes
        fields = '__all__'

    def validate_organizer_id(self, value):
        # Skip validation for read-only operations (like list views)
        if self.context.get('request') and self.context['request'].method == 'GET':
            return value
        
        try:
            validate_organizer_id_with_service(value)
            return value
        except serializers.ValidationError as e:
            raise serializers.ValidationError(str(e))

    def create(self, validated_data):
        category_data = validated_data.pop('category_data', None)
        if category_data:
            category, _ = Category.objects.get_or_create(
                name=category_data.get('name'),
                defaults={'description': category_data.get('description', '')}
            )
            validated_data['category'] = category
        return super().create(validated_data)
