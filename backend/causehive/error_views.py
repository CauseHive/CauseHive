"""
Custom error views for CauseHive backend.
Provides JSON error responses for API endpoints and proper error handling.
"""

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def handler404(request, exception):
    """
    Custom 404 handler - returns JSON for API requests, HTML for others
    """
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Not Found',
            'message': 'The requested resource was not found.',
            'status_code': 404,
            'path': request.path
        }, status=404)
    
    return render(request, 'errors/404.html', {
        'request_path': request.path,
        'debug': settings.DEBUG
    }, status=404)


def handler500(request):
    """
    Custom 500 handler - returns JSON for API requests, HTML for others
    """
    logger.error(f"Server error on path: {request.path}")
    
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.',
            'status_code': 500,
            'path': request.path
        }, status=500)
    
    return render(request, 'errors/500.html', {
        'request_path': request.path,
        'debug': settings.DEBUG
    }, status=500)


def handler403(request, exception):
    """
    Custom 403 handler - returns JSON for API requests, HTML for others
    """
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource.',
            'status_code': 403,
            'path': request.path
        }, status=403)
    
    return render(request, 'errors/403.html', {
        'request_path': request.path,
        'debug': settings.DEBUG
    }, status=403)


def handler400(request, exception):
    """
    Custom 400 handler - returns JSON for API requests, HTML for others
    """
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Bad Request',
            'message': 'The request could not be understood by the server.',
            'status_code': 400,
            'path': request.path
        }, status=400)
    
    return render(request, 'errors/400.html', {
        'request_path': request.path,
        'debug': settings.DEBUG
    }, status=400)


def health_check(request):
    """
    Health check endpoint for monitoring
    """
    return JsonResponse({
        'status': 'healthy',
        'service': 'causehive-backend',
        'debug_mode': settings.DEBUG
    })