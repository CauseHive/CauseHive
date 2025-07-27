import uuid

from django.db import models
from django.utils import timezone

# Create your models here.
class CachedReportData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report_type = models.CharField(max_length=50)
    data = models.JSONField()
    generated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('report_type', 'generated_at')

    def __str__(self):
        return f"{self.report_type} report at {self.generated_at}"