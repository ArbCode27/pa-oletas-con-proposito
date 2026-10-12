import { motion } from "framer-motion"

interface RibbonDecorProps {
  className?: string
  width?: number
  height?: number
  glow?: boolean
}

export const RibbonDecor = ({
  className = "",
  width = 64,
  height = 84,
  glow = true,
}: RibbonDecorProps) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 bg-[#EF007E]/30 rounded-full blur-xl pointer-events-none transform scale-125"
          aria-hidden="true"
        />
      )}
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 100 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <defs>
          <linearGradient id="ribbonGrad1" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FF3B9E" />
            <stop offset="50%" stopColor="#EF007E" />
            <stop offset="100%" stopColor="#C9006A" />
          </linearGradient>
          <linearGradient id="ribbonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2FC7EA" />
            <stop offset="100%" stopColor="#EF007E" />
          </linearGradient>
          <linearGradient id="ribbonShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Back tail left */}
        <path
          d="M32 75 C 20 95, 10 115, 12 125 C 22 122, 35 110, 42 96 Z"
          fill="url(#ribbonGrad1)"
          opacity="0.85"
        />
        {/* Back tail right */}
        <path
          d="M68 75 C 80 95, 90 115, 88 125 C 78 122, 65 110, 58 96 Z"
          fill="url(#ribbonGrad1)"
          opacity="0.9"
        />

        {/* Main Ribbon Loop */}
        <path
          d="M50 15 C 32 15, 20 28, 20 45 C 20 62, 34 76, 50 92 C 66 76, 80 62, 80 45 C 80 28, 68 15, 50 15 Z"
          fill="url(#ribbonGrad1)"
        />

        {/* Inner loop cut */}
        <path
          d="M50 28 C 40 28, 33 36, 33 46 C 33 56, 42 66, 50 75 C 58 66, 67 56, 67 46 C 67 36, 60 28, 50 28 Z"
          fill="#FAF7F8"
        />

        {/* Cross overlap highlight */}
        <path
          d="M35 70 C 45 80, 55 88, 65 105 C 57 108, 48 100, 42 92 Z"
          fill="url(#ribbonGrad2)"
        />

        {/* Gloss / Light reflection */}
        <path
          d="M50 18 C 36 18, 26 28, 24 42 C 26 32, 36 22, 50 22 C 64 22, 74 32, 76 42 C 74 28, 64 18, 50 18 Z"
          fill="url(#ribbonShine)"
        />
      </motion.svg>
    </div>
  )
}
