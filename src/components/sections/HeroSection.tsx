import { ArrowRight, Calendar, MapPin, Heart, Sparkles, Activity, ShieldCheck, ChevronRight, Building2, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#F0F9FF] via-[#FAF7F8] to-[#FFF0F4]"
    >
      {/* Background ambient glows: Soft Pink & Fresh Celeste */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#38BDF8]/20 via-[#FF69B4]/15 to-[#E91E63]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/4 -right-40 h-[550px] w-[550px] rounded-full bg-gradient-to-bl from-[#E0F2FE]/60 via-[#F8E1E1]/50 to-[#D5006D]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-full max-w-5xl bg-gradient-to-t from-white to-transparent opacity-80"
        aria-hidden="true"
      />

      {/* Subtle Athletic Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#0284C7_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badges Row: Dream Home as Host & Event Details */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <Badge variant="celeste" className="gap-1.5 px-4 py-1.5 text-xs uppercase tracking-wider font-black shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>Host Oficial del Evento</span>
          </Badge>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-white/95 px-4 py-1.5 text-xs font-extrabold text-[#0369A1] shadow-sm backdrop-blur-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#0284C7] animate-pulse" />
            <span>Inmobiliaria Dream Home Venezuela</span>
          </div>

          <Badge variant="pink" className="gap-1.5 px-4 py-1.5 text-xs uppercase tracking-wider font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Campaña Oficial Mes Rosa 2026</span>
          </Badge>

          <Badge variant="sport" className="px-3.5 py-1.5 text-[11px]">
            Caminata 5K Charallave
          </Badge>
        </div>

        {/* Hero Main Headline (Athletic Condensed Style - Move Fasted inspired) */}
        <div className="text-center max-w-5xl mx-auto">
          <div className="relative">
            {/* Athletic Big Display Title: "CAMINA Y RENACE CON DREAM HOME" */}
            <h1 className="font-sport uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tight text-[#121316]">
              CAMINA Y RENACE
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#E91E63] via-[#FF69B4] to-[#0284C7] bg-clip-text text-transparent italic drop-shadow-sm">
                CON DREAM HOME
              </span>
            </h1>

            {/* Campaign Subtitle Ribbon with Celeste Accent */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-[#D5006D]">
                «Una Pañoleta con Propósito»
              </span>
              <span className="hidden sm:inline-block text-[#9CA3AF]">•</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F2FE] px-3 py-0.5 text-xs sm:text-sm font-bold text-[#0369A1] border border-[#BAE6FD]">
                <Building2 className="h-3.5 w-3.5 text-[#0284C7]" />
                Host: Inmobiliaria Dream Home
              </span>
            </div>
          </div>

          {/* Subtitle / Key Details Bar */}
          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-[#525866] leading-relaxed font-normal">
              <strong className="font-bold text-[#121316]">Inmobiliaria Dream Home Venezuela</strong> te invita a la gran
              caminata deportiva y familiar por la salud integral, el renacer de la esperanza y la prevención del cáncer de mama
              en las calles de Charallave.
            </p>

            {/* Event Key Highlights Grid with Celeste Accents */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 rounded-2xl bg-white/95 border border-[#F4D7DE] p-3.5 text-left shadow-sm backdrop-blur-md hover:border-[#E91E63] transition-colors">
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

              <div className="flex items-center gap-3 rounded-2xl bg-white/95 border border-[#BAE6FD] p-3.5 text-left shadow-sm backdrop-blur-md hover:border-[#0284C7] transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0369A1]">
                    Ruta Charallave
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#121316]">
                    Forum ➔ El Campito
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/95 border border-[#F4D7DE] p-3.5 text-left shadow-sm backdrop-blur-md hover:border-[#E91E63] transition-colors">
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
                variant="celeste"
                onClick={() => handleScrollTo("ruta")}
                className="w-full sm:w-auto font-bold text-sm tracking-wide"
              >
                <Droplets className="mr-1.5 h-4 w-4" />
                <span>Ver Recorrido & Puntos</span>
              </Button>

              <Button
                size="lg"
                variant="glass"
                onClick={() => handleScrollTo("patrocinantes")}
                className="w-full sm:w-auto font-bold text-sm text-[#121316] hover:text-[#0284C7] border border-[#BAE6FD]"
              >
                <span>Patrocinadores</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Solid Graphic Visual Section: Sports & Awareness Showcase (No floating bobbing) */}
        <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto">
          {/* Main Hero Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden border border-[#F4D7DE] bg-gradient-to-r from-[#121316] via-[#1A1828] to-[#251322] p-6 sm:p-10 text-white shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#0284C7_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#E91E63]/25 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#0284C7]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Mission text & stats */}
              <div className="md:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#FF69B4] border border-white/15">
                    <Heart className="h-3.5 w-3.5 fill-[#FF69B4]" />
                    <span>Caminata con Sentido Benéfico</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0284C7]/30 px-3 py-1 text-xs font-semibold text-[#38BDF8] border border-[#38BDF8]/30">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Dream Home Host</span>
                  </div>
                </div>

                <h2 className="font-sport uppercase text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
                  CADA PASO ES UN HOMENAJE A LA VIDA
                </h2>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Lleva tu pañoleta rosa con orgullo en las calles de Charallave. Celebramos la resiliencia de las guerreras,
                  fomentamos la prevención temprana y cerramos con una explosiva sesión de bailoterapia en la meta.
                </p>

                {/* Micro Stats with Celeste + Pink highlights */}
                <div className="pt-2 grid grid-cols-3 gap-3 border-t border-white/15">
                  <div>
                    <span className="block font-sport text-2xl sm:text-3xl font-extrabold text-[#38BDF8]">
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
                    <span className="block font-sport text-2xl sm:text-3xl font-extrabold text-[#FF69B4]">
                      100%
                    </span>
                    <span className="text-[11px] text-white/70 uppercase tracking-wider">
                      Propósito & Vida
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Ribbon & Badge Mockup (Steady solid card, without floating animations) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4">
                <div className="relative w-full max-w-xs p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center">
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

                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E91E63] to-[#0284C7] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Inscripción Abierta 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Integrated Highlights Bar below showcase (replacing awkward floating badges) */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#BAE6FD] p-3.5 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7] font-black text-xs">
                5K
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#121316]">
                Circuito recreativo apto para toda la familia, niños y mascotas
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#F4D7DE] p-3.5 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F4] text-[#E91E63] font-black text-xs">
                ♫
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#121316]">
                Gran Bailoterapia Rosa, música en vivo y rifas al llegar a Meta
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
