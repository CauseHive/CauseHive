from users_n_auth.models import User
from causes.models import Causes
from rest_framework import serializers

def validate_user_id_with_service(value, request=None):
    try:
        user = User.objects.get(id=value)
        if not user.is_active:
            raise serializers.ValidationError('User is not active.')
        return value
    except User.DoesNotExist:
        raise serializers.ValidationError('User not found.')

def validate_cause_with_service(value, request=None):
    try:
        cause = Causes.objects.get(id=value)
        return value
    except Causes.DoesNotExist:
        raise serializers.ValidationError('Cause not found.')
