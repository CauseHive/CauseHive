import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'donation_processing_service.settings')
app = Celery('donation_processing_service')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()