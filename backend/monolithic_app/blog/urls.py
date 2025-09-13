from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, TestimonialViewSet, ContributorViewSet, StatisticsViewSet

router = DefaultRouter()
router.register(r'blog-posts', BlogPostViewSet, basename='blog-posts')
router.register(r'testimonials', TestimonialViewSet, basename='testimonials')
router.register(r'contributors', ContributorViewSet, basename='contributors')
router.register(r'statistics', StatisticsViewSet, basename='statistics')

urlpatterns = [
    path('', include(router.urls)),
]
