from django.db.models.signals import post_save
from django.dispatch import receiver
from .services import NotificationService
from causes.models import Causes
from donations.models import Donation
from users_n_auth.models import User

@receiver(post_save, sender=Causes)
def notify_cause_created(sender, instance, created, **kwargs):
    """Send notification when a new cause is created"""
    if created and instance.status == 'under_review':
        NotificationService.notify_cause_pending(instance)

@receiver(post_save, sender=Donation)
def notify_donation_created(sender, instance, created, **kwargs):
    """Send notification when a new donation is made"""
    if created:
        NotificationService.notify_new_donation(instance)

@receiver(post_save, sender=User)
def notify_user_registered(sender, instance, created, **kwargs):
    """Send notification when a new user registers"""
    if created:
        NotificationService.notify_new_user(instance)
