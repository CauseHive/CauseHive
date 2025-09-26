# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=causehive.settings
ENV PORT=8000

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client libpq-dev build-essential curl \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt

# Copy project
COPY . /app

# Prepare dirs
RUN mkdir -p /app/backend/staticfiles /app/backend/media /app/logs

# Build-time defaults (overridden in runtime env)
ENV SECRET_KEY=build-time-secret
ENV DEBUG=False

# Collect static from project root (specify manage.py path)
RUN python backend/manage.py collectstatic --noinput --clear || true

# Non-root
RUN adduser --disabled-password --gecos '' appuser \
 && chown -R appuser:appuser /app
USER appuser

EXPOSE $PORT

# Run migrations then start gunicorn with correct wsgi module
CMD ["sh", "-c", "python backend/manage.py migrate && exec gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --keep-alive 2 --max-requests 1000 --max-requests-jitter 50 --access-logfile - --error-logfile - --log-level info causehive.wsgi:application"]
