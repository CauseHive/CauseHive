from rest_framework.throttling import UserRateThrottle

class AdminActionThrottle(UserRateThrottle):
    scope = 'admin_action'