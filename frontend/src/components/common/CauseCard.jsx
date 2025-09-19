import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, Button } from '../ui';
import { Heart, Users, Clock, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Modern Cause Card Component
 * Enterprise-grade design with shadcn/ui components
 */
const CauseCard = ({ 
  cause, 
  className,
  showProgress = true,
  variant = "default" 
}) => {
  const {
    id,
    name,
    description,
    target_amount,
    amount_raised = 0,
    image_url,
    organizer_name,
    location,
    created_at,
    status = 'active',
    category
  } = cause || {};

  // Calculate progress percentage
  const progressPercentage = target_amount > 0 
    ? Math.min((amount_raised / target_amount) * 100, 100) 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      "border-border bg-card",
      variant === "featured" && "ring-2 ring-causehive-primary/20",
      className
    )}>
      {/* Cause Image */}
      <div className="relative overflow-hidden">
        <img
          src={image_url || '/api/placeholder/400/200'}
          alt={name || 'Cause image'}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Status Badge */}
        {status && (
          <div className={cn(
            "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium",
            status === 'active' && "bg-green-100 text-green-800",
            status === 'completed' && "bg-blue-100 text-blue-800",
            status === 'urgent' && "bg-red-100 text-red-800"
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {category}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="space-y-3">
        {/* Cause Title */}
        <h3 className="text-lg font-display font-semibold text-foreground line-clamp-2 group-hover:text-causehive-primary transition-colors">
          {name || 'Untitled Cause'}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {organizer_name && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{organizer_name}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          )}
          
          {created_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(created_at)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        {showProgress && target_amount > 0 && (
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-causehive-primary to-causehive-secondary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Progress Stats */}
            <div className="flex justify-between items-center text-sm">
              <div className="text-foreground font-semibold">
                {formatCurrency(amount_raised)}
              </div>
              <div className="text-muted-foreground">
                of {formatCurrency(target_amount)} goal
              </div>
            </div>
            
            {/* Progress Percentage */}
            <div className="text-xs text-center text-muted-foreground">
              {progressPercentage.toFixed(1)}% funded
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 gap-2">
        {/* Action Buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          asChild
        >
          <Link to={`/causes/${id}`}>
            Learn More
          </Link>
        </Button>
        
        <Button 
          variant="donate" 
          size="sm" 
          className="flex-1"
          asChild
        >
          <Link to={`/donate?causeId=${id}`}>
            <Heart className="h-3 w-3 mr-1" />
            Donate
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CauseCard;