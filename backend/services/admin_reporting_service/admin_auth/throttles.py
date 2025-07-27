from rest_framework.throttling import SimpleRateThrottle, UserRateThrottle

class PasswordResetThrottle(SimpleRateThrottle):
    scope = 'password_reset'

    def get_cache_key(self, request, view):
        return self.get_ident(request)