import uuid

from django.db import models
from django.utils.text import slugify


# Create your models here.
class Causes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = [
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE, related_name='causes')
    description = models.TextField(blank=True)
    organizer_id = models.ForeignKey('users_n_auth.User', on_delete=models.CASCADE, related_name='organized_causes', help_text="References the organizer's user ID from the user-service.")
    # Note: This field is not unique. Multiple events can have the same organizer.
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    rejection_reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing', db_index=True)
    cover_image = models.ImageField(upload_to='causes_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Causes"