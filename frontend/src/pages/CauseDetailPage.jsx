import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Calendar, User, Plus, ShoppingCart, Heart } from 'lucide-react';
import apiService from '../services/apiService';
import DonationModal from '../components/DonationModal';
import BookmarkButton from '../components/ui/BookmarkButton';
import { useToast } from '../components/Toast/ToastProvider';
import { useDonationCart } from '../contexts/DonationCartContext';
import { useAuth } from '../contexts/AuthContext';
import { TestimonialsList } from '../components/testimonials';
import { TestimonialsProvider } from '../contexts/TestimonialsContext';

const CauseDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();
  const { addToCart, isInCart, getCartItem } = useDonationCart();
  const { user } = useAuth();
  
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [addToCartAmount, setAddToCartAmount] = useState(50);

  const fetchCauseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getCauseDetails(id);
      setCause(response);
    } catch (err) {
      setError('Failed to load cause details. Please try again.');
      console.error('Error fetching cause details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCauseDetails();
  }, [fetchCauseDetails]);

  const getProgressPercentage = () => {
    if (!cause) return 0;
    return Math.min((cause.current_amount / cause.target_amount) * 100, 100);
  };

  const handleAddToCart = () => {
    if (!cause) return;
    
    const cartItem = {
      causeId: cause.id.toString(),
      causeName: cause.title,
      causeCategory: cause.category,
      causeImage: cause.image_url,
      amount: addToCartAmount
    };
    
    addToCart(cartItem);
    toast.success(`Added ${cause.title} to cart (GH₵${addToCartAmount})`);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-gray-300 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cause) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cause not found</h2>
          <p className="text-gray-600 mb-4">{error || 'This cause doesn\'t exist or has been removed.'}</p>
          <Link
            to="/causes"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Other Causes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div className="bg-white border-b -mx-4 lg:-mx-8 mb-6">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/causes"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Causes
          </Link>
        </div>
      </div>

            {/* Main Content */}
      <div className="py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-400 to-purple-600">
            {cause.cover_image ? (
              <img
                src={cause.cover_image}
                alt={cause.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Heart className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                <BookmarkButton 
                  causeId={cause.id}
                  causeName={cause.name}
                  variant="ghost"
                  size="default"
                />
              </div>
              <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {cause.name}
              </h1>
              
              {/* Status Badge */}
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  cause.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  cause.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  cause.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                </span>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {new Date(cause.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Fundraising Progress</h3>
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              
              {/* Amount Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatAmount(cause.current_amount)}
                  </div>
                  <div className="text-sm text-gray-600">Raised so far</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatAmount(cause.target_amount)}
                  </div>
                  <div className="text-sm text-gray-600">Goal amount</div>
                </div>
              </div>
              
              {/* Donation Actions */}
              <div className="mt-6 space-y-3">
                {/* Quick Add to Cart */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <label htmlFor="cart-amount" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Quick add:
                  </label>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">GH₵</span>
                    <input
                      id="cart-amount"
                      type="number"
                      value={addToCartAmount}
                      onChange={(e) => setAddToCartAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      min="1"
                      step="10"
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartAmount <= 0}
                    className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                      isInCart(cause.id.toString())
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                    } ${addToCartAmount <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isInCart(cause.id.toString()) ? 'In Cart' : 'Add to Cart'}</span>
                  </button>
                </div>

                {/* Donate Now Button */}
                <button 
                  onClick={() => setDonationModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Donate Now
                </button>

                {/* View Cart Link */}
                {isInCart(cause.id.toString()) && (
                  <div className="text-center">
                    <Link 
                      to="/cart" 
                      className="text-sm text-blue-600 hover:text-blue-700 underline inline-flex items-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>View Cart ({getCartItem(cause.id.toString())?.amount ? `GH₵${getCartItem(cause.id.toString()).amount}` : ''})</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Cause</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {cause.description}
                </p>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mb-8">
              <TestimonialsProvider>
                <TestimonialsList
                  causeId={cause.id}
                  currentUserId={user?.id}
                />
              </TestimonialsProvider>
            </div>

            {/* Organizer Info */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Organizer ID: {cause.organizer_id}</div>
                  <div className="text-sm text-gray-600">Cause organizer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        cause={cause}
      />
    </div>
  );
};

export default CauseDetailPage;