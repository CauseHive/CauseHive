from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import (register_user, LoginView, LogoutView, GoogleLogin, request_password_reset, reset_password_confirm,
                    UserProfileDetailView, UserAccountDeleteView, UserDetailView, AdminUserListView, BankListAPIView, MobileMoneyListAPIView, ValidateBankAccountAPIView, google_oauth_callback, google_oauth_url, UserMeView, UserCombinedView)
# from .google_oauth_views import google_oauth_callback, google_oauth_url  # Deleted file

# JWT Authentication URLs
jwt_urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

# Social Authentication URLs
social_urlpatterns = [
    path('google/url/', google_oauth_url, name='google_oauth_url'),
    path('google/callback/', google_oauth_callback, name='google_oauth_callback'),
]

password_urlpatterns = [
    path('password-reset/', request_password_reset, name='password_reset'),
    path('password-reset/confirm/<uidb64>/<token>/', reset_password_confirm, name='password_reset_confirm'),
]

urlpatterns = [
    # Authentication
    path('auth/signup/', register_user, name='signup'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileDetailView.as_view(), name='profile_view'),
    path('me/', UserMeView.as_view(), name='user_me'),
    path('combined/', UserCombinedView.as_view(), name='user_combined'),
    path('users/<uuid:id>/', UserDetailView.as_view(), name='user_detail'),
    path('profile/delete', UserAccountDeleteView.as_view(), name='account_delete'),
    # path('admin-see/users/', AdminUserListView.as_view(), name='user_list'),
    path('banks/', BankListAPIView.as_view(), name='bank_list'),
    path('mobile-money/', MobileMoneyListAPIView.as_view(), name='mobile_money_list'),
    path('validate-bank-account/', ValidateBankAccountAPIView.as_view(), name='validate_bank_account'),
]

urlpatterns += jwt_urlpatterns
urlpatterns += social_urlpatterns
urlpatterns += password_urlpatterns

# Compatibility aliases under /api/user/auth/* expected by frontend
from django.urls import re_path
from django.http import HttpResponseRedirect
from django.utils.http import urlencode

urlpatterns += [
    path('auth/password-reset/', request_password_reset, name='auth_password_reset'),
    # For backwards compatibility, accept confirm via /auth/password-reset-confirm/?uid=..&token=..
    path('auth/password-reset-confirm/', lambda request: HttpResponseRedirect(
        f"/api/user/password-reset/confirm/{request.GET.get('uid','')}/{request.GET.get('token','')}/"
    )),
]