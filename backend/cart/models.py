import uuid

from django.db import models

from donations.models import Donation


# Create your models here.
class Cart(models.Model):
    CART_STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey('users_n_auth.User', db_index=True, editable=False, on_delete=models.CASCADE, null=True, default=None,
                                help_text='References the user ID from the user service')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=CART_STATUS_CHOICES, default='active', db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_id', 'status'],
                condition=models.Q(status='active'),
                name='unique_active_cart_per_user'
            )
        ]

class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    cause_id = models.UUIDField(db_index=True, help_text='References the cause ID from the causes app')  # Changed to UUIDField
    donation = models.OneToOneField(Donation, on_delete=models.SET_NULL, null=True, blank=True, related_name='cart_item')
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'cause_id')