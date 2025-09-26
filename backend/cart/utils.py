from functools import wraps

from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from django.core.cache import cache
from django.utils.text import slugify

from users_n_auth.models import User
from causes.models import Causes
from cart.models import Cart


def validate_user_id_with_service(value, request=None):
    cache_key = f'user_lookup_{slugify(str(value))}'
    user = cache.get(cache_key)
    if user is None:
        try:
            user = User.objects.get(id=value)
            cache.set(cache_key, user, timeout=300)  # Cache for 5 minutes
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found.')
    return value

def validate_cause_with_service(value, request=None):
    cache_key = f'cause_lookup_{slugify(str(value))}'
    cause = cache.get(cache_key)
    if cause is None:
        try:
            cause = Causes.objects.get(id=value)
            cache.set(cache_key, cause, timeout=300)  # Cache for 5 minutes
        except Causes.DoesNotExist:
            raise serializers.ValidationError('Cause not found.')
    return value

def get_user_email_from_service(user_id, request=None):
    cache_key = f'user_email_{slugify(str(user_id))}'
    email = cache.get(cache_key)
    if email is None:
        try:
            # Try to get user by ID first if it's a UUID
            try:
                user = User.objects.get(email=user_id)
            except (User.DoesNotExist, ValueError):
                # If that fails, try by email (for backward compatibility)
                user = User.objects.get(email=user_id)

            email = user.email
            cache.set(cache_key, email, timeout=300)
        except User.DoesNotExist:
            raise ValueError('User not found.')
    return email

def get_recipient_id_from_service(cause_id, request=None):
    cache_key = f'cause_recipient_{slugify(str(cause_id))}'
    recipient_id = cache.get(cache_key)
    if recipient_id is None:
        try:
            cause = Causes.objects.get(id=cause_id)
            # Get the UUID directly from the organizer's id
            recipient_id = str(cause.organizer_id.id)  # Access the actual UUID
            cache.set(cache_key, recipient_id, timeout=300)
        except Causes.DoesNotExist:
            raise ValueError('Cause not found.')
        except AttributeError:
            # In case organizer_id is None or doesn't have an id attribute
            raise ValueError('Invalid organizer for this cause.')
    return recipient_id

def get_or_create_user_cart(user_id):
    """
    Get or create a cart for a user.
    user_id can be a User instance or None for anonymous users
    Returns (cart, created) tuple
    """
    if user_id:
        try:
            # Get cart by user instance
            cart = Cart.objects.get(user_id=user_id, status='active')
            return cart, False  # False means not created
        except Cart.DoesNotExist:
            # Create new cart with user instance
            cart = Cart.objects.create(user_id=user_id, status='active')
            return cart, True
        except Cart.MultipleObjectsReturned:
            # Handle multiple active carts - keep the newest one
            active_carts = Cart.objects.filter(user_id=user_id, status='active').order_by('-created_at')
            cart = active_carts.first()

            # Mark others as abandoned
            for old_cart in active_carts[1:]:
                old_cart.status = 'abandoned'
                old_cart.save()
            return cart, False
    else:
        # For anonymous users, create a new cart
        cart = Cart.objects.create(user_id=None, status='active')
        return cart, True

def create_user_cart(user_id):
    """
    Create a new cart for the user or anonymous user.
    user_id can be a User instance or None for anonymous users
    Returns the created cart.
    """
    if user_id:
        # Mark any existing active cart as abandoned first
        Cart.objects.filter(user_id=user_id, status='active').update(status='abandoned')

    # Create new cart with proper user_id (User instance or None)
    cart = Cart.objects.create(user_id=user_id, status='active')
    return cart

def validate_request(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            # You can add any additional validation here
            return view_func(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return wrapper