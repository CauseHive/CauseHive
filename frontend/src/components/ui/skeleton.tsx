import * as React from 'react'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800/70 ${className}`}
      {...props}
    />
  )
}

export default Skeleton
