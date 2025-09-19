from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Avg, Q
from django.shortcuts import get_object_or_404
from causes.models import Cause
from .models import Testimonial, TestimonialLike, TestimonialReport
from .serializers import (
    TestimonialSerializer, TestimonialCreateSerializer, 
    TestimonialLikeSerializer, TestimonialStatsSerializer,
    TestimonialReportSerializer, TestimonialModerationSerializer
)


class TestimonialPagination(PageNumberPagination):
    """Custom pagination for testimonials"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class CauseTestimonialsListView(generics.ListAPIView):
    """List testimonials for a specific cause"""
    
    serializer_class = TestimonialSerializer
    pagination_class = TestimonialPagination
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        cause_id = self.kwargs['cause_id']
        queryset = Testimonial.objects.filter(
            cause_id=cause_id,
            is_approved=True
        ).select_related('user', 'cause').annotate(
            likes_count=Count('likes')
        )
        
        # Sorting
        sort_by = self.request.query_params.get('sort', 'newest')
        if sort_by == 'oldest':
            queryset = queryset.order_by('created_at')
        elif sort_by == 'highest_rated':
            queryset = queryset.order_by('-rating', '-created_at')
        else:  # newest
            queryset = queryset.order_by('-created_at')
        
        return queryset


class TestimonialCreateView(generics.CreateAPIView):
    """Create a new testimonial"""
    
    serializer_class = TestimonialCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        testimonial = serializer.save()
        
        # Check if user has donated to this cause for verification
        # This would integrate with your donations app
        # from donations.models import Donation
        # has_donated = Donation.objects.filter(
        #     user=self.request.user,
        #     cause=testimonial.cause,
        #     status='completed'
        # ).exists()
        # testimonial.is_verified_donation = has_donated
        # testimonial.save()


class TestimonialUpdateView(generics.UpdateAPIView):
    """Update an existing testimonial"""
    
    serializer_class = TestimonialCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Testimonial.objects.filter(user=self.request.user)


class TestimonialDeleteView(generics.DestroyAPIView):
    """Delete a testimonial"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Testimonial.objects.filter(user=self.request.user)


class UserTestimonialsListView(generics.ListAPIView):
    """List testimonials by a specific user"""
    
    serializer_class = TestimonialSerializer
    pagination_class = TestimonialPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id:
            # Public view of user's testimonials
            return Testimonial.objects.filter(
                user_id=user_id,
                is_approved=True
            ).select_related('user', 'cause').annotate(
                likes_count=Count('likes')
            ).order_by('-created_at')
        else:
            # Current user's own testimonials (including unapproved)
            return Testimonial.objects.filter(
                user=self.request.user
            ).select_related('user', 'cause').annotate(
                likes_count=Count('likes')
            ).order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_testimonial_like(request, testimonial_id):
    """Toggle like on a testimonial"""
    
    testimonial = get_object_or_404(Testimonial, id=testimonial_id, is_approved=True)
    
    like, created = TestimonialLike.objects.get_or_create(
        testimonial=testimonial,
        user=request.user
    )
    
    if not created:
        # Unlike
        like.delete()
        liked = False
    else:
        # Like
        liked = True
    
    # Get updated like count
    likes_count = testimonial.likes.count()
    
    return Response({
        'liked': liked,
        'likes_count': likes_count
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def cause_testimonials_stats(request, cause_id):
    """Get statistics for cause testimonials"""
    
    cause = get_object_or_404(Cause, id=cause_id)
    
    testimonials = Testimonial.objects.filter(
        cause=cause,
        is_approved=True
    )
    
    stats = testimonials.aggregate(
        total_reviews=Count('id'),
        average_rating=Avg('rating')
    )
    
    # Rating distribution
    rating_distribution = {}
    for i in range(1, 6):
        count = testimonials.filter(rating=i).count()
        rating_distribution[str(i)] = count
    
    # Featured testimonials (highest rated recent ones)
    featured_testimonials = testimonials.filter(
        is_featured=True
    ).select_related('user').annotate(
        likes_count=Count('likes')
    ).order_by('-created_at')[:3]
    
    if not featured_testimonials.exists():
        # Fallback to highest rated recent testimonials
        featured_testimonials = testimonials.filter(
            rating__gte=4
        ).select_related('user').annotate(
            likes_count=Count('likes')
        ).order_by('-rating', '-created_at')[:3]
    
    data = {
        'total_reviews': stats['total_reviews'] or 0,
        'average_rating': round(stats['average_rating'] or 0, 1),
        'rating_distribution': rating_distribution,
        'featured_testimonials': TestimonialSerializer(
            featured_testimonials, 
            many=True, 
            context={'request': request}
        ).data
    }
    
    return Response(data)


class TestimonialReportCreateView(generics.CreateAPIView):
    """Report a testimonial"""
    
    serializer_class = TestimonialReportSerializer
    permission_classes = [permissions.IsAuthenticated]


# Admin/Moderation Views
class TestimonialModerationListView(generics.ListAPIView):
    """List testimonials for moderation (admin only)"""
    
    serializer_class = TestimonialModerationSerializer
    pagination_class = TestimonialPagination
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = Testimonial.objects.select_related('user', 'cause')
        
        # Filter parameters
        status_filter = self.request.query_params.get('status', 'all')
        if status_filter == 'pending':
            queryset = queryset.filter(is_approved=False)
        elif status_filter == 'approved':
            queryset = queryset.filter(is_approved=True)
        elif status_filter == 'featured':
            queryset = queryset.filter(is_featured=True)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(review_text__icontains=search) |
                Q(user__username__icontains=search) |
                Q(cause__name__icontains=search)
            )
        
        return queryset.order_by('-created_at')


class TestimonialModerationUpdateView(generics.UpdateAPIView):
    """Update testimonial moderation status (admin only)"""
    
    serializer_class = TestimonialModerationSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Testimonial.objects.all()


class TestimonialReportsListView(generics.ListAPIView):
    """List testimonial reports for moderation (admin only)"""
    
    serializer_class = TestimonialReportSerializer
    pagination_class = TestimonialPagination
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = TestimonialReport.objects.select_related(
            'testimonial', 'reporter', 'resolved_by'
        )
        
        # Filter by resolution status
        status_filter = self.request.query_params.get('status', 'pending')
        if status_filter == 'pending':
            queryset = queryset.filter(is_resolved=False)
        elif status_filter == 'resolved':
            queryset = queryset.filter(is_resolved=True)
        
        return queryset.order_by('-created_at')