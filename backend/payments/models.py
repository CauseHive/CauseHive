import uuid

from django.db import models
from donations.models import Donation

# Create your models here.
class PaymentTransaction(models.Model):
    id =  models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE)
    user_id = models.ForeignKey('users_n_auth.User', db_index=True, editable=False, on_delete=models.CASCADE, null=True,
                                default=None,
                                help_text='References the user ID from the user service')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')  # The Default currency is GHS
    transaction_id = models.CharField(max_length=255, unique=True)  # Unique transaction ID from payment gateway
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='pending')
    transaction_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    email = models.EmailField(null=True, blank=True, help_text="Email address of the payment method ('anonymous')")

    def __str__(self):
        return f"Payment for {self.donation} by {self.user_id} - {self.status}"