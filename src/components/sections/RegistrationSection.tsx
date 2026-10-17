import { useState, useRef, useId } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import confetti from "canvas-confetti"
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Upload,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Check,
  Copy,
  FileText,
  X,
  ArrowRight,
  ArrowLeft,
  Heart,
  Sparkles,
  ShoppingBag,
  Shirt,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { uploadPaymentProof, submitRegistration, type RegistrationRecord } from "@/lib/supabase"

const SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const

interface DateParseResult {
  valid: boolean
  error?: string
  date?: Date
}

// Validación estricta de fecha de nacimiento en formato DD/MM/AAAA
const parseBirthDate = (val: string): DateParseResult => {
  if (!val || val.trim().length === 0) {
    return { valid: false, error: "Ingresa tu fecha de nacimiento" }
  }

  // Comprobar formato DD/MM/AAAA
  const match = val.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) {
    return { valid: false, error: "Usa el formato DD/MM/AAAA (ej. 15/06/1995)" }
  }

  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const year = parseInt(match[3], 10)

  if (month < 1 || month > 12) {
    return { valid: false, error: "El mes debe estar entre 01 y 12" }
  }

  if (day < 1 || day > 31) {
    return { valid: false, error: "El día no es válido" }
  }

  const currentYear = new Date().getFullYear()
  if (year < 1920) {
    return { valid: false, error: "El año debe ser mayor a 1920" }
  }

  if (year > currentYear) {
    return { valid: false, error: "El año no puede ser en el futuro" }
  }

  // Validar consistencia de días por mes y años bisiestos
  const candidate = new Date(year, month - 1, day)
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return { valid: false, error: "La fecha ingresada no existe en el calendario" }
  }

  // Validar que la fecha sea en el pasado
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (candidate >= today) {
    return { valid: false, error: "La fecha de nacimiento debe ser anterior a hoy" }
  }

  return { valid: true, date: candidate }
}

