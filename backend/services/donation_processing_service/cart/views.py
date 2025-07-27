from django.contrib.admindocs.views import user_has_model_view_permission
from django.core.serializers import serialize
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from .utils import (validate_user_id_with_service, validate_cause_with_service,
                    validate_request, get_user_email_from_service,
                    get_recipient_id_from_service, get_or_create_user_cart, create_user_cart)
from .decorators import extract_user_from_token
from donations.models import Donation
from payments.models import PaymentTransaction
from payments.paystack import Paystack

# Create your views here.
def is_authenticated(request):
    return hasattr(request, 'user_id') and request.user_id

@api_view(['GET'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def get_cart(request):
    cart_id = request.query_params.get('cart_id')
    # Validate user ID with the user service if the user is authenticated
    if is_authenticated(request):
        validate_user_id_with_service(request.user_id, request)

        try:
            cart, created = get_or_create_user_cart(request.user_id)
            serializer = CartSerializer(cart)
            return Response({
                "cart_id": str(cart.id),
                "cart": serializer.data,
                "items": serializer.data.get("items", [])
            }, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({
                "message": "No active cart found",
                "cart": None,
                "items": []
            }, status=status.HTTP_200_OK)
    elif cart_id:
        try:
            cart = Cart.objects.get(id=cart_id, user_id=None)
            serializer = CartSerializer(cart)
            return Response({
                "cart_id": str(cart_id),
                "cart": serializer.data,
                "items": serializer.data.get("items", [])
            }, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({
                "message": "No active cart found",
                "cart": None,
                "items": []
            }, status=status.HTTP_200_OK)

    else:
        return Response({
            "message": "No active cart found",
            "cart": None,
            "items": []
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def add_to_cart(request):
    cart_id = request.data.get('cart_id')
    serializer = CartItemSerializer(data=request.data)
    if serializer.is_valid():
        if is_authenticated(request):
            validate_user_id_with_service(request.user_id, request)
            user_id = request.user_id
            try:
                cart, created = get_or_create_user_cart(user_id)
            except Cart.DoesNotExist:
                  # Create a new cart if it doesn't exist
                 cart = create_user_cart(user_id)
        else:
            user_id = None
            if cart_id:
                try:
                    cart = Cart.objects.get(id=cart_id, user_id=None)
                except Cart.DoesNotExist:
                    cart = create_user_cart(user_id)
            else:
                cart = create_user_cart(user_id)

        existing_item = CartItem.objects.filter(
            cart=cart,
            cause_id=serializer.validated_data['cause_id']
        ).first()

        if existing_item:
            existing_item.quantity += serializer.validated_data.get('quantity', 1)
            existing_item.donation_amount = serializer.validated_data['donation_amount']
            existing_item.save()
            item_data = CartItemSerializer(existing_item).data
        else:
            cart_item = CartItem.objects.create(
                cart=cart,
                cause_id=serializer.validated_data['cause_id'],
                quantity=serializer.validated_data.get('quantity', 1),
                donation_amount=serializer.validated_data['donation_amount']
            )
            item_data = CartItemSerializer(cart_item).data

        return Response({
            "cart_id": str(cart.id),
            "item": item_data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # serializer = CartItemSerializer(data=request.data)
    # if serializer.is_valid():
    #     if is_authenticated(request):
    #         validate_user_id_with_service(request.user_id, request)
    #         user_id = request.user_id
    #     else:
    #         user_id = None # Anonymous donor
    #
    #     validate_cause_with_service(serializer.validated_data['cause_id'], request)
    #
    #     try:
    #         cart, created = get_or_create_user_cart(user_id)
    #     except Cart.DoesNotExist:
    #          # Create a new cart if it doesn't exist
    #         cart = create_user_cart(user_id)
    #
    #     existing_item = CartItem.objects.filter(
    #         cart=cart,
    #         cause_id=serializer.validated_data['cause_id']
    #     ).first()
    #
    #     if existing_item:
    #         existing_item.quantity += serializer.validated_data.get('quantity', 1)
    #         existing_item.donation_amount = serializer.validated_data['donation_amount']
    #         existing_item.save()
    #         return Response(CartItemSerializer(existing_item).data, status=status.HTTP_200_OK)
    #     else:
    #         cart_item = CartItem.objects.create(
    #             cart=cart,
    #             cause_id=serializer.validated_data['cause_id'],
    #             quantity=serializer.validated_data.get('quantity', 1),
    #             donation_amount=serializer.validated_data['donation_amount']
    #         )
    #         return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
    #
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def update_cart_item(request, item_id):
    cart_id = request.data.get('cart_id') or request.query_params.get('cart_id')
    if is_authenticated(request):
        validate_user_id_with_service(request.user_id, request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=request.user_id)
    elif cart_id:
        cart_item = get_object_or_404(CartItem, id=item_id, cart__id=cart_id, cart__user_id=None)
    else:
        return Response({"error": "cart_id is required for anonymous users"}, status=status.HTTP_400_BAD_REQUEST)

    quantity = request.data.get('quantity', cart_item.quantity)
    if quantity <= 0:
        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

    cart_item.quantity = quantity
    cart_item.save()
    return Response({"message": "Cart item updated"}, status=status.HTTP_200_OK)

    # if is_authenticated(request):
    #     validate_user_id_with_service(request.user_id, request)
    #     cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=request.user_id)
    # else:
    #     cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=None)
    #
    # quantity = request.data.get('quantity', cart_item.quantity)
    #
    # if quantity <= 0:
    #     cart_item.delete()
    #     return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)
    #
    # cart_item.quantity = quantity
    # cart_item.save()
    # return Response({"message": "Cart item updated"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def remove_from_cart(request, item_id):
    cart_id = request.data.get('cart_id') or request.query_params.get('cart_id')
    if is_authenticated(request):
        validate_user_id_with_service(request.user_id, request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=request.user_id)
    elif cart_id:
        cart_item = get_object_or_404(CartItem, id=item_id, cart__id=cart_id, cart__user_id=None)
    else:
        return Response({"error": "cart_id is required for anonymous users"}, status=status.HTTP_400_BAD_REQUEST)
    cart_item.delete()
    return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

    # if is_authenticated(request):
    #     validate_user_id_with_service(request.user_id, request)
    #     cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=request.user_id)
    # else:
    #     cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=None)
    # cart_item.delete()
    # return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def delete_cart(request):
    cart_id = request.data.get('cart_id') or request.query_params.get('cart_id')
    if is_authenticated(request):
        try:
            cart, created = get_or_create_user_cart(request.user_id)
        except Cart.DoesNotExist:
            return Response({"message": "No active cart found"}, status=status.HTTP_404_NOT_FOUND)
    elif cart_id:
        try:
            cart = Cart.objects.get(id=cart_id, user_id=None)
        except Cart.DoesNotExist:
            return Response({"message": "No active cart found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "cart_id is required for anonymous users"}, status=status.HTTP_400_BAD_REQUEST)

    cart.items.all().delete()
    cart.delete()
    return Response({"message": "Cart deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    # if is_authenticated(request):
    #     try:
    #         cart, created = get_or_create_user_cart(request.user_id)
    #
    #         # Delete items in the cart
    #         cart.items.all().delete()
    #         # Delete the cart itself
    #         cart.delete()
    #
    #         return Response({"message": "Cart deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    #     except Cart.DoesNotExist:
    #         return Response({"message": "No active cart found"}, status=status.HTTP_404_NOT_FOUND)
    # else:
    #     return Response({"message": "You have no cart"}, status=HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def checkout(request):
    if is_authenticated(request):
        user_id = request.user_id
    else:
        user_id = None

    try:
        cart = Cart.objects.get(user_id=request.user.id, status='active')
    except Cart.DoesNotExist:
        return Response({"message": "No active cart not found"}, status=status.HTTP_404_NOT_FOUND)
    except Cart.MultipleObjectsReturned:
        cart = Cart.objects.filter(user_id=request.user.id, status='active')

    if not cart.items.exists():
        return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    total_amount = sum(item.donation_amount * item.quantity for item in cart.items.all())

    donations = []
    for item in cart.items.all():
        # Get recipient ID from cause service
        try:
            recipient_id = get_recipient_id_from_service(item.cause_id, request)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        donation = Donation.objects.create(
            user_id=request.user_id,
            cause_id=item.cause_id,
            amount=item.donation_amount * item.quantity,
            currency='GHS',
            status='pending',
            recipient_id=recipient_id
        )
        donations.append(donation)


    # Get user email from user_service if registered else request it in the body
    if user_id:
        try:
            user_email = get_user_email_from_service(request.user_id, request)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user_email = request.data.get('email')
        if not user_email:
            return Response({"error": "Email is required for checkout"}, status=status.HTTP_400_BAD_REQUEST)

    # Initialize payment with Paystack
    paystack_response = Paystack.initialize_payment(user_email, total_amount)

    if paystack_response['status']:
        data = paystack_response['data']
        payment_transaction = PaymentTransaction.objects.create(
            donation=donations[0],
            user_id=request.user_id,
            amount=total_amount,
            currency='GHS',
            transaction_id=data['reference'],
            status='pending',
            payment_method='Paystack',
        )
        cart.status = 'completed'
        cart.save()
        return Response({
            'authorization_url': data['authorization_url'],
            'reference': data['reference'],
            'total_amount': total_amount,
            'payment_id': payment_transaction.id
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": paystack_response['message']}, status=status.HTTP_400_BAD_REQUEST)

# Straight up "donate" skipping the whole cart process.
@api_view(['POST'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def donate(request):
    # First handle the cart operations (similar to add_to_cart)
    cart_id = request.data.get('cart_id')
    serializer = CartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Validate cause exists
    try:
        validate_cause_with_service(serializer.validated_data['cause_id'], request)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Handle cart creation/retrieval
    if is_authenticated(request):
        validate_user_id_with_service(request.user_id, request)
        user_id = request.user_id
        try:
            cart, created = get_or_create_user_cart(user_id)
        except Cart.DoesNotExist:
            cart = create_user_cart(user_id)
    else:
        user_id = None
        if cart_id:
            try:
                cart = Cart.objects.get(id=cart_id, user_id=None)
            except Cart.DoesNotExist:
                cart = create_user_cart(user_id)
        else:
            cart = create_user_cart(user_id)

    # Add/update item in cart
    existing_item = CartItem.objects.filter(
        cart=cart,
        cause_id=serializer.validated_data['cause_id']
    ).first()

    if existing_item:
        existing_item.quantity += serializer.validated_data.get('quantity', 1)
        existing_item.donation_amount = serializer.validated_data['donation_amount']
        existing_item.save()
        cart_item = existing_item
    else:
        cart_item = CartItem.objects.create(
            cart=cart,
            cause_id=serializer.validated_data['cause_id'],
            quantity=serializer.validated_data.get('quantity', 1),
            donation_amount=serializer.validated_data['donation_amount']
        )

    # Now handle the checkout process
    total_amount = cart_item.donation_amount * cart_item.quantity

    # Get recipient ID from cause service
    try:
        recipient_id = get_recipient_id_from_service(cart_item.cause_id, request)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Create donation record
    donation = Donation.objects.create(
        user_id=user_id,
        cause_id=cart_item.cause_id,
        amount=total_amount,
        currency='GHS',
        status='pending',
        recipient_id=recipient_id
    )

    # Get user email
    if user_id:
        try:
            user_email = get_user_email_from_service(user_id, request)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user_email = request.data.get('email')
        if not user_email:
            return Response({"error": "Email is required for checkout"}, status=status.HTTP_400_BAD_REQUEST)

    # Initialize payment with Paystack
    paystack_response = Paystack.initialize_payment(user_email, total_amount)

    if paystack_response['status']:
        data = paystack_response['data']
        payment_transaction = PaymentTransaction.objects.create(
            donation=donation,
            user_id=user_id,
            amount=total_amount,
            currency='GHS',
            transaction_id=data['reference'],
            status='pending',
            payment_method='Paystack',
        )

        # Mark cart item as processed (or remove it)
        cart_item.delete()
        if not cart.items.exists():
            cart.delete()

        return Response({
            'authorization_url': data['authorization_url'],
            'reference': data['reference'],
            'total_amount': total_amount,
            'payment_id': payment_transaction.id,
            'donation_id': donation.id
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": paystack_response['message']}, status=status.HTTP_400_BAD_REQUEST)