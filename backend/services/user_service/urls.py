from django.urls import path
from .views import signup, login, google_auth

urlpatterns = [
    path('api/auth/signup/', signup, name='signup'),
    path('api/auth/login/', login, name='login'),
    path('api/auth/google/', google_auth, name='google_auth'),
]