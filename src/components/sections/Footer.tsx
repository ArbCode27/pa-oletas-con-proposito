import { Heart, MapPin, Phone, UserCheck } from "lucide-react"
import { RibbonDecor } from "@/components/animations/RibbonDecor"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export const Footer = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gradient-to-b from-[#FAF7F8] via-white to-[#FDF0F6] text-[#121316] pt-16 pb-12 relative overflow-hidden border-t-2 border-[#F8BFDC]">
      {/* Background ambient ribbon and celeste glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#2FC7EA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#EF007E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F4D7DE]">
          {/* Brand & Purpose (Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-0.5 border border-[#AEEAF7] shadow-md shadow-[#2FC7EA]/20">
                <img
                  src="/logo-dream-home.png"
                  alt="Inmobiliaria Dream Home"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#0E8EA8] bg-[#E8FAFD] px-2 py-0.5 rounded-full border border-[#AEEAF7]">
                    Caminata 5K
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#EF007E]">
                    Mes Rosa 2026
                  </span>
                </div>
                <h3 className="font-sport uppercase text-2xl font-black text-[#121316] leading-none mt-1">
                  INMOBILIARIA DREAM HOME
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
              Caminata 5K oficial «Camina y Renace con Dream Home 2026».
              Uniendo corazones, promoviendo la salud integral y vistiendo a los Valles del Tuy con la pañoleta de la vida y la prevención temprana del cáncer de mama.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <RibbonDecor width={36} height={43} glow={false} />
              <span className="text-xs text-[#EF007E] font-semibold italic">
                «Una Pañoleta con Propósito»
              </span>
            </div>
          </div>

          {/* Quick Links (Span 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sport uppercase text-lg font-black text-[#121316] tracking-wider">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#525866]">
              <li>
                <button
                  onClick={() => handleScrollTo("hero")}
                  className="hover:text-[#EF007E] transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("patrocinantes")}
                  className="hover:text-[#0E8EA8] transition-colors cursor-pointer text-[#0E8EA8] font-bold"
                >
                  Marcas Patrocinantes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("proposito")}
                  className="hover:text-[#EF007E] transition-colors cursor-pointer"
                >
                  Propósito del Evento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("ruta")}
                  className="hover:text-[#0E8EA8] transition-colors cursor-pointer"
                >
                  Ruta 5K & Puntos Clave
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("cronograma")}
                  className="hover:text-[#EF007E] transition-colors cursor-pointer"
                >
                  Cronograma & Horarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("registro")}
                  className="hover:text-[#EF007E] transition-colors cursor-pointer text-[#EF007E] font-bold"
                >
                  Formulario de Inscripción
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Location (Span 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-sport uppercase text-lg font-black text-[#121316] tracking-wider">
              Contacto & Sede Dream Home
            </h4>
            <div className="space-y-3 text-xs text-[#525866]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#2FC7EA] shrink-0 mt-0.5" />
                <span>
                  Charallave, Municipio Cristóbal Rojas, Estado Miranda, Venezuela.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <UserCheck className="h-4 w-4 text-[#2FC7EA] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="block text-[#121316] font-bold">
                    Master Bróker: Leiris Perdigón
                  </span>
                  <a
                    href="https://instagram.com/leiris.perdigon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0E8EA8] hover:underline font-semibold"
                  >
                    @leiris.perdigon
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#2FC7EA] shrink-0 mt-0.5" />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-[#525866]">Teléfonos:</span>
                  <a
                    href="tel:04241128778"
                    className="hover:text-[#EF007E] transition-colors font-bold text-[#121316]"
                  >
                    0424-112.87.78
                  </a>
                  <span>/</span>
                  <a
                    href="tel:02392484093"
                    className="hover:text-[#EF007E] transition-colors font-bold text-[#121316]"
                  >
                    0239-248.40.93
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <InstagramIcon className="h-4 w-4 text-[#EF007E] shrink-0" />
                <a
                  href="https://instagram.com/inmobiliariadreamhomevenezuela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EF007E] transition-colors font-bold text-[#121316]"
                >
                  @inmobiliariadreamhomevenezuela
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <p>
            © 2026 Inmobiliaria Dream Home Venezuela. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-[#525866]">
            <span>Organizado con</span>
            <Heart className="h-3.5 w-3.5 text-[#EF007E] fill-[#EF007E]" />
            <span>por la vida y la salud en los Valles del Tuy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
