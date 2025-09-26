#!/usr/bin/env sh
set -e

# Run DB migrations and start gunicorn
python manage.py migrate --noinput
exec gunicorn causehive.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
