import { Heart, Activity, Award, Users, CheckCircle, Sparkles, ArrowUpRight, Building2, Droplets } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SpotlightCard } from "@/components/animations/SpotlightCard"
import { RibbonDecor } from "@/components/animations/RibbonDecor"

export const PurposeSection = () => {
  return (
    <section id="proposito" className="py-20 md:py-28 bg-[#FAF7F8] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with sports condensed flair */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold flex items-center">
              <img src="/logo-dream-home.png" alt="Dream Home" className="h-4 w-4 mr-1.5 rounded-full object-contain" />
              Inmobiliaria Dream Home
            </Badge>
            <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Campaña Mes Rosa 2026
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            UNA PAÑOLETA
            <span className="block text-[#EF007E]">CON PROPÓSITO</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#525866] leading-relaxed">
            Más que una caminata deportiva, es un movimiento de esperanza, educación y apoyo mutuo.
            Durante el Mes Rosa, vestimos las calles de Charallave con la pañoleta del renacer junto a Dream Home Venezuela.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1 (Span 7): El Sentido de la Pañoleta */}
          <div className="lg:col-span-7 flex flex-col">
            <SpotlightCard className="h-full flex flex-col justify-between bg-gradient-to-br from-white to-[#FDF0F6] border-[#F8BFDC]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF0F6] px-3.5 py-1 text-xs font-bold text-[#EF007E]">
                    <Heart className="h-3.5 w-3.5 fill-[#EF007E]" />
                    <span>Símbolo de Conciencia</span>
                  </span>
                  <RibbonDecor width={42} height={50} glow={false} />
                </div>

                <h3 className="font-sport uppercase text-2xl sm:text-3xl lg:text-4xl font-black text-[#121316] leading-tight">
                  EL PODER DE LLEVAR LA PAÑOLETA ROSA
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#525866] leading-relaxed">
                  La pañoleta representa el abrazo colectivo a quienes han luchado o luchan contra el cáncer de mama.
                  Es un recordatorio visual de que el autoexamen y la mamografía preventiva salvan vidas en nuestras familias.
                </p>

                {/* Dotted callout card inside */}
                <div className="mt-6 rounded-2xl border-2 border-dashed border-[#F8BFDC] bg-white/80 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EF007E] text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#121316]">
                        Detección a tiempo: 90% de probabilidad de éxito
                      </h4>
                      <p className="text-xs text-[#525866] mt-1">
                        Promovemos hábitos de vida saludable, chequeos periódicos y la salud integral en Charallave y todo el Estado Miranda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F8BFDC] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Impacto Comunitario
                </span>
                <span className="text-xs font-extrabold text-[#EF007E] flex items-center gap-1">
                  100% Sin Fines de Lucro <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2 (Span 5): 5K Salud Integral (Secondary Celeste & Pink Soft Theme) */}
          <div className="lg:col-span-5 flex flex-col">
            <SpotlightCard className="h-full flex flex-col justify-between bg-gradient-to-br from-white via-[#E8FAFD]/60 to-[#FDF0F6]/40 text-[#121316] border-2 border-[#AEEAF7] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="celeste" className="bg-[#E8FAFD] text-[#0E8EA8] border border-[#AEEAF7] font-black">
                    Salud Integral
                  </Badge>
                  {/* Athletic badge */}
                  <div className="flex items-center gap-1 text-xs font-black text-[#0E8EA8] bg-white px-3 py-1 rounded-full border border-[#AEEAF7]">
                    <Droplets className="h-3.5 w-3.5 text-[#2FC7EA]" />
                    <span>5K OFICIAL CHARALLAVE</span>
                  </div>
                </div>

                <div className="my-3">
                  <span className="text-4xl sm:text-5xl font-sport font-black text-[#0E8EA8] block">
                    5 KILÓMETROS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#121316] mt-1">
                    Caminata por la Vida & el Renacer
                  </h3>
                </div>

                <p className="text-sm text-[#525866] leading-relaxed mt-2">
                  La actividad física moderada contribuye directamente a regular los niveles hormonales,
                  estimular el sistema inmunológico y disminuir factores de riesgo oncológico.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-[#121316]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#2FC7EA] shrink-0" />
                    <span>Apto para todas las edades, niños y familias</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#2FC7EA] shrink-0" />
                    <span>Ritmo guiado y seguro por las avenidas de Charallave</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#2FC7EA] shrink-0" />
                    <span>3 estaciones de hidratación con agua fresca y electrolitos</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#AEEAF7] flex items-center justify-between text-xs text-[#525866]">
                <span>Asfalto Urbano Plano</span>
                <span className="font-bold text-[#0E8EA8]">Dificultad: Baja / Familiar</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3 (Span 6): ¿Qué incluye tu inscripción? */}
          <div className="lg:col-span-6">
            <SpotlightCard className="h-full flex flex-col justify-between bg-white border-[#F8BFDC]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF0F6] text-[#EF007E]">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EF007E]">
                    Kit del Participante
                  </span>
                </div>

                <h3 className="font-sport uppercase text-2xl sm:text-3xl font-black text-[#121316]">
                  TODO LO QUE RECIBES CON TU REGISTRO
                </h3>

                <p className="text-xs sm:text-sm text-[#525866] mt-2 leading-relaxed">
                  Tu colaboración cubre la logística integral del evento y la entrega de tu material oficial:
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F8BFDC] p-3">
                    <span className="block text-xs font-extrabold text-[#EF007E]">
                      01. Pañoleta Rosa Oficial
                    </span>
                    <span className="text-xs text-[#525866]">
                      Edición conmemorativa Mes Rosa 2026
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#E8FAFD] border border-[#AEEAF7] p-3">
                    <span className="block text-xs font-extrabold text-[#2FC7EA]">
                      02. Número Dorsal
                    </span>
                    <span className="text-xs text-[#525866]">
                      Asignado e intransferible para el circuito
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#E8FAFD] border border-[#AEEAF7] p-3">
                    <span className="block text-xs font-extrabold text-[#2FC7EA]">
                      03. Hidratación en Ruta
                    </span>
                    <span className="text-xs text-[#525866]">
                      3 estaciones con agua y electrolitos
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F8BFDC] p-3">
                    <span className="block text-xs font-extrabold text-[#EF007E]">
                      04. Cierre & Bailoterapia
                    </span>
                    <span className="text-xs text-[#525866]">
                      Animación, instructores y rifas en meta
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F8BFDC] text-xs font-medium text-[#525866]">
                * Entrega de kits en días previos en la oficina de Dream Home Charallave.
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4 (Span 6): Host Dream Home Venezuela */}
          <div className="lg:col-span-6">
            <SpotlightCard className="h-full flex flex-col justify-between bg-gradient-to-br from-white via-[#E8FAFD]/40 to-[#FDF0F6]/40 border-[#AEEAF7]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8FAFD] text-[#2FC7EA]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E8EA8]">
                    Organizador Oficial
                  </span>
                </div>

                <h3 className="font-sport uppercase text-2xl sm:text-3xl font-black text-[#121316]">
                  INMOBILIARIA DREAM HOME VENEZUELA
                </h3>

                <p className="text-xs sm:text-sm text-[#525866] mt-2 leading-relaxed">
                  Como empresa anfitriona y líder en los Valles del Tuy, Dream Home impulsa iniciativas que trascienden el ámbito inmobiliario.
                  Creemos en construir comunidades saludables, unidas y conscientes del valor de la vida y el bienestar de cada familia.
                </p>

                <div className="mt-6 rounded-2xl bg-white p-4 border border-[#AEEAF7] shadow-sm flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border border-[#AEEAF7] p-1 shadow-md">
                    <img
                      src="/logo-dream-home.png"
                      alt="Inmobiliaria Dream Home"
                      className="h-full w-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#121316]">
                      Compromiso con Charallave y los Valles del Tuy
                    </h5>
                    <p className="text-xs text-[#525866]">
                      Creando valor social y sembrando esperanza en cada rincón de nuestra región.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#AEEAF7] flex items-center justify-between text-xs text-[#525866]">
                <span>Charallave, Estado Miranda</span>
                <span className="font-bold text-[#2FC7EA]">Dream Home 2026</span>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Running Category Pill Row with Celeste & Fucsia */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-[#AEEAF7] shadow-sm hover:border-[#2FC7EA] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8FAFD] text-[#2FC7EA] font-bold text-xs">
                01
              </span>
              <span className="font-bold text-sm text-[#121316] group-hover:text-[#2FC7EA] transition-colors">
                Caminata Saludable 5K
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2FC7EA] transition-colors" />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-[#F8BFDC] shadow-sm hover:border-[#EF007E] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF0F6] text-[#EF007E] font-bold text-xs">
                02
              </span>
              <span className="font-bold text-sm text-[#121316] group-hover:text-[#EF007E] transition-colors">
                Prevención Activa Rosa
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#EF007E] transition-colors" />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-[#AEEAF7] shadow-sm hover:border-[#2FC7EA] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8FAFD] text-[#2FC7EA] font-bold text-xs">
                03
              </span>
              <span className="font-bold text-sm text-[#121316] group-hover:text-[#2FC7EA] transition-colors">
                Bailoterapia & Meta
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2FC7EA] transition-colors" />
          </div>
        </div>
      </div>
    </section>
  )
}
