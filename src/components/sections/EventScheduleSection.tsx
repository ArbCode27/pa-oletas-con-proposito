import { Clock, CheckCircle2, Flame, Trophy, Sparkles, MapPin, Building2, Droplets } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SCHEDULE_ITEMS = [
  {
    time: "06:00 AM",
    title: "Concentración & Entrega de Dorsales",
    location: "Forum Charallave (Vía La Pitahaya)",
    description: "Recepción de caminantes, validación de inscripciones de última hora e hidratación inicial.",
    icon: Clock,
    isCeleste: true,
  },
  {
    time: "06:30 AM",
    title: "Calentamiento & Palabras de Apertura",
    location: "Tarima de Salida",
    description: "Activación muscular con preparadores físicos y bienvenida del equipo de Inmobiliaria Dream Home.",
    icon: Flame,
    isCeleste: false,
  },
  {
    time: "07:00 AM",
    title: "¡Salida Oficial 5K!",
    location: "Arco de Salida Forum",
    description: "Comienzo del recorrido de 5 kilómetros por la ruta de Charallave con acompañamiento de seguridad.",
    icon: Sparkles,
    isCeleste: true,
  },
  {
    time: "08:30 AM",
    title: "Llegada a Meta & Punto de Frutas",
    location: "C.C. / Res. El Campito",
    description: "Recepción con aplausos, entrega de medallas simbólicas, hidratación y frutas para recargar energía.",
    icon: Trophy,
    isCeleste: false,
  },
  {
    time: "08:45 AM",
    title: "Gran Bailoterapia Rosa",
    location: "Tarima Principal El Campito",
    description: "Sesión especial de baile y fitness con los mejores instructores de los Valles del Tuy.",
    icon: Flame,
    isCeleste: false,
  },
  {
    time: "09:45 AM",
    title: "Rifas de Patrocinadores & Cierre",
    location: "Tarima Principal",
    description: "Sorteos de las marcas patrocinantes, agradecimiento a los participantes y foto oficial Dream Home.",
    icon: CheckCircle2,
    isCeleste: true,
  },
]

export const EventScheduleSection = () => {
  return (
    <section id="cronograma" className="py-20 md:py-28 bg-[#FAF7F8] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold">
              <Building2 className="h-3.5 w-3.5 mr-1 text-[#0284C7]" />
              Host: Dream Home
            </Badge>
            <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Sábado 31 de Octubre de 2026
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            CRONOGRAMA
            <span className="block text-transparent bg-gradient-to-r from-[#0284C7] via-[#FF69B4] to-[#E91E63] bg-clip-text">
              DE LA MAÑANA
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#525866] leading-relaxed">
            Una jornada deportiva y festiva planificada al detalle por Inmobiliaria Dream Home para que vivas una experiencia memorable.
          </p>
        </div>

        {/* Schedule Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {SCHEDULE_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className={`relative rounded-3xl border bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${
                  item.isCeleste
                    ? "border-[#BAE6FD] hover:border-[#0284C7]"
                    : "border-[#F4D7DE] hover:border-[#E91E63]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-sport text-2xl font-black transition-colors ${
                      item.isCeleste
                        ? "text-[#0284C7] group-hover:text-[#0369A1]"
                        : "text-[#E91E63] group-hover:text-[#D5006D]"
                    }`}
                  >
                    {item.time}
                  </span>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      item.isCeleste
                        ? "bg-[#E0F2FE] text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white"
                        : "bg-[#FDF2F4] text-[#E91E63] group-hover:bg-[#E91E63] group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-sport uppercase text-xl font-black text-[#121316] leading-snug">
                  {item.title}
                </h3>

                <p
                  className={`text-xs font-bold mt-1 flex items-center gap-1.5 ${
                    item.isCeleste ? "text-[#0369A1]" : "text-[#D5006D]"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.location}</span>
                </p>

                <p className="text-xs text-[#525866] mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
