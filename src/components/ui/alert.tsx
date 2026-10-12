import * as React from "react"
import { cn } from "@/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "pink" | "celeste"
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles: Record<NonNullable<AlertProps["variant"]>, string> = {
      default: "bg-[#FDF0F6] text-[#121316] border-[#F8BFDC]",
      destructive: "border-red-300 bg-red-50 text-red-900 [&>svg]:text-red-600",
      success: "border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600",
      pink: "border-[#EF007E]/30 bg-gradient-to-r from-[#FDF0F6] to-[#F8BFDC]/50 text-[#EF007E] [&>svg]:text-[#EF007E]",
      celeste: "border-[#2FC7EA]/30 bg-gradient-to-r from-[#E8FAFD] to-[#AEEAF7]/50 text-[#0E8EA8] [&>svg]:text-[#2FC7EA]",
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-2xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"
