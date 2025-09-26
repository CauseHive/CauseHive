# withdrawal_transfer/utils.py
from rest_framework import serializers
from users_n_auth.models import User, UserProfile
from causes.models import Causes


def validate_user_with_service(user_id, request=None):
    """Validate user exists and is authenticated"""
    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        raise serializers.ValidationError('User not found.')


def validate_cause_with_service(cause_id, user_id, request=None):
    """Validate cause exists and user is the organizer"""
    try:
        cause = Causes.objects.get(id=cause_id)
        if str(cause.organizer_id.id) != str(user_id):
            raise serializers.ValidationError('User is not the organizer of this cause.')
        return cause
    except Causes.DoesNotExist:
        raise serializers.ValidationError('Cause not found.')


def get_user_payment_info(user_id, request=None):
    """Get user's payment information from local user profile"""
    try:
        profile = UserProfile.objects.get(user_id=user_id)
        if not profile.has_complete_withdrawal_info():
            raise serializers.ValidationError('User has not configured withdrawal address.')
        return profile.get_withdrawal_info()
    except UserProfile.DoesNotExist:
        raise serializers.ValidationError('User profile not found.')


def validate_withdrawal_amount(amount, cause_id, request=None):
    """Validate withdrawal amount against cause's available balance"""
    try:
        cause = Causes.objects.get(id=cause_id)
        current_amount = float(getattr(cause, 'current_amount', 0))
        if amount > current_amount:
            raise serializers.ValidationError(
                f'Withdrawal amount ({amount}) exceeds available balance ({current_amount})')
        return True
    except Causes.DoesNotExist:
        raise serializers.ValidationError('Cause not found.')
    except Exception as e:
        raise serializers.ValidationError(f'Error validating withdrawal amount: {str(e)}')


def validate_withdrawal_request(user_id, cause_id, amount, request=None):
    """Comprehensive validation for withdrawal request"""
    user_data = validate_user_with_service(user_id, request)
    cause_data = validate_cause_with_service(cause_id, user_id, request)
    validate_withdrawal_amount(amount, cause_id, request)
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