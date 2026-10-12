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
    default: "bg-[#EF007E] text-white",
    secondary: "bg-[#FDF0F6] text-[#EF007E]",
    destructive: "bg-red-500 text-white",
    outline: "border border-[#EF007E] text-[#EF007E] bg-transparent",
    pink: "bg-gradient-to-r from-[#FF3B9E] to-[#EF007E] text-white shadow-sm shadow-[#EF007E]/30",
    sport: "bg-[#121316] text-[#2FC7EA] font-bold tracking-wider uppercase text-[11px]",
    blush: "bg-[#FDF0F6] text-[#EF007E] border border-[#F8BFDC] font-semibold",
    celeste: "bg-[#E8FAFD] text-[#0E8EA8] border border-[#AEEAF7] font-bold shadow-sm shadow-[#2FC7EA]/15",
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
