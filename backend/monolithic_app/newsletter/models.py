from django.db import models
from django.core.validators import EmailValidator


class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    confirmation_token = models.CharField(max_length=100, blank=True, null=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email
