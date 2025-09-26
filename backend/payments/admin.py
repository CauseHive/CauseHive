from django.contrib import admin
from .models import PaymentTransaction

# Register your models here.
@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'donation_cause', 'amount', 'currency', 'status', 'payment_method', 'transaction_date')
    list_filter = ('status', 'currency', 'payment_method', 'transaction_date')
    search_fields = ('user_id__email', 'donation__cause_id__name', 'transaction_id')
    readonly_fields = ('id', 'transaction_date', 'transaction_id')
    list_editable = ('status',)
    
    def user_email(self, obj):
        return obj.user_id.email if obj.user_id else "Anonymous"
    user_email.short_description = "User Email"
    user_email.admin_order_field = 'user_id__email'
    
    def donation_cause(self, obj):
        return obj.donation.cause_id.name if obj.donation else "N/A"
    donation_cause.short_description = "Cause"
    donation_cause.admin_order_field = 'donation__cause_id__name'
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('donation', 'user_id', 'amount', 'currency', 'status', 'payment_method')
        }),
        ('Payment Information', {
            'fields': ('transaction_id', 'transaction_date')
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user_id', 'donation__cause_id')
