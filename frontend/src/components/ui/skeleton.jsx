import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../utils/cn"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "",
        circle: "rounded-full",
        text: "h-4",
        heading: "h-6",
        button: "h-10",
        card: "h-32",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Skeleton = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
})
Skeleton.displayName = "Skeleton"

export { Skeleton }