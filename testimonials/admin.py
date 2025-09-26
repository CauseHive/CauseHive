from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Testimonial, TestimonialLike, TestimonialReport


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """Admin interface for testimonials"""
    
    list_display = [
        'id', 'user_name', 'cause_name', 'rating', 'approval_status', 
        'featured_status', 'verification_status', 'likes_count', 'created_at'
    ]
    list_filter = [
        'is_approved', 'is_featured', 'is_verified_donation', 
        'rating', 'created_at'
    ]
    search_fields = [
        'user__username', 'user__first_name', 'user__last_name',
        'cause__name', 'review_text'
    ]
    readonly_fields = ['created_at', 'updated_at', 'likes_count']
    raw_id_fields = ['user', 'cause']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'cause', 'rating', 'review_text')
        }),
        ('Moderation', {
            'fields': (
                'is_approved', 'is_featured', 'moderation_notes',
                'is_verified_donation'
            )
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'likes_count'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'cause'
        ).annotate(
            likes_count=admin.Count('likes')
        )
    
    def user_name(self, obj):
        """Display user's name with link to user admin"""
        url = reverse('admin:auth_user_change', args=[obj.user.pk])
        return format_html('<a href="{}">{}</a>', url, obj.user_name)
    user_name.short_description = 'User'
    user_name.admin_order_field = 'user__username'
    
    def cause_name(self, obj):
        """Display cause name with link to cause admin"""
        url = reverse('admin:causes_cause_change', args=[obj.cause.pk])
        return format_html('<a href="{}">{}</a>', url, obj.cause.name)
    cause_name.short_description = 'Cause'
    cause_name.admin_order_field = 'cause__name'
    
    def approval_status(self, obj):
        """Display approval status with colored indicator"""
        if obj.is_approved:
            return format_html(
                '<span style="color: green;">✓ Approved</span>'
            )
        return format_html(
            '<span style="color: red;">✗ Pending</span>'
        )
    approval_status.short_description = 'Status'
    approval_status.admin_order_field = 'is_approved'
    
    def featured_status(self, obj):
        """Display featured status"""
        if obj.is_featured:
            return format_html(
                '<span style="color: blue;">⭐ Featured</span>'
            )
        return '-'
    featured_status.short_description = 'Featured'
    featured_status.admin_order_field = 'is_featured'
    
    def verification_status(self, obj):
        """Display verification status"""
        if obj.is_verified_donation:
            return format_html(
                '<span style="color: orange;">✓ Verified Donor</span>'
            )
        return '-'
    verification_status.short_description = 'Verification'
    verification_status.admin_order_field = 'is_verified_donation'
    
    def likes_count(self, obj):
        """Display number of likes"""
        return obj.likes_count or 0
    likes_count.short_description = 'Likes'
    likes_count.admin_order_field = 'likes_count'
    
    actions = ['approve_testimonials', 'unapprove_testimonials', 'feature_testimonials']
    
    def approve_testimonials(self, request, queryset):
        """Bulk approve testimonials"""
        updated = queryset.update(is_approved=True)
        self.message_user(
            request, 
            f'{updated} testimonial(s) were approved.'
        )
    approve_testimonials.short_description = 'Approve selected testimonials'
    
    def unapprove_testimonials(self, request, queryset):
        """Bulk unapprove testimonials"""
        updated = queryset.update(is_approved=False)
        self.message_user(
            request, 
            f'{updated} testimonial(s) were unapproved.'
        )
    unapprove_testimonials.short_description = 'Unapprove selected testimonials'
    
    def feature_testimonials(self, request, queryset):
        """Bulk feature testimonials"""
        updated = queryset.update(is_featured=True)
        self.message_user(
            request, 
            f'{updated} testimonial(s) were featured.'
        )
    feature_testimonials.short_description = 'Feature selected testimonials'


@admin.register(TestimonialLike)
class TestimonialLikeAdmin(admin.ModelAdmin):
    """Admin interface for testimonial likes"""
    
    list_display = ['id', 'user', 'testimonial_info', 'created_at']
    list_filter = ['created_at']
    search_fields = [
        'user__username', 'testimonial__user__username',
        'testimonial__cause__name'
    ]
    raw_id_fields = ['user', 'testimonial']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'testimonial__user', 'testimonial__cause'
        )
    
    def testimonial_info(self, obj):
        """Display testimonial information"""
        return f"{obj.testimonial.user_name} - {obj.testimonial.cause.name}"
    testimonial_info.short_description = 'Testimonial'


@admin.register(TestimonialReport)
class TestimonialReportAdmin(admin.ModelAdmin):
    """Admin interface for testimonial reports"""
    
    list_display = [
        'id', 'reporter', 'testimonial_info', 'reason', 
        'resolution_status', 'created_at'
    ]
    list_filter = [
        'is_resolved', 'reason', 'created_at', 'resolved_at'
    ]
    search_fields = [
        'reporter__username', 'testimonial__user__username',
        'testimonial__cause__name', 'description'
    ]
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['reporter', 'testimonial', 'resolved_by']
    
    fieldsets = (
        ('Report Information', {
            'fields': ('reporter', 'testimonial', 'reason', 'description')
        }),
        ('Resolution', {
            'fields': (
                'is_resolved', 'resolution_notes', 'resolved_by', 'resolved_at'
            )
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'reporter', 'testimonial__user', 'testimonial__cause', 'resolved_by'
        )
    
    def testimonial_info(self, obj):
        """Display testimonial information with admin link"""
        url = reverse('admin:testimonials_testimonial_change', 
                     args=[obj.testimonial.pk])
        return format_html(
            '<a href="{}">{} - {}</a>', 
            url, 
            obj.testimonial.user_name, 
            obj.testimonial.cause.name
        )
    testimonial_info.short_description = 'Testimonial'
    
    def resolution_status(self, obj):
        """Display resolution status with colored indicator"""
        if obj.is_resolved:
            return format_html(
                '<span style="color: green;">✓ Resolved</span>'
            )
        return format_html(
            '<span style="color: red;">⚠ Pending</span>'
        )
    resolution_status.short_description = 'Status'
    resolution_status.admin_order_field = 'is_resolved'
    
    actions = ['mark_resolved', 'mark_unresolved']
    
    def mark_resolved(self, request, queryset):
        """Mark reports as resolved"""
        from django.utils import timezone
        updated = queryset.update(
            is_resolved=True,
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
        self.message_user(
            request, 
            f'{updated} report(s) were marked as resolved.'
        )
    mark_resolved.short_description = 'Mark selected reports as resolved'
    
    def mark_unresolved(self, request, queryset):
        """Mark reports as unresolved"""
        updated = queryset.update(
            is_resolved=False,
            resolved_by=None,
            resolved_at=None
        )
        self.message_user(
            request, 
            f'{updated} report(s) were marked as unresolved.'
        )
    mark_unresolved.short_description = 'Mark selected reports as unresolved'