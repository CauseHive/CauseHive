import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User, Heart, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useDonationCart } from '../../contexts/DonationCartContext';
import { useSavedCauses } from '../../contexts/SavedCausesContext';

export function Header({ onMenuClick, showMenuButton = true, className }) {
  const { user, logout } = useAuth();
  const { totalItems } = useDonationCart();
  const { savedCount } = useSavedCauses();

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
            <Link to="/dashboard" className="flex items-center space-x-2 hover-lift">
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
                placeholder="Search causes, organizations..."
                className="w-full pl-10 pr-4 bg-neutral-50 border-neutral-200 focus:bg-white transition-trust"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Donation Cart */}
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

            {/* Saved Causes */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/saved">
                <Heart className="h-5 w-5" />
                {savedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white"
                  >
                    {savedCount}
                  </Badge>
                )}
                <span className="sr-only">Saved causes ({savedCount} saved)</span>
              </Link>
            </Button>

            {/* Create Cause Button */}
            <Button
              asChild
              className="hidden sm:flex btn-secondary"
            >
              <Link to="/causes/create">
                <Plus className="h-4 w-4 mr-2" />
                Start a Cause
              </Link>
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    3
                  </Badge>
                  <span className="sr-only">View notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">New donation received</p>
                    <p className="text-xs text-neutral-500">
                      Someone donated $25 to your cause "Clean Water for All"
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Cause milestone reached</p>
                    <p className="text-xs text-neutral-500">
                      Your cause has reached 50% of its goal!
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/notifications" className="w-full text-center text-sm text-primary-600">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
                    <p className="text-xs leading-none text-neutral-500">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-causes">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>My Causes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/donations">
                    <span className="mr-2">💖</span>
                    <span>My Donations</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;