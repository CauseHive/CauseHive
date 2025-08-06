# withdrawal_transfer/utils.py
import requests
from rest_framework import serializers
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status


def validate_user_with_service(user_id, request=None):
    """Validate user exists and is authenticated"""
    user_service_url = getattr(settings, 'USER_SERVICE_URL', 'http://localhost:8000/user')
    url = f"{user_service_url}/users/{user_id}/"
    headers = {}

    if request and hasattr(request, 'headers'):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise serializers.ValidationError('User not found in user service.')

        user_data = response.json()
        if 'id' not in user_data:
            raise serializers.ValidationError('User is not valid.')

        return user_data
    except requests.RequestException:
        raise serializers.ValidationError('User service is not reachable.')
    except Exception as e:
        raise serializers.ValidationError(f'An error occurred while validating user: {str(e)}')


def validate_cause_with_service(cause_id, user_id, request=None):
    """Validate cause exists and user is the organizer"""
    cause_service_url = getattr(settings, 'CAUSES_URL', 'http://localhost:8001/causes')
    url = f"{cause_service_url}/details/{cause_id}/"
    headers = {}

    if request and hasattr(request, 'headers'):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise serializers.ValidationError('Cause not found in cause service.')

        cause_data = response.json()
        if 'id' not in cause_data:
            raise serializers.ValidationError('Cause is not valid.')

        # Check if user is the organizer
        if cause_data.get('organizer_id') != str(user_id):
            raise serializers.ValidationError('User is not the organizer of this cause.')

        return cause_data
    except requests.RequestException:
        raise serializers.ValidationError('Cause service is not reachable.')
    except Exception as e:
        raise serializers.ValidationError(f'An error occurred while validating cause: {str(e)}')


def get_user_payment_info(user_id, request=None):
    """Get user's payment information from user service"""
    user_service_url = getattr(settings, 'USER_SERVICE_URL', 'http://localhost:8000/user')
    url = f"{user_service_url}/profile/"
    headers = {}

    if request and hasattr(request, 'headers'):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise serializers.ValidationError('User profile not found in user service.')

        profile_data = response.json()

        # Extract payment information
        withdrawal_address = profile_data.get('withdrawal_address')

        # Check if payment information is complete
        if not withdrawal_address:
            raise serializers.ValidationError('User has not configured withdrawal address.')

        return withdrawal_address
    except requests.RequestException:
        raise serializers.ValidationError('User service is not reachable.')
    except Exception as e:
        raise serializers.ValidationError(f'Failed to get user payment info: {str(e)}')


def validate_withdrawal_amount(amount, cause_id, request=None):
    """Validate withdrawal amount against cause's available balance"""
    cause_service_url = getattr(settings, 'CAUSES_URL', 'http://localhost:8001/causes')
    url = f"{cause_service_url}/details/{cause_id}/"
    headers = {}

    if request and hasattr(request, 'headers'):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise serializers.ValidationError('Unable to fetch cause details.')

        cause_data = response.json()
        current_amount = float(cause_data.get('current_amount', 0))

        if amount > current_amount:
            raise serializers.ValidationError(
                f'Withdrawal amount ({amount}) exceeds available balance ({current_amount})')

        return True
    except requests.RequestException:
        raise serializers.ValidationError('Cause service is not reachable.')
    except Exception as e:
        raise serializers.ValidationError(f'Error validating withdrawal amount: {str(e)}')


def validate_withdrawal_request(user_id, cause_id, amount, request=None):
    """Comprehensive validation for withdrawal request"""
    # Validate user
    user_data = validate_user_with_service(user_id, request)

    # Validate cause and organizer
    cause_data = validate_cause_with_service(cause_id, user_id, request)

    # Validate amount
    validate_withdrawal_amount(amount, cause_id, request)

    # Get payment info
    payment_info = get_user_payment_info(user_id, request)

    return {
        'user_data': user_data,
        'cause_data': cause_data,
        'payment_info': payment_info
    }

def validate_payment_details(payment_details):
    """Validate payment details from request"""
    if not payment_details:
        raise serializers.ValidationError('Payment details cannot be empty.')

    if not isinstance(payment_details, dict):
        raise serializers.ValidationError('Payment details must be a valid JSON object.')