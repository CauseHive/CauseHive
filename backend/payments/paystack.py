from http.client import responses

import requests
from django.conf import settings

class Paystack:
    BASE_URL = settings.PAYSTACK_BASE_URL
    SECRET_KEY = settings.PAYSTACK_SECRET_KEY

    @classmethod
    def initialize_payment(cls, email, amount):
        """Initialize a payment on Paystack
        Amount is in pesewas (multiply by ten)"""
        url = f"{cls.BASE_URL}/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {cls.SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "email": email,
            "amount": int(amount * 100), # Convert to pesewas
        }

        response = requests.post(url, json=data, headers=headers)
        return response.json()

    @classmethod
    def verify_payment(cls, reference):
        """Verify payment with Paystack"""
        url = f"{cls.BASE_URL}/transaction/verify/{reference}"
        headers = {
            "Authorization": f"Bearer {cls.SECRET_KEY}",
            "Content-Type": "application/json",
        }

        response = requests.get(url, headers=headers)
        return response.json()