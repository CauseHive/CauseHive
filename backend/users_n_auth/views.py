from tokenize import TokenError

import requests
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.cache import cache
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, UserProfile
from .permissions import IsAdminService
from .serializers import UserSerializer, UserProfileSerializer
from .throttles import PasswordResetThrottle


# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Clear any cached user data to ensure fresh data
        cache.delete(f'user_email_{user.email}')

        # Send verification email
        # token = default_token_generator.make_token(user)
        # uid = urlsafe_base64_encode(force_bytes(user.pk))
        # verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
        #
        # html_message = render_to_string('email/verification_email.html', {
        #     'user': user,
        #     'verification_url': verification_url
        # })
        # plain_message = strip_tags(html_message)
        #
        # send_mail(
        #     subject='Verify your email address',
        #     message=plain_message,
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        #     html_message=html_message
        # )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Use select_related for better performance
        cache_key = f'user_email_{email}'
        user = cache.get(cache_key)
        
        if user is None:
            try:
                # Use select_related and only fetch essential fields
                # Add database-level optimizations for Supabase
                user = User.objects.select_related().only(
                    'id', 'email', 'password', 'is_active', 
                    'first_name', 'last_name'
                ).get(email=email)
                # Cache for longer since user data doesn't change often
                cache.set(cache_key, user, timeout=600)  # 10 minutes
            except User.DoesNotExist:
                # Cache failed attempts to prevent repeated DB hits
                cache.set(f'failed_login_{email}', True, timeout=60)
                raise AuthenticationFailed("Invalid credentials")
        
        # Check if this is a known failed attempt
        if cache.get(f'failed_login_{email}'):
            raise AuthenticationFailed("Invalid credentials")
        
        # Check password first (faster than DB operations)
        if not user.check_password(password):
            # Cache failed attempts
            cache.set(f'failed_login_{email}', True, timeout=60)
            raise AuthenticationFailed("Invalid credentials.")
        
        if not user.is_active:
            raise AuthenticationFailed("User account is inactive.")
            
        data = super().validate(attrs)
        data.update({
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })
        return data


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    cache_key = f'user_email_{email}'
    user = cache.get(cache_key)
    if user is None:
        try:
            # Only fetch necessary fields for better performance
            user = User.objects.only(
                'id', 'email', 'first_name', 'last_name', 'is_active'
            ).get(email=email)
            cache.set(cache_key, user, timeout=300)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_url = f"{settings.FRONTEND_URL}/reset-password-confirm/{uid}/{token}/"

    html_message = render_to_string('email/password_reset_email.html', {
        'user': user,
        'reset_url': reset_url
    })
    plain_message = strip_tags(html_message)

    send_mail(
        subject='Reset Your Password',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message
    )

    return Response({'message': 'Password reset email sent'})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request, uidb64, token):
    try:
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid user ID.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user'}, status=status.HTTP_404_NOT_FOUND)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response({'message': 'Password has been reset'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = f"{settings.BACKEND_URL}/accounts/google/login/callback/"

class UserDetailView(RetrieveAPIView):
    queryset = User.objects.only('id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active')
    serializer_class = UserSerializer
    lookup_field = 'id'
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.only('id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active')
    permission_classes = [IsAdminService]
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'email']

class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except UserProfile.DoesNotExist:
            raise NotFound("User profile does not exist.")

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class UserAccountDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": "User account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class BankListAPIView(APIView):
    """Fetch list of Ghanaian banks from Paystack"""

    def get(self, request):
        # Check cache first
        cache_key = 'ghana_banks'
        banks = cache.get(cache_key)

        if not banks:
            try:
                url = "https://api.paystack.co/bank?currency=GHS"
                headers = {
                    "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                    "Content-Type": "application/json"
                }

                response = requests.get(url, headers=headers)
                response.raise_for_status()

                data = response.json()
                banks = data.get('data', [])

                # Cache for 24 hours (banks don't change often)
                cache.set(cache_key, banks, 60 * 60 * 24)

            except requests.RequestException as e:
                return Response(
                    {"error": "Failed to fetch banks from Paystack"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

        return Response({
            "status": "success",
            "data": banks
        })


class MobileMoneyListAPIView(APIView):
    """Fetch list of Ghanaian mobile money providers from Paystack"""

    def get(self, request):
        # Check cache first
        cache_key = 'ghana_mobile_money'
        mobile_money = cache.get(cache_key)

        if not mobile_money:
            try:
                url = "https://api.paystack.co/bank?currency=GHS&type=mobile_money"
                headers = {
                    "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                    "Content-Type": "application/json"
                }

                response = requests.get(url, headers=headers)
                response.raise_for_status()

                data = response.json()
                mobile_money = data.get('data', [])

                # Cache for 24 hours
                cache.set(cache_key, mobile_money, 60 * 60 * 24)

            except requests.RequestException as e:
                return Response(
                    {"error": "Failed to fetch mobile money providers from Paystack"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

        return Response({
            "status": "success",
            "data": mobile_money
        })


class ValidateBankAccountAPIView(APIView):
    """Validate bank account number with Paystack"""

    def post(self, request):
        bank_code = request.data.get('bank_code')
        account_number = request.data.get('account_number')

        if not bank_code or not account_number:
            return Response(
                {"error": "bank_code and account_number are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            url = "https://api.paystack.co/bank/resolve"
            headers = {
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "account_number": account_number,
                "bank_code": bank_code
            }

            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()

            result = response.json()

            if result.get('status'):
                return Response({
                    "status": "success",
                    "data": {
                        "account_name": result['data']['account_name'],
                        "account_number": result['data']['account_number'],
                        "bank_id": result['data']['bank_id']
                    }
                })
            else:
                return Response({
                    "status": "error",
                    "message": result.get('message', 'Invalid account details')
                }, status=status.HTTP_400_BAD_REQUEST)

        except requests.RequestException as e:
            return Response(
                {"error": "Failed to validate account with Paystack"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )