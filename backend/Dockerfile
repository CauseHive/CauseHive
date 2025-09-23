# Backend Dockerfile (Django + Gunicorn)
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY backend /app

# Collect static (if whitenoise is used, this populates staticfiles)
ENV DJANGO_SETTINGS_MODULE=causehive.settings
RUN python manage.py collectstatic --noinput || true

# Entrypoint + gunicorn
COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8000
CMD ["/entrypoint.sh"]
