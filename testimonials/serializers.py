from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Count, Avg
from .models import Testimonial, TestimonialLike, TestimonialReport


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user information for testimonials"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for testimonials"""
    
    user_name = serializers.CharField(read_only=True)
    user_avatar = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'cause', 'rating', 'review_text', 'created_at', 'updated_at',
            'user_name', 'user_avatar', 'likes_count', 'is_liked', 
            'is_verified_donation', 'is_featured'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified_donation', 'is_featured']
    
    def get_user_avatar(self, obj):
        """Get user avatar URL if available"""
        if hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            return obj.user.profile.avatar.url
        return None
    
    def get_is_liked(self, obj):
        """Check if current user has liked this testimonial"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return TestimonialLike.objects.filter(
                testimonial=obj, 
                user=request.user
            ).exists()
        return False
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_review_text(self, value):
        """Validate review text"""
        if not value or not value.strip():
            raise serializers.ValidationError("Review text cannot be empty")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Review must be at least 10 characters long")
        if len(value) > 1000:
            raise serializers.ValidationError("Review must be less than 1000 characters")
        return value.strip()
    
    def create(self, validated_data):
        """Create a new testimonial"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        validated_data['user'] = request.user
        return super().create(validated_data)


class TestimonialCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating testimonials"""
    
    class Meta:
        model = Testimonial
        fields = ['cause', 'rating', 'review_text']
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_review_text(self, value):
        """Validate review text"""
        if not value or not value.strip():
            raise serializers.ValidationError("Review text cannot be empty")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Review must be at least 10 characters long")
        if len(value) > 1000:
            raise serializers.ValidationError("Review must be less than 1000 characters")
        return value.strip()
    
    def validate(self, attrs):
        """Custom validation"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        # Check if user already has a testimonial for this cause
        if Testimonial.objects.filter(
            cause=attrs['cause'], 
            user=request.user
        ).exists():
            raise serializers.ValidationError(
                "You have already submitted a review for this cause"
            )
        
        return attrs
    
    def create(self, validated_data):
        """Create a new testimonial"""
        request = self.context.get('request')
        validated_data['user'] = request.user
        
        # Check if user has donated to this cause for verification
        # This would need to be implemented based on your donation model
        # validated_data['is_verified_donation'] = self._check_donation_verification(
        #     request.user, validated_data['cause']
        # )
        
        return super().create(validated_data)


class TestimonialLikeSerializer(serializers.ModelSerializer):
    """Serializer for testimonial likes"""
    
    class Meta:
        model = TestimonialLike
        fields = ['id', 'testimonial', 'created_at']
        read_only_fields = ['id', 'created_at']


class TestimonialStatsSerializer(serializers.Serializer):
    """Serializer for testimonial statistics"""
    
    total_reviews = serializers.IntegerField()
    average_rating = serializers.FloatField()
    rating_distribution = serializers.DictField()
    featured_testimonials = TestimonialSerializer(many=True, read_only=True)


class TestimonialReportSerializer(serializers.ModelSerializer):
    """Serializer for reporting testimonials"""
    
    class Meta:
        model = TestimonialReport
        fields = [
            'id', 'testimonial', 'reason', 'description', 
            'created_at', 'is_resolved'
        ]
        read_only_fields = ['id', 'created_at', 'is_resolved']
    
    def validate(self, attrs):
        """Custom validation"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        # Check if user already reported this testimonial
        if TestimonialReport.objects.filter(
            testimonial=attrs['testimonial'], 
            reporter=request.user
        ).exists():
            raise serializers.ValidationError(
                "You have already reported this testimonial"
            )
        
        return attrs
    
    def create(self, validated_data):
        """Create a new report"""
        request = self.context.get('request')
        validated_data['reporter'] = request.user
        return super().create(validated_data)


class TestimonialModerationSerializer(serializers.ModelSerializer):
    """Serializer for moderating testimonials (admin only)"""
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'is_approved', 'is_featured', 'moderation_notes',
            'user_name', 'rating', 'review_text', 'created_at'
        ]
        read_only_fields = ['id', 'user_name', 'rating', 'review_text', 'created_at']