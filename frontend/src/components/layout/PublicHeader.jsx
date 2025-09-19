import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { useDonationCart } from '../../contexts/DonationCartContext';

/**
 * PublicHeader - Header specifically for unauthenticated users
 * Shows login/signup options and basic navigation
 */
export function PublicHeader({ onMenuClick, showMenuButton = true, className }) {
  const { totalItems } = useDonationCart();

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md",
      className
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {showMenuButton && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover-lift">
              <img src="/favicon.ico" alt="CauseHive Logo" className="h-8 w-8" />
              <span className="heading-card text-xl font-bold text-primary-700">
                CauseHive
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search causes to support..."
                className="w-full pl-10 pr-4 bg-neutral-50 border-neutral-200 focus:bg-white transition-trust"
              />
            </div>
          </div>

          {/* Right Section - Public Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Donation Cart - Public users can still donate */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">Donation cart ({totalItems} items)</span>
              </Link>
            </Button>

            {/* Auth Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="ghost" asChild>
                <Link to="/login">
                  Log In
                </Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link to="/register">
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;