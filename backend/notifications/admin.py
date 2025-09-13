from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import AdminNotification

@admin.register(AdminNotification)
class AdminNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'priority', 'is_read', 'created_at', 'priority_badge')
    list_filter = ('notification_type', 'priority', 'is_read', 'is_archived', 'created_at')
    search_fields = ('title', 'message')
    list_editable = ('is_read',)
    readonly_fields = ('created_at', 'read_at')
    ordering = ('-created_at',)
    list_per_page = 25
    
    actions = ['mark_as_read', 'mark_as_unread', 'archive_notifications']
    
    def priority_badge(self, obj):
        colors = {
            'low': '#28a745',
            'medium': '#ffc107', 
            'high': '#fd7e14',
            'urgent': '#dc3545'
        }
        color = colors.get(obj.priority, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color, obj.get_priority_display().upper()
        )
    priority_badge.short_description = 'Priority'
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True, read_at=timezone.now())
        self.message_user(request, f'{updated} notifications marked as read.')
    mark_as_read.short_description = "Mark as read"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False, read_at=None)
        self.message_user(request, f'{updated} notifications marked as unread.')
    mark_as_unread.short_description = "Mark as unread"
    
    def archive_notifications(self, request, queryset):
        updated = queryset.update(is_archived=True)
        self.message_user(request, f'{updated} notifications archived.')
    archive_notifications.short_description = "Archive notifications"
    
    fieldsets = (
        ('Notification Details', {
            'fields': ('title', 'message', 'notification_type', 'priority')
        }),
        ('Related Objects', {
            'fields': ('cause', 'user', 'donation'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_read', 'is_archived', 'created_at', 'read_at')
        }),
    )
