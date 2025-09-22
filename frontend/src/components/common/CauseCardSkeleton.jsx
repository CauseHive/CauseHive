import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '../ui';
import { cn } from '../../utils/cn';

/**
 * Loading Skeleton for Cause Cards
 * Provides visual feedback during data loading
 */
const CauseCardSkeleton = ({ className, count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Card key={index} className={cn("overflow-hidden", className)}>
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48" />
      
      <CardHeader className="space-y-3">
        {/* Title Skeleton */}
        <Skeleton variant="heading" className="w-3/4" />
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
        
        {/* Meta Information Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton variant="text" className="w-20" />
          <Skeleton variant="text" className="w-16" />
          <Skeleton variant="text" className="w-24" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar Skeleton */}
        <div className="space-y-2">
          <Skeleton className="w-full h-2 rounded-full" />
          <div className="flex justify-between">
            <Skeleton variant="text" className="w-16" />
            <Skeleton variant="text" className="w-20" />
          </div>
          <Skeleton variant="text" className="w-12 mx-auto" />
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {/* Button Skeletons */}
        <Skeleton variant="button" className="flex-1" />
        <Skeleton variant="button" className="flex-1" />
      </CardFooter>
    </Card>
  ));

  return count === 1 ? skeletons[0] : skeletons;
};

export default CauseCardSkeleton;