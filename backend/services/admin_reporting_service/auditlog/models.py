import uuid

from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ACTION_CHOICES = [
        ('approve', 'Approve'),
        ('reject', 'Reject'),
    ]
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, related_name='audit_logs', null=True, blank=True)
    entity_type = models.CharField(max_length=50) # e.g., 'cause', 'donation'
    entity_id = models.UUIDField()  # ID of the cause or donation
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    reason = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    extra_data = models.JSONField(null=True, blank=True)  # For any additional data related to the action

    def __str__(self):
        return f"{self.user} {self.action} {self.entity_type} {self.entity_id} at {self.timestamp}"
