# donation_processing_service/withdrawal_transfer/paystack_transfer.py
import requests
import json
from django.conf import settings
from .models import WithdrawalRequest


class PaystackTransfer:
    BASE_URL = settings.PAYSTACK_BASE_URL
    SECRET_KEY = settings.PAYSTACK_SECRET_KEY

    @classmethod
    def initiate_transfer(cls, withdrawal_request):
        """Initiate transfer by first creating recipient, then transferring"""
        # Step 1: Create transfer recipient
        recipient_result = cls._create_transfer_recipient(withdrawal_request)

        if not recipient_result.get('status'):
            return recipient_result

        recipient_code = recipient_result['data']['recipient_code']

        # Save the recipient code to the database
        withdrawal_request.recipient_code = recipient_code
        withdrawal_request.save()

        # Step 2: Initiate transfer with recipient code
        url = f"{cls.BASE_URL}/transfer"
        headers = {
            'Authorization': f'Bearer {cls.SECRET_KEY}',
            'Content-Type': 'application/json'
        }

        transfer_data = {
            "amount": int(withdrawal_request.amount * 100),  # Convert to pesewas
            "currency": withdrawal_request.currency,
            "source": "balance",
            "reason": f"Withdrawal for cause {withdrawal_request.cause_id}",
            "recipient": recipient_code
        }

        try:
            response = requests.post(url, json=transfer_data, headers=headers)
            return response.json()
        except requests.RequestException as e:
            return {
                'status': False,
                'message': f'Transfer initiation failed: {str(e)}'
            }

    @classmethod
    def _create_transfer_recipient(cls, withdrawal_request):
        """Create a transfer recipient for Ghana"""
        # Check if we already have a recipient code for this user and payment method
        existing_recipient = cls._get_existing_recipient(withdrawal_request)
        if existing_recipient:
            return {
                'status': True,
                'data': {'recipient_code': existing_recipient}
            }

        url = f"{cls.BASE_URL}/transferrecipient"
        headers = {
            'Authorization': f'Bearer {cls.SECRET_KEY}',
            'Content-Type': 'application/json'
        }

        payment_details = withdrawal_request.payment_details
        payment_method = withdrawal_request.payment_method

        # Debug logging
        print(f"Payment Method: {payment_method}")
        print(f"Payment Details: {json.dumps(payment_details, indent=2)}")

        # Determine recipient type based on payment method
        if payment_method == 'bank_transfer':
            recipient_type = "ghipss"
        elif payment_method == 'mobile_money':
            recipient_type = "mobile_money"
        else:
            recipient_type = "ghipss"  # Default to bank transfer

        recipient_data = {
            "type": recipient_type,
            "currency": withdrawal_request.currency
        }

        # Add payment details based on type
        if recipient_type == "ghipss":
            # For bank transfers, we need account_number and bank_code
            account_number = payment_details.get('account_number')
            bank_code = payment_details.get('bank_code')
            account_name = payment_details.get('account_name')

            if not account_number or not bank_code:
                return {
                    'status': False,
                    'message': f'Missing required fields for bank transfer. account_number: {account_number}, bank_code: {bank_code}'
                }

            recipient_data.update({
                "bank_code": bank_code,
                "account_number": account_number,
                "account_name": account_name or "Withdrawal Recipient"
            })

        elif recipient_type == "mobile_money":
            # For Ghana mobile money, we need to use a different approach
            # Try using the phone number as account_number for mobile money
            phone_number = payment_details.get('phone_number')
            provider = payment_details.get('provider')

            if not phone_number or not provider:
                return {
                    'status': False,
                    'message': f'Missing required fields for mobile money. phone_number: {phone_number}, provider: {provider}'
                }

            # Format phone number for Paystack (remove +233 country code)
            formatted_phone = cls._format_phone_number(phone_number)

            # For Ghana mobile money, try using phone_number as account_number
            recipient_data.update({
                "account_number": formatted_phone,
                "bank_code": cls._get_mobile_money_bank_code(provider)
            })

        # Debug logging
        print(f"Recipient Data: {json.dumps(recipient_data, indent=2)}")

        try:
            response = requests.post(url, json=recipient_data, headers=headers)
            result = response.json()

            # Debug logging
            print(f"Paystack Response: {json.dumps(result, indent=2)}")

            return result
        except requests.RequestException as e:
            return {
                'status': False,
                'message': f'Recipient creation failed: {str(e)}'
            }

    @classmethod
    def _get_existing_recipient(cls, withdrawal_request):
        """Get existing recipient code for the same user and payment method"""
        try:
            # Find a completed withdrawal request with the same user and payment method
            existing_withdrawal = WithdrawalRequest.objects.filter(
                user_id=withdrawal_request.user_id,
                payment_method=withdrawal_request.payment_method,
                recipient_code__isnull=False
            ).exclude(
                recipient_code=''
            ).first()

            return existing_withdrawal.recipient_code if existing_withdrawal else None
        except Exception:
            return None

    @classmethod
    def _format_phone_number(cls, phone_number):
        """Format phone number for Paystack (remove +233 country code, keep leading 0)"""
        if phone_number.startswith('+233'):
            # Remove +233 and add leading 0
            return '0' + phone_number[4:]
        elif phone_number.startswith('233'):
            # Remove 233 and add leading 0
            return '0' + phone_number[3:]
        elif phone_number.startswith('0'):
            # Already has leading 0, return as is
            return phone_number
        else:
            # Add leading 0 if missing
            return '0' + phone_number

    @classmethod
    def _get_mobile_money_bank_code(cls, provider):
        """Get bank code for mobile money providers in Ghana"""
        mobile_money_codes = {
            "MTN": "MTN",  # MTN Mobile Money
            "VOD": "VOD",  # Vodafone Cash
            "AIRTEL": "AIRTEL",  # Airtel Money
            "TIGO": "TIGO"  # Tigo Money
        }
        return mobile_money_codes.get(provider.upper(), "MTN")

    @classmethod
    def verify_transfer(cls, transfer_code):
        url = f"{cls.BASE_URL}/transfer/verify/{transfer_code}"
        headers = {
            'Authorization': f'Bearer {cls.SECRET_KEY}',
            'Content-Type': 'application/json'
        }

        try:
            response = requests.get(url, headers=headers)
            return response.json()
        except requests.RequestException as e:
            return {
                'status': False,
                'message': f'Transfer verification failed: {str(e)}'
            }