import { motion } from "framer-motion"

interface RibbonDecorProps {
  className?: string
  width?: number | string
  height?: number | string
  glow?: boolean
  alt?: string
}

export const RibbonDecor = ({
  className = "",
  width = 64,
  height = 84,
  glow = true,
  alt = "Lazo conmemorativo de la vida y el renacer",
}: RibbonDecorProps) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 bg-[#EF007E]/25 rounded-full blur-xl pointer-events-none transform scale-125"
          aria-hidden="true"
        />
      )}
      <motion.img
        src="/paoleta-referencia.png"
        alt={alt}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
        className="relative z-10 drop-shadow-md select-none object-contain"
        whileHover={{ scale: 1.06, rotate: 2 }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
      />
    </div>
  )
}

export const PaoletaDecor = RibbonDecor
