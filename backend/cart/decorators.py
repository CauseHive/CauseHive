from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken


def extract_user_from_token(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                token = auth_header.split(' ')[1]
                decoded_token = AccessToken(token)
                user_id = decoded_token['user_id']
                request.user_id = user_id # Attach id to requests
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # No auth header: treat as anonymous
            request.user_id = None
        return view_func(request, *args, **kwargs)

    return wrapper