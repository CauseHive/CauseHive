import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDonationCart } from '../contexts/DonationCartContext';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function DonationCartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    totalAmount,
    totalItems,
    removeFromCart,
    updateAmount,
    clearCart,
  } = useDonationCart();


  const handleAmountChange = (causeId, newAmount) => {
    if (newAmount <= 0) {
      removeFromCart(causeId);
    } else {
      updateAmount(causeId, newAmount);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Donation Cart is Empty</h1>
        <p className="text-neutral-600 mb-6">Add causes to your cart to make a difference.</p>
        <Button asChild size="lg"><Link to="/causes"><Heart className="h-5 w-5 mr-2" />Browse Causes</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Donation Cart</h1>
          <p className="text-neutral-600">{totalItems} {totalItems === 1 ? 'cause' : 'causes'} for a total of GH₵{totalAmount.toFixed(2)}</p>
        </div>
        <Button variant="outline" onClick={clearCart} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Clear Cart</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.causeId}>
              <CardContent className="p-4 flex items-center space-x-4">
                <img src={item.causeImage || '/placeholder.png'} alt={item.causeName} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.causeName}</h3>
                  <p className="text-sm text-neutral-500">{item.causeCategory}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAmountChange(item.causeId, item.amount - 10)}><Minus className="h-4 w-4" /></Button>
                  <Input type="number" value={item.amount} onChange={(e) => handleAmountChange(item.causeId, parseFloat(e.target.value) || 0)} className="w-20 text-center h-9" />
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAmountChange(item.causeId, item.amount + 10)}><Plus className="h-4 w-4" /></Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.causeId)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>Subtotal</span><span>GH₵{totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Platform Fee</span><span>GH₵0.00</span></div>
              <div className="border-t pt-4 font-bold flex justify-between"><span>Total</span><span>GH₵{totalAmount.toFixed(2)}</span></div>
              <Button onClick={handleCheckout} size="lg" className="w-full">Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DonationCartPage;
