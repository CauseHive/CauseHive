import React, { useState, useEffect } from 'react';
import { X, Heart, CreditCard, Smartphone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const DonationModal = ({ isOpen, onClose, cause }) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1); // 1: Amount, 2: Details, 3: Payment, 4: Success
  const [formData, setFormData] = useState({
    amount: '',
    email: user?.email || '',
    fullName: user?.full_name || '',
    isAnonymous: false,
    message: '',
    dedicatedTo: '',
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // Suggested amounts
  const suggestedAmounts = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.full_name || ''
      }));
    }
  }, [isOpen, user]);

  const handleAmountSelect = (amount) => {
    setFormData({ ...formData, amount: amount.toString() });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, amount: value });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        const amount = parseFloat(formData.amount);
        return amount && amount > 0;
      case 2:
        if (!isAuthenticated && !formData.email) {
          setError('Email is required for guest donations');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError(null);
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleDonation = async () => {
    try {
      setLoading(true);
      setError(null);

      const donationData = {
        cause_id: cause.id,
        donation_amount: parseFloat(formData.amount),
        email: formData.email,
        quantity: 1
      };

      // Use the cart donation flow
      const response = await apiService.donate(donationData);

      if (response.authorization_url) {
        // Redirect to Paystack payment page
        window.open(response.authorization_url, '_blank');
        setPaymentResult({
          reference: response.reference,
          amount: response.total_amount
        });
        setStep(4);
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateImpact = (amount) => {
    if (!amount || isNaN(amount)) return null;
    
    // Simple impact calculations based on cause type
    const impacts = {
      education: Math.floor(amount / 10),
      healthcare: Math.floor(amount / 15),
      environment: Math.floor(amount / 5),
      poverty: Math.floor(amount / 20)
    };

    return {
      meals: Math.floor(amount / 3),
      days: Math.floor(amount / 25),
      people: Math.floor(amount / 50),
      ...impacts
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isOpen || !cause) return null;

  const impact = calculateImpact(parseFloat(formData.amount));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 4 ? 'Thank You!' : 'Make a Donation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNum <= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        stepNum < step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Amount</span>
              <span>Details</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Cause Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{cause.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{cause.description}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Amount Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose donation amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {suggestedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-3 text-center rounded-lg border transition-colors ${
                        formData.amount === amount.toString()
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    placeholder="Enter custom amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Impact Preview */}
              {impact && formData.amount && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Your Impact</h4>
                  <div className="text-sm text-blue-700">
                    Your ${formData.amount} donation could provide:
                    <ul className="mt-1 space-y-1">
                      <li>• {impact.meals} meals for those in need</li>
                      <li>• {impact.days} days of support</li>
                      <li>• Help for {impact.people} people</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Donation Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address {!isAuthenticated && '*'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isAuthenticated}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share why this cause matters to you..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Donation Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(formData.amount))}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="text-gray-600">Covered by CauseHive</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(parseFloat(formData.amount))}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Credit/Debit Card</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile"
                      checked={formData.paymentMethod === 'mobile'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Mobile Money</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>Secure payment powered by Paystack</span>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank you for your generosity!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your donation of {formatCurrency(parseFloat(formData.amount))} is being processed.
                </p>
                {paymentResult && (
                  <div className="text-sm text-gray-500">
                    <p>Reference: {paymentResult.reference}</p>
                    <p>You will receive a confirmation email shortly.</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  🎉 You're making a real difference! Your support helps bring us closer to the goal of {formatCurrency(cause.target_amount)}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          {step > 1 && step < 4 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          )}
          
          <div className="flex-1 flex justify-end space-x-3">
            {step < 3 && (
              <button
                onClick={handleNext}
                disabled={!validateStep(step)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            )}
            
            {step === 3 && (
              <button
                onClick={handleDonation}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Processing...' : `Donate ${formatCurrency(parseFloat(formData.amount))}`}
              </button>
            )}
            
            {step === 4 && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;