import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useDonationCart } from '../contexts/DonationCartContext';
import { useAuth } from '../contexts/AuthContext';

export function DonationCartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    items, 
    totalAmount, 
    totalItems, 
    removeFromCart, 
    updateAmount, 
    clearCart 
  } = useDonationCart();

  const [updatingItems, setUpdatingItems] = useState({});

  const handleAmountChange = (causeId, newAmount) => {
    if (newAmount <= 0) {
      removeFromCart(causeId);
    } else {
      updateAmount(causeId, newAmount);
    }
  };

  const incrementAmount = (causeId, currentAmount) => {
    setUpdatingItems(prev => ({ ...prev, [causeId]: true }));
    handleAmountChange(causeId, currentAmount + 10);
    setTimeout(() => {
      setUpdatingItems(prev => ({ ...prev, [causeId]: false }));
    }, 300);
  };

  const decrementAmount = (causeId, currentAmount) => {
    setUpdatingItems(prev => ({ ...prev, [causeId]: true }));
    handleAmountChange(causeId, Math.max(0, currentAmount - 10));
    setTimeout(() => {
      setUpdatingItems(prev => ({ ...prev, [causeId]: false }));
    }, 300);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart/checkout' } });
      return;
    }
    navigate('/cart/checkout');
  };

  if (items.length === 0) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Donation Cart is Empty</h1>
            <p className="text-neutral-600 mb-6">
              Start making a difference by adding causes to your donation cart.
            </p>
            <Link to="/causes">
              <Button size="lg" className="gap-2">
                <Heart className="h-5 w-5" />
                Browse Causes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Donation Cart</h1>
          <p className="text-neutral-600">
            {totalItems} {totalItems === 1 ? 'cause' : 'causes'} • GH₵{totalAmount.toFixed(2)} total
          </p>
        </div>
        
        {totalItems > 0 && (
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.causeId} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Cause Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden">
                    {item.causeImage ? (
                      <img
                        src={item.causeImage}
                        alt={item.causeName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-8 w-8 text-primary-400" />
                      </div>
                    )}
                  </div>

                  {/* Cause Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">
                      {item.causeName}
                    </h3>
                    {item.causeCategory && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {item.causeCategory}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 mt-1">
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Amount Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrementAmount(item.causeId, item.amount)}
                        disabled={updatingItems[item.causeId]}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-neutral-600">GH₵</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleAmountChange(item.causeId, parseFloat(e.target.value) || 0)}
                          min="0"
                          step="1"
                          className="w-16 text-center text-sm border rounded px-2 py-1"
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => incrementAmount(item.causeId, item.amount)}
                        disabled={updatingItems[item.causeId]}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.causeId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'cause' : 'causes'})</span>
                  <span>GH₵{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Platform fee</span>
                  <span>GH₵0.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>GH₵{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full gap-2"
                size="lg"
                disabled={totalAmount === 0}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-xs text-neutral-500 text-center">
                You will be redirected to a secure payment page
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center pt-6 border-t">
        <Link to="/causes">
          <Button variant="outline" size="lg" className="gap-2">
            <Heart className="h-4 w-4" />
            Continue Browsing Causes
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}

export default DonationCartPage;