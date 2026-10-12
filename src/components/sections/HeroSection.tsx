import { motion } from "framer-motion"
import { ArrowRight, Calendar, MapPin, Heart, Sparkles, Activity, ShieldCheck, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingElement } from "@/components/animations/FloatingElement"
import { RibbonDecor } from "@/components/animations/RibbonDecor"

export const HeroSection = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FAF7F8] to-[#FFF0F4]"
    >
      {/* Background radial ambient glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#FF69B4]/20 to-[#E91E63]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[#D5006D]/15 to-[#FFC0CB]/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-full max-w-5xl bg-gradient-to-t from-white to-transparent opacity-80"
        aria-hidden="true"
      />

      {/* Background Subtle Athletic Track lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#E91E63_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="pink" className="gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campaña Oficial Mes Rosa 2026</span>
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F4D7DE] bg-white/90 px-3.5 py-1 text-xs font-semibold text-[#121316] shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#E91E63] animate-pulse" />
              <span>Inmobiliaria Dream Home Venezuela</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge variant="sport" className="px-3.5 py-1.5 text-[11px]">
              Caminata 5K Charallave
            </Badge>
          </motion.div>
        </div>

        {/* Hero Main Headline (Inspired by Move Fasted athletic condensed energy) */}
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Athletic Big Display Title */}
            <h1 className="font-sport font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter text-[#121316]">
              CAMINA Y RENACE
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#E91E63] via-[#FF69B4] to-[#D5006D] bg-clip-text text-transparent italic drop-shadow-sm">
                CON PROPÓSITO
              </span>
            </h1>

            {/* Campaign Subtitle Ribbon */}
            <p className="mt-4 sm:mt-6 text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#D5006D]">
              «Una Pañoleta con Propósito»
            </p>
          </motion.div>

          {/* Subtitle / Key Details Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-3xl mx-auto"
          >
            <p className="text-base sm:text-lg text-[#525866] leading-relaxed font-normal">
              Únete a la gran caminata deportiva y familiar por la prevención y concientización
              del cáncer de mama. Una mañana de salud integral, esperanza, bailoterapia y vida en comunidad.
            </p>

            {/* Event Key Highlights Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-[#F4D7DE] p-3.5 text-left shadow-sm backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F4] text-[#E91E63]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Fecha Oficial
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#121316]">
                    Sábado 31 Octubre 2026
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-[#F4D7DE] p-3.5 text-left shadow-sm backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F4] text-[#E91E63]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Salida / Meta
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#121316]">
                    Forum Charallave ➔ Campito
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-[#F4D7DE] p-3.5 text-left shadow-sm backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F4] text-[#E91E63]">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Distancia & Nivel
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#121316]">
                    5K Familiar y Recreativo
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs Row */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                variant="sport"
                onClick={() => handleScrollTo("registro")}
                className="w-full sm:w-auto text-base sm:text-lg font-black tracking-wider py-4 px-9 shadow-xl shadow-[#E91E63]/30 hover:shadow-2xl hover:shadow-[#E91E63]/50 group"
              >
                <span>Inscríbete Aquí</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="glass"
                onClick={() => handleScrollTo("ruta")}
                className="w-full sm:w-auto font-bold text-sm text-[#121316] hover:text-[#E91E63] border border-[#F4D7DE]"
              >
                <span>Ver Recorrido 5K</span>
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Graphic Visual Section with Floating Sports & Awareness Cards */}
        <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto">
          {/* Main Hero Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden border border-[#F4D7DE] bg-gradient-to-r from-[#121316] via-[#1E121E] to-[#2B1124] p-6 sm:p-10 text-white shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#FF69B4_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#E91E63]/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Mission text & stats */}
              <div className="md:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#FF69B4] border border-white/15">
                  <Heart className="h-3.5 w-3.5 fill-[#FF69B4]" />
                  <span>Caminata con Sentido Benéfico</span>
                </div>

                <h2 className="font-sport uppercase text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
                  CADA PASO ES UN HOMENAJE A LA VIDA
                </h2>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Lleva tu pañoleta rosa con orgullo en las calles de Charallave. Celebramos la resiliencia de las guerreras,
                  fomentamos la prevención temprana y cerramos con una explosiva sesión de bailoterapia.
                </p>

                {/* Micro Stats */}
                <div className="pt-2 grid grid-cols-3 gap-3 border-t border-white/15">
                  <div>
                    <span className="block font-sport text-2xl sm:text-3xl font-extrabold text-[#FF69B4]">
                      5.0 KM
                    </span>
                    <span className="text-[11px] text-white/70 uppercase tracking-wider">
                      Circuito Seguro
                    </span>
                  </div>
                  <div>
                    <span className="block font-sport text-2xl sm:text-3xl font-extrabold text-white">
                      3 PUNTOS
                    </span>
                    <span className="text-[11px] text-white/70 uppercase tracking-wider">
                      Hidratación
                    </span>
                  </div>
                  <div>
                    <span className="block font-sport text-2xl sm:text-3xl font-extrabold text-[#FFC0CB]">
                      100%
                    </span>
                    <span className="text-[11px] text-white/70 uppercase tracking-wider">
                      Propósito & Amor
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Ribbon & Badge Mockup */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4">
                <FloatingElement duration={5} yOffset={8}>
                  <div className="relative p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center">
                    <RibbonDecor width={80} height={105} glow={true} />

                    <div className="mt-4">
                      <span className="inline-block font-sport uppercase tracking-widest text-xs font-black text-[#FF69B4]">
                        Kit Incluye
                      </span>
                      <h4 className="text-lg font-extrabold text-white">
                        Pañoleta Rosa Conmemorativa
                      </h4>
                      <p className="text-xs text-white/70 mt-1">
                        + Número Dorsal Oficial + Hidratación
                      </p>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#E91E63] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Inscripción Abierta 2026</span>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </div>
          </div>

          {/* Floating Pill Badges around Showcase (Inspired by Image 1) */}
          <FloatingElement
            duration={4.5}
            yOffset={10}
            className="hidden lg:block absolute -top-6 -left-6 z-20"
          >
            <div className="flex items-center gap-2.5 rounded-full bg-white/95 border border-[#F4D7DE] px-4 py-2 shadow-xl backdrop-blur-md">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E91E63] text-white font-black text-xs">
                5K
              </div>
              <span className="text-xs font-bold text-[#121316]">
                Para toda la familia & mascotas
              </span>
            </div>
          </FloatingElement>

          <FloatingElement
            duration={5.5}
            yOffset={12}
            delay={0.5}
            className="hidden lg:block absolute -bottom-6 -right-6 z-20"
          >
            <div className="flex items-center gap-2.5 rounded-full bg-white/95 border border-[#F4D7DE] px-4 py-2 shadow-xl backdrop-blur-md">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D5006D] text-white font-black text-xs">
                ♫
              </div>
              <span className="text-xs font-bold text-[#121316]">
                Bailoterapia & Música en Meta
              </span>
            </div>
          </FloatingElement>
        </div>
      </div>
    </section>
  )
}
