import { Clock, CheckCircle2, Flame, Trophy, Sparkles, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SCHEDULE_ITEMS = [
  {
    time: "06:00 AM",
    title: "Concentración & Entrega de Dorsales",
    location: "Forum Charallave (Vía La Pitahaya)",
    description: "Recepción de caminantes, validación de inscripciones de última hora e hidratación inicial.",
    icon: Clock,
  },
  {
    time: "06:30 AM",
    title: "Calentamiento & Palabras de Apertura",
    location: "Tarima de Salida",
    description: "Activación muscular con preparadores físicos y bienvenida del equipo de Inmobiliaria Dream Home.",
    icon: Flame,
  },
  {
    time: "07:00 AM",
    title: "¡Salida Oficial 5K!",
    location: "Arco de Salida Forum",
    description: "Comienzo del recorrido de 5 kilómetros por la ruta de Charallave con acompañamiento de seguridad.",
    icon: Sparkles,
  },
  {
    time: "08:30 AM",
    title: "Llegada a Meta & Punto de Frutas",
    location: "C.C. / Res. El Campito",
    description: "Recepción con aplausos, entrega de medallas simbólicas, hidratación y frutas para recargar energía.",
    icon: Trophy,
  },
  {
    time: "08:45 AM",
    title: "Gran Bailoterapia Rosa",
    location: "Tarima Principal El Campito",
    description: "Sesión especial de baile y fitness con los mejores instructores de los Valles del Tuy.",
    icon: Flame,
  },
  {
    time: "09:45 AM",
    title: "Rifas de Patrocinadores & Cierre",
    location: "Tarima Principal",
    description: "Sorteos exclusivos para caminantes inscritos y foto oficial de la familia Dream Home Venezuela.",
    icon: CheckCircle2,
  },
]

export const EventScheduleSection = () => {
  return (
    <section id="cronograma" className="py-20 md:py-28 bg-[#FAF7F8] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="blush" className="mb-3 px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
            Sábado 31 de Octubre de 2026
          </Badge>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            CRONOGRAMA
            <span className="block text-[#E91E63]">DE LA MAÑANA</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#525866] leading-relaxed">
            Una jornada deportiva y festiva planificada al detalle para que vivas una experiencia memorable.
          </p>
        </div>

        {/* Schedule Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {SCHEDULE_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="relative rounded-3xl border border-[#F4D7DE] bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sport text-2xl font-black text-[#E91E63] group-hover:text-[#D5006D] transition-colors">
                    {item.time}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF2F4] text-[#E91E63] group-hover:bg-[#E91E63] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-sport uppercase text-xl font-black text-[#121316] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs font-bold text-[#D5006D] mt-1 flex items-center gap-1.5">
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
