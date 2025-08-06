from celery import shared_task
from .models import WithdrawalRequest
from .paystack_transfer import PaystackTransfer

@shared_task
def process_withdrawal_transfer(withdrawal_id):
    global withdrawal_request
    try:
        withdrawal_request = WithdrawalRequest.objects.get(id=withdrawal_id)

        # Initiate transfer
        transfer_result = PaystackTransfer.initiate_transfer(withdrawal_request)

        if transfer_result.get('status'):
            # Update with transaction ID
            withdrawal_request.transaction_id = transfer_result['data']['reference']
            withdrawal_request.save()

            # Schedule verification task
            verify_transfer_status.delay(withdrawal_request.transaction_id)
        else:
            withdrawal_request.mark_as_failed(transfer_result.get('message'))

    except WithdrawalRequest.DoesNotExist:
        pass
    except Exception as e:
        withdrawal_request.mark_as_failed(str(e))

@shared_task
def verify_transfer_status(transaction_id):
    """Verify the transfer status with Paystack."""
    try:
        withdrawal_request = WithdrawalRequest.objects.get(transaction_id=transaction_id)

        # Verify with Paystack
        verification_result = PaystackTransfer.verify_transfer(transaction_id)

        if verification_result.get('status'):
            data = verification_result['data']
            if data['status'] == 'success':
                withdrawal_request.mark_as_completed(transaction_id)
            elif data['status'] == 'failed':
                withdrawal_request.mark_as_failed(data.get('failure_reason', transaction_id))
        else:
            withdrawal_request.mark_as_failed('Verification failed: ' + verification_result.get('message', 'Unknown error'))

    except WithdrawalRequest.DoesNotExist:
        pass
    except Exception as e:
        print(f"Error verifying transfer {transaction_id}: {str(e)}")