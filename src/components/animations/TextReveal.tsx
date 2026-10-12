import { motion } from "framer-motion"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export const TextReveal = ({ text, className = "", delay = 0 }: TextRevealProps) => {
  const words = text.split(" ")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      rotateX: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 14,
        stiffness: 120,
      },
    },
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-2.5 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
