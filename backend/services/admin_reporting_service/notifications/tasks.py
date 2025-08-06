from celery import shared_task
from .models import AdminNotification
from dashboard.utils import fetch_admin_data

@shared_task
def poll_new_pending_causes():
    # Fetch causes with status 'under_review'
    causes = fetch_admin_data('http://localhost:8001/causes/admin/causes?status=under_review')
    # if paginated, use causes['results']
    if isinstance(causes, dict) and 'results' in causes:
        causes = causes['results']
    for cause in causes:
        cause_id = cause['id']
        # Notify if not already notified
        if not AdminNotification.objects.filter(entity_id=cause_id, notif_type='cause_pending').exists():
            AdminNotification.objects.create(
                notif_type='cause_pending',
                entity_id=cause_id,
                message=f"New cause '{cause['name']}' is awaiting review."
            )