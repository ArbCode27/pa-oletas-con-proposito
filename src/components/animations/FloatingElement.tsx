import React from "react"
import { motion } from "framer-motion"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  yOffset?: number
  delay?: number
}

export const FloatingElement = ({
  children,
  className = "",
  duration = 4,
  yOffset = 12,
  delay = 0,
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
