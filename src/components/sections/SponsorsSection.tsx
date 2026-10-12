import { Sparkles, Building2, Handshake, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SponsorItem {
  id: number
  tier: "ORO" | "PLATA" | "DIAMANTE" | "HIDRATACIÓN" | "ALIADO"
  name: string
  category: string
}

const SPONSORS_ROW_1: SponsorItem[] = [
  { id: 1, tier: "DIAMANTE", name: "Dream Home", category: "Inmobiliaria Oficial" },
  { id: 2, tier: "ORO", name: "Dream Home", category: "Valles del Tuy" },
  { id: 3, tier: "HIDRATACIÓN", name: "Dream Home", category: "Puntos de Hidratación" },
  { id: 4, tier: "PLATA", name: "Dream Home", category: "Aliado Comercial" },
  { id: 5, tier: "ALIADO", name: "Dream Home", category: "Charallave Centro" },
  { id: 6, tier: "ORO", name: "Dream Home", category: "División Inversiones" },
  { id: 7, tier: "DIAMANTE", name: "Dream Home", category: "Sponsor Principal" },
  { id: 8, tier: "ALIADO", name: "Dream Home", category: "Comunidad Rosa" },
]

const SPONSORS_ROW_2: SponsorItem[] = [
  { id: 9, tier: "ORO", name: "Dream Home", category: "Bienes Raíces" },
  { id: 10, tier: "ALIADO", name: "Dream Home", category: "Desarrollo Social" },
  { id: 11, tier: "DIAMANTE", name: "Dream Home", category: "Líder Inmobiliario" },
  { id: 12, tier: "HIDRATACIÓN", name: "Dream Home", category: "Salud Integral" },
  { id: 13, tier: "PLATA", name: "Dream Home", category: "Patrocinante Oficial" },
  { id: 14, tier: "ORO", name: "Dream Home", category: "Miranda & Tuy" },
  { id: 15, tier: "ALIADO", name: "Dream Home", category: "Campaña Rosa" },
  { id: 16, tier: "PLATA", name: "Dream Home", category: "Compromiso Social" },
]

export const SponsorsSection = () => {
  const handleContactSponsor = () => {
    const message = encodeURIComponent(
      "Hola, deseo información para patrocinar la Caminata 5K 'Camina y Renace con Dream Home 2026' con mi marca o empresa."
    )
    window.open(`https://wa.me/584241128778?text=${message}`, "_blank")
  }

  return (
    <section id="patrocinantes" className="py-16 md:py-24 bg-white relative overflow-hidden border-y border-[#F8BFDC]/60">
      {/* Background soft secondary celeste and primary fucsia glows */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 h-72 w-72 rounded-full bg-[#E8FAFD] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 h-72 w-72 rounded-full bg-[#FDF0F6] blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        {/* Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold">
            <Building2 className="h-3.5 w-3.5 mr-1 text-[#2FC7EA]" />
            Alianzas Comerciales
          </Badge>
          <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-[#EF007E]" />
            Sponsors Oficiales
          </Badge>
        </div>

        {/* Section Heading with athletic condensed font */}
        <h2 className="font-sport uppercase text-4xl sm:text-5xl md:text-6xl font-black text-[#121316] tracking-tight leading-tight">
          MARCAS QUE RENACEN
          <span className="block text-transparent bg-gradient-to-r from-[#2FC7EA] via-[#18A9CC] to-[#EF007E] bg-clip-text">
            CON DREAM HOME
          </span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#525866] max-w-2xl mx-auto leading-relaxed">
          Agradecemos a las empresas, marcas aliadas y comercios de los Valles del Tuy que se suman como patrocinantes oficiales de la salud integral y la prevención.
        </p>
      </div>

      {/* Infinite Auto-Scrolling Marquee Carousel Row 1 (Leftward) */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Side fade masks for seamless visual blend */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="animate-marquee-left flex gap-4 sm:gap-6 items-center">
          {/* Double array for seamless infinite marquee loop */}
          {[...SPONSORS_ROW_1, ...SPONSORS_ROW_1].map((sponsor, index) => (
            <div
              key={`row1-${sponsor.id}-${index}`}
              className="flex-shrink-0 w-56 sm:w-64 h-24 sm:h-28 rounded-2xl border border-[#AEEAF7] bg-white/95 backdrop-blur-sm p-3.5 flex items-center gap-3.5 shadow-sm hover:border-[#2FC7EA] hover:shadow-md transition-all group cursor-default"
            >
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[#E8FAFD] p-1 border border-[#AEEAF7] shadow-inner transition-transform group-hover:scale-105">
                <img
                  src="/logo-dream-home.png"
                  alt={sponsor.name}
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="h-2 w-2 rounded-full bg-[#2FC7EA]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0E8EA8]">
                    {sponsor.tier}
                  </span>
                </div>
                <span className="font-sport uppercase text-base sm:text-lg font-black text-[#121316] leading-tight truncate group-hover:text-[#2FC7EA] transition-colors">
                  {sponsor.name}
                </span>
                <span className="text-[10px] text-[#6B7280] font-medium tracking-wide truncate">
                  {sponsor.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Auto-Scrolling Marquee Carousel Row 2 (Rightward) */}
      <div className="relative w-full overflow-hidden py-3 mt-1">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="animate-marquee-right flex gap-4 sm:gap-6 items-center">
          {[...SPONSORS_ROW_2, ...SPONSORS_ROW_2].map((sponsor, index) => (
            <div
              key={`row2-${sponsor.id}-${index}`}
              className="flex-shrink-0 w-56 sm:w-64 h-24 sm:h-28 rounded-2xl border border-[#F8BFDC] bg-white/95 backdrop-blur-sm p-3.5 flex items-center gap-3.5 shadow-sm hover:border-[#EF007E] hover:shadow-md transition-all group cursor-default"
            >
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[#FDF0F6] p-1 border border-[#F8BFDC] shadow-inner transition-transform group-hover:scale-105">
                <img
                  src="/logo-dream-home.png"
                  alt={sponsor.name}
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="h-2 w-2 rounded-full bg-[#EF007E]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EF007E]">
                    {sponsor.tier}
                  </span>
                </div>
                <span className="font-sport uppercase text-base sm:text-lg font-black text-[#121316] leading-tight truncate group-hover:text-[#EF007E] transition-colors">
                  {sponsor.name}
                </span>
                <span className="text-[10px] text-[#6B7280] font-medium tracking-wide truncate">
                  {sponsor.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Invitation Callout Card */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-3xl border border-[#AEEAF7] bg-gradient-to-r from-[#E8FAFD] via-white to-[#FDF0F6] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E8EA8] uppercase tracking-wider">
              <Handshake className="h-4 w-4 text-[#2FC7EA]" />
              <span>Oportunidad para Marcas y Empresas</span>
            </div>
            <h4 className="font-sport uppercase text-2xl font-black text-[#121316]">
              ¿QUIERES SER PATROCINADOR OFICIAL DE LA CAMINATA 5K?
            </h4>
            <p className="text-xs sm:text-sm text-[#525866]">
              Posiciona tu marca ante cientos de familias y deportistas de los Valles del Tuy junto a Inmobiliaria Dream Home.
            </p>
          </div>

          <Button
            variant="celeste"
            size="lg"
            onClick={handleContactSponsor}
            className="w-full sm:w-auto shrink-0 shadow-md"
          >
            <span>Sumar mi Marca</span>
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
