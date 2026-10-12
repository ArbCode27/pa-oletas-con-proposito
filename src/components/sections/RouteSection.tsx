import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Droplets, Music, Flag, Shield, Clock, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Checkpoint {
  id: number
  km: string
  kmValue: number
  title: string
  subtitle: string
  description: string
  landmark: string
  isHydration?: boolean
  isStart?: boolean
  isFinish?: boolean
  highlightBadge?: string
}

const CHECKPOINTS: Checkpoint[] = [
  {
    id: 1,
    km: "0,0 KM",
    kmValue: 0.0,
    title: "Punto de Salida: Forum Charallave",
    subtitle: "Vía principal La Pitahaya",
    description: "Concentración a las 6:00 AM. Calentamiento físico grupal con Dream Home, bendición de la caminata y arco de salida oficial con ambientación musical.",
    landmark: "Forum Charallave",
    isStart: true,
    highlightBadge: "Concentración 6:00 AM / Salida 7:00 AM",
  },
  {
    id: 2,
    km: "1,0 KM",
    kmValue: 1.0,
    title: "Punto 2: Redoma de Charallave",
    subtitle: "Sector Santa Rosa",
    description: "Primer kilómetro completado. Punto de hidratación inicial con entrega de agua mineral y animación con banda de animación local.",
    landmark: "Redoma Santa Rosa",
    isHydration: true,
    highlightBadge: "Estación de Hidratación 1",
  },
  {
    id: 3,
    km: "1,8 KM",
    kmValue: 1.8,
    title: "Punto 3: Daka",
    subtitle: "Av. Intercomunal / Perimetral",
    description: "Tramo amplio sobre la avenida perimetral. Excelente visibilidad y calzada despejada, resguardada por las autoridades de tránsito.",
    landmark: "Daka Charallave",
  },
  {
    id: 4,
    km: "2,6 KM",
    kmValue: 2.6,
    title: "Punto 4: Posterior Terminal & C.C. Vanessa Mall",
    subtitle: "Eje comercial céntrico",
    description: "Paso de la mitad del recorrido (Km 2.6 superado). Pancartas de motivación del Mes Rosa y música motivacional de aliento.",
    landmark: "Terminal & C.C. Vanessa Mall",
    highlightBadge: "Mitad de Carrera (Km 2.6)",
  },
  {
    id: 5,
    km: "3,2 KM",
    kmValue: 3.2,
    title: "Punto 5: Súper Río",
    subtitle: "Av. Principal",
    description: "Segunda estación de hidratación clave con puntos de esponjas frías y asistencia médica preventiva de la Cruz Roja / Paramédicos.",
    landmark: "Súper Río",
    isHydration: true,
    highlightBadge: "Estación de Hidratación 2",
  },
  {
    id: 6,
    km: "3,9 KM",
    kmValue: 3.9,
    title: "Punto 6: C.C. Tamanaco Tuy",
    subtitle: "Eje Tuyero",
    description: "Ingreso al tramo final de la caminata. Recta con ligera brisa matutina y apoyo del público de los comercios aliados.",
    landmark: "C.C. Tamanaco Tuy",
  },
  {
    id: 7,
    km: "4,4 KM",
    kmValue: 4.4,
    title: "Punto 7: Dispramar",
    subtitle: "Aproximación a Meta",
    description: "Últimos 600 metros de adrenalina. Los voluntarios preparan la llegada y guían a los participantes hacia el acceso del Campito.",
    landmark: "Dispramar",
    highlightBadge: "¡Últimos 600 metros!",
  },
  {
    id: 8,
    km: "5,0 KM",
    kmValue: 5.0,
    title: "Punto de Llegada: C.C. / Residencias El Campito",
    subtitle: "Meta, Tarima, Bailoterapia y Cierre",
    description: "¡Arco de Meta triunfal! Entrega de medallas simbólicas, frutas frescas, bebidas isotónicas, gran sesión de bailoterapia y rifas sorpresa de Dream Home.",
    landmark: "El Campito",
    isFinish: true,
    isHydration: true,
    highlightBadge: "Meta & Gran Bailoterapia",
  },
]

