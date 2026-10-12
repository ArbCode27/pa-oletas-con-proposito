import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "sport" | "glass"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95 select-none"

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-[#E91E63] text-white hover:bg-[#D5006D] shadow-lg shadow-[#E91E63]/25 hover:shadow-xl hover:shadow-[#D5006D]/35",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",
      outline: "border-2 border-[#E91E63] text-[#E91E63] bg-transparent hover:bg-[#E91E63] hover:text-white",
      secondary: "bg-[#F8E1E1] text-[#D5006D] hover:bg-[#ffd2dc]",
      ghost: "hover:bg-[#FDF2F4] text-[#121316] hover:text-[#E91E63]",
      link: "text-[#E91E63] underline-offset-4 hover:underline",
      sport: "bg-gradient-to-r from-[#E91E63] via-[#FF69B4] to-[#D5006D] text-white uppercase tracking-wider font-extrabold shadow-lg shadow-[#E91E63]/30 hover:shadow-xl hover:shadow-[#E91E63]/50 hover:brightness-105",
      glass: "bg-white/80 backdrop-blur-md text-[#121316] border border-white/70 hover:bg-white shadow-sm hover:shadow-md",
    }

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-full px-4 text-xs",
      lg: "h-14 rounded-full px-8 text-base",
      xl: "h-16 rounded-full px-10 text-lg font-bold tracking-wide",
      icon: "h-11 w-11 p-0",
    }

    return (
      <Comp
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
