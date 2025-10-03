from tokenize import TokenError

import requests
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
from pycparser.ply.yacc import default_lr
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
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.http import HttpResponseRedirect
from rest_framework_simplejwt.views import TokenObtainPairView
from twisted.mail.scripts.mailmail import failure

from .email_utils import send_account_verification_email, send_password_reset_email
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

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

        send_account_verification_email(
            to_email=user.email,
            first_name=user.first_name,
            verification_url=verification_url,
            expiry_minutes=30,
            logo_filename="Causehive.png",
        )


        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_account(request, uidb64: str, token: str):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except Exception:
        return _verification_redirect_or_json(success=False, reason="Invalid uid")

    if not default_token_generator.check_token(user, token):
        return _verification_redirect_or_json(success=False, reason="Invalid or expired token")

    # Mark as verified
    updated = False
    if hasattr(user, 'is_active') and not user.is_active:
        user.is_active = True
        updated = True
    if hasattr(user, "is_verified") and not user.is_verified:
        user.is_verified = True
        updated = True
    if updated:
        user.save()

    return _verification_redirect_or_json(success=True)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def resend_verification_email(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.only("id", "email", "first_name", "is_active", "is_verified").get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'If an account with that email exists, a verification email has been sent.'}, status=status.HTTP_200_OK)

    # Already verified?
    already_verified = getattr(user, 'is_verified', None) is True or user.is_active
    if already_verified:
        return Response({'detail': 'Account is already verified.'}, status=status.HTTP_200_OK)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

    send_account_verification_email(
        to_email=user.email,
        first_name=user.first_name,
        verification_url=verification_url,
        expiry_minutes=30,
        logo_filename="Causehive.png",
    )
    return Response({"detail": "Verification email sent"}, status=status.HTTP_200_OK)

def _verification_redirect_or_json(*, success: bool, reason: str):
    success_path = "/verify-email/success/"
    failure_path = f"/verify-email/failure/?reason={reason or 'error'}"
    target = success_path if success else failure_path
    frontend = getattr(settings, 'FRONTEND_URL', None)
    if frontend:
        return HttpResponseRedirect(frontend.rstrip('/') + target)

    payload = {"success": success}
    if reason:
        payload["reason"] = reason
    return Response(payload, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)

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

    send_password_reset_email(
        to_email=user.email,
        first_name=user.first_name,
        reset_url=reset_url,
        expiry_minutes=30,
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
    callback_url = f"{settings.BACKEND_URL}/api/user/google/callback/"
    
    def get_response(self):
        response = super().get_response()
        
        # Check if the user is authenticated (OAuth was successful)
        if self.request.user.is_authenticated:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(self.request.user)
            access_token = refresh.access_token
            
            # Redirect to API profile page with access token
            api_url = f"{settings.BACKEND_URL}/api/user/profile/?access_token={access_token}"
            return HttpResponseRedirect(api_url)
        
        return response

@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_url(request):
    """
    Generate Google OAuth URL for frontend to redirect to
    """
    from django.conf import settings
    
    # Your Google OAuth credentials
    GOOGLE_CLIENT_ID = settings.GOOGLE_OAUTH2_CLIENT_ID
    REDIRECT_URI = request.build_absolute_uri('/api/user/google/callback/')
    SCOPE = 'openid email profile'
    
    # Generate Google OAuth URL with proper scope URLs
    scopes = [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
    scope_string = '%20'.join(scopes)
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={scope_string}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    
    return Response({
        'google_oauth_url': auth_url,
        'message': 'Use this URL to initiate Google OAuth flow'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_callback(request):
    """
    Custom Google OAuth callback that redirects to profile with access token
    """
    try:
        # Get the authorization code from the URL parameters
        auth_code = request.GET.get('code')
        state = request.GET.get('state')
        
        if not auth_code:
            return Response(
                {'error': 'Authorization code is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Exchange code for tokens with Google
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import Flow
        from django.conf import settings
        
        # Your Google OAuth credentials
        GOOGLE_CLIENT_ID = settings.GOOGLE_OAUTH2_CLIENT_ID
        GOOGLE_CLIENT_SECRET = settings.GOOGLE_OAUTH2_SECRET
        REDIRECT_URI = request.build_absolute_uri('/api/user/google/callback/')
        
        # Create flow with Google's actual scope URLs
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI]
                }
            },
            scopes=[
                'openid',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ]
        )
        flow.redirect_uri = REDIRECT_URI
        
        # Exchange code for tokens
        flow.fetch_token(code=auth_code)
        credentials = flow.credentials
        
        # Get user info from Google
        from googleapiclient.discovery import build
        service = build('oauth2', 'v2', credentials=credentials)
        user_info = service.userinfo().get().execute()
        
        # Handle case where email might not be available
        if 'email' not in user_info:
            return Response(
                {'error': 'Email not available from Google. Please ensure your Google OAuth app has email scope enabled.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user, created = User.objects.get_or_create(
            email=user_info['email'],
            defaults={
                'first_name': user_info.get('given_name', ''),
                'last_name': user_info.get('family_name', ''),
                'is_active': True,
            }
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Redirect to API profile page with access token
        api_url = f"{settings.BACKEND_URL}/api/user/profile/?access_token={access_token}"
        return HttpResponseRedirect(api_url)
        
    except Exception as e:
        return Response(
            {'error': f'Google OAuth authentication failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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

    def get_permissions(self):
        # Allow access without authentication if access_token is provided in URL
        if self.request.GET.get('access_token'):
            return []
        return super().get_permissions()

    def get(self, request, *args, **kwargs):
        # Handle access token from URL parameter (for OAuth redirects)
        access_token = request.GET.get('access_token')
        if access_token:
            try:
                from rest_framework_simplejwt.tokens import AccessToken
                from django.contrib.auth import get_user_model
                
                # Validate the access token
                token = AccessToken(access_token)
                user_id = token['user_id']
                User = get_user_model()
                user = User.objects.get(id=user_id)
                
                # Set the user in the request for authentication
                request.user = user
                
                # Return profile data with success message
                try:
                    profile = user.profile
                    serializer = self.get_serializer(profile)
                    return Response({
                        'profile': serializer.data,
                        'user': {
                            'id': user.id,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'is_active': user.is_active,
                        },
                        'message': 'Google OAuth login successful!',
                        'access_token': access_token
                    })
                except UserProfile.DoesNotExist:
                    return Response({
                        'user': {
                            'id': user.id,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'is_active': user.is_active,
                        },
                        'message': 'Google OAuth login successful! Profile not yet created.',
                        'access_token': access_token
                    })
                    
            except Exception as e:
                return Response({
                    'error': 'Invalid access token',
                    'message': str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Normal authenticated request
        return super().get(request, *args, **kwargs)

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
