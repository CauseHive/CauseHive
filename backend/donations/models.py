import uuid

from django.db import models

# Create your models here.
class Donation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey('users_n_auth.User', db_index=True, editable=False, on_delete=models.CASCADE, null=True,
                                default=None,
                                help_text='References the user ID from the user service')
    cause_id = models.ForeignKey('causes.Causes', db_index=True, editable=False, on_delete=models.CASCADE, help_text='References the cause ID from the cause service')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')  # Default currency is GHS
    donated_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='pending', db_index=True)
    recipient_id = models.ForeignKey('users_n_auth.User', db_index=True, editable=False, on_delete=models.CASCADE, related_name='donations_received', help_text='References the recipient user ID')
    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)  # Unique transaction ID from payment gateway