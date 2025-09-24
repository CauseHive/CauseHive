import json
import redis
from django.conf import settings

from causehive.celery import app
from donations.email_utils import send_donation_successful_email
from donations.models import Donation

@app.task
def publish_donation_completed_event(cause_id, amount):
    r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
    event = {
        "event": "donation.completed",
        "data": {
            "cause_id": str(cause_id),
            "amount": float(amount)
        }
    }
    r.publish('donation_events', json.dumps(event))


@app.task
def send_donation_success_notification(donation_id, donor_email=None):
    try:
        donation = Donation.objects.select_related('user_id', 'cause_id').get(id=donation_id)

        email_to_use = None
        user_name = None

        if donation.user_id:
            email_to_use = donation.user_id.email
            user_name = donation.user_id.first_name
        elif donor_email:
            email_to_use = donor_email
            user_name = "there"

        if email_to_use:
            send_donation_successful_email(
                to_email=email_to_use,
                user_name=user_name,
                amount=float(donation.amount),
                cause_name=donation.cause_id.name,
                currency=donation.currency,
            )
    except Donation.DoesNotExist:
        pass