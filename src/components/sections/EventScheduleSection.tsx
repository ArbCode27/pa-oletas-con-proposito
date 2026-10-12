import { Clock, MapPin, Coffee, Trophy, Music, Award, CheckCircle2, Building2 } from "lucide-react"
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
    time: "06:00 AM",
    title: "Concentración & Entrega de Últimos Kits",
    location: "Estacionamiento Forum Charallave",
    description: "Llegada de participantes, verificación de números dorsales, colocación de pañoletas rosas y música para energizar la mañana.",
    icon: Coffee,
    isCeleste: true,
  },
  {
    time: "06:30 AM",
    title: "Calentamiento Funcional & Estiramiento",
    location: "Tarima Principal Forum",
    description: "Sesión guiada por instructores certificados de fitness de los Valles del Tuy para preparar articulaciones y músculos.",
    icon: Trophy,
    isCeleste: false,
  },
  {
    time: "07:00 AM",
    title: "Arco de Salida Oficial 5K",
    location: "Vía La Pitahaya (Frente a Forum)",
    description: "Conteo regresivo oficial de Dream Home, bendición comunitaria y arranque de la caminata con resguardo policial.",
    icon: Clock,
    isCeleste: true,
  },
  {
    time: "07:45 AM",
    title: "Llegada Progresiva a Meta",
    location: "C.C. & Residencias El Campito",
    description: "Recepción de caminantes con música, hidratación especial fría, entrega de reconocimientos y zona de fotografías conmemorativas.",
    icon: Award,
    isCeleste: false,
  },
  {
    time: "08:15 AM",
    title: "Gran Bailoterapia Rosa & Animación",
    location: "Tarima de Celebración El Campito",
    description: "Hora completa de baile, fitness grupal, alegría y energía rosa para celebrar la salud, la vida y el renacer.",
    icon: Music,
    isCeleste: false,
  },
  {
    time: "09:30 AM",
    title: "Sorteos de Dream Home & Clausura",
    location: "Tarima de Celebración El Campito",
    description: "Rifas de premios especiales cortesía de Inmobiliaria Dream Home y patrocinantes, palabras de agradecimiento y cierre oficial.",
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
      </div>
    </section>
  )
}
