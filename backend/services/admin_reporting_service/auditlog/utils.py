from .models import AuditLog

def log_admin_action(user, entity_type, entity_id, action, reason='', extra_data=None):
    AuditLog.objects.create(
        user=user,
        entity_type=entity_type,
        entity_id=str(entity_id),
        action=action,
        reason=reason,
        extra_data=extra_data or {}
    )