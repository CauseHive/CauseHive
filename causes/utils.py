import requests
from rest_framework import serializers
from django.conf import settings

def validate_organizer_id_with_service(value):
    """
    Validate organizer ID with user service.
    In monolithic setup, we validate against the local User model.
    """
    try:
        # Import here to avoid circular imports
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Check if user exists and is active in the local database
        user = User.objects.get(id=value, is_active=True)
        return value
    except User.DoesNotExist:
        raise serializers.ValidationError('Organizer not found or not active.')
    except Exception as e:
        # If local validation fails, fall back to the original HTTP validation
        # This provides backward compatibility
        user_service_url = getattr(settings, 'USER_SERVICE_URL', 'http://causehive.tech/user/')
        url = f"{user_service_url}/users/{value}/"
        try:
            response = requests.get(url)
            if response.status_code != 200:
                raise serializers.ValidationError('Organizer not found in user service.')
            user_data = response.json()
            if not user_data.get('is_active', True):
                raise serializers.ValidationError('User is not active.')
            return value
        except requests.RequestException:
            raise serializers.ValidationError('User service is not reachable.')
    return value