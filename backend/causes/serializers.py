from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Causes
from categories.models import Category
from .utils import validate_organizer_id_with_service


class CategorySerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    cause_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'color', 'cause_count']

    def get_icon(self, obj):
        return getattr(obj, 'icon', None)

    def get_color(self, obj):
        return getattr(obj, 'color', None)

    def get_cause_count(self, obj):
        return getattr(obj, 'cause_count', 0)


class CausesSerializer(serializers.ModelSerializer):
    organizer_id = serializers.UUIDField(source='organizer_id.id', read_only=True)
    title = serializers.CharField(source='name', required=False)
    featured_image = serializers.ImageField(source='cover_image', allow_null=True, required=False)
    progress_percentage = serializers.SerializerMethodField()
    creator = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(source='category', queryset=Category.objects.all(), write_only=True, required=False, allow_null=True)
    category_data = serializers.DictField(write_only=True, required=False)
    donation_count = serializers.SerializerMethodField()
    is_featured = serializers.SerializerMethodField()
    deadline = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    updates = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Causes
        fields = [
            'id',
            'title',
            'description',
            'target_amount',
            'current_amount',
            'progress_percentage',
            'status',
            'category',
            'category_id',
            'category_data',
            'creator',
            'created_at',
            'updated_at',
            'deadline',
            'featured_image',
            'donation_count',
            'is_featured',
            'organizer_id',
            'gallery',
            'tags',
            'updates',
            'rejection_reason',
        ]
        extra_kwargs = {
            'description': {'required': False},
            'target_amount': {'required': False},
            'current_amount': {'required': False},
            'status': {'required': False},
            'rejection_reason': {'required': False},
        }

    def validate_organizer_id(self, value):
        try:
            validate_organizer_id_with_service(value)
            return value
        except serializers.ValidationError as e:
            raise serializers.ValidationError(str(e))

    def create(self, validated_data):
        category_data = validated_data.pop('category_data', None)

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

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category_data', None)
        if category_data:
            category, _ = Category.objects.get_or_create(
                name=category_data.get('name'),
                defaults={'description': category_data.get('description', '')}
            )
            validated_data['category'] = category
        return super().update(instance, validated_data)

    def get_progress_percentage(self, obj):
        target = obj.target_amount or 0
        current = obj.current_amount or 0
        if not target:
            return 0
        try:
            return max(0, min(100, round((current / target) * 100, 2)))
        except ZeroDivisionError:
            return 0

    def get_creator(self, obj):
        user = getattr(obj, 'organizer_id', None)
        if not user:
            return {'id': '', 'full_name': '', 'profile_picture': None}

        full_name = f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip()
        profile_picture = None
        profile = getattr(user, 'profile', None)
        if profile and getattr(profile, 'profile_picture', None):
            try:
                request = self.context.get('request')
                url = profile.profile_picture.url
                profile_picture = request.build_absolute_uri(url) if request else url
            except Exception:
                profile_picture = profile.profile_picture.url if profile.profile_picture else None

        return {
            'id': str(user.id),
            'full_name': full_name,
            'profile_picture': profile_picture,
        }

    def get_donation_count(self, obj):
        return getattr(obj, 'donation_count', 0)

    def get_is_featured(self, obj):
        return getattr(obj, 'is_featured', False)

    def get_deadline(self, obj):
        return getattr(obj, 'deadline', None)

    def get_gallery(self, obj):
        gallery = getattr(obj, 'gallery', None)
        return gallery if isinstance(gallery, list) else []

    def get_tags(self, obj):
        tags = getattr(obj, 'tags', None)
        return tags if isinstance(tags, list) else []

    def get_updates(self, obj):
        updates = getattr(obj, 'updates', None)
        return updates if isinstance(updates, list) else []

    def get_updated_at(self, obj):
        return getattr(obj, 'updated_at', None) or obj.created_at

    def to_representation(self, instance):
        data = super().to_representation(instance)
        category = instance.category if hasattr(instance, 'category') else None
        if category:
            data['category'] = CategorySerializer(category).data
        else:
            data['category'] = {
                'id': '',
                'name': '',
                'description': '',
                'icon': None,
                'color': None,
                'cause_count': 0,
            }
        return data
