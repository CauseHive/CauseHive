from django.contrib import admin
from django.utils.html import format_html
from .models import Donation

# Register your models here.
@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'cause_name', 'amount', 'currency', 'status', 'donated_at')
    list_filter = ('status', 'currency', 'donated_at', 'cause_id__category')
    search_fields = ('user_id__email', 'cause_id__name', 'transaction_id')
    readonly_fields = ('id', 'donated_at', 'transaction_id')
    list_editable = ('status',)
    
    def user_email(self, obj):
        return obj.user_id.email if obj.user_id else "Anonymous"
    user_email.short_description = "Donor Email"
    user_email.admin_order_field = 'user_id__email'
    
    def cause_name(self, obj):
        return obj.cause_id.name
    cause_name.short_description = "Cause"
    cause_name.admin_order_field = 'cause_id__name'
    
    fieldsets = (
        ('Donation Details', {
            'fields': ('user_id', 'cause_id', 'amount', 'currency', 'status')
        }),
        ('Transaction Information', {
            'fields': ('transaction_id', 'donated_at')
        }),
        ('Recipient Information', {
            'fields': ('recipient_id',)
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user_id', 'cause_id', 'recipient_id')
