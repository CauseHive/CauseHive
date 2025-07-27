import requests
from django.conf import settings

class CauseClient:
    BASE_URL = settings.CAUSE_SERVICE_URL

    @staticmethod
    def get_causes(params=None):
        response = requests.get(
            f"{CauseClient.BASE_URL}/admin/causes/",
            headers={'X-ADMIN-SERVICE-API-KEY': settings.ADMIN_SERVICE_API_KEY},
            params=params,
            timeout=5
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def update_cause(cause_id, data):
        response = requests.patch(
            f"{CauseClient.BASE_URL}/admin/causes/{cause_id}/update/",
            headers={'X-ADMIN-SERVICE-API-KEY': settings.ADMIN_SERVICE_API_KEY},
            json=data,
            timeout=5
        )
        response.raise_for_status()
        return response.json()