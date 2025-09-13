from django.contrib import admin
from .models import BlogPost, Testimonial, Contributor, SiteStatistics


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'published', 'created_at', 'updated_at']
    list_filter = ['published', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'featured', 'created_at']
    list_filter = ['featured', 'created_at']
    search_fields = ['name', 'text']


@admin.register(Contributor)
class ContributorAdmin(admin.ModelAdmin):
    list_display = ['name', 'contributions', 'joined_at']
    search_fields = ['name']
    ordering = ['-contributions']


@admin.register(SiteStatistics)
class SiteStatisticsAdmin(admin.ModelAdmin):
    list_display = ['total_donations', 'total_causes', 'total_donors', 'impact_score', 'last_updated']
    readonly_fields = ['last_updated']
