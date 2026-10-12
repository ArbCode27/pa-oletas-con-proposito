import { Sparkles, Building2, Handshake, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SponsorPlaceholder {
  id: number
  tier: "ORO" | "PLATA" | "DIAMANTE" | "HIDRATACIÓN" | "ALIADO"
  label: string
}

const SPONSORS_ROW_1: SponsorPlaceholder[] = [
  { id: 1, tier: "DIAMANTE", label: "LOGO 01" },
  { id: 2, tier: "ORO", label: "LOGO 02" },
  { id: 3, tier: "HIDRATACIÓN", label: "LOGO 03" },
  { id: 4, tier: "PLATA", label: "LOGO 04" },
  { id: 5, tier: "ALIADO", label: "LOGO 05" },
  { id: 6, tier: "ORO", label: "LOGO 06" },
  { id: 7, tier: "DIAMANTE", label: "LOGO 07" },
  { id: 8, tier: "ALIADO", label: "LOGO 08" },
]

const SPONSORS_ROW_2: SponsorPlaceholder[] = [
  { id: 9, tier: "ORO", label: "LOGO 09" },
  { id: 10, tier: "ALIADO", label: "LOGO 10" },
  { id: 11, tier: "DIAMANTE", label: "LOGO 11" },
  { id: 12, tier: "HIDRATACIÓN", label: "LOGO 12" },
  { id: 13, tier: "PLATA", label: "LOGO 13" },
  { id: 14, tier: "ORO", label: "LOGO 14" },
  { id: 15, tier: "ALIADO", label: "LOGO 15" },
  { id: 16, tier: "PLATA", label: "LOGO 16" },
]

export const SponsorsSection = () => {
  const handleContactSponsor = () => {
    const message = encodeURIComponent(
      "Hola, deseo información para patrocinar la Caminata 5K 'Camina y Renace con Dream Home 2026' con mi marca o empresa."
    )
    window.open(`https://wa.me/584142345678?text=${message}`, "_blank")
  }

  return (
    <section id="patrocinantes" className="py-16 md:py-24 bg-white relative overflow-hidden border-y border-[#F4D7DE]">
      {/* Background soft celeste and pink glows */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 h-72 w-72 rounded-full bg-[#E0F2FE] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 h-72 w-72 rounded-full bg-[#FDF2F4] blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        {/* Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold">
            <Building2 className="h-3.5 w-3.5 mr-1 text-[#0284C7]" />
            Alianzas Comerciales
          </Badge>
          <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-[#E91E63]" />
            Sponsors Oficiales
          </Badge>
        </div>

        {/* Section Heading with athletic condensed font */}
        <h2 className="font-sport uppercase text-4xl sm:text-5xl md:text-6xl font-black text-[#121316] tracking-tight leading-tight">
          MARCAS QUE RENACEN
          <span className="block text-transparent bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#E91E63] bg-clip-text">
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
              className="flex-shrink-0 w-48 sm:w-56 h-24 sm:h-28 rounded-2xl border-2 border-dashed border-[#BAE6FD] bg-[#F0F9FF]/80 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#0284C7] hover:bg-white hover:shadow-md transition-all group cursor-default"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#38BDF8] group-hover:bg-[#0284C7] transition-colors" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0369A1]">
                  {sponsor.tier}
                </span>
              </div>
              <span className="font-sport uppercase text-2xl sm:text-3xl font-black text-[#121316] tracking-wider group-hover:text-[#0284C7] transition-colors">
                {sponsor.label}
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium tracking-wide">
                Patrocinador Oficial
              </span>
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
              className="flex-shrink-0 w-48 sm:w-56 h-24 sm:h-28 rounded-2xl border-2 border-dashed border-[#F4D7DE] bg-[#FDF2F4]/80 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#E91E63] hover:bg-white hover:shadow-md transition-all group cursor-default"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FF69B4] group-hover:bg-[#E91E63] transition-colors" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D5006D]">
                  {sponsor.tier}
                </span>
              </div>
              <span className="font-sport uppercase text-2xl sm:text-3xl font-black text-[#121316] tracking-wider group-hover:text-[#E91E63] transition-colors">
                {sponsor.label}
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium tracking-wide">
                Marca Aliada 2026
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Invitation Callout Card */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-3xl border border-[#BAE6FD] bg-gradient-to-r from-[#F0F9FF] via-white to-[#FDF2F4] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369A1] uppercase tracking-wider">
              <Handshake className="h-4 w-4 text-[#0284C7]" />
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
