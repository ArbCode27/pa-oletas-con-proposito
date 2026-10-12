import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Heart, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Event Date: Saturday October 31, 2026, 06:30 AM VET (UTC-4)
    const targetDate = new Date("2026-10-31T06:30:00-04:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const diff = targetDate - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl rounded-full transition-all duration-300 ${
          isScrolled
            ? "glass-pill shadow-lg shadow-[#D5006D]/10 py-2.5 px-4 sm:px-6 border border-white/80"
            : "bg-white/70 backdrop-blur-md py-3 px-4 sm:px-6 border border-white/60 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF69B4] text-white shadow-md shadow-[#E91E63]/30 transition-transform group-hover:scale-105">
              <Heart className="h-5 w-5 fill-white" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#121316] text-[9px] font-bold text-[#FF69B4]">
                5K
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#E91E63]">
                Mes Rosa 2026
              </span>
              <span className="text-sm font-black tracking-tight text-[#121316]">
                Dream Home <span className="font-medium text-[#525866]">Venezuela</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick("hero")}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#E91E63] transition-colors rounded-full hover:bg-[#FDF2F4] cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick("proposito")}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#E91E63] transition-colors rounded-full hover:bg-[#FDF2F4] cursor-pointer"
            >
              Propósito
            </button>
            <button
              onClick={() => handleNavClick("ruta")}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#E91E63] transition-colors rounded-full hover:bg-[#FDF2F4] cursor-pointer"
            >
              Ruta 5K
            </button>
            <button
              onClick={() => handleNavClick("cronograma")}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#E91E63] transition-colors rounded-full hover:bg-[#FDF2F4] cursor-pointer"
            >
              Detalles
            </button>
            <button
              onClick={() => handleNavClick("preguntas")}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#E91E63] transition-colors rounded-full hover:bg-[#FDF2F4] cursor-pointer"
            >
              Preguntas
            </button>
          </nav>

          {/* Countdown & Action CTA */}
          <div className="flex items-center gap-3">
            {/* Countdown chip (desktop only) */}
            <div className="hidden xl:flex items-center gap-2 rounded-full bg-[#FDF2F4] px-3.5 py-1.5 text-xs font-semibold text-[#D5006D] border border-[#F4D7DE]">
              <Calendar className="h-3.5 w-3.5 text-[#E91E63]" />
              <span>
                Faltan <strong className="font-black text-[#121316]">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</strong>
              </span>
            </div>

            {/* Registration CTA button */}
            <Button
              variant="sport"
              size="default"
              onClick={() => handleNavClick("registro")}
              className="shadow-md text-xs sm:text-sm font-bold tracking-wide"
            >
              <span>Inscríbete Aquí</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full bg-[#FDF2F4] text-[#121316] hover:bg-[#F8E1E1] transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 mx-auto max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-[#F4D7DE] p-5 shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4D7DE]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E91E63]">
                  <Calendar className="h-4 w-4" />
                  <span>Sábado 31 de octubre de 2026</span>
                </div>
                <span className="text-[11px] font-bold bg-[#F8E1E1] text-[#D5006D] px-2 py-0.5 rounded-full">
                  {timeLeft.days} días para la salida
                </span>
              </div>
              <button
                onClick={() => handleNavClick("hero")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#E91E63]"
              >
                <span>Inicio</span>
              </button>
              <button
                onClick={() => handleNavClick("proposito")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#E91E63]"
              >
                <span>Propósito del Evento</span>
              </button>
              <button
                onClick={() => handleNavClick("ruta")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#E91E63]"
              >
                <span>Ruta Oficial 5K Charallave</span>
              </button>
              <button
                onClick={() => handleNavClick("cronograma")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#E91E63]"
              >
                <span>Horarios y Kit de Caminante</span>
              </button>
              <button
                onClick={() => handleNavClick("preguntas")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#E91E63]"
              >
                <span>Preguntas Frecuentes</span>
              </button>

              <Button
                variant="sport"
                size="lg"
                onClick={() => handleNavClick("registro")}
                className="w-full mt-2"
              >
                <span>Completar Inscripción</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
