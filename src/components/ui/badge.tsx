import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "pink" | "sport" | "blush" | "celeste"
}

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => {
  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-[#E91E63] text-white",
    secondary: "bg-[#F8E1E1] text-[#D5006D]",
    destructive: "bg-red-500 text-white",
    outline: "border border-[#E91E63] text-[#E91E63] bg-transparent",
    pink: "bg-gradient-to-r from-[#FF69B4] to-[#E91E63] text-white shadow-sm shadow-[#FF69B4]/30",
    sport: "bg-[#121316] text-[#FF69B4] font-bold tracking-wider uppercase text-[11px]",
    blush: "bg-[#FDF2F4] text-[#E91E63] border border-[#F4D7DE] font-semibold",
    celeste: "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-bold shadow-sm shadow-[#38BDF8]/15",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
