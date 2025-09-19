import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../ui';
import { Loader2, Check, X, AlertCircle, Heart } from 'lucide-react';

/**
 * Enhanced loading button with animation states
 */
export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = "Loading...",
  successText,
  errorText,
  className,
  variant = "default",
  ...props
}) => {
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      setState('loading');
    }
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getText = () => {
    switch (state) {
      case 'loading':
        return loadingText;
      case 'success':
        return successText || 'Success!';
      case 'error':
        return errorText || 'Error occurred';
      default:
        return children;
    }
  };

  const getVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return variant;
    }
  };

  return (
    <Button
      variant={getVariant()}
      disabled={state === 'loading'}
      className={cn(
        "transition-all duration-300",
        state === 'success' && "bg-green-600 hover:bg-green-700",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {getIcon()}
        <span className={cn(
          "transition-all duration-200",
          state !== 'idle' && "animate-pulse"
        )}>
          {getText()}
        </span>
      </div>
    </Button>
  );
};

/**
 * Animated heart icon for favorites/likes
 */
export const AnimatedHeart = ({ 
  isLiked = false, 
  onToggle, 
  size = 24,
  className 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggle?.(!isLiked);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1",
        className
      )}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Heart
        size={size}
        className={cn(
          "transition-all duration-300",
          isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400",
          isAnimating && "animate-bounce scale-125"
        )}
      />
    </button>
  );
};

/**
 * Progress indicator with smooth animations
 */
export const AnimatedProgress = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  animate = true,
  color = "bg-primary",
  className,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.round((value / max) * 100);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  const displayPercentage = Math.round((displayValue / max) * 100);

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">
              {displayPercentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-1000 ease-out",
            color
          )}
          style={{ width: `${displayPercentage}%` }}
          role="progressbar"
          aria-valuenow={displayValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${displayPercentage}%`}
        />
      </div>
    </div>
  );
};

/**
 * Animated counter with smooth transitions
 */
export const AnimatedCounter = ({
  value = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOutCubic * value);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={cn("font-bold tabular-nums", className)} {...props}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

/**
 * Floating action button with ripple effect
 */
export const FloatingActionButton = ({
  children,
  onClick,
  className,
  size = "md",
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.(event);
  };

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16"
  };

  return (
    <button
      onClick={createRipple}
      className={cn(
        "relative overflow-hidden rounded-full bg-primary text-primary-foreground",
        "shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "flex items-center justify-center",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
      
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white opacity-30 rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '600ms'
          }}
        />
      ))}
    </button>
  );
};

/**
 * Skeleton with shimmer effect
 */
export const ShimmerSkeleton = ({ 
  className,
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "bg-muted",
    text: "bg-muted h-4",
    avatar: "bg-muted rounded-full w-10 h-10",
    button: "bg-muted h-10 rounded-md"
  };

  return (
    <div
      className={cn(
        "animate-pulse relative overflow-hidden",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

/**
 * Toast notification with entrance/exit animations
 */
export const AnimatedToast = ({
  type = "info",
  title,
  message,
  isVisible = false,
  onClose,
  duration = 5000,
  position = "top-right"
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      
      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          handleClose();
        }, duration);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <X className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info: <AlertCircle className="w-5 h-5 text-blue-600" />
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 p-4 rounded-lg border shadow-lg max-w-sm",
        "transform transition-all duration-300 ease-out",
        positionClasses[position],
        typeStyles[type],
        isShowing ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"
      )}
    >
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          {message && (
            <p className="text-sm opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Loading dots animation
 */
export const LoadingDots = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

// Export all interactive components
const InteractiveComponents = {
  LoadingButton,
  AnimatedHeart,
  AnimatedProgress,
  AnimatedCounter,
  FloatingActionButton,
  ShimmerSkeleton,
  AnimatedToast,
  LoadingDots
};

export default InteractiveComponents;