import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "¿Quiénes pueden participar en la Caminata 5K?",
    answer: "¡Todos! Es un evento 100% familiar, inclusivo y recreativo. Pueden participar niños, jóvenes, adultos mayores y personas en cochecitos o con mascotas debidamente aseguradas.",
  },
  {
    question: "¿Qué incluye el Kit del Caminante?",
    answer: "Incluye la pañoleta oficial conmemorativa de la campaña 'Una Pañoleta con Propósito', el número dorsal de corredor, acceso a los 3 puntos de hidratación durante los 5K, hidratación y frutas en la llegada, y boleto para las rifas al cierre del evento.",
  },
  {
    question: "¿Dónde y cuándo se retira el kit con la pañoleta y dorsal?",
    answer: "Los kits podrán ser retirados en las oficinas de Inmobiliaria Dream Home Charallave durante la semana previa al evento (te notificaremos horarios exactos a tu correo) y también en el módulo de recepción de Forum Charallave el día de la caminata desde las 6:00 AM.",
  },
  {
    question: "¿Cómo confirmo que mi pago fue verificado?",
    answer: "Al enviar el formulario con tu capture, el sistema registrará tu solicitud. Nuestro equipo administrativo validará la transacción en un lapso de 24 a 48 horas y recibirás un correo electrónico de confirmación con tu número oficial de participante.",
  },
  {
    question: "¿Hay estacionamiento disponible?",
    answer: "Sí, Forum Charallave contará con área de estacionamiento vigilado por cuerpos de seguridad para los vehículos de los participantes durante la jornada matutina.",
  },
  {
    question: "¿Qué vestimenta y calzado se recomienda llevar?",
    answer: "Recomendamos ropa deportiva cómoda, preferiblemente de color blanco o rosado para acompañar la marea rosa, calzado deportivo para caminar sobre asfalto, protector solar, gorra y tu termo de agua personal si deseas complementar la hidratación.",
  },
]

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="preguntas" className="py-20 md:py-28 bg-white relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="blush" className="mb-3 px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
            Resuelve tus Dudas
          </Badge>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl leading-[0.95] text-[#121316] tracking-tight">
            PREGUNTAS
            <span className="block text-[#E91E63]">FRECUENTES</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#525866]">
            Todo lo que necesitas saber antes de calzarte los zapatos y acompañarnos este 31 de octubre.
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
                    ? "border-[#E91E63] bg-[#FDF2F4]/40 shadow-sm"
                    : "border-[#F4D7DE] bg-white hover:border-[#FF69B4]/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? "text-[#E91E63]" : "text-[#9CA3AF]"}`} />
                    <span className="font-bold text-sm sm:text-base text-[#121316]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#E91E63] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#525866] leading-relaxed border-t border-[#F4D7DE]/50 animate-in fade-in-50 duration-200">
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
