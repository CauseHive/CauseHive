from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True},
        }

    def create(self, validated_data):
        password2 = validated_data.pop('password2')
        if validated_data['password'] != password2:
            raise serializers.ValidationError({"password2": "Passwords don't match"})

        # is_organizer = validated_data.pop('is_organizer', False)
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            # is_organizer=is_organizer
        )
        return user

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = '__all__'

    def validate_profile_picture(self, value):
        valid_mime_types = ['image/jpeg', 'image/png', 'image/gif']
        file_mime_type = getattr(value.file, 'content_type', None)
        if file_mime_type is None:
            file_mime_type = getattr(value, 'content_type', None)
        if file_mime_type not in valid_mime_types:
            raise serializers.ValidationError("Unsupported file type. Only JPEG, PNG, and GIF are allowed.")
        return value