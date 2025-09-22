import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, ShoppingCart } from 'lucide-react';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useDonationCart } from '../contexts/DonationCartContext';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import DonationModal from '../components/DonationModal';
import { useToast } from '../components/Toast/ToastProvider';

const CauseDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();
  
  // Auth context
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  
  // Cart context
  const { addToCart, isInCart, getItemAmount } = useDonationCart();

  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [addToCartAmount, setAddToCartAmount] = useState(50);

  // React Query for data fetching
  const { data: cause, isPending, isError, error } = useQuery({
    queryKey: ['cause', id],
    queryFn: () => apiService.getCauseDetails(id),
  });

  // eslint-disable-next-line no-unused-vars
  const getProgressPercentage = () => {
    if (!cause) return 0;
    return Math.min((cause.current_amount / cause.target_amount) * 100, 100);
  };

  const handleAddToCart = () => {
    if (!cause) return;
    addToCart(cause, addToCartAmount);
    toast.success(`Added ${cause.name} to cart (GH₵${addToCartAmount})`);
  };

  // eslint-disable-next-line no-unused-vars
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS', minimumFractionDigits: 2 }).format(amount);
  };

  if (isPending) {
    return <CauseDetailSkeleton />;
  }

  if (isError || !cause) {
    return (
        <div className="text-center py-16">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cause Not Found</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'This cause doesn\'t exist or has been removed.'}</p>
          <Button asChild><Link to="/causes">Browse Other Causes</Link></Button>
        </div>
    );
  }

  const isCauseInCart = isInCart(cause.id);

  return (
    <div>
      {/* Navigation */}
      <div className="bg-white border-b -mx-4 lg:-mx-8 mb-6">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="link" asChild>
            <Link to="/causes" className="flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Causes
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* ... (rest of the UI is largely the same, just using shadcn components) */}
          <div className="p-6 md:p-8">
            {/* ... Header, Progress, etc. */}
            <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <label htmlFor="cart-amount" className="text-sm font-medium text-gray-700 whitespace-nowrap">Quick add:</label>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">GH₵</span>
                    <Input
                      id="cart-amount"
                      type="number"
                      value={addToCartAmount}
                      onChange={(e) => setAddToCartAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      min="1"
                      step="10"
                      className="w-24 h-9"
                    />
                  </div>
                  <Button onClick={handleAddToCart} disabled={addToCartAmount <= 0} variant={isCauseInCart ? 'secondary' : 'outline'}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isCauseInCart ? 'In Cart' : 'Add to Cart'}
                  </Button>
                </div>

                <Button onClick={() => setDonationModalOpen(true)} size="lg" className="w-full text-lg">
                  Donate Now
                </Button>

                {isCauseInCart && (
                  <div className="text-center">
                    <Button variant="link" asChild>
                        <Link to="/cart" className="inline-flex items-center space-x-1">
                            <ShoppingCart className="h-4 w-4" />
                            <span>View Cart (GH₵{getItemAmount(cause.id)})</span>
                        </Link>
                    </Button>
                  </div>
                )}
            </div>
            {/* ... Description, Testimonials, Organizer */}
          </div>
        </div>
      </div>

      <DonationModal isOpen={donationModalOpen} onClose={() => setDonationModalOpen(false)} cause={cause} />
    </div>
  );
};

const CauseDetailSkeleton = () => (
  <div className="py-8">
    <div className="px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <Skeleton className="h-64 w-full rounded-lg mb-6" />
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-6" />
      <Skeleton className="h-32 w-full mb-6" />
      
    </div>
  </div>
);

export default CauseDetailPage;
