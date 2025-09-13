from django.contrib import admin
from .models import WithdrawalRequest

# Register your models here.
@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'cause_name', 'amount', 'currency', 'status', 'payment_method', 'requested_at')
    list_filter = ('status', 'payment_method', 'currency', 'requested_at', 'completed_at')
    search_fields = ('user_id__email', 'cause_id__name', 'transaction_id', 'recipient_code')
    readonly_fields = ('id', 'requested_at', 'completed_at')
    list_editable = ('status',)
    
    def user_email(self, obj):
        return obj.user_id.email if obj.user_id else "N/A"
    user_email.short_description = "User Email"
    user_email.admin_order_field = 'user_id__email'
    
    def cause_name(self, obj):
        return obj.cause_id.name if obj.cause_id else "N/A"
    cause_name.short_description = "Cause"
    cause_name.admin_order_field = 'cause_id__name'
    
    fieldsets = (
        ('Withdrawal Details', {
            'fields': ('user_id', 'cause_id', 'amount', 'currency', 'status')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'payment_details', 'recipient_code', 'transaction_id')
        }),
        ('Status & Timing', {
            'fields': ('failure_reason', 'requested_at', 'completed_at')
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user_id', 'cause_id')
