import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Heart, Menu, X, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Event Date: Saturday October 31, 2026, 07:00 AM VET (UTC-4) - Inicio con Bailoterapia en el Fórum
    const targetDate = new Date("2026-10-31T07:00:00-04:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 py-3 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl rounded-full transition-all duration-300 ${
          isScrolled
            ? "glass-pill shadow-lg shadow-[#EF007E]/10 py-2 px-3 sm:px-5 border border-white/80"
            : "bg-white/85 backdrop-blur-md py-2.5 px-3 sm:px-5 border border-white/70 shadow-sm"
        }`}>
        <div className="flex items-center justify-between">
          {/* Logo & Brand: Only icon on mobile, full brand on desktop */}
          <div
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none">
            <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <img
                src="/logo-dream-home.png"
                alt="Inmobiliaria Dream Home"
                className="h-full w-full object-contain rounded-full shadow-md shadow-[#EF007E]/20"
              />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#EF007E] text-[8px] sm:text-[9px] font-black text-white border border-white shadow-xs">
                5K
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#EF007E]">
                Mes Rosa
              </span>
              <span className="text-sm font-black tracking-tight text-[#121316]">
                Dream Home{" "}
                <span className="font-semibold text-[#525866]">Venezuela</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick("hero")}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#EF007E] transition-colors rounded-full hover:bg-[#FDF0F6] cursor-pointer">
              Inicio
            </button>
            <button
              onClick={() => handleNavClick("patrocinantes")}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0E8EA8] hover:text-[#2FC7EA] transition-colors rounded-full hover:bg-[#E8FAFD] cursor-pointer font-bold">
              Patrocinadores
            </button>
            <button
              onClick={() => handleNavClick("proposito")}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#EF007E] transition-colors rounded-full hover:bg-[#FDF0F6] cursor-pointer">
              Propósito
            </button>
            <button
              onClick={() => handleNavClick("ruta")}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#2FC7EA] transition-colors rounded-full hover:bg-[#E8FAFD] cursor-pointer">
              Ruta 5K
            </button>
            <button
              onClick={() => handleNavClick("cronograma")}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#EF007E] transition-colors rounded-full hover:bg-[#FDF0F6] cursor-pointer">
              Horarios
            </button>
            <button
              onClick={() => handleNavClick("preguntas")}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#121316] hover:text-[#EF007E] transition-colors rounded-full hover:bg-[#FDF0F6] cursor-pointer">
              Preguntas
            </button>
          </nav>

          {/* Countdown & Action CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Countdown chip (desktop only) */}
            <div className="hidden xl:flex items-center gap-2 rounded-full bg-[#E8FAFD] px-3.5 py-1.5 text-xs font-bold text-[#0E8EA8] border border-[#AEEAF7]">
              <Calendar className="h-3.5 w-3.5 text-[#2FC7EA]" />
              <span>
                Faltan{" "}
                <strong className="font-black text-[#121316]">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </strong>
              </span>
            </div>

            {/* Registration CTA button (more compact on mobile) */}
            <Button
              variant="sport"
              size="default"
              onClick={() => handleNavClick("registro")}
              className="shadow-md h-8 sm:h-11 px-3.5 sm:px-6 py-1 sm:py-2.5 text-[11px] sm:text-sm font-bold tracking-normal sm:tracking-wider">
              <span>Inscríbete Aquí</span>
              <ArrowRight className="ml-1 sm:ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            {/* Mobile menu toggle (eliminated on mobile phones, tablet only) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hidden sm:flex lg:hidden h-10 w-10 items-center justify-center rounded-full bg-[#E8FAFD] text-[#0E8EA8] hover:bg-[#AEEAF7]/40 transition-colors border border-[#AEEAF7]"
              aria-label="Abrir menú">
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (only for tablet breakpoint when toggle is visible) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="hidden sm:block lg:hidden mt-2 mx-auto max-w-md rounded-3xl bg-white/98 backdrop-blur-xl border border-[#AEEAF7] p-5 shadow-2xl">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F8BFDC]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0E8EA8]">
                  <img
                    src="/logo-dream-home.png"
                    alt="Dream Home"
                    className="h-6 w-6 rounded-full object-contain"
                  />
                  <span>Inmobiliaria Dream Home</span>
                </div>
                <span className="text-[11px] font-bold bg-[#E8FAFD] text-[#0E8EA8] px-2.5 py-0.5 rounded-full border border-[#AEEAF7]">
                  {timeLeft.days} días para la salida
                </span>
              </div>
              <button
                onClick={() => handleNavClick("hero")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#2FC7EA]">
                <span>Inicio</span>
              </button>
              <button
                onClick={() => handleNavClick("patrocinantes")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#0E8EA8] hover:text-[#2FC7EA]">
                <span>Marcas Patrocinantes</span>
                <span className="text-[10px] bg-[#E8FAFD] text-[#0E8EA8] font-bold px-2 py-0.5 rounded-full">
                  Sponsors
                </span>
              </button>
              <button
                onClick={() => handleNavClick("proposito")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#EF007E]">
                <span>Propósito del Evento</span>
              </button>
              <button
                onClick={() => handleNavClick("ruta")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#2FC7EA]">
                <span>Ruta Oficial 5K Charallave</span>
              </button>
              <button
                onClick={() => handleNavClick("cronograma")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#EF007E]">
                <span>Horarios y Kit de Caminante</span>
              </button>
              <button
                onClick={() => handleNavClick("preguntas")}
                className="flex items-center justify-between py-2 text-sm font-bold text-[#121316] hover:text-[#EF007E]">
                <span>Preguntas Frecuentes</span>
              </button>

              <Button
                variant="sport"
                size="lg"
                onClick={() => handleNavClick("registro")}
                className="w-full mt-2">
                <span>Completar Inscripción</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
