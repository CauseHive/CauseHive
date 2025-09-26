from rest_framework.throttling import SimpleRateThrottle


class NameChangeThrottle(SimpleRateThrottle):
    """Throttle specifically for limiting profile name changes."""
    scope = 'name_change'

    def get_cache_key(self, request, view):  # pragma: no cover
        if not request.user or not request.user.is_authenticated:
            return None
        return self.cache_format % {
            'scope': self.scope,
            'ident': request.user.pk,
        }
from rest_framework.throttling import SimpleRateThrottle, UserRateThrottle

class PasswordResetThrottle(SimpleRateThrottle):
    scope = 'password_reset'

    def get_cache_key(self, request, view):
        return self.get_ident(request)