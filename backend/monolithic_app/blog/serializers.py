from rest_framework import serializers
from .models import BlogPost, Testimonial, Contributor, SiteStatistics


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'excerpt', 'content', 'slug', 'created_at', 'updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'text', 'avatar', 'position', 'created_at', 'featured']


class ContributorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contributor
        fields = ['id', 'name', 'avatar', 'contributions', 'joined_at']


class SiteStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStatistics
        fields = ['total_donations', 'total_causes', 'total_donors', 'impact_score', 'last_updated']
