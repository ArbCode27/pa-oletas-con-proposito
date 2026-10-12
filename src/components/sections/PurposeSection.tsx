import { Heart, Activity, Award, Users, CheckCircle, Sparkles, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SpotlightCard } from "@/components/animations/SpotlightCard"
import { RibbonDecor } from "@/components/animations/RibbonDecor"

export const PurposeSection = () => {
  return (
    <section id="proposito" className="py-20 md:py-28 bg-[#FAF7F8] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with sports condensed flair */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <Badge variant="blush" className="mb-3 px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
            Campaña Mes Rosa 2026
          </Badge>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            UNA PAÑOLETA
            <span className="block text-[#E91E63]">CON PROPÓSITO</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#525866] leading-relaxed">
            Más que una caminata deportiva, es un movimiento de esperanza, educación y apoyo mutuo.
            Durante el Mes Rosa, vestimos las calles de Charallave con la pañoleta del renacer.
          </p>
        </div>

        {/* Asymmetrical Bento Grid (Inspired by the running design reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1 (Span 7): El Sentido de la Pañoleta */}
          <div className="lg:col-span-7 flex flex-col">
            <SpotlightCard className="h-full flex flex-col justify-between bg-gradient-to-br from-white to-[#FFF0F4] border-[#F4D7DE]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF2F4] px-3.5 py-1 text-xs font-bold text-[#E91E63]">
                    <Heart className="h-3.5 w-3.5 fill-[#E91E63]" />
                    <span>Símbolo de Conciencia</span>
                  </span>
                  <RibbonDecor width={36} height={46} glow={false} />
                </div>

                <h3 className="font-sport uppercase text-2xl sm:text-3xl lg:text-4xl font-black text-[#121316] leading-tight">
                  EL PODER DE LLEVAR LA PAÑOLETA ROSA
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#525866] leading-relaxed">
                  La pañoleta representa el abrazo colectivo a quienes han luchado o luchan contra el cáncer de mama.
                  Es un recordatorio visual de que el autoexamen y la mamografía preventiva salvan vidas en nuestras familias.
                </p>

                {/* Dotted callout card inside (Image 1 reference) */}
                <div className="mt-6 rounded-2xl border-2 border-dashed border-[#F4D7DE] bg-white/80 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E91E63] text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#121316]">
                        Detección a tiempo: 90% de probabilidad de éxito
                      </h4>
                      <p className="text-xs text-[#525866] mt-1">
                        Promovemos hábitos de vida saludable, chequeos periódicos y la salud integral femenina y masculina en Charallave y todo el Estado Miranda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F4D7DE] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Impacto Comunitario
                </span>
                <span className="text-xs font-extrabold text-[#E91E63] flex items-center gap-1">
                  100% Sin Fines de Lucro <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2 (Span 5): 5K Salud Integral & Laurel Wreath Badge */}
          <div className="lg:col-span-5 flex flex-col">
            <SpotlightCard className="h-full flex flex-col justify-between bg-gradient-to-br from-[#121316] to-[#251322] text-white border-transparent">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="sport" className="bg-[#FF69B4] text-[#121316]">
                    Salud Integral
                  </Badge>
                  {/* Athletic laurel badge inspired by Image 1 */}
                  <div className="flex items-center gap-1 text-xs font-black text-[#FF69B4] bg-white/10 px-3 py-1 rounded-full">
                    <span>★ 5K OFICIAL</span>
                  </div>
                </div>

                <div className="my-3">
                  <span className="text-4xl sm:text-5xl font-sport font-black text-[#FF69B4] block">
                    5 KILÓMETROS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    Caminata por la Vida
                  </h3>
                </div>

                <p className="text-sm text-white/80 leading-relaxed mt-2">
                  La actividad física moderada contribuye directamente a regular los niveles hormonales,
                  estimular el sistema inmunológico y disminuir factores de riesgo oncológico.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#FF69B4] shrink-0" />
                    <span>Apto para todas las edades y condición física</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#FF69B4] shrink-0" />
                    <span>Ritmo guiado y seguro por las avenidas de Charallave</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#FF69B4] shrink-0" />
                    <span>Puntos de asistencia médica y ambulancia</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>Asfalto Urbano Plano</span>
                <span className="font-bold text-[#FF69B4]">Dificultad: Baja / Familiar</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3 (Span 6): ¿Qué incluye tu inscripción? */}
          <div className="lg:col-span-6">
            <SpotlightCard className="h-full flex flex-col justify-between bg-white border-[#F4D7DE]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF2F4] text-[#E91E63]">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E91E63]">
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
                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F4D7DE] p-3">
                    <span className="block text-xs font-extrabold text-[#E91E63]">
                      01. Pañoleta Oficial
                    </span>
                    <span className="text-xs text-[#525866]">
                      Edición conmemorativa Mes Rosa 2026
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F4D7DE] p-3">
                    <span className="block text-xs font-extrabold text-[#E91E63]">
                      02. Número Dorsal
                    </span>
                    <span className="text-xs text-[#525866]">
                      Asignado e intransferible para el circuito
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F4D7DE] p-3">
                    <span className="block text-xs font-extrabold text-[#E91E63]">
                      03. Hidratación en Ruta
                    </span>
                    <span className="text-xs text-[#525866]">
                      3 estaciones con agua y electrolitos
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F4D7DE] p-3">
                    <span className="block text-xs font-extrabold text-[#E91E63]">
                      04. Cierre & Bailoterapia
                    </span>
                    <span className="text-xs text-[#525866]">
                      Animación, instructores y rifas en meta
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F4D7DE] text-xs font-medium text-[#525866]">
                * Entrega de kits en días previos en la oficina de Dream Home Charallave.
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4 (Span 6): Compromiso Dream Home */}
          <div className="lg:col-span-6">
            <SpotlightCard className="h-full flex flex-col justify-between bg-gradient-to-br from-white to-[#F8E1E1]/40 border-[#F4D7DE]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8E1E1] text-[#D5006D]">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D5006D]">
                    Organizador Oficial
                  </span>
                </div>

                <h3 className="font-sport uppercase text-2xl sm:text-3xl font-black text-[#121316]">
                  INMOBILIARIA DREAM HOME VENEZUELA
                </h3>

                <p className="text-xs sm:text-sm text-[#525866] mt-2 leading-relaxed">
                  Como empresa líder en los Valles del Tuy, Dream Home impulsa iniciativas que trascienden el ámbito inmobiliario.
                  Creemos en construir comunidades saludables, unidas y conscientes del valor de la vida y el bienestar de cada familia.
                </p>

                <div className="mt-6 rounded-2xl bg-white p-4 border border-[#F4D7DE] shadow-sm flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF69B4] text-white font-black text-sm">
                    DH
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

              <div className="mt-6 pt-4 border-t border-[#F4D7DE] flex items-center justify-between text-xs text-[#525866]">
                <span>Charallave, Estado Miranda</span>
                <span className="font-bold text-[#E91E63]">Edición Anual 2026</span>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Running Category Pill Row (Matching Image 1 reference style) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-[#F4D7DE] shadow-sm hover:border-[#E91E63] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF2F4] text-[#E91E63] font-bold text-xs">
                01
              </span>
              <span className="font-bold text-sm text-[#121316] group-hover:text-[#E91E63] transition-colors">
                Caminata Saludable
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#E91E63] transition-colors" />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-[#F4D7DE] shadow-sm hover:border-[#E91E63] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF2F4] text-[#E91E63] font-bold text-xs">
                02
              </span>
              <span className="font-bold text-sm text-[#121316] group-hover:text-[#E91E63] transition-colors">
                Prevención Activa
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#E91E63] transition-colors" />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-[#F4D7DE] shadow-sm hover:border-[#E91E63] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF2F4] text-[#E91E63] font-bold text-xs">
                03
              </span>
              <span className="font-bold text-sm text-[#121316] group-hover:text-[#E91E63] transition-colors">
                Bailoterapia & Meta
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#E91E63] transition-colors" />
          </div>
        </div>
      </div>
    </section>
  )
}
