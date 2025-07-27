from celery import shared_task
import json
import redis

@shared_task
def publish_donation_completed_event(cause_id, amount):
    r = redis.Redis(host='localhost', port=6379, db=0)
    event = {
        "event": "donation.completed",
        "data": {
            "cause_id": str(cause_id),
            "amount": float(amount)
        }
    }
    r.publish('donation_events', json.dumps(event))