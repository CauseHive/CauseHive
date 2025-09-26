#!/bin/bash
# Script to run Celery worker, beat, and donation event consumer

echo "Starting CauseHive services..."

# Start Redis if not running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "Starting Redis..."
    sudo systemctl start redis-server
fi

# Start Celery worker
echo "Starting Celery worker..."
uv run celery -A causehive worker --loglevel=info &
WORKER_PID=$!

# Start Celery beat (scheduler)
echo "Starting Celery beat..."
uv run celery -A causehive beat --loglevel=info &
BEAT_PID=$!

# Start donation event consumer
echo "Starting donation event consumer..."
uv run python manage.py consume_donation_events &
CONSUMER_PID=$!

echo "All services started!"
echo "Worker PID: $WORKER_PID"
echo "Beat PID: $BEAT_PID"
echo "Consumer PID: $CONSUMER_PID"

# Function to cleanup on exit
cleanup() {
    echo "Stopping services..."
    kill $WORKER_PID $BEAT_PID $CONSUMER_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
echo "Press Ctrl+C to stop all services"
wait
