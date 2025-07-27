import requests
from rest_framework import serializers
from django.conf import settings

def validate_user_id_with_service(value, request=None):
    user_service_url = getattr(settings, 'USER_SERVICE_URL', 'http://localhost:8000/user/api/auth')
    url = f"{user_service_url}/users/{value}/"
    headers = {}
    if request and hasattr(request, 'headers'):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header
    try:
        response = requests.get(url)
        if response.status_code != 200:
            raise serializers.ValidationError('User not found in user service.')
        user_data = response.json()
        if not user_data.get('is_user', False):
            raise serializers.ValidationError('User is not valid.')
    except requests.RequestException:
        raise serializers.ValidationError('User service is not reachable.')
    return value

def validate_cause_with_service(value, request=None):
    cause_service_url = getattr(settings, 'CAUSE_SERVICE_URL', 'http://localhost:8001/causes/')
    url = f"{cause_service_url}/details/{value}/"
    headers = {}
    if request and hasattr(request, 'headers'):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header
    try:
        response = requests.get(url)
        if response.status_code != 200:
            raise serializers.ValidationError('The cause service is not reachable.')
        cause_data = response.json()
        if not cause_data.get('is_cause', False):
            raise serializers.ValidationError('This cause is not valid.')
        # Check for cause status
        # if cause_data.get('status') == 'completed':
        #     raise serializers.ValidationError('This cause has reached its target.')
    except requests.RequestException:
        raise serializers.ValidationError('The cause service is not reachable.')
    return value