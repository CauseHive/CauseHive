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
    # Compatibility fields expected by frontend
    title = serializers.CharField(source='name', read_only=True)
    featured_image = serializers.ImageField(source='cover_image', read_only=True)
    progress_percentage = serializers.SerializerMethodField(read_only=True)
    donation_count = serializers.SerializerMethodField(read_only=True)
    creator = serializers.SerializerMethodField(read_only=True)

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

    def get_progress_percentage(self, obj):
        try:
            if obj.target_amount and obj.target_amount > 0:
                return round((obj.current_amount / obj.target_amount) * 100, 2)
        except Exception:
            pass
        return 0

    def get_donation_count(self, obj):
        try:
            return getattr(obj, 'donation_set', None).count() if hasattr(obj, 'donation_set') else obj.donation_set.count()
        except Exception:
            # Fallback if relation or count fails
            from donations.models import Donation
            return Donation.objects.filter(cause_id=obj.id).count()

    def get_creator(self, obj):
        user = getattr(obj, 'organizer_id', None)
        if not user:
            return None
        full_name = f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip()
        return {
            'id': str(getattr(user, 'id', '')),
            'full_name': full_name or getattr(user, 'email', ''),
            'profile_picture': getattr(getattr(user, 'userprofile', None), 'profile_picture', None),
        }
