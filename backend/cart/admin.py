from django.contrib import admin
from .models import Cart, CartItem

# Register your models here.
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('id',)
    fields = ('cause_id', 'donation_amount', 'quantity', 'donation')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'status', 'item_count', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('user_id__email', 'user_id__first_name', 'user_id__last_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [CartItemInline]
    
    def user_email(self, obj):
        return obj.user_id.email if obj.user_id else "Anonymous"
    user_email.short_description = "User Email"
    user_email.admin_order_field = 'user_id__email'
    
    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = "Items Count"
    
    fieldsets = (
        ('Cart Information', {
            'fields': ('user_id', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user_id').prefetch_related('items')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart_user', 'cause_id', 'donation_amount', 'quantity', 'has_donation')
    list_filter = ('cart__status', 'cart__created_at')
    search_fields = ('cart__user_id__email', 'cause_id')
    readonly_fields = ('id',)
    
    def cart_user(self, obj):
        return obj.cart.user_id.email if obj.cart.user_id else "Anonymous"
    cart_user.short_description = "Cart User"
    cart_user.admin_order_field = 'cart__user_id__email'
    
    def has_donation(self, obj):
        return "Yes" if obj.donation else "No"
    has_donation.short_description = "Has Donation"
    has_donation.boolean = True
    
    fieldsets = (
        ('Item Details', {
            'fields': ('cart', 'cause_id', 'donation_amount', 'quantity')
        }),
        ('Donation Information', {
            'fields': ('donation',)
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('cart__user_id', 'donation')
