import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

const NotFoundPage = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const suggestions = [
    {
      icon: Home,
      title: 'Go Home',
      description: 'Return to our homepage',
      link: isAuthenticated ? '/dashboard' : '/',
      action: isAuthenticated ? 'Go to Dashboard' : 'Visit Homepage'
    },
    {
      icon: Search,
      title: 'Browse Causes',
      description: 'Explore causes you can support',
      link: '/causes',
      action: 'Browse Causes'
    },
    {
      icon: MapPin,
      title: 'Get Help',
      description: 'Contact our support team',
      link: '/help',
      action: 'Help Center'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Graphic */}
        <div className="mb-12">
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-bold text-gray-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="h-24 w-24 text-primary-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-6">
            We couldn't find the page you're looking for. It might have been moved, 
            deleted, or the URL might be incorrect.
          </p>
          <div className="flex items-center justify-center text-sm text-neutral-500">
            <span>Error Code: 404</span>
            <span className="mx-2">•</span>
            <span>Page Not Found</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {suggestion.title}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {suggestion.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={suggestion.link}>
                    {suggestion.action}
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" onClick={() => window.history.back()}>
            <span className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </span>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">
              Report a Problem
            </Link>
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Looking for something specific?
          </h3>
          <p className="text-neutral-600 mb-4">
            Try searching for causes, or browse our popular categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search causes..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-sm text-neutral-500">
          <p>
            💡 Did you know? While you're here, over 2.5 million people are making a difference through CauseHive!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;