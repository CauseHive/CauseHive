from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import AdminNotification

User = get_user_model()

class NotificationService:
    @staticmethod
    def create_notification(title, message, notification_type, priority='medium', cause=None, user=None, donation=None):
        """Create a new admin notification"""
        notification = AdminNotification.objects.create(
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            cause=cause,
            user=user,
            donation=donation
        )
        return notification
    
    @staticmethod
    def notify_cause_pending(cause):
        """Notify when a new cause is pending review"""
        return NotificationService.create_notification(
            title=f"New Cause Pending Review: {cause.name}",
            message=f"A new cause '{cause.name}' by {cause.organizer_id.get_full_name()} is waiting for approval.",
            notification_type='cause_pending',
            priority='high',
            cause=cause,
            user=cause.organizer_id
        )
    
    @staticmethod
    def notify_cause_approved(cause):
        """Notify when a cause is approved"""
        return NotificationService.create_notification(
            title=f"Cause Approved: {cause.name}",
            message=f"Cause '{cause.name}' has been approved and is now live.",
            notification_type='cause_approved',
            priority='medium',
            cause=cause,
            user=cause.organizer_id
        )
    
    @staticmethod
    def notify_cause_rejected(cause):
        """Notify when a cause is rejected"""
        return NotificationService.create_notification(
            title=f"Cause Rejected: {cause.name}",
            message=f"Cause '{cause.name}' has been rejected. Reason: {cause.rejection_reason or 'No reason provided'}",
            notification_type='cause_rejected',
            priority='medium',
            cause=cause,
            user=cause.organizer_id
        )
    
    @staticmethod
    def notify_new_donation(donation):
        """Notify when a new donation is made"""
        return NotificationService.create_notification(
            title=f"New Donation: GHS {donation.amount:,.2f}",
            message=f"New donation of GHS {donation.amount:,.2f} received for '{donation.cause.name}' by {donation.user.get_full_name()}",
            notification_type='new_donation',
            priority='medium',
            cause=donation.cause,
            user=donation.user,
            donation=donation
        )
    
    @staticmethod
    def notify_withdrawal_request(withdrawal):
        """Notify when a withdrawal request is made"""
        return NotificationService.create_notification(
            title=f"Withdrawal Request: GHS {withdrawal.amount:,.2f}",
            message=f"Withdrawal request of GHS {withdrawal.amount:,.2f} from '{withdrawal.cause.name}' by {withdrawal.user.get_full_name()}",
            notification_type='withdrawal_request',
            priority='high',
            cause=withdrawal.cause,
            user=withdrawal.user
        )
    
    @staticmethod
    def notify_new_user(user):
        """Notify when a new user registers"""
        return NotificationService.create_notification(
            title=f"New User Registration: {user.get_full_name()}",
            message=f"New user {user.get_full_name()} ({user.email}) has registered.",
            notification_type='user_registration',
            priority='low',
            user=user
        )
    
    @staticmethod
    def get_unread_count():
        """Get count of unread notifications"""
        return AdminNotification.objects.filter(is_read=False, is_archived=False).count()
    
    @staticmethod
    def get_recent_notifications(limit=10):
        """Get recent notifications"""
        return AdminNotification.objects.filter(is_archived=False).order_by('-created_at')[:limit]
    
    @staticmethod
    def get_notifications_by_type(notification_type, limit=10):
        """Get notifications by type"""
        return AdminNotification.objects.filter(
            notification_type=notification_type,
            is_archived=False
        ).order_by('-created_at')[:limit]
    
    @staticmethod
    def mark_all_as_read():
        """Mark all notifications as read"""
        return AdminNotification.objects.filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
