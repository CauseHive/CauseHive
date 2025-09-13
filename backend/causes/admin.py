from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import Causes

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
    actions = ['approve_causes', 'reject_causes', 'export_causes_data']
    
    def progress_bar(self, obj):
        if obj.target_amount > 0:
            percentage = min((obj.current_amount / obj.target_amount) * 100, 100)
            if percentage >= 100:
                color = '#28a745'  # Green
                text_color = 'white'
            elif percentage >= 50:
                color = '#ffc107'  # Orange/Yellow
                text_color = 'black'
            else:
                color = '#dc3545'  # Red
                text_color = 'white'
            
            return format_html(
                '<div style="width: 100px; background-color: #e9ecef; border-radius: 10px; overflow: hidden; border: 1px solid #dee2e6;">'
                '<div style="width: {}%; height: 20px; background-color: {}; text-align: center; line-height: 20px; color: {}; font-size: 10px; font-weight: bold;">'
                '{}%</div></div>',
                percentage, color, text_color, f"{percentage:.1f}"
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
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} causes were successfully approved.')
    approve_causes.short_description = "Approve selected causes"
    
    def reject_causes(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} causes were successfully rejected.')
    reject_causes.short_description = "Reject selected causes"
    
    def export_causes_data(self, request, queryset):
        self.message_user(request, f'Exporting data for {queryset.count()} causes...')
    export_causes_data.short_description = "Export causes data"
    
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