export const RouteSection = () => {
  const [selectedPoint, setSelectedPoint] = useState<Checkpoint>(CHECKPOINTS[0])

  const handleSelectPoint = (cp: Checkpoint) => {
    setSelectedPoint(cp)
  }

  return (
    <section id="ruta" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background soft pink and fresh celeste elements */}
      <div className="pointer-events-none absolute top-10 right-0 h-96 w-96 rounded-full bg-[#E8FAFD] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-96 w-96 rounded-full bg-[#FDF0F6] blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold flex items-center">
              <img src="/logo-dream-home.png" alt="Dream Home" className="h-4 w-4 mr-1.5 rounded-full object-contain" />
              Circuito Oficial Dream Home
            </Badge>
            <Badge variant="pink" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Charallave 5K
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            MAPA 5K
            <span className="block text-transparent bg-gradient-to-r from-[#2FC7EA] via-[#FF3B9E] to-[#EF007E] bg-clip-text">
              INTERACTIVO
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#525866] leading-relaxed">
            Conoce los 8 puntos clave de nuestra ruta por las principales arterias viales de Charallave.
            Un circuito 100% asfaltado, resguardado, con hidratación celeste y diseñado para disfrutar en familia.
          </p>
        </div>

        {/* Route Metric Stats Bar with Celeste Highlights */}
        <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#AEEAF7] bg-[#E8FAFD] p-4 text-center">
            <span className="block font-sport text-3xl sm:text-4xl font-black text-[#2FC7EA]">
              5,0 KM
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#0E8EA8]">
              Distancia Total
            </span>
          </div>

          <div className="rounded-2xl border border-[#F8BFDC] bg-[#FAF7F8] p-4 text-center">
            <span className="block font-sport text-3xl sm:text-4xl font-black text-[#121316]">
              8 PUNTOS
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#525866]">
              Control & Hitos
            </span>
          </div>

          <div className="rounded-2xl border border-[#AEEAF7] bg-[#E8FAFD] p-4 text-center">
            <span className="block font-sport text-3xl sm:text-4xl font-black text-[#2FC7EA]">
              3 PUNTOS
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#0E8EA8]">
              Hidratación
            </span>
          </div>

          <div className="rounded-2xl border border-[#F8BFDC] bg-[#FAF7F8] p-4 text-center">
            <span className="block font-sport text-3xl sm:text-4xl font-black text-[#EF007E]">
              ~55 MIN
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#525866]">
              Ritmo Caminata
            </span>
          </div>
        </div>

        {/* Interactive Map Visualizer & Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Span 7): Interactive Visual Timeline / Map Canvas */}
          <div className="lg:col-span-7 rounded-3xl border border-[#AEEAF7] bg-gradient-to-b from-[#E8FAFD]/60 via-white to-white p-6 sm:p-8 shadow-xl shadow-[#2FC7EA]/10">
            <div className="flex items-center justify-between pb-4 border-b border-[#AEEAF7]">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-[#2FC7EA]" />
                <h3 className="font-bold text-sm sm:text-base text-[#121316]">
                  Línea de Carrera: Forum ➔ El Campito
                </h3>
              </div>
              <span className="text-xs font-bold text-[#0E8EA8] bg-[#E8FAFD] px-3 py-1 rounded-full border border-[#AEEAF7]">
                Haz clic en cualquier hito
              </span>
            </div>

            {/* Visual Circuit SVG Route Tracker */}
            <div className="py-6">
              <div className="relative w-full rounded-2xl bg-[#121316] p-6 text-white overflow-hidden shadow-inner">
                {/* SVG Route Track Graphic */}
                <svg
                  viewBox="0 0 600 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow"
                >
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2FC7EA" />
                      <stop offset="50%" stopColor="#FF3B9E" />
                      <stop offset="100%" stopColor="#EF007E" />
                    </linearGradient>
                  </defs>

                  {/* Road Base Track */}
                  <path
                    d="M 30 110 Q 120 40, 210 90 T 390 60 T 570 100"
                    stroke="#1E293B"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* Road Active Gradient Track */}
                  <path
                    d="M 30 110 Q 120 40, 210 90 T 390 60 T 570 100"
                    stroke="url(#routeGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                  />

                  {/* Render 8 Checkpoint Dots along the curve */}
                  {CHECKPOINTS.map((cp, idx) => {
                    const positions = [
                      { x: 30, y: 110 },
                      { x: 95, y: 70 },
                      { x: 175, y: 75 },
                      { x: 260, y: 92 },
                      { x: 345, y: 65 },
                      { x: 420, y: 68 },
                      { x: 495, y: 84 },
                      { x: 570, y: 100 },
                    ]
                    const pos = positions[idx]
                    const isSelected = selectedPoint.id === cp.id

                    return (
                      <g
                        key={cp.id}
                        className="cursor-pointer transition-transform"
                        onClick={() => handleSelectPoint(cp)}
                      >
                        {isSelected && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="16"
                            fill="#2FC7EA"
                            opacity="0.35"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? "11" : "8"}
                          fill={isSelected ? "#2FC7EA" : "#FFFFFF"}
                          stroke={isSelected ? "#FFFFFF" : cp.isHydration ? "#2FC7EA" : "#EF007E"}
                          strokeWidth="3"
                        />
                        <text
                          x={pos.x}
                          y={pos.y - 15}
                          fill={isSelected ? "#2FC7EA" : "#94A3B8"}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {cp.km}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Road Labels */}
                <div className="mt-4 flex items-center justify-between text-xs text-white/80 font-bold px-2">
                  <div className="flex items-center gap-1.5 text-[#2FC7EA]">
                    <Flag className="h-4 w-4" />
                    <span>Salida: Forum Charallave</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#EF007E]">
                    <span>Meta: El Campito</span>
                    <Flag className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkpoint Buttons Bar */}
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CHECKPOINTS.map((cp) => {
                const isSelected = selectedPoint.id === cp.id
                return (
                  <button
                    key={cp.id}
                    onClick={() => handleSelectPoint(cp)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2FC7EA] text-[#072430] border-[#2FC7EA] shadow-md shadow-[#2FC7EA]/30 scale-[1.02] font-bold"
                        : "bg-white text-[#121316] border-[#AEEAF7]/80 hover:border-[#2FC7EA] hover:bg-[#E8FAFD]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-sport font-black text-xs uppercase tracking-wider">
                      <span>Punto {cp.id}</span>
                      <span className={isSelected ? "text-[#072430]" : cp.isHydration ? "text-[#2FC7EA]" : "text-[#EF007E]"}>
                        {cp.km}
                      </span>
                    </div>
                    <p className={`text-[11px] font-semibold truncate mt-0.5 ${isSelected ? "text-[#072430]/90" : "text-[#525866]"}`}>
                      {cp.landmark}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column (Span 5): Active Checkpoint Detailed Card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPoint.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-[#AEEAF7] bg-white p-6 sm:p-8 shadow-xl shadow-[#2FC7EA]/10"
              >
                {/* Checkpoint Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F8BFDC]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2FC7EA] text-[#072430] font-black text-xs">
                      #{selectedPoint.id}
                    </span>
                    <Badge variant="sport" className="text-xs">
                      {selectedPoint.km}
                    </Badge>
                  </div>

                  {selectedPoint.isHydration && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8FAFD] px-3 py-1 text-xs font-bold text-[#0E8EA8] border border-[#AEEAF7]">
                      <Droplets className="h-3.5 w-3.5 text-[#2FC7EA]" />
                      <span>Hidratación</span>
                    </span>
                  )}

                  {selectedPoint.isFinish && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF0F6] px-3 py-1 text-xs font-bold text-[#EF007E]">
                      <Music className="h-3.5 w-3.5" />
                      <span>Bailoterapia</span>
                    </span>
                  )}
                </div>

                {/* Point Title */}
                <div className="mt-5">
                  {selectedPoint.highlightBadge && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2FC7EA] mb-1">
                      {selectedPoint.highlightBadge}
                    </span>
                  )}
                  <h4 className="font-sport uppercase text-2xl sm:text-3xl font-black text-[#121316] leading-tight">
                    {selectedPoint.title}
                  </h4>
                  <p className="text-xs font-bold text-[#0E8EA8] mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedPoint.subtitle}</span>
                  </p>
                </div>

                {/* Point Description */}
                <p className="mt-4 text-sm text-[#525866] leading-relaxed">
                  {selectedPoint.description}
                </p>

                {/* Safety & Logistics Info */}
                <div className="mt-6 rounded-2xl bg-[#E8FAFD] border border-[#AEEAF7] p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#121316]">
                    <Shield className="h-4 w-4 text-[#2FC7EA] shrink-0" />
                    <span>Custodiado por Policía Municipal & Tránsito Terrestre</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#121316]">
                    <Clock className="h-4 w-4 text-[#2FC7EA] shrink-0" />
                    <span>Control de paso y cronometraje amigable</span>
                  </div>
                </div>

                {/* Next point navigator */}
                <div className="mt-6 pt-5 border-t border-[#F8BFDC] flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">
                    Hito {selectedPoint.id} de {CHECKPOINTS.length}
                  </span>
                  <button
                    onClick={() => {
                      const nextIndex = (selectedPoint.id % CHECKPOINTS.length)
                      setSelectedPoint(CHECKPOINTS[nextIndex])
                    }}
                    className="text-xs font-extrabold text-[#EF007E] hover:text-[#D4006E] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Siguiente Punto</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