// Convertir DD/MM/AAAA a formato ISO YYYY-MM-DD para almacenamiento en Supabase
const formatBirthDateToISO = (dateStr: string): string => {
  const match = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month}-${day}`
  }
  return dateStr
}

const registrationSchema = z
  .object({
    kit_type: z.enum(["basico", "premium"]),
    shirt_size: z.string().optional(),
    first_name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "Nombre demasiado largo"),
    last_name: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "Apellido demasiado largo"),
    cedula_prefix: z.enum(["V", "E"]),
    cedula_number: z
      .string()
      .regex(/^\d{6,9}$/, "Ingresa una cédula válida de 6 a 9 dígitos"),
    birth_date: z
      .string()
      .min(1, "Ingresa tu fecha de nacimiento")
      .superRefine((val, ctx) => {
        const result = parseBirthDate(val)
        if (!result.valid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: result.error || "Fecha de nacimiento no válida",
          })
        }
      }),
    phone: z
      .string()
      .min(10, "Ingresa un número telefónico válido (ej. 04141234567)")
      .max(15, "Número demasiado largo"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    emergency_contact_name: z
      .string()
      .min(2, "Ingresa el nombre del contacto de emergencia")
      .max(60, "Nombre demasiado largo"),
    emergency_contact_phone: z
      .string()
      .min(10, "Ingresa un teléfono válido de emergencia"),
    accept_terms: z
      .boolean()
      .refine((val) => val === true, "Debes certificar tu aptitud física para la caminata"),
    payment_reference: z
      .string()
      .min(4, "Ingresa el número de referencia de tu pago (mínimo 4 dígitos)")
      .max(25, "Referencia demasiado larga"),
  })
  .superRefine((data, ctx) => {
    if (data.kit_type === "premium" && (!data.shirt_size || data.shirt_size.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["shirt_size"],
        message: "Por favor selecciona la talla de tu camisa oficial para el Kit Premium",
      })
    }
  })

type RegistrationFormValues = z.infer<typeof registrationSchema>

export const RegistrationSection = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [registeredData, setRegisteredData] = useState<RegistrationRecord | null>(null)
  const [copiedBank, setCopiedBank] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputId = useId()

  const {
    register,
    handleSubmit,
    trigger,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      kit_type: "basico",
      shirt_size: "",
      first_name: "",
      last_name: "",
      cedula_prefix: "V",
      cedula_number: "",
      birth_date: "",
      phone: "",
      email: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      accept_terms: false,
      payment_reference: "",
    },
    mode: "onBlur",
  })

  const selectedKit = watch("kit_type")
  const selectedShirtSize = watch("shirt_size")
  const birthDateValue = watch("birth_date") || ""

  // Manejo de escritura y máscara automática DD/MM/AAAA (sin desplegar calendario)
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Extraer solo dígitos y limitar a un máximo de 8 números
    const digits = raw.replace(/\D/g, "").slice(0, 8)
    let formatted = digits
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    setValue("birth_date", formatted, { shouldValidate: false, shouldDirty: true })
  }

  const handleBirthDateBlur = () => {
    trigger("birth_date")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    if (!validTypes.includes(selectedFile.type)) {
      setFileError("Formato no válido. Debe ser PNG, JPG, WEBP o PDF.")
      setFile(null)
      setFilePreview(null)
      return
    }

    // Validar tamaño máximo (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("El archivo supera el tamaño máximo permitido de 5MB.")
      setFile(null)
      setFilePreview(null)
      return
    }

    setFileError(null)
    setFile(selectedFile)

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview("pdf")
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFilePreview(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleNextStep = async () => {
    if (activeStep === 1) {
      const step1Valid = await trigger(["kit_type", "shirt_size"])
      if (step1Valid) {
        setActiveStep(2)
      }
      return
    }

    if (activeStep === 2) {
      const step2Valid = await trigger([
        "first_name",
        "last_name",
        "cedula_prefix",
        "cedula_number",
        "birth_date",
        "phone",
        "email",
      ])
      if (step2Valid) {
        setActiveStep(3)
      }
      return
    }

    if (activeStep === 3) {
      const step3Valid = await trigger([
        "emergency_contact_name",
        "emergency_contact_phone",
        "accept_terms",
      ])
      if (step3Valid) {
        setActiveStep(4)
      }
      return
    }
  }

  const handlePrevStep = () => {
    if (activeStep === 2) setActiveStep(1)
    if (activeStep === 3) setActiveStep(2)
    if (activeStep === 4) setActiveStep(3)
  }

  const handleCopyPaymentInfo = () => {
    const textToCopy = `PAGO MÓVIL BANESCO (0134)\nCI: 17965340\nTeléfono: 04241128778\nConcepto: Caminata 5K`
    navigator.clipboard.writeText(textToCopy)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2500)
  }

  const fireSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#EF007E", "#2FC7EA", "#FF3B9E", "#E8FAFD", "#FFFFFF"],
      })
    } catch {
      // Ignorar si canvas-confetti falla
    }
  }

  const onSubmit = async (values: RegistrationFormValues) => {
    setSubmissionError(null)

    if (!file) {
      setFileError("Por favor adjunta la captura o comprobante de tu pago.")
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Subir capture a Supabase Storage
      const { url: fileUrl, error: uploadErr } = await uploadPaymentProof(file)

      if (uploadErr || !fileUrl) {
        setSubmissionError(`Error al subir comprobante: ${uploadErr || "No se obtuvo URL"}`)
        setIsSubmitting(false)
        return
      }

      // 2. Guardar registro en Supabase Database
      const formattedCedula = `${values.cedula_prefix}-${values.cedula_number}`
      const amount = values.kit_type === "premium" ? 15 : 10

      const { data, error: dbErr } = await submitRegistration({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        cedula: formattedCedula,
        birth_date: formatBirthDateToISO(values.birth_date),
        phone: values.phone.trim(),
        email: values.email.trim().toLowerCase(),
        emergency_contact_name: values.emergency_contact_name.trim(),
        emergency_contact_phone: values.emergency_contact_phone.trim(),
        kit_type: values.kit_type,
        shirt_size: values.kit_type === "premium" ? values.shirt_size || null : null,
        payment_reference: values.payment_reference.trim(),
        payment_amount: amount,
        payment_proof_url: fileUrl,
      })

      if (dbErr) {
        setSubmissionError(dbErr)
        setIsSubmitting(false)
        return
      }

      // Éxito
      setRegisteredData(data)
      setIsSubmitting(false)
      setSuccessModalOpen(true)
      fireSuccessConfetti()

      // Reset form
      reset()
      setFile(null)
      setFilePreview(null)
      setActiveStep(1)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado"
      setSubmissionError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <section id="registro" className="py-20 md:py-28 bg-[#FAF7F8] relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="celeste" className="px-3.5 py-1 text-xs uppercase tracking-wider font-extrabold flex items-center">
              <img src="/logo-dream-home.png" alt="Dream Home" className="h-4 w-4 mr-1.5 rounded-full object-contain" />
              Inmobiliaria Dream Home
            </Badge>
            <Badge variant="pink" className="px-3.5 py-1 text-xs uppercase tracking-wider font-bold">
              Inscripción Oficial
            </Badge>
          </div>

          <h2 className="font-sport font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-[#121316] tracking-tight">
            INSCRÍBETE
            <span className="block text-transparent bg-gradient-to-r from-[#EF007E] via-[#FF3B9E] to-[#2FC7EA] bg-clip-text">
              Y RENACE HOY
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#525866] leading-relaxed">
            Sábado 31 de octubre • 7:00 am • Salida: Fórum Charallave (con Bailoterapia 💃🎶).
            Selecciona tu kit, completa tus datos y asegura tu dorsal oficial. ¡Cupos limitados!
          </p>
        </div>

        {/* Multi-step progress indicator (4 Pasos) */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#F8BFDC] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#EF007E] to-[#2FC7EA] -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width:
                  activeStep === 1
                    ? "0%"
                    : activeStep === 2
                    ? "33.3%"
                    : activeStep === 3
                    ? "66.6%"
                    : "100%",
              }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  activeStep >= 1
                    ? "bg-[#EF007E] text-white shadow-md shadow-[#EF007E]/30 scale-105"
                    : "bg-white text-[#9CA3AF] border border-[#F8BFDC]"
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-bold text-[#121316] mt-1.5 uppercase">
                Kit
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  activeStep >= 2
                    ? "bg-[#EF007E] text-white shadow-md shadow-[#EF007E]/30 scale-105"
                    : "bg-white text-[#9CA3AF] border border-[#F8BFDC]"
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-bold text-[#121316] mt-1.5 uppercase">
                Datos
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  activeStep >= 3
                    ? "bg-[#EF007E] text-white shadow-md shadow-[#EF007E]/30 scale-105"
                    : "bg-white text-[#9CA3AF] border border-[#F8BFDC]"
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-[#121316] mt-1.5 uppercase">
                Emergencia
              </span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  activeStep === 4
                    ? "bg-[#EF007E] text-white shadow-md shadow-[#EF007E]/30 scale-105"
                    : "bg-white text-[#9CA3AF] border border-[#F8BFDC]"
                }`}
              >
                4
              </div>
              <span className="text-[11px] font-bold text-[#121316] mt-1.5 uppercase">
                Pago
              </span>
            </div>
          </div>
        </div>

        {/* Main Form Card Container */}
        <div className="rounded-3xl border border-[#F8BFDC] bg-white p-4 sm:p-8 md:p-10 shadow-2xl shadow-[#EF007E]/10">
          {submissionError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>No se pudo completar la inscripción</AlertTitle>
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ============================================================== */}
            {/* PASO 1: SELECCIÓN DE KIT */}
            {/* ============================================================== */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#EF007E]" />
                    <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                      Paso 1: Modalidad de Inscripción & Kit
                    </h3>
                  </div>
                  <p className="text-xs text-[#525866] mt-1">
                    Selecciona el kit que deseas para participar en la Caminata 5K. Ambos kits incluyen tu número dorsal y acceso completo al evento.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Tarjeta Kit Básico */}
                  <div
                    onClick={() => setValue("kit_type", "basico", { shouldValidate: true })}
                    className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedKit === "basico"
                        ? "border-[#2FC7EA] bg-gradient-to-b from-[#E8FAFD]/60 via-white to-white shadow-lg shadow-[#2FC7EA]/15 scale-[1.01]"
                        : "border-[#E5E7EB] bg-white hover:border-[#AEEAF7] hover:bg-[#FAF7F8]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#0E8EA8] bg-[#E8FAFD] px-3 py-1 rounded-full border border-[#AEEAF7]">
                          Opción Esencial
                        </span>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedKit === "basico"
                              ? "border-[#2FC7EA] bg-[#2FC7EA]"
                              : "border-[#D1D5DB]"
                          }`}
                        >
                          {selectedKit === "basico" && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>

                      <h4 className="font-sport uppercase text-3xl font-black text-[#121316]">
                        Kit Básico
                      </h4>

                      <div className="mt-2 mb-4 flex items-baseline gap-1.5">
                        <span className="font-sport text-4xl sm:text-5xl font-black text-[#0E8EA8]">
                          $10
                        </span>
                        <span className="text-xs text-[#525866] font-semibold">
                          / Tasa oficial BCV
                        </span>
                      </div>

                      <p className="text-xs text-[#525866] mb-4">
                        Ideal para quienes desean participar con su propia ropa deportiva y llevar la pañoleta conmemorativa oficial.
                      </p>

                      <ul className="space-y-2 text-xs text-[#121316] font-medium border-t border-[#F4D7DE] pt-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#2FC7EA] shrink-0 stroke-[2.5]" />
                          <span>Pañoleta conmemorativa oficial</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#2FC7EA] shrink-0 stroke-[2.5]" />
                          <span>Llavero conmemorativo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#2FC7EA] shrink-0 stroke-[2.5]" />
                          <span>Dorsal oficial (número de competencia)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#2FC7EA] shrink-0 stroke-[2.5]" />
                          <span>Hidratación garantizada en 3 puntos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#2FC7EA] shrink-0 stroke-[2.5]" />
                          <span>Certificado de participación digital</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#2FC7EA] shrink-0 stroke-[2.5]" />
                          <span>Obsequios por parte de patrocinantes</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Tarjeta Kit Premium */}
                  <div
                    onClick={() => setValue("kit_type", "premium", { shouldValidate: true })}
                    className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedKit === "premium"
                        ? "border-[#EF007E] bg-gradient-to-b from-[#FDF0F6]/80 via-white to-white shadow-xl shadow-[#EF007E]/15 scale-[1.01]"
                        : "border-[#E5E7EB] bg-white hover:border-[#F8BFDC] hover:bg-[#FAF7F8]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#EF007E] bg-[#FDF0F6] px-3 py-1 rounded-full border border-[#F8BFDC] flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Más Completo
                        </span>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedKit === "premium"
                              ? "border-[#EF007E] bg-[#EF007E]"
                              : "border-[#D1D5DB]"
                          }`}
                        >
                          {selectedKit === "premium" && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>

                      <h4 className="font-sport uppercase text-3xl font-black text-[#121316]">
                        Kit Premium
                      </h4>

                      <div className="mt-2 mb-4 flex items-baseline gap-1.5">
                        <span className="font-sport text-4xl sm:text-5xl font-black text-[#EF007E]">
                          $15
                        </span>
                        <span className="text-xs text-[#525866] font-semibold">
                          / Tasa oficial BCV
                        </span>
                      </div>

                      <p className="text-xs text-[#525866] mb-4">
                        La experiencia completa: incluye la <strong>Camisa deportiva oficial</strong> y el <strong>Cooler de hidratación</strong> conmemorativo.
                      </p>

                      <ul className="space-y-2 text-xs text-[#121316] font-medium border-t border-[#F4D7DE] pt-4">
                        <li className="flex items-center gap-2 font-bold text-[#EF007E]">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Camisa oficial del evento</span>
                        </li>
                        <li className="flex items-center gap-2 font-bold text-[#EF007E]">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Cooler conmemorativo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Pañoleta conmemorativa oficial</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Llavero conmemorativo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Dorsal oficial (número de competencia)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Hidratación garantizada en 3 puntos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Certificado de participación digital</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#EF007E] shrink-0 stroke-[2.5]" />
                          <span>Obsequios por parte de patrocinantes</span>
                        </li>
                      </ul>
                    </div>

                    {/* Selector de Talla de Camisa si se selecciona Kit Premium */}
                    {selectedKit === "premium" && (
                      <div className="mt-5 p-4 rounded-2xl bg-white border border-[#F8BFDC] shadow-sm animate-in fade-in-50 duration-200">
                        <Label className="text-xs font-bold text-[#121316] flex items-center gap-1.5 mb-2">
                          <Shirt className="h-4 w-4 text-[#EF007E]" />
                          <span>Selecciona la Talla de tu Camisa Oficial *</span>
                        </Label>

                        <div className="grid grid-cols-5 gap-2">
                          {SHIRT_SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setValue("shirt_size", size, { shouldValidate: true })
                              }}
                              className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                                selectedShirtSize === size
                                  ? "bg-[#EF007E] text-white border-[#EF007E] shadow-sm shadow-[#EF007E]/30 scale-105"
                                  : "bg-[#FAF7F8] text-[#121316] border-[#F4D7DE] hover:border-[#EF007E]"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>

                        {errors.shirt_size && (
                          <p className="text-xs font-semibold text-red-500 mt-2">
                            {errors.shirt_size.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón Siguiente a Datos */}
                <div className="pt-4 flex flex-col sm:flex-row justify-end w-full">
                  <Button
                    type="button"
                    variant="sport"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto shadow-md"
                  >
                    <span>Continuar a Datos Personales</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PASO 2: DATOS PERSONALES */}
            {/* ============================================================== */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                      Paso 2: Datos del Participante
                    </h3>
                    <p className="text-xs text-[#525866]">
                      Ingresa tus nombres y apellidos tal como aparecen en tu documento de identidad.
                    </p>
                  </div>
                  <Badge variant="pink" className="text-[11px] font-bold">
                    {selectedKit === "premium" ? "Kit Premium ($15)" : "Kit Básico ($10)"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <Label htmlFor="first_name">Nombre *</Label>
                    <div className="relative">
                      <Input
                        id="first_name"
                        placeholder="Ej. María"
                        {...register("first_name")}
                      />
                      <User className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    {errors.first_name && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div className="space-y-1.5">
                    <Label htmlFor="last_name">Apellido *</Label>
                    <div className="relative">
                      <Input
                        id="last_name"
                        placeholder="Ej. González"
                        {...register("last_name")}
                      />
                      <User className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    {errors.last_name && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cédula y Fecha de Nacimiento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cédula con selector V / E */}
                  <div className="space-y-1.5">
                    <Label htmlFor="cedula_number">Cédula de Identidad *</Label>
                    <div className="flex gap-2">
                      <select
                        {...register("cedula_prefix")}
                        className="w-16 rounded-2xl border border-[#F8BFDC] bg-[#FAF7F8] px-3 py-2.5 text-sm font-bold text-[#121316] focus:border-[#EF007E] focus:outline-none"
                      >
                        <option value="V">V-</option>
                        <option value="E">E-</option>
                      </select>

                      <div className="relative flex-1">
                        <Input
                          id="cedula_number"
                          placeholder="12345678"
                          type="tel"
                          maxLength={9}
                          {...register("cedula_number")}
                        />
                      </div>
                    </div>
                    {errors.cedula_number && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.cedula_number.message}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="birth_date">Fecha de Nacimiento *</Label>
                      <span className="text-[11px] font-semibold text-[#8B93A0]">
                        DD/MM/AAAA
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        id="birth_date"
                        type="text"
                        inputMode="numeric"
                        placeholder="DD/MM/AAAA (ej. 15/06/1995)"
                        maxLength={10}
                        value={birthDateValue}
                        onChange={handleBirthDateChange}
                        onBlur={handleBirthDateBlur}
                        className="font-mono text-sm tracking-wide bg-white"
                        autoComplete="bday"
                      />
                      <Calendar className="absolute right-3.5 top-3.5 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                    {errors.birth_date && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.birth_date.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Teléfono y Correo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Teléfono Personal (WhatsApp) *</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="Ej. 04141234567"
                        type="tel"
                        {...register("phone")}
                      />
                      <Phone className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      Para enviarte la confirmación y avisos de la entrega del kit.
                    </p>
                    {errors.phone && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Correo Electrónico */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        placeholder="ejemplo@correo.com"
                        type="email"
                        {...register("email")}
                      />
                      <Mail className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      A esta dirección te enviaremos tu número asignado (dorsal).
                    </p>
                    {errors.email && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones de navegación */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    <span>Volver a Selección de Kit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="sport"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto shadow-md"
                  >
                    <span>Continuar a Contacto de Emergencia</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PASO 3: CONTACTO DE EMERGENCIA */}
            {/* ============================================================== */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                      Paso 3: Contacto de Emergencia & Salud
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs text-[#EF007E] font-bold hover:underline"
                          >
                            <HelpCircle className="h-4 w-4" />
                            <span>¿Por qué se solicita?</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Requerimiento de seguridad médica y protocolo deportivo para cualquier imprevisto durante el recorrido de 5K.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-[#525866]">
                    Protocolo indispensable de primeros auxilios y protección civil para la caminata.
                  </p>
                </div>

                {/* Banner de aclaratoria */}
                <div className="rounded-2xl border border-[#F8BFDC] bg-[#FDF0F6] p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#EF007E] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-[#121316]">
                      Aclaratoria importante de seguridad:
                    </h5>
                    <p className="text-xs text-[#525866] mt-0.5">
                      Preferiblemente que sea una persona de confianza que{" "}
                      <strong className="text-[#EF007E]">no esté participando en el evento</strong>,
                      para facilitar la comunicación inmediata de ser necesario.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre persona de emergencia */}
                  <div className="space-y-1.5">
                    <Label htmlFor="emergency_contact_name">Nombre de Contacto *</Label>
                    <div className="relative">
                      <Input
                        id="emergency_contact_name"
                        placeholder="Ej. Carlos Mendoza (Hermano)"
                        {...register("emergency_contact_name")}
                      />
                      <User className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    {errors.emergency_contact_name && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.emergency_contact_name.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono persona de emergencia */}
                  <div className="space-y-1.5">
                    <Label htmlFor="emergency_contact_phone">Teléfono de Emergencia *</Label>
                    <div className="relative">
                      <Input
                        id="emergency_contact_phone"
                        placeholder="Ej. 04249876543"
                        type="tel"
                        {...register("emergency_contact_phone")}
                      />
                      <Phone className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    {errors.emergency_contact_phone && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.emergency_contact_phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkbox Aceptación de términos y aptitud física */}
                <div className="pt-2">
                  <div className="rounded-2xl border border-[#F8BFDC] bg-[#FAF7F8] p-4 flex items-start gap-3">
                    <Controller
                      name="accept_terms"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="accept_terms"
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-[#F8BFDC] text-[#EF007E] focus:ring-[#EF007E] cursor-pointer"
                        />
                      )}
                    />
                    <label
                      htmlFor="accept_terms"
                      className="text-xs text-[#121316] leading-relaxed cursor-pointer"
                    >
                      Certifico que me encuentro en condiciones físicas y de salud aptas para participar en la Caminata 5K «Camina y Renace con Dream Home 2026», y acepto el reglamento de convivencia del evento.
                    </label>
                  </div>
                  {errors.accept_terms && (
                    <p className="text-xs font-medium text-red-500 mt-1 pl-1">
                      {errors.accept_terms.message}
                    </p>
                  )}
                </div>

                {/* Botones de navegación */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    <span>Volver a Datos Personales</span>
                  </Button>

                  <Button
                    type="button"
                    variant="sport"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto shadow-md"
                  >
                    <span>Continuar al Pago y Comprobante</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PASO 4: PAGO & COMPROBANTE */}
            {/* ============================================================== */}
            {activeStep === 4 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-4">
                  <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                    Paso 4: Verificación de Pago & Capture
                  </h3>
                  <p className="text-xs text-[#525866]">
                    Realiza tu pago móvil, ingresa el número de referencia y adjunta la captura para validar tu cupo y asignarte tu dorsal oficial.
                  </p>
                </div>

                {/* Resumen del Kit seleccionado */}
                <div className="rounded-2xl bg-gradient-to-r from-[#FDF0F6] to-[#E8FAFD] border border-[#F8BFDC] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white text-[#EF007E] border border-[#F8BFDC] flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#525866]">
                        Modalidad seleccionada
                      </span>
                      <h4 className="font-sport uppercase text-lg font-black text-[#121316]">
                        {selectedKit === "premium" ? "Kit Premium 5K" : "Kit Básico 5K"}
                        {selectedKit === "premium" && selectedShirtSize && (
                          <span className="ml-1.5 text-xs text-[#EF007E]">
                            (Talla {selectedShirtSize})
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#525866] block">
                      Total a Pagar
                    </span>
                    <span className="font-sport text-2xl sm:text-3xl font-black text-[#EF007E]">
                      {selectedKit === "premium" ? "$15" : "$10"}
                    </span>
                  </div>
                </div>

                {/* Card de Datos Bancarios Oficiales de Dream Home */}
                <div className="rounded-3xl bg-gradient-to-br from-[#E8FAFD]/60 via-white to-[#FDF0F6]/60 text-[#121316] p-6 shadow-md relative overflow-hidden border-2 border-[#AEEAF7]">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-[#EF007E]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#0E8EA8]" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-[#0E8EA8]">
                        Pago Móvil Oficial
                      </span>
                    </div>
                    <Badge variant="celeste" className="text-[11px] font-bold bg-[#E8FAFD] text-[#0E8EA8] border border-[#AEEAF7]">
                      Tasa Oficial BCV
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[#6B7280] font-medium">Banco Receptor:</span>
                      <strong className="text-sm font-black text-[#121316]">
                        Banesco (0134)
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[#6B7280] font-medium">Cédula:</span>
                      <strong className="text-sm font-black text-[#121316]">
                        17.965.340
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[#6B7280] font-medium">Teléfono Pago Móvil:</span>
                      <strong className="text-sm font-black text-[#EF007E]">
                        0424-112.87.78
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[#6B7280] font-medium">Beneficiario:</span>
                      <strong className="text-sm font-black text-[#121316]">
                        Inmobiliaria Dream Home Venezuela
                      </strong>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F4D7DE] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-[#6B7280]">Inversión Oficial: </span>
                      <strong className="text-[#121316] font-extrabold">
                        {selectedKit === "premium" ? "Ref. $15" : "Ref. $10"} / Tasa oficial BCV
                      </strong>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPaymentInfo}
                      className="bg-white text-[#121316] border-[#AEEAF7] hover:bg-[#E8FAFD] hover:text-[#0E8EA8] text-xs h-8 font-bold"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          <span>Copiar Datos Bancarios</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Campo: Número de Referencia de Pago */}
                <div className="space-y-1.5">
                  <Label htmlFor="payment_reference" className="text-xs font-bold text-[#121316] flex items-center gap-1.5">
                    <Hash className="h-4 w-4 text-[#EF007E]" />
                    <span>Número de Referencia de Pago Móvil o Transferencia *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="payment_reference"
                      placeholder="Ej. 489201 (los dígitos de tu confirmación)"
                      {...register("payment_reference")}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Indica los números de confirmación emitidos por tu banco para validar tu transferencia.
                  </p>
                  {errors.payment_reference && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.payment_reference.message}
                    </p>
                  )}
                </div>

                {/* File Upload Box (Drag and Drop / File Input) */}
                <div className="space-y-2">
                  <Label htmlFor={fileInputId} className="text-sm font-bold text-[#121316]">
                    Adjuntar Capture del Pago *
                  </Label>

                  {!file ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer bg-[#FAF7F8] hover:bg-[#FDF0F6] ${
                        fileError
                          ? "border-red-400 bg-red-50/50"
                          : "border-[#F8BFDC] hover:border-[#EF007E]"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        id={fileInputId}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#F8BFDC] text-[#EF007E] mb-3">
                        <Upload className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-[#121316]">
                        Haz clic aquí para subir tu comprobante
                      </h4>
                      <p className="text-xs text-[#525866] mt-1">
                        Formatos soportados: JPG, PNG, WEBP o PDF (Máximo 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#F8BFDC] bg-white p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {filePreview && filePreview !== "pdf" ? (
                          <img
                            src={filePreview}
                            alt="Preview capture"
                            className="h-14 w-14 rounded-xl object-cover border border-[#F8BFDC]"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#FDF0F6] text-[#EF007E]">
                            <FileText className="h-7 w-7" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-[#121316] truncate max-w-[200px] sm:max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-[#6B7280]">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • Comprobante listo
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <FileCheck className="h-3 w-3" /> Archivo verificado
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="text-[#9CA3AF] hover:text-red-500 hover:bg-red-50"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {fileError && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {fileError}
                    </p>
                  )}
                </div>

                {/* Botones Finales */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto justify-center"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    <span>Volver a Contacto</span>
                  </Button>

                  <Button
                    type="submit"
                    variant="sport"
                    size="xl"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto shadow-xl shadow-[#EF007E]/25 text-sm sm:text-base font-black px-6 sm:px-8 py-3.5 sm:py-4"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">◌</span>
                        <span>Procesando Inscripción...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                        <span>Confirmar Inscripción 5K</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* DIALOG MODAL DE ÉXITO */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="max-w-lg text-center p-6 sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF0F6] text-[#EF007E] mb-2 shadow-inner">
            <Heart className="h-8 w-8 fill-[#EF007E]" />
          </div>

          <DialogHeader>
            <DialogTitle className="font-sport uppercase text-3xl font-black text-[#121316]">
              ¡Inscripción Recibida!
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-[#525866] pt-1">
              Caminata 5K «Camina y Renace con Dream Home 2026»
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 rounded-2xl bg-[#FDF0F6] border border-[#F8BFDC] p-4 text-center">
            <p className="text-sm font-extrabold text-[#EF007E] leading-relaxed">
              «¡Inscripción recibida! Una vez comprobado tu pago, enviaremos tu número asignado para la carrera a tu correo y WhatsApp.»
            </p>
          </div>

          {registeredData && (
            <div className="rounded-2xl bg-[#FAF7F8] border border-[#F8BFDC] p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#F8BFDC] pb-2">
                <span className="text-[#6B7280]">Participante:</span>
                <strong className="text-[#121316]">
                  {registeredData.first_name} {registeredData.last_name}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#F8BFDC] pb-2">
                <span className="text-[#6B7280]">Cédula:</span>
                <strong className="text-[#121316]">{registeredData.cedula}</strong>
              </div>
              <div className="flex justify-between border-b border-[#F8BFDC] pb-2">
                <span className="text-[#6B7280]">Modalidad Kit:</span>
                <strong className="text-[#EF007E] font-bold">
                  {registeredData.kit_type === "premium"
                    ? `Kit Premium ($15)${registeredData.shirt_size ? ` - Talla ${registeredData.shirt_size}` : ""}`
                    : "Kit Básico ($10)"}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#F8BFDC] pb-2">
                <span className="text-[#6B7280]">Ref. Bancaria:</span>
                <strong className="text-[#121316] font-mono">{registeredData.payment_reference}</strong>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#6B7280]">Estado:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold">
                  En Verificación (Pending)
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="sport"
              onClick={() => setSuccessModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Entendido, muchas gracias
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
