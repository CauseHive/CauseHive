import logging

from payments.models import PaymentTransaction
from payments.paystack import Paystack
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from users_n_auth.models import User

from .decorators import extract_user_from_token
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from .utils import (validate_user_id_with_service, validate_request, get_user_email_from_service,
                    get_recipient_id_from_service, get_or_create_user_cart, create_user_cart)
from donations.models import Donation
from causes.models import Causes
from causes.serializers import CausesSerializer

# Create your views here.
def is_authenticated(request):
    return hasattr(request, 'user_id') and request.user_id

# Compatibility adapter to route DELETE /api/cart/<id>/ to remove_from_cart
@api_view(['DELETE'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def cart_item_compat_delete(request, item_id):
    return remove_from_cart(request, item_id)

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
            cart = Cart.objects.only('id', 'user_id', 'status').select_related('user_id').prefetch_related('items').get(id=cart.id)
            serializer = CartSerializer(cart)
            items = serializer.data.get("items", [])
            try:
                total_amount = sum([float(i.get('donation_amount', 0)) * int(i.get('quantity', 1)) for i in items])
            except Exception:
                total_amount = 0
            return Response({
                "cart_id": str(cart.id),
                "cart": serializer.data,
                "items": items,
                "total_amount": total_amount,
                "item_count": len(items),
            }, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({
                "message": "No active cart found",
                "cart": None,
                "items": []
            }, status=status.HTTP_200_OK)
    elif cart_id:
        try:
            cart = Cart.objects.only('id', 'user_id', 'status').select_related('user_id').prefetch_related('items').get(id=cart_id, user_id=None)
            serializer = CartSerializer(cart)
            items = serializer.data.get("items", [])
            try:
                total_amount = sum([float(i.get('donation_amount', 0)) * int(i.get('quantity', 1)) for i in items])
            except Exception:
                total_amount = 0
            return Response({
                "cart_id": str(cart_id),
                "cart": serializer.data,
                "items": items,
                "total_amount": total_amount,
                "item_count": len(items),
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
            "items": [],
            "total_amount": 0,
            "item_count": 0,
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def add_to_cart(request):
    cart_id = request.data.get('cart_id')
    # Accept 'amount' alias from frontend and map to donation_amount for serializer
    data = request.data.copy()
    if 'amount' in data and 'donation_amount' not in data:
        data['donation_amount'] = data.get('amount')
    serializer = CartItemSerializer(data=data)
    if serializer.is_valid():
        if is_authenticated(request):
            validate_user_id_with_service(request.user_id, request)
            try:
                user = User.objects.get(id=request.user_id)
                cart, created = get_or_create_user_cart(user)  # Pass User instance instead of UUID
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
            except Cart.DoesNotExist:
                cart = create_user_cart(user)  # Pass User instance here too
        else:
            if cart_id:
                try:
                    cart = Cart.objects.get(id=cart_id, user_id=None)
                except Cart.DoesNotExist:
                    cart = create_user_cart(None)
            else:
                cart = create_user_cart(None)

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

@api_view(['PATCH', 'DELETE'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def update_cart_item(request, item_id):
    # Handle DELETE for compatibility with /api/cart/<uuid>/
    if request.method == 'DELETE':
        return remove_from_cart(request, item_id)
    cart_id = request.data.get('cart_id') or request.query_params.get('cart_id')
    if is_authenticated(request):
        validate_user_id_with_service(request.user_id, request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user_id=request.user_id)
    elif cart_id:
        cart_item = get_object_or_404(CartItem, id=item_id, cart__id=cart_id, cart__user_id=None)
    else:
        return Response({"error": "cart_id is required for anonymous users"}, status=status.HTTP_400_BAD_REQUEST)

    # Support updating donation_amount via 'amount' alias from frontend
    if 'amount' in request.data or 'donation_amount' in request.data:
        try:
            new_amount = request.data.get('amount', request.data.get('donation_amount'))
            cart_item.donation_amount = new_amount
        except Exception:
            pass
    # Also support quantity updates
    quantity = request.data.get('quantity')
    if quantity is not None:
        if int(quantity) <= 0:
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

    # Use bulk delete for cart items
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
    import logging

    if is_authenticated(request):
        try:
            user = User.objects.get(id=request.user_id)
        except User.DoesNotExist:
            logging.error(f"User not found with ID: {request.user_id}")
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user_id=user, status='active')
        except Cart.DoesNotExist:
            return Response({"message": "No active cart found"}, status=status.HTTP_404_NOT_FOUND)
        except Cart.MultipleObjectsReturned:
            cart = Cart.objects.filter(user_id=user, status='active').first()
    else:
        cart_id = request.data.get('cart_id')
        if not cart_id:
            return Response({"error": "cart_id is required for anonymous users"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cart = Cart.objects.get(id=cart_id, user_id=None, status='active')
        except Cart.DoesNotExist:
            return Response({"message": "No active cart found"}, status=status.HTTP_404_NOT_FOUND)

    if not cart.items.exists():
        return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    total_amount = sum(item.donation_amount * item.quantity for item in cart.items.all())
    donations = []

    for item in cart.items.all():
        try:
            recipient_uuid = get_recipient_id_from_service(item.cause_id, request)
            recipient = User.objects.get(id=recipient_uuid)
            cause = Causes.objects.get(id=item.cause_id)

            donation = Donation.objects.create(
                user_id=user if is_authenticated(request) else None,
                cause_id=cause,
                amount=item.donation_amount * item.quantity,
                currency='GHS',
                status='pending',
                recipient_id=recipient
            )
            donations.append(donation)
        except Exception as e:
            logging.error(f"Error creating donation: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Get user email - for authenticated users, get from their profile
    if is_authenticated(request):
        user_email = user.email
    else:
        user_email = request.data.get('email')
        if not user_email:
            return Response({"error": "Email is required for checkout"}, status=status.HTTP_400_BAD_REQUEST)

    # Initialize payment with Paystack
    try:
        paystack_response = Paystack.initialize_payment(user_email, total_amount)
    except Exception as e:
        logging.error(f"Paystack initialization error: {str(e)}")
        return Response({"error": "Payment initialization failed"}, status=status.HTTP_400_BAD_REQUEST)

    if paystack_response['status']:
        data = paystack_response['data']
        try:
            payment_transaction = PaymentTransaction.objects.create(
                donation=donations[0],
                user_id=user if is_authenticated(request) else None,
                amount=total_amount,
                currency='GHS',
                transaction_id=data['reference'],
                status='pending',
                payment_method='Paystack',
                email=user_email,
            )

            # Mark cart as completed
            cart.status = 'completed'
            cart.save()

            return Response({
                'authorization_url': data['authorization_url'],
                'reference': data['reference'],
                'total_amount': total_amount,
                'payment_id': payment_transaction.id
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error creating payment transaction: {str(e)}")
            return Response({"error": "Error processing payment"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": paystack_response.get('message', 'Payment initialization failed')}, status=status.HTTP_400_BAD_REQUEST)

# Straight up "donate" skipping the whole cart process.
@api_view(['POST'])
@permission_classes([AllowAny])
@extract_user_from_token
@validate_request
def donate(request):
    import logging
    logging.warning(f"DONATE ENDPOINT request.data: {request.data}")
    cart_id = request.data.get('cart_id')
    cause_id = request.data.get('cause_id')

    # Validate cause_id is a valid UUID
    import uuid
    try:
        uuid.UUID(str(cause_id))
    except (ValueError, TypeError):
        return Response({"error": "cause_id must be a valid UUID."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = CartItemSerializer(data=request.data)
    if not serializer.is_valid():
        logging.warning(f"CartItemSerializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    logging.warning("Serializer valid. Proceeding to cart creation/retrieval.")

    # Handle user authentication and cart creation
    if is_authenticated(request):
        validate_user_id_with_service(request.user_id, request)
        try:
            user = User.objects.get(id=request.user_id)
            user_id = user  # Store the User instance
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart, created = get_or_create_user_cart(user_id)
        except Cart.DoesNotExist:
            cart = create_user_cart(user_id)
    else:
        user_id = None  # For anonymous users
        if cart_id:
            try:
                cart = Cart.objects.get(id=cart_id, user_id=None)
            except Cart.DoesNotExist:
                cart = create_user_cart(None)
        else:
            cart = create_user_cart(None)

    logging.warning(f"Cart ready: {cart}. Proceeding to cart item creation/update.")

    # Create or update cart item
    try:
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
        logging.warning(f"Cart item ready: {cart_item}")
    except Exception as e:
        logging.warning(f"CartItem creation/update error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate total amount
    total_amount = float(cart_item.donation_amount) * cart_item.quantity

    # Get recipient and create donation
    try:
        recipient_uuid = get_recipient_id_from_service(cart_item.cause_id, request)
        recipient = User.objects.get(id=recipient_uuid)
        cause = Causes.objects.get(id=cart_item.cause_id)

        # Create the donation with proper model instances
        donation = Donation.objects.create(
            user_id=None if user_id is None else User.objects.get(id=user_id.id),  # Convert User instance to ID and back
            cause_id=cause,
            amount=total_amount,
            currency='GHS',
            status='pending',
            recipient_id=recipient
        )
    except Exception as e:
        logging.error(f"Error creating donation: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Handle email for payment
    if user_id:
        try:
            user_email = get_user_email_from_service(user_id.id if hasattr(user_id, 'id') else user_id, request)
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
        # Create payment transaction with proper model instances
        payment_transaction = PaymentTransaction.objects.create(
            donation=donation,
            user_id=None if user_id is None else User.objects.get(id=user_id.id),
            amount=total_amount,
            currency='GHS',
            transaction_id=data['reference'],
            status='pending',
            payment_method='Paystack',
            email=user_email,
        )

        # Cleanup cart
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

# Ensure that user_id, cart_id, and cause_id fields are indexed in Cart and CartItem models for optimal performance.
