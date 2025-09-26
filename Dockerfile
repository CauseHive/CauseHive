# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend/causehive.settings
ENV PORT=8000

# Set work directory
WORKDIR /app

# Install system dependencies in smaller chunks to avoid memory issues
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client
RUN apt-get install -y --no-install-recommends libpq-dev curl
RUN apt-get install -y --no-install-recommends build-essential
RUN rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install Python dependencies with memory optimization
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p staticfiles media logs

# Set default environment variables for build
ENV SECRET_KEY=build-time-secret-key-will-be-overridden
ENV DEBUG=False

# Collect static files during build (skip if fails)
RUN python manage.py collectstatic --noinput --clear || echo "Static collection skipped"

# Create a non-root user and set permissions
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE $PORT

# Start command with proper error handling
CMD ["sh", "-c", "python migrate_databases.py all && exec gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --keep-alive 2 --max-requests 1000 --max-requests-jitter 50 --access-logfile - --error-logfile - --log-level info causehive_monolith.wsgi:application"]
