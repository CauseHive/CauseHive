"""
CauseHive Error Handling Middleware

This middleware provides comprehensive error handling and logging for the CauseHive backend.
It ensures proper error responses for both API and web requests.
"""

import logging
import traceback
from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('causehive')


class ErrorHandlingMiddleware(MiddlewareMixin):
    """
    Middleware to handle errors gracefully and provide consistent responses
    """

    def process_exception(self, request, exception):
        """
        Process exceptions and return appropriate responses
        """
        # Log the error with full traceback
        logger.error(
            f"Unhandled exception on {request.method} {request.path}: {str(exception)}",
            exc_info=True,
            extra={
                'request': request,
                'user': getattr(request, 'user', None),
                'method': request.method,
                'path': request.path,
                'get_params': request.GET.dict(),
                'post_params': request.POST.dict() if request.method == 'POST' else {},
            }
        )

        # Determine if this is an API request
        is_api_request = (
            request.path.startswith('/api/') or
            request.headers.get('accept', '').startswith('application/json') or
            request.headers.get('content-type', '').startswith('application/json')
        )

        if is_api_request:
            # Return JSON error response for API requests
            error_data = {
                'error': 'Internal Server Error',
                'message': 'An unexpected error occurred. Please try again later.',
                'status_code': 500,
                'path': request.path
            }
            
            # In debug mode, include exception details
            if settings.DEBUG:
                error_data.update({
                    'exception_type': type(exception).__name__,
                    'exception_message': str(exception),
                    'traceback': traceback.format_exc().split('\n')
                })
            
            return JsonResponse(error_data, status=500)
        
        # For non-API requests, let Django's default error handling take over
        # This will use our custom error handlers defined in urls.py
        return None


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Add security headers to responses
    """

    def process_response(self, request, response):
        """
        Add security headers to the response
        """
        # Only add security headers in production
        if not settings.DEBUG:
            response['X-Content-Type-Options'] = 'nosniff'
            response['X-Frame-Options'] = 'DENY'
            response['X-XSS-Protection'] = '1; mode=block'
            response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Add CORS headers for API requests
        if request.path.startswith('/api/'):
            response['Access-Control-Allow-Origin'] = settings.FRONTEND_URL
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Requested-With'
        
        return response


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Log incoming requests for monitoring and debugging
    """

    def process_request(self, request):
        """
        Log incoming requests
        """
        # Only log in debug mode or for errors
        if settings.DEBUG:
            logger.debug(
                f"Incoming request: {request.method} {request.path}",
                extra={
                    'method': request.method,
                    'path': request.path,
                    'user': getattr(request, 'user', None),
                    'ip': self.get_client_ip(request),
                    'user_agent': request.headers.get('user-agent', ''),
                }
            )
        
        return None

    def process_response(self, request, response):
        """
        Log response status
        """
        if settings.DEBUG:
            logger.debug(
                f"Response: {request.method} {request.path} -> {response.status_code}",
                extra={
                    'method': request.method,
                    'path': request.path,
                    'status_code': response.status_code,
                }
            )
        
        return response

    def get_client_ip(self, request):
        """
        Get the client's IP address
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip