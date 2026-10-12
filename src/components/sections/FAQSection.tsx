import { useState } from "react"
import { ChevronDown, HelpCircle, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "¿Quién organiza y respalda la Caminata 5K «Camina y Renace»?",
    answer: "El evento es organizado y auspiciado oficialmente por Inmobiliaria Dream Home Venezuela en alianza con comercios, centros de salud y fundaciones aliadas del Municipio Cristóbal Rojas (Charallave, Estado Miranda) para celebrar la vida durante el Mes Rosa.",
  },
  {
    question: "¿Es una carrera competitiva o una caminata recreativa?",
    answer: "Es una caminata 100% recreativa y familiar. No necesitas ser atleta ni corredor profesional. El objetivo es caminar juntos por la salud, crear conciencia preventiva contra el cáncer de mama y compartir una mañana activa llena de ánimo y bailoterapia.",
  },
  {
    question: "¿Qué incluye mi inscripción y cuándo me entregan el kit?",
    answer: "Incluye la pañoleta conmemorativa oficial del Mes Rosa 2026, tu número dorsal asignado, 3 puntos de hidratación garantizada en ruta, asistencia médica y acceso total a la bailoterapia y rifas de Dream Home. Los kits se entregarán en la semana previa en la sede de Dream Home Charallave.",
  },
  {
    question: "¿Puedo asistir con mis hijos, abuelos o en familia?",
    answer: "¡Por supuesto! Es un circuito totalmente plano y seguro sobre asfalto, diseñado para que participen personas de todas las edades. Contaremos con escolta de las autoridades viales y puntos de descanso e hidratación.",
  },
  {
    question: "¿Cómo confirmo que mi inscripción fue validada tras pagar?",
    answer: "Al llenar el formulario y adjuntar tu comprobante de Pago Móvil o Transferencia, nuestro equipo administrativo verificará el ingreso bancario en un lapso de 24 a 48 horas. Recibirás en tu correo electrónico la confirmación formal junto a tu número dorsal asignado.",
  },
  {
    question: "¿Qué debo llevar el día del evento (31 de Octubre)?",
    answer: "Ropa deportiva cómoda, calzado para caminar, tu pañoleta rosa Dream Home visible, tu número dorsal fijado y mucha energía positiva. La hidratación y la música corren por nuestra cuenta.",
  },
]

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-white relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold flex items-center">
              <img src="/logo-dream-home.png" alt="Dream Home" className="h-4 w-4 mr-1.5 rounded-full object-contain" />
              Inmobiliaria Dream Home
            </Badge>
            <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Resuelve tus Dudas
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl leading-[0.95] text-[#121316] tracking-tight">
            PREGUNTAS
            <span className="block text-transparent bg-gradient-to-r from-[#2FC7EA] via-[#FF3B9E] to-[#EF007E] bg-clip-text">
              FRECUENTES
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#525866]">
            Todo lo que necesitas saber antes de calzarte los zapatos y acompañarnos este 31 de octubre en Charallave.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "border-[#2FC7EA] bg-[#E8FAFD]/60 shadow-sm"
                    : "border-[#F8BFDC] bg-white hover:border-[#AEEAF7]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? "text-[#2FC7EA]" : "text-[#9CA3AF]"}`} />
                    <span className="font-bold text-sm sm:text-base text-[#121316]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#2FC7EA] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#525866] leading-relaxed border-t border-[#AEEAF7]/50 animate-in fade-in-50 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
