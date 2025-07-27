import os
import requests

ADMIN_SERVICE_API_KEY = os.getenv('ADMIN_SERVICE_API_KEY')
HEADERS = {'X-ADMIN-SERVICE-API-KEY': ADMIN_SERVICE_API_KEY}

# def fetch_admin_data(url, params=None):
#     response = requests.get(url, headers=HEADERS, params=params)
#     response.raise_for_status()
#     return response.json()


def fetch_admin_data(url, params=None):
    response = requests.get(url, headers=HEADERS, params=params)
    try:
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        print("Response status:", response.status_code)
        print("Response content:", response.content.decode())
        raise