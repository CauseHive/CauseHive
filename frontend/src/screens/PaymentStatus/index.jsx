import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';

// Minimal page that verifies payment by reference and shows result.
// Styling is intentionally minimal to avoid changing existing themes.

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying payment...');
  const toast = useToast();

  useEffect(() => {
    (async () => {
      let ref = searchParams.get('reference');
      if (!ref) {
        try { ref = window.localStorage.getItem('last_payment_reference') || ''; } catch (_) {}
      }
      if (!ref) {
        setStatus('No payment reference found');
        toast.error('No payment reference found');
        return;
      }
      try {
        const res = await apiService.verifyPayment(ref);
        if (res && res.message) {
          setStatus('Payment verified successfully');
          toast.success('Payment verified successfully');
        } else {
          setStatus('Payment verification complete');
          toast.info('Payment verification complete');
        }
      } catch (e) {
        setStatus('Payment not successful or verification failed');
        toast.error('Payment not successful or verification failed');
      }
    })();
  }, [searchParams, toast]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Payment Status</h1>
      <div>{status}</div>
    </div>
  );
};

export default PaymentStatus;

