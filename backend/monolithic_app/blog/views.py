from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Sum, Count
from .models import BlogPost, Testimonial, Contributor, SiteStatistics
from .serializers import BlogPostSerializer, TestimonialSerializer, ContributorSerializer, SiteStatisticsSerializer


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for blog posts - read-only for public access
    """
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for testimonials - read-only for public access
    """
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Return all testimonials, optionally filter by featured"""
        queryset = super().get_queryset()
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        return queryset


class ContributorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for contributors - read-only for public access
    """
    queryset = Contributor.objects.all()
    serializer_class = ContributorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class StatisticsViewSet(viewsets.ViewSet):
    """
    ViewSet for site statistics - dynamic calculation
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request):
        """
        Return calculated site statistics
        """
        # Try to get cached statistics first
        try:
            cached_stats = SiteStatistics.objects.latest('last_updated')
            serializer = SiteStatisticsSerializer(cached_stats)
            return Response(serializer.data)
        except SiteStatistics.DoesNotExist:
            pass

        # Calculate statistics dynamically if no cached version
        from donations.models import Donation
        from causes.models import Cause
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        
        try:
            total_donations = Donation.objects.filter(status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            total_causes = Cause.objects.count()
            total_donors = Donation.objects.filter(status='completed').values('user').distinct().count()
            
            # Create basic statistics
            stats_data = {
                'total_donations': total_donations,
                'total_causes': total_causes,
                'total_donors': total_donors,
                'impact_score': int(total_donations / 100) if total_donations > 0 else 0,
            }
            
            return Response(stats_data)
            
        except Exception as e:
            # Return default statistics if calculation fails
            return Response({
                'total_donations': 0,
                'total_causes': 0,
                'total_donors': 0,
                'impact_score': 0,
            })
