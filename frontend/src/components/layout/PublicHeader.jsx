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
        <div className="flex h-16 items-center">
          <div className="flex items-center space-x-4">
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
            <Link to="/" className="flex items-center space-x-2">
              <img src="/favicon.ico" alt="CauseHive Logo" className="h-8 w-8" />
              <span className="font-bold text-lg">CauseHive</span>
            </Link>
          </div>

          <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search causes..."
                  className="w-full pl-10 pr-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">Donation cart</span>
              </Link>
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;