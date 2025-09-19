import React, { Suspense, lazy } from 'react';
import { Skeleton } from '../ui';
import { cn } from '../../utils/cn';

/**
 * Lazy loading wrapper component for code splitting
 */
export const LazyComponent = ({ 
  importFunc, 
  fallback, 
  className,
  ...props 
}) => {
  const Component = lazy(importFunc);
  
  return (
    <Suspense fallback={fallback || <ComponentSkeleton className={className} />}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * Generic component skeleton for lazy loading
 */
export const ComponentSkeleton = ({ className, height = "h-96" }) => (
  <div className={cn("space-y-4", className)}>
    <Skeleton className={cn("w-full", height)} />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

/**
 * Lazy image component with loading states and error handling
 */
export const LazyImage = ({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholder.jpg',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(src);

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoading(false);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    onError?.(e);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError && imageSrc === fallbackSrc && "filter grayscale",
          className
        )}
        {...props}
      />
      
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">
            Image unavailable
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasBeenVisible, options]);

  return { elementRef, isIntersecting, hasBeenVisible };
};

/**
 * Lazy section component that loads content when visible
 */
export const LazySection = ({ 
  children, 
  fallback, 
  className,
  threshold = 0.1,
  ...props 
}) => {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({ threshold });

  return (
    <div ref={elementRef} className={className} {...props}>
      {hasBeenVisible ? children : (fallback || <ComponentSkeleton />)}
    </div>
  );
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) { // Log slow renders (>100ms)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};

/**
 * Bundle size optimization utilities
 */
export const lazyPages = {
  Dashboard: lazy(() => import('../../screens/Dashboard')),
  CauseListpage: lazy(() => import('../../screens/CauseListpage')),
  CausedetailPage: lazy(() => import('../../screens/CausedetailPage')),
  Donation: lazy(() => import('../../screens/Donation')),
  Profilepage: lazy(() => import('../../screens/Profilepage')),
  AdminDashboard: lazy(() => import('../../screens/AdminDashboard')),
  CartPage: lazy(() => import('../../screens/CartPage')),
};

/**
 * Preload critical components
 */
export const preloadComponent = (importFunc) => {
  const component = lazy(importFunc);
  // Trigger import without rendering
  importFunc();
  return component;
};

/**
 * Memory usage monitor
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = React.useState(null);

  React.useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo({
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
      };

      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, []);

  return memoryInfo;
};

export default LazyComponent;