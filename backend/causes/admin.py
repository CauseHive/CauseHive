from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render, redirect
from django.db.models import Count, Sum
from django.utils import timezone
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta

from .email_utils import send_cause_approved_email, send_cause_rejected_email
from .models import Causes
from notifications.services import NotificationService

# Register your models here.
@admin.register(Causes)
class CausesAdmin(admin.ModelAdmin):
    list_display = ('name', 'organizer_id', 'category', 'status', 'target_amount', 'current_amount', 'progress_bar', 'donation_count', 'created_at')
    list_filter = ('status', 'category', 'created_at', 'organizer_id')
    search_fields = ('name', 'description', 'organizer_id__email', 'organizer_id__first_name', 'organizer_id__last_name')
    list_editable = ('status',)
    readonly_fields = ('id', 'slug', 'created_at', 'current_amount', 'progress_percentage', 'donation_count')
    ordering = ('-created_at',)
    list_per_page = 25
    
    # Custom actions
    actions = ['approve_causes', 'reject_causes', 'put_under_review', 'export_causes_data']
    
    def progress_bar(self, obj):
        if obj.target_amount > 0:
            percentage = min((obj.current_amount / obj.target_amount) * 100, 100)
            if percentage >= 100:
                # Completed - Dark green with white text
                bg_color = '#059669'
                text_color = '#ffffff'
                border_color = '#047857'
            elif percentage >= 75:
                # High progress - Blue with white text
                bg_color = '#2563eb'
                text_color = '#ffffff'
                border_color = '#1d4ed8'
            elif percentage >= 50:
                # Medium progress - Amber with dark text
                bg_color = '#f59e0b'
                text_color = '#1f2937'
                border_color = '#d97706'
            elif percentage >= 25:
                # Low progress - Orange with white text
                bg_color = '#ea580c'
                text_color = '#ffffff'
                border_color = '#c2410c'
            else:
                # Very low progress - Gray with white text
                bg_color = '#6b7280'
                text_color = '#ffffff'
                border_color = '#4b5563'
            
            return format_html(
                '<div style="width: 120px; height: 24px; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; position: relative; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">'
                '<div style="width: {}%; height: 100%; background: linear-gradient(135deg, {} 0%, {} 100%); border-right: 1px solid {}; position: relative;"></div>'
                '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: {}; font-size: 11px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3); white-space: nowrap; z-index: 10;">'
                '{}%</span></div>',
                percentage, bg_color, bg_color, border_color, text_color, f"{percentage:.1f}"
            )
        return "N/A"
    progress_bar.short_description = "Progress"
    progress_bar.admin_order_field = 'current_amount'
    
    def progress_percentage(self, obj):
        if obj.target_amount > 0:
            return f"{(obj.current_amount / obj.target_amount) * 100:.1f}%"
        return "N/A"
    progress_percentage.short_description = "Progress %"
    
    def donation_count(self, obj):
        return obj.donation_set.count()
    donation_count.short_description = "Donations"
    donation_count.admin_order_field = 'donation__count'
    
    def approve_causes(self, request, queryset):
        causes_to_approve = queryset.filter(status__in=['under_review', 'rejected'])

        # Causes approved
        causes_list = list(causes_to_approve)

        updated = causes_to_approve.update(status='ongoing')
        
        # Send notifications to organizers and create admin notifications
        for cause in causes_list:
            self._send_approval_notification(cause, 'approved')
            NotificationService.notify_cause_approved(cause)
        
        self.message_user(request, f'{updated} causes were successfully approved and are now live!', level=messages.SUCCESS)
    approve_causes.short_description = "✅ Approve & Go Live"
    
    def reject_causes(self, request, queryset):
        # Get causes that will be rejected for notification
        causes_to_reject = queryset.filter(status__in=['under_review', 'approved'])

        causes_list = list(causes_to_reject)

        updated = causes_to_reject.update(status='rejected')
        
        # Send notifications to organizers and create admin notifications
        for cause in causes_to_reject:
            self._send_approval_notification(cause, 'rejected')
            NotificationService.notify_cause_rejected(cause)
        
        self.message_user(request, f'{updated} causes were successfully rejected.', level=messages.WARNING)
    reject_causes.short_description = "❌ Reject selected causes"
    
    def put_under_review(self, request, queryset):
        updated = queryset.update(status='under_review')
        self.message_user(request, f'{updated} causes were put under review.', level=messages.INFO)
    put_under_review.short_description = "🔍 Put under review"
    
    def export_causes_data(self, request, queryset):
        self.message_user(request, f'Exporting data for {queryset.count()} causes...')
    export_causes_data.short_description = "📊 Export causes data"
    
    def _send_approval_notification(self, cause, action):
        """Send email notification to cause organizer"""
        try:
            organizer = cause.organizer_id

            
            if action == 'approved':

                cause_url = f"{settings.FRONTEND_URL}/causes/{cause.id}/" if hasattr(settings, 'FRONTEND_URL') else None
                send_cause_approved_email(
                    to_email=organizer.email,
                    organizer_name=organizer.first_name,
                    cause_name=cause.name,
                    target_amount=cause.target_amount,
                    category_name=cause.category.name if cause.category else 'Uncategorized',
                    cause_url=cause_url
                )
            else:  # rejected
                create_new_cause_url = f"{settings.FRONTEND_URL}/create-cause/" if hasattr(settings, 'FRONTEND_URL') else None
                send_cause_rejected_email(
                    to_email=organizer.email,
                    organizer_name=organizer.first_name,
                    cause_name=cause.name,
                    currency="₵",
                    target_amount=cause.target_amount,
                    category_name=cause.category.name if cause.category else 'Uncategorized',
                    rejection_reason=cause.rejection_reason or "No specific reason provided. Maybe admin forgot to add one.",
                    create_new_cause_url=create_new_cause_url
                )


        except Exception as e:
            print(f"Failed to send notification: {e}")
    
    def get_queryset(self, request):
        """Optimize queryset for better performance"""
        return super().get_queryset(request).select_related('category', 'organizer_id').prefetch_related('donation_set')
    
    def changelist_view(self, request, extra_context=None):
        """Add extra context for the changelist view"""
        extra_context = extra_context or {}
        
        # Add statistics for the approval dashboard
        total_causes = Causes.objects.count()
        pending_causes = Causes.objects.filter(status='under_review').count()
        approved_causes = Causes.objects.filter(status='approved').count()
        rejected_causes = Causes.objects.filter(status='rejected').count()
        
        extra_context.update({
            'total_causes': total_causes,
            'pending_causes': pending_causes,
            'approved_causes': approved_causes,
            'rejected_causes': rejected_causes,
        })
        
        return super().changelist_view(request, extra_context)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'description', 'organizer_id')
        }),
        ('Financial Details', {
            'fields': ('target_amount', 'current_amount', 'progress_percentage', 'donation_count')
        }),
        ('Status & Media', {
            'fields': ('status', 'cover_image', 'rejection_reason')
        }),
        ('System Fields', {
            'fields': ('id', 'slug', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def cover_image_thumbnail(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover;" />',
                obj.cover_image.url
            )
        return "No Image"
    cover_image_thumbnail.short_description = "Cover Image"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('organizer_id', 'category').prefetch_related('donation_set')
