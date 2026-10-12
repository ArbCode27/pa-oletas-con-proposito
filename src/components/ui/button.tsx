import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "sport" | "glass" | "celeste"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseStyles = "inline-flex items-center justify-center max-w-full rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF007E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95 select-none text-center"

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-[#EF007E] text-white hover:bg-[#C9006A] shadow-lg shadow-[#EF007E]/25 hover:shadow-xl hover:shadow-[#C9006A]/35",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",
      outline: "border-2 border-[#EF007E] text-[#EF007E] bg-transparent hover:bg-[#EF007E] hover:text-white",
      secondary: "bg-[#FDF0F6] text-[#EF007E] hover:bg-[#F8BFDC]",
      ghost: "hover:bg-[#FDF0F6] text-[#121316] hover:text-[#EF007E]",
      link: "text-[#EF007E] underline-offset-4 hover:underline",
      sport: "bg-gradient-to-r from-[#EF007E] via-[#FF3B9E] to-[#2FC7EA] text-white uppercase tracking-normal sm:tracking-wider font-extrabold shadow-lg shadow-[#EF007E]/30 hover:shadow-xl hover:shadow-[#EF007E]/50 hover:brightness-105",
      glass: "bg-white/80 backdrop-blur-md text-[#121316] border border-white/70 hover:bg-white shadow-sm hover:shadow-md",
      celeste: "bg-gradient-to-r from-[#2FC7EA] to-[#18A9CC] text-white hover:from-[#18A9CC] hover:to-[#0E8EA8] shadow-lg shadow-[#2FC7EA]/25 hover:shadow-xl hover:shadow-[#2FC7EA]/40",
    }

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      default: "min-h-[44px] px-5 sm:px-6 py-2.5 text-xs sm:text-sm",
      sm: "min-h-[36px] rounded-full px-3.5 sm:px-4 py-1.5 text-xs",
      lg: "min-h-[48px] sm:min-h-[56px] rounded-full px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-base leading-snug",
      xl: "min-h-[52px] sm:min-h-[64px] rounded-full px-5 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-lg font-bold tracking-normal sm:tracking-wide leading-snug",
      icon: "h-11 w-11 p-0 shrink-0",
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
