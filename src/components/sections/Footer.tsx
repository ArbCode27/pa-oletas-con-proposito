import { Heart, Phone, Mail, MapPin, Building2 } from "lucide-react"
import { RibbonDecor } from "@/components/animations/RibbonDecor"

const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
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
    <footer className="bg-[#121316] text-white pt-16 pb-12 relative overflow-hidden border-t-4 border-[#0284C7]">
      {/* Background ambient ribbon and celeste glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#E91E63]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Purpose (Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#0284C7] via-[#FF69B4] to-[#E91E63] text-white shadow-lg shadow-[#0284C7]/30">
                <Heart className="h-6 w-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#38BDF8] bg-[#0284C7]/20 px-2 py-0.5 rounded-full">
                    Host Oficial
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#FF69B4]">
                    Mes Rosa 2026
                  </span>
                </div>
                <h3 className="font-sport uppercase text-2xl font-black text-white leading-none mt-1">
                  INMOBILIARIA DREAM HOME
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Caminata 5K oficial «Camina y Renace con Dream Home 2026».
              Uniendo corazones, promoviendo la salud integral y vistiendo a los Valles del Tuy con la pañoleta de la vida y la prevención temprana del cáncer de mama.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <RibbonDecor width={32} height={40} glow={false} />
              <span className="text-xs text-[#FFC0CB] font-semibold italic">
                «Una Pañoleta con Propósito»
              </span>
            </div>
          </div>

          {/* Quick Links (Span 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sport uppercase text-lg font-black text-white tracking-wider">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/70">
              <li>
                <button
                  onClick={() => handleScrollTo("hero")}
                  className="hover:text-[#38BDF8] transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("patrocinantes")}
                  className="hover:text-[#38BDF8] transition-colors cursor-pointer text-[#38BDF8] font-bold"
                >
                  Marcas Patrocinantes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("proposito")}
                  className="hover:text-[#FF69B4] transition-colors cursor-pointer"
                >
                  Propósito del Evento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("ruta")}
                  className="hover:text-[#38BDF8] transition-colors cursor-pointer"
                >
                  Ruta 5K & Puntos Clave
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("cronograma")}
                  className="hover:text-[#FF69B4] transition-colors cursor-pointer"
                >
                  Cronograma & Horarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("registro")}
                  className="hover:text-[#FF69B4] transition-colors cursor-pointer text-[#FF69B4] font-bold"
                >
                  Formulario de Inscripción
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Location (Span 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-sport uppercase text-lg font-black text-white tracking-wider">
              Contacto & Sede Dream Home
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  Charallave, Municipio Cristóbal Rojas, Estado Miranda, Venezuela.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#38BDF8] shrink-0" />
                <span>+58 (414) 234-5678 / +58 (424) 100-2026</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#38BDF8] shrink-0" />
                <span>caminata5k@dreamhomevenezuela.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <InstagramIcon className="h-4 w-4 text-[#FF69B4] shrink-0" />
                <span>@inmobiliariadreamhome</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>
            © 2026 Inmobiliaria Dream Home Venezuela (Host Oficial). Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-white/70">
            <span>Organizado con</span>
            <Heart className="h-3.5 w-3.5 text-[#E91E63] fill-[#E91E63]" />
            <span>por la vida y la salud en los Valles del Tuy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
