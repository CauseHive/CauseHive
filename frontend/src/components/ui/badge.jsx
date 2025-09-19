import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-100 text-primary-700 shadow-sm",
        secondary: "border-transparent bg-secondary-100 text-secondary-700 shadow-sm",
        destructive: "border-transparent bg-red-100 text-red-700 shadow-sm",
        outline: "text-foreground border-neutral-300",
        success: "border-transparent bg-green-100 text-green-700 shadow-sm",
        warning: "border-transparent bg-yellow-100 text-yellow-700 shadow-sm",
        trust: "border-transparent bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 shadow-trust",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }