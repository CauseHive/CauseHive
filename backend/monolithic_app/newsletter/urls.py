from django.urls import path
from .views import subscribe_newsletter, unsubscribe_newsletter

urlpatterns = [
    path('newsletter/subscribe/', subscribe_newsletter, name='newsletter-subscribe'),
    path('newsletter/unsubscribe/', unsubscribe_newsletter, name='newsletter-unsubscribe'),
]
