import { Sparkles, Building2, Handshake, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SponsorItem {
  id: number
  name: string
  logo: string
}

const SPONSORS: SponsorItem[] = [
  { id: 1, name: "Dream Home Cúa - Urdaneta", logo: "/sponsors/dream-home-cua.png" },
  { id: 2, name: "Cuchitur@s", logo: "/sponsors/cuchituras.jpg" },
  { id: 3, name: "slash", logo: "/sponsors/slash.png" },
  { id: 4, name: "Pacheco, Marcano & Asociados", logo: "/sponsors/pacheco-marcano.jpg" },
  { id: 5, name: "Hospital Clinic Venezuela", logo: "/sponsors/hospital-clinic.png" },
  { id: 6, name: "Norte", logo: "/sponsors/norte.png" },
  { id: 7, name: "FTB Creativo", logo: "/sponsors/ftb-creativo.jpg" },
  {
    id: 8,
    name: "Tecnológico Antonio José de Sucre — Ampliación Charallave",
    logo: "/sponsors/uts-charallave.jpg",
  },
  { id: 9, name: "Canaima Discoteca", logo: "/sponsors/canaima-discoteca.jpg" },
  { id: 10, name: "CIAR Group", logo: "/sponsors/ciar-group.png" },
  { id: 11, name: "MediCare+", logo: "/sponsors/medicare.png" },
  { id: 12, name: "JBY 2616", logo: "/sponsors/1_20261027_231242_0000.png" },
  { id: 13, name: "Galope", logo: "/sponsors/2_20261027_231242_0001.png" },
  { id: 14, name: "Valle Agro Ranch", logo: "/sponsors/3_20261027_231243_0002.png" },
  { id: 15, name: "Alineal", logo: "/sponsors/4_20261027_231243_0003.png" },
  { id: 16, name: "Neumocard 33", logo: "/sponsors/5_20261027_231243_0004.png" },
  {
    id: 17,
    name: "Dream Home Santa Teresa",
    logo: "/sponsors/6_20261027_231243_0005.png",
  },
  { id: 18, name: "Dream Home Maracay", logo: "/sponsors/7_20261027_231243_0006.png" },
  { id: 19, name: "Dream Home VIP", logo: "/sponsors/8_20261027_231243_0007.png" },
  { id: 20, name: "Dream Home Caracas", logo: "/sponsors/9_20261027_231243_0008.png" },
  {
    id: 21,
    name: "Yelitza Matamoros Rehabilitación Integral",
    logo: "/sponsors/10_20261027_231848_0000.png",
  },
  { id: 22, name: "Grupo Catedral", logo: "/sponsors/11_20261027_231848_0001.png" },
  {
    id: 23,
    name: "Forum SuperMayorista",
    logo: "/sponsors/12_20261027_231848_0002.png",
  },
  {
    id: 24,
    name: "Rigney Pérez Bañadores",
    logo: "/sponsors/13_20261027_231848_0003.png",
  },
]

/** 3 copias idénticas → el CSS desplaza exactamente 1/3 sin salto ni hueco */
const MARQUEE_COPIES = [0, 1, 2] as const

const SponsorLogoCard = ({ sponsor }: { sponsor: SponsorItem }) => (
  <div className="flex-shrink-0 w-44 sm:w-52 h-28 sm:h-32 rounded-2xl border border-[#AEEAF7] bg-white/95 backdrop-blur-sm p-4 flex items-center justify-center shadow-sm hover:border-[#2FC7EA] hover:shadow-md transition-all group cursor-default">
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2 transition-transform group-hover:scale-[1.02]">
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        draggable={false}
      />
    </div>
  </div>
)

export const SponsorsSection = () => {
  const handleContactSponsor = () => {
    const message = encodeURIComponent(
      "Hola, deseo información para patrocinar la Caminata 5K 'Camina y Renace con Dream Home 2026' con mi marca o empresa."
    )
    window.open(`https://wa.me/584241128778?text=${message}`, "_blank")
  }

  return (
    <section
      id="patrocinantes"
      className="py-16 md:py-24 bg-white relative overflow-hidden border-y border-[#F8BFDC]/60"
    >
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 h-72 w-72 rounded-full bg-[#E8FAFD] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 h-72 w-72 rounded-full bg-[#FDF0F6] blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge
            variant="celeste"
            className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold"
          >
            <Building2 className="h-3.5 w-3.5 mr-1 text-[#2FC7EA]" />
            Alianzas Comerciales
          </Badge>
          <Badge
            variant="blush"
            className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-[#EF007E]" />
            Sponsors Oficiales
          </Badge>
        </div>

        <h2 className="font-sport uppercase text-4xl sm:text-5xl md:text-6xl font-black text-[#121316] tracking-tight leading-tight">
          MARCAS QUE RENACEN
          <span className="block text-transparent bg-gradient-to-r from-[#2FC7EA] via-[#18A9CC] to-[#EF007E] bg-clip-text">
            CON DREAM HOME
          </span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#525866] max-w-2xl mx-auto leading-relaxed">
          Agradecemos a las empresas, marcas aliadas y comercios de los Valles del Tuy que se
          suman como patrocinantes oficiales de la salud integral y la prevención.
        </p>
      </div>

      {/* Un solo carrusel infinito */}
      <div className="relative w-full overflow-hidden py-3">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="animate-marquee-left">
          {MARQUEE_COPIES.map((copy) => (
            <div
              key={`copy-${copy}`}
              className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6"
              aria-hidden={copy > 0 ? true : undefined}
            >
              {SPONSORS.map((sponsor) => (
                <SponsorLogoCard key={`${copy}-${sponsor.id}`} sponsor={sponsor} />
              ))}
            </div>
          ))}
        </div>
      </div>

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
              Posiciona tu marca ante cientos de familias y deportistas de los Valles del Tuy junto
              a Inmobiliaria Dream Home.
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
