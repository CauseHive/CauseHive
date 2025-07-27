from django.contrib import admin
from django.utils.html import format_html

from .models import User, UserProfile

# Register your models here.
admin.site.site_header = "CauseHive"
admin.site.site_title = "CauseHive"

class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_active', 'date_joined')
    list_display_links = ('first_name', 'email')

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