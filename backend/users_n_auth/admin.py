from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

from .models import User, UserProfile

# Register your models here.
admin.site.site_header = "CauseHive Admin"
admin.site.site_title = "CauseHive"
admin.site.index_title = "Welcome to CauseHive Administration"

class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'is_active', 'date_joined', 'donation_count', 'causes_created')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_active', 'date_joined', 'is_staff', 'is_superuser')
    list_display_links = ('first_name', 'email')
    readonly_fields = ('id', 'date_joined', 'last_login')
    ordering = ('-date_joined',)
    list_per_page = 25
    
    # Custom actions
    actions = ['activate_users', 'deactivate_users', 'export_user_data']
    
    def donation_count(self, obj):
        return obj.donation_set.count()
    donation_count.short_description = "Donations Made"
    donation_count.admin_order_field = 'donation__count'
    
    def causes_created(self, obj):
        return obj.organized_causes.count()
    causes_created.short_description = "Causes Created"
    causes_created.admin_order_field = 'organized_causes__count'
    
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users were successfully activated.')
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users were successfully deactivated.')
    deactivate_users.short_description = "Deactivate selected users"
    
    def export_user_data(self, request, queryset):
        # This would typically generate a CSV or Excel file
        self.message_user(request, f'Exporting data for {queryset.count()} users...')
    export_user_data.short_description = "Export user data"
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Account Status', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Timestamps', {
            'fields': ('date_joined', 'last_login'),
            'classes': ('collapse',)
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )

admin.site.register(User, UserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'profile_picture_thumbnail')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    list_filter = ('user__is_active',)

    def profile_picture_thumbnail(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius:50%;" />',
                obj.profile_picture.url
            )
        return "No Image"
    profile_picture_thumbnail.short_description = "Profile Picture"