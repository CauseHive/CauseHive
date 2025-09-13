from django.conf import settings
from django.core.management.base import BaseCommand
import redis
import json
from causes.models import Causes
from decimal import Decimal

class Command(BaseCommand):
    help = 'Consume donation events and updates current_amount in causes'

    def handle(self, *args, **options):
        r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
        pubsub = r.pubsub()
        pubsub.subscribe('donation_events')
        print("Listening for donation events...")

        for message in pubsub.listen():
            if message['type'] == 'message':
                event = json.loads(message['data'])
                if event.get('event') == 'donation.completed':
                    data = event['data']
                    cause_id = data['cause_id']
                    amount = data['amount']
                    try:
                        causes = Causes.objects.get(id=cause_id)
                        causes.current_amount += Decimal(str(amount))

                        if causes.current_amount >= causes.target_amount:
                            causes.status = 'completed'

                        causes.save()
                        print(f"Updated cause {cause_id} by {amount}")
                    except Causes.DoesNotExist:
                        print(f"Cause {cause_id} not found")