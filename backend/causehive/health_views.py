"""
Health check views for Railway deployment monitoring
"""
from django.http import JsonResponse
from django.db import connections
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint for Railway deployment
    Checks database connections and returns status
    """
    health_status = {
        "status": "healthy",
        "databases": {},
        "services": ["user_service", "cause_service", "donation_service", "admin_service"]
    }
    
    databases = ['default', 'causes_db', 'donations_db', 'admin_db']
    all_healthy = True
    
    for db_alias in databases:
        try:
            conn = connections[db_alias]
            conn.ensure_connection()
            health_status["databases"][db_alias] = "connected"
        except Exception as e:
            logger.error(f"Database {db_alias} health check failed: {e}")
            health_status["databases"][db_alias] = "disconnected"
            all_healthy = False
    
    if not all_healthy:
        health_status["status"] = "degraded"
        return JsonResponse(health_status, status=503)
    
    return JsonResponse(health_status, status=200)

@csrf_exempt
@require_http_methods(["GET"])
def readiness_check(request):
    """
    Readiness check for Railway - simpler check for startup
    """
    try:
        # Just check if Django is responding
        return JsonResponse({"status": "ready"}, status=200)
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return JsonResponse({"status": "not_ready", "error": str(e)}, status=503)
