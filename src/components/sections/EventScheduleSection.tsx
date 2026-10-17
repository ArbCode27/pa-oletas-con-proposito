import { Clock, MapPin, Trophy, Music, Award, CheckCircle2, HeartHandshake, Sparkles, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ScheduleItem {
  time: string
  title: string
  location: string
  description: string
  icon: typeof Clock
  isCeleste?: boolean
}

const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: "07:00 AM",
    title: "Inicio en el Fórum & Bailoterapia",
    location: "Estacionamiento Fórum Charallave",
    description: "Concentración de participantes, ambientación musical y gran sesión de bailoterapia matutina para calentar motores con alegría y energía rosa.",
    icon: Music,
    isCeleste: false,
  },
  {
    time: "08:00 AM",
    title: "Salida Oficial Caminata 5K",
    location: "Arco de Salida Fórum Charallave",
    description: "Conteo regresivo oficial de Dream Home, bendición comunitaria del Mes Rosa y arranque de la caminata con resguardo vial y puntos de hidratación en ruta.",
    icon: Clock,
    isCeleste: true,
  },
  {
    time: "10:00 AM - 11:00 AM",
    title: "Llegada, Marcas, Salud y Premiación",
    location: "Meta: C.C. & Residencias El Campito",
    description: "Llegada triunfal de caminantes, hidratación fría, feria de activación de marcas patrocinantes, jornadas de salud y despistaje preventivo, y acto de premiación.",
    icon: Award,
    isCeleste: false,
  },
  {
    time: "11:00 AM - 12:00 M",
    title: "Bailoterapia de Cierre",
    location: "Tarima Principal El Campito",
    description: "Explosiva hora de bailoterapia, coreografías, sorpresas y celebración rosa de la vida junto a instructores certificados de los Valles del Tuy.",
    icon: Sparkles,
    isCeleste: true,
  },
  {
    time: "12:00 M",
    title: "Clausura y Cierre del Evento",
    location: "Tarima Principal El Campito",
    description: "Palabras de agradecimiento por parte de Inmobiliaria Dream Home y conclusión puntual de las actividades según los permisos autorizados.",
    icon: CheckCircle2,
    isCeleste: false,
  },
]

export const EventScheduleSection = () => {
  return (
    <section id="cronograma" className="py-20 md:py-28 bg-[#FAF7F8] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold flex items-center">
              <img src="/logo-dream-home.png" alt="Dream Home" className="h-4 w-4 mr-1.5 rounded-full object-contain" />
              Inmobiliaria Dream Home
            </Badge>
            <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Sábado 31 de Octubre de 2026
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            CRONOGRAMA
            <span className="block text-transparent bg-gradient-to-r from-[#2FC7EA] via-[#FF3B9E] to-[#EF007E] bg-clip-text">
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
                    ? "border-[#AEEAF7] hover:border-[#2FC7EA]"
                    : "border-[#F8BFDC] hover:border-[#EF007E]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-sport text-2xl font-black transition-colors ${
                      item.isCeleste
                        ? "text-[#2FC7EA] group-hover:text-[#0E8EA8]"
                        : "text-[#EF007E] group-hover:text-[#D4006E]"
                    }`}
                  >
                    {item.time}
                  </span>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      item.isCeleste
                        ? "bg-[#E8FAFD] text-[#2FC7EA] group-hover:bg-[#2FC7EA] group-hover:text-white"
                        : "bg-[#FDF0F6] text-[#EF007E] group-hover:bg-[#EF007E] group-hover:text-white"
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
                    item.isCeleste ? "text-[#0E8EA8]" : "text-[#EF007E]"
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

        {/* Nota informativa de cumplimiento de horario */}
        <div className="mt-10 max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-[#FDF0F6] via-white to-[#E8FAFD] border border-[#F8BFDC] p-4 text-center shadow-sm">
          <p className="text-xs sm:text-sm text-[#121316] font-medium leading-relaxed">
            <strong className="text-[#EF007E] font-bold">Importante:</strong> La jornada deportiva y festiva inicia puntualmente a las{" "}
            <span className="font-bold text-[#0E8EA8]">7:00 AM</span> con la bailoterapia en el Fórum Charallave y culmina a las{" "}
            <span className="font-bold text-[#EF007E]">12:00 M</span> en estricto apego a los permisos otorgados por las autoridades municipales.
          </p>
        </div>
      </div>
    </section>
  )
}
