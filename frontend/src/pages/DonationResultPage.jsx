import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Heart, Share2 } from 'lucide-react';
import apiService from '../services/apiService';

const DonationResultPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [donationData, setDonationData] = useState(null);
  const [error, setError] = useState(null);

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    if (reference || trxref) {
      verifyPayment(reference || trxref);
    } else {
      setError('No payment reference found');
      setVerificationStatus('error');
    }
  }, [reference, trxref]);

  const verifyPayment = async (paymentReference) => {
    try {
      const response = await apiService.verifyPayment(paymentReference);
      setDonationData(response);
      setVerificationStatus('success');
    } catch (err) {
      console.error('Payment verification failed:', err);
      setError('Payment verification failed');
      setVerificationStatus('failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleShare = () => {
    const shareText = `I just made a donation on CauseHive! Join me in making a difference. #CauseHive #MakeADifference`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'I made a difference on CauseHive',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          {verificationStatus === 'verifying' && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your donation...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Thank You!</h2>
              <p className="text-gray-600">Your donation has been successfully processed.</p>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
              <p className="text-gray-600">{error || 'There was an issue processing your payment.'}</p>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
        </div>

        {/* Donation Details */}
        {verificationStatus === 'success' && donationData && (
          <div className="px-6 pb-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{formatCurrency(donationData.amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="text-sm font-mono">{reference || trxref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
              {donationData.cause_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cause:</span>
                  <span className="text-sm font-medium">{donationData.cause_name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Impact Message */}
        {verificationStatus === 'success' && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-blue-600" fill="currentColor" />
                <h3 className="font-medium text-blue-900">Your Impact</h3>
              </div>
              <p className="text-sm text-blue-700">
                🎉 You've made a real difference! Your generosity helps bring positive change to those who need it most.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {verificationStatus === 'success' && (
            <>
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Share2 className="h-5 w-5" />
                <span>Share Your Impact</span>
              </button>
              
              <Link
                to="/causes"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="h-5 w-5" />
                <span>Support Another Cause</span>
              </Link>
            </>
          )}

          {(verificationStatus === 'failed' || verificationStatus === 'error') && (
            <div className="space-y-3">
              <Link
                to="/causes"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Try Again</span>
              </Link>
              
              <Link
                to="/help"
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          )}

          <Link
            to="/"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationResultPage;