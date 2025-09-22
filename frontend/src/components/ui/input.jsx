import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-warm border border-neutral-300 bg-white px-4 py-2 text-sm placeholder-neutral-400 text-neutral-800 transition-trust file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-4 focus:ring-primary-200 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }