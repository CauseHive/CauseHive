import requests

from rest_framework import serializers

from .models import Causes
from categories.models import Category
from .utils import validate_organizer_id_with_service


from django.conf import settings

class CausesSerializer(serializers.ModelSerializer):
    organizer_name = serializers.SerializerMethodField()
    organizer_id = serializers.UUIDField(required=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    category_data = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = Causes
        fields = '__all__'

    def get_organizer_name(self, obj):
        user_service_url = f"{settings.USER_SERVICE_URL}/users/{obj.organizer_id}/"
        try:
            response = requests.get(user_service_url)
            if response.status_code == 200:
                user_data = response.json()
                return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip()
        except requests.RequestException:
            pass
        return "Unknown Organizer"

    def validate_organizer_id(self, value):
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
