import uuid
from django.utils import timezone

from django.db import models


class WithdrawalRequest(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
        ('paystack_transfer', 'Paystack Transfer'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey('users_n_auth.User', db_index=True, editable=False, on_delete=models.CASCADE, help_text='References the user ID from the user service')
    cause_id = models.ForeignKey('causes.Causes', db_index=True, editable=False, on_delete=models.CASCADE, help_text='References the cause ID from the cause service')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS', help_text='Currency of the withdrawal amount')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='processing', db_index=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='bank_transfer')
    payment_details = models.JSONField(help_text='Details of the payment account')
    recipient_code = models.CharField(max_length=100, blank=True, null=True, help_text='Code of the recipient for future transactions.')
    transaction_id = models.CharField(max_length=100, blank=True, null=True,
                                      help_text='Transaction ID from the payment gateway')
    failure_reason = models.TextField(blank=True, null=True, help_text='Reason for failure if the request fails')
    requested_at = models.DateTimeField(auto_now_add=True, help_text='When the withdrawal request was made')
    completed_at = models.DateTimeField(auto_now_add=True, help_text='When the withdrawal request was completed')

    class Meta:
        ordering = ['-requested_at']
        verbose_name = 'Withdrawal Request'
        verbose_name_plural = 'Withdrawal Requests'

    def __str__(self):
        return f"Withdrawal {self.id} - {self.user_id} - {self.amount} {self.currency}"

    def mark_as_completed(self, transaction_id=None):
        self.status = 'completed'
        self.completed_at = timezone.now()
        if transaction_id:
            self.transaction_id = transaction_id
        self.save()

    def mark_as_failed(self, failure_reason=None):
        self.status = 'failed'
        self.completed_at = timezone.now()
        if failure_reason:
            self.failure_reason = failure_reason
        self.save()