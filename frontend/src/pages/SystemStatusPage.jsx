import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDonationCart } from '../contexts/DonationCartContext';
import { useSavedCauses } from '../contexts/SavedCausesContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, AlertCircle, User, Heart, ShoppingCart } from 'lucide-react';

/**
 * SystemStatusPage - A diagnostic page to test all major app systems
 * This page helps validate that all core functionality is working correctly
 */
export function SystemStatusPage() {
  const { user, loading: authLoading, token } = useAuth();
  const { items: cartItems, totalAmount } = useDonationCart();
  const { savedCauses } = useSavedCauses();

  const systems = [
    {
      name: 'Authentication System',
      status: authLoading ? 'loading' : (user ? 'connected' : 'disconnected'),
      details: authLoading ? 'Checking authentication...' : (
        user ? `Logged in as: ${user.email || user.username || 'User'}` : 'Not authenticated'
      ),
      icon: User
    },
    {
      name: 'Donation Cart System',
      status: cartItems?.length > 0 ? 'active' : 'empty',
      details: cartItems?.length > 0 ? `${cartItems.length} items, Total: GH₵${totalAmount?.toFixed(2)}` : 'Cart is empty',
      icon: ShoppingCart
    },
    {
      name: 'Saved Causes System', 
      status: savedCauses?.length > 0 ? 'active' : 'empty',
      details: savedCauses?.length > 0 ? `${savedCauses.length} saved causes` : 'No saved causes',
      icon: Heart
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'loading':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'disconnected':
      case 'empty':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'loading':
        return <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />;
      case 'disconnected':
      case 'empty':
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
        <p className="text-gray-600 mt-2">
          Diagnostic page to verify all core application systems are functioning correctly
        </p>
      </div>

      {/* Authentication Status Alert */}
      {!authLoading && (
        <Alert className={`mb-6 ${user ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {user 
              ? '✅ Authentication system is working - you are logged in successfully'
              : '⚠️ You are not logged in - some features may be limited'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {systems.map((system) => {
          const Icon = system.icon;
          const statusColors = getStatusColor(system.status);
          
          return (
            <Card key={system.name} className={`border ${statusColors.split(' ').slice(-1)[0]}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5" />
                  {system.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusColors}`}>
                  {getStatusIcon(system.status)}
                  <span className="font-medium capitalize">{system.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{system.details}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <span className="text-gray-600">Token Present:</span>{' '}
              <span className={token ? 'text-green-600' : 'text-red-600'}>
                {token ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">User Object:</span>{' '}
              <span className={user ? 'text-green-600' : 'text-gray-400'}>
                {user ? 'Loaded' : 'Not loaded'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Auth Loading:</span>{' '}
              <span className={authLoading ? 'text-yellow-600' : 'text-green-600'}>
                {authLoading ? 'True' : 'False'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Cart Items:</span>{' '}
              <span className="text-blue-600">{cartItems?.length || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Saved Causes:</span>{' '}
              <span className="text-purple-600">{savedCauses?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button onClick={() => window.location.href = '/login'} variant="outline">
          Test Login Page
        </Button>
        <Button onClick={() => window.location.href = '/causes'} variant="outline">
          Test Causes List
        </Button>
        <Button onClick={() => window.location.href = '/create-cause'} variant="outline">
          Test Create Cause
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
          Test Dashboard
        </Button>
      </div>
    </div>
  );
}

export default SystemStatusPage;