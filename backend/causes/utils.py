from users_n_auth.models import User
from rest_framework import serializers

def validate_organizer_id_with_service(value):
    try:
        user = User.objects.get(id=value)
        if not user.is_active:
            raise serializers.ValidationError('User is not active.')
    except User.DoesNotExist:
        raise serializers.ValidationError('Organizer not found.')
    return value