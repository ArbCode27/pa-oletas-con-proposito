import { useState } from "react"
import { ChevronDown, HelpCircle, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "¿Quiénes pueden participar en la Caminata 5K?",
    answer: "¡Todos! Es un evento 100% familiar, inclusivo y recreativo organizado por Inmobiliaria Dream Home. Pueden participar niños, jóvenes, adultos mayores y personas en cochecitos o con mascotas debidamente aseguradas.",
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
    question: "¿Cómo puede una marca o empresa sumarse como patrocinante?",
    answer: "Las empresas y comercios interesados pueden comunicarse directamente con el equipo corporativo de Inmobiliaria Dream Home mediante el botón 'Sumar mi Marca' en la sección de patrocinantes o vía WhatsApp al 0414-234.56.78 para conocer los planes de patrocinio.",
  },
  {
    question: "¿Hay estacionamiento disponible en la salida?",
    answer: "Sí, Forum Charallave contará con área de estacionamiento vigilado por cuerpos de seguridad para los vehículos de los participantes durante la jornada matutina.",
  },
  {
    question: "¿Qué vestimenta y calzado se recomienda llevar?",
    answer: "Recomendamos ropa deportiva cómoda, preferiblemente de color blanco, rosado o celeste para acompañar la marea del evento, calzado deportivo para asfalto, protector solar, gorra y tu termo de agua si deseas complementar la hidratación.",
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
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold">
              <Building2 className="h-3.5 w-3.5 mr-1 text-[#0284C7]" />
              Host: Dream Home
            </Badge>
            <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Resuelve tus Dudas
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl leading-[0.95] text-[#121316] tracking-tight">
            PREGUNTAS
            <span className="block text-transparent bg-gradient-to-r from-[#0284C7] via-[#FF69B4] to-[#E91E63] bg-clip-text">
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
                    ? "border-[#0284C7] bg-[#F0F9FF]/60 shadow-sm"
                    : "border-[#F4D7DE] bg-white hover:border-[#BAE6FD]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? "text-[#0284C7]" : "text-[#9CA3AF]"}`} />
                    <span className="font-bold text-sm sm:text-base text-[#121316]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#0284C7] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#525866] leading-relaxed border-t border-[#BAE6FD]/40 animate-in fade-in-50 duration-200">
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
