from .models import WithdrawalRequest
from .paystack_transfer import PaystackTransfer
from causehive.celery import app

@app.task
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

@app.task
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
                withdrawal_request.mark_as_failed(data.get('failure_reason', 'Transfer failed'))
            elif data['status'] == 'otp':
                # OTP required - keep as processing, will be verified later
                print(f"Transfer {transaction_id} requires OTP verification")
            else:
                # Other statuses like 'pending', 'processing', etc.
                print(f"Transfer {transaction_id} status: {data['status']}")
        else:
            withdrawal_request.mark_as_failed('Verification failed: ' + verification_result.get('message', 'Unknown error'))

    except WithdrawalRequest.DoesNotExist:
        pass
    except Exception as e:
        print(f"Error verifying transfer {transaction_id}: {str(e)}")

@app.task
def verify_pending_withdrawals():
    """Periodically verify all pending withdrawal requests."""
    try:
        pending_withdrawals = WithdrawalRequest.objects.filter(
            status='processing',
            transaction_id__isnull=False
        )
        
        for withdrawal in pending_withdrawals:
            verify_transfer_status.delay(withdrawal.transaction_id)
            
        print(f"Queued verification for {pending_withdrawals.count()} pending withdrawals")
        
    except Exception as e:
        print(f"Error in verify_pending_withdrawals: {str(e)}")