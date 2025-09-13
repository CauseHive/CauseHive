from django.contrib import admin
from .models import NewsletterSubscription


@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at', 'confirmed_at']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email']
    readonly_fields = ['subscribed_at', 'confirmed_at']
