import uuid

from django.db import models

# Create your models here.
class AdminNotification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    NOTIF_TYP_CHOICES = [
        ('cause_pending', 'Cause Pending'),
    ]
    notif_type = models.CharField(max_length=50, choices=NOTIF_TYP_CHOICES)
    entity_id = models.CharField(max_length=100),
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notif_type} - {self.entity_id} - {self.message[:30]}"