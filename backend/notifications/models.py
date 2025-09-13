from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class AdminNotification(models.Model):
    NOTIFICATION_TYPES = [
        ('cause_pending', 'Cause Pending Review'),
        ('cause_approved', 'Cause Approved'),
        ('cause_rejected', 'Cause Rejected'),
        ('new_donation', 'New Donation'),
        ('withdrawal_request', 'Withdrawal Request'),
        ('user_registration', 'New User Registration'),
        ('system_alert', 'System Alert'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Related objects (optional)
    cause = models.ForeignKey('causes.Causes', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    donation = models.ForeignKey('donations.Donation', on_delete=models.CASCADE, null=True, blank=True)
    
    # Notification status
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Admin Notification'
        verbose_name_plural = 'Admin Notifications'
    
    def __str__(self):
        return f"{self.title} - {self.get_notification_type_display()}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()
    
    def mark_as_archived(self):
        self.is_archived = True
        self.save()
