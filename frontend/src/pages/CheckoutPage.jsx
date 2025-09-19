import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useDonationCart } from '../contexts/DonationCartContext';
import { useAuth } from '../contexts/AuthContext';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, totalAmount, clearCart } = useDonationCart();
  
  const [formData, setFormData] = useState({
    donorName: user?.fullName || '',
    donorEmail: user?.email || '',
    donorPhone: user?.phone || '',
    isAnonymous: false,
    paymentMethod: 'mobile_money',
    mobileMoneyProvider: 'mtn',
    mobileNumber: '',
    comments: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if cart is empty or user not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart/checkout' } });
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.isAnonymous) {
      if (!formData.donorName.trim()) {
        errors.donorName = 'Name is required';
      }
      if (!formData.donorEmail.trim()) {
        errors.donorEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.donorEmail)) {
        errors.donorEmail = 'Email is invalid';
      }
    }

    if (formData.paymentMethod === 'mobile_money') {
      if (!formData.mobileNumber.trim()) {
        errors.mobileNumber = 'Mobile number is required';
      } else if (!/^0[235][0-9]{8}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) {
        errors.mobileNumber = 'Please enter a valid Ghana mobile number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare donation data
      const donationData = {
        items: items.map(item => ({
          causeId: item.causeId,
          amount: item.amount
        })),
        totalAmount,
        donor: formData.isAnonymous ? null : {
          name: formData.donorName,
          email: formData.donorEmail,
          phone: formData.donorPhone
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'mobile_money' ? {
          provider: formData.mobileMoneyProvider,
          mobileNumber: formData.mobileNumber
        } : null,
        comments: formData.comments.trim(),
        isAnonymous: formData.isAnonymous
      };

      // TODO: Replace with actual API call
      console.log('Processing donation:', donationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/donation/success', { 
        state: { 
          donationData,
          transactionId: 'TXN' + Date.now() 
        } 
      });
      
    } catch (error) {
      console.error('Donation processing failed:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
            <p className="text-neutral-600">Complete your donation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Donor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <label htmlFor="isAnonymous" className="text-sm text-neutral-700">
                    Make this donation anonymously
                  </label>
                </div>

                {!formData.isAnonymous && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="donorName" className="block text-sm font-medium text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="donorName"
                        name="donorName"
                        value={formData.donorName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          validationErrors.donorName ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.donorName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.donorName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="donorEmail" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="donorEmail"
                        name="donorEmail"
                        value={formData.donorEmail}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          validationErrors.donorEmail ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {validationErrors.donorEmail && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.donorEmail}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="donorPhone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="donorPhone"
                        name="donorPhone"
                        value={formData.donorPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="0XX XXX XXXX"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="mobile_money"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={formData.paymentMethod === 'mobile_money'}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <label htmlFor="mobile_money" className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Mobile Money</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <label htmlFor="credit_card" className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'mobile_money' && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary-100">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Mobile Money Provider
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'mtn', label: 'MTN MoMo' },
                          { value: 'vodafone', label: 'Vodafone Cash' },
                          { value: 'airteltigo', label: 'AirtelTigo Money' }
                        ].map((provider) => (
                          <div key={provider.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={provider.value}
                              name="mobileMoneyProvider"
                              value={provider.value}
                              checked={formData.mobileMoneyProvider === provider.value}
                              onChange={handleInputChange}
                              className="text-primary-600"
                            />
                            <label htmlFor={provider.value} className="text-sm">
                              {provider.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mobileNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          validationErrors.mobileNumber ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="0XX XXX XXXX"
                      />
                      {validationErrors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.mobileNumber}</p>
                      )}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'credit_card' && (
                  <div className="pl-6 border-l-2 border-primary-100">
                    <p className="text-sm text-neutral-600">
                      You will be redirected to a secure payment page to enter your card details.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Comments (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any message or comments about your donation..."
                />
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.causeId} className="flex justify-between text-sm">
                    <div className="flex-1 pr-2">
                      <p className="font-medium truncate">{item.causeName}</p>
                      <p className="text-neutral-500 text-xs">{item.causeCategory}</p>
                    </div>
                    <div className="text-right">
                      <p>GH₵{item.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>GH₵{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Platform fee</span>
                  <span>GH₵0.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>GH₵{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full gap-2"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Complete Donation
                  </>
                )}
              </Button>

              <div className="text-xs text-neutral-500 text-center">
                <Lock className="h-3 w-3 inline mr-1" />
                Your payment information is secure and encrypted
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CheckoutPage;