import { useState, useRef, useId } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import confetti from "canvas-confetti"
import {
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Upload,
  CheckCircle2,
  FileCheck,
  CreditCard,
  Heart,
  Loader2,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
  X,
  FileText,
  Building2,
  ArrowRight
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

const registrationSchema = z.object({
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
  birth_date: z.string().refine((val) => {
    if (!val) return false
    const date = new Date(val)
    const today = new Date()
    return date < today && date.getFullYear() > 1920
  }, "Ingresa una fecha de nacimiento válida"),
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
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

export const RegistrationSection = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
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
    formState: { errors },
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
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
    },
    mode: "onBlur",
  })

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
      const step1Valid = await trigger([
        "first_name",
        "last_name",
        "cedula_prefix",
        "cedula_number",
        "birth_date",
        "phone",
        "email",
      ])
      if (step1Valid) {
        setActiveStep(2)
      }
      return
    }

    if (activeStep === 2) {
      const step2Valid = await trigger([
        "emergency_contact_name",
        "emergency_contact_phone",
        "accept_terms",
      ])
      if (step2Valid) {
        setActiveStep(3)
      }
      return
    }
  }

  const handlePrevStep = () => {
    if (activeStep === 2) setActiveStep(1)
    if (activeStep === 3) setActiveStep(2)
  }

  const handleCopyPaymentInfo = () => {
    const textToCopy = `PAGO MÓVIL BANESCO (0134)\nCI/RIF: J-501234567\nTeléfono: 04241128778\nConcepto: Caminata 5K`
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

      const { data, error: dbErr } = await submitRegistration({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        cedula: formattedCedula,
        birth_date: values.birth_date,
        phone: values.phone.trim(),
        email: values.email.trim().toLowerCase(),
        emergency_contact_name: values.emergency_contact_name.trim(),
        emergency_contact_phone: values.emergency_contact_phone.trim(),
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
            Completa tus datos personales, información de contacto para emergencias y adjunta tu comprobante de pago para reservar tu cupo oficial con Dream Home Venezuela.
          </p>
        </div>

        {/* Multi-step progress indicator */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#F8BFDC] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#EF007E] to-[#2FC7EA] -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: activeStep === 1 ? "0%" : activeStep === 2 ? "50%" : "100%",
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
                Datos
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
                Emergencia
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  activeStep === 3
                    ? "bg-[#EF007E] text-white shadow-md shadow-[#EF007E]/30 scale-105"
                    : "bg-white text-[#9CA3AF] border border-[#F8BFDC]"
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-[#121316] mt-1.5 uppercase">
                Pago & Capture
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
            {/* STEP 1: DATOS PERSONALES */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-4">
                  <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                    Paso 1: Datos del Participante
                  </h3>
                  <p className="text-xs text-[#525866]">
                    Ingresa tus nombres y apellidos tal como aparecen en tu documento de identidad.
                  </p>
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

                {/* Cédula con selector V / E */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3 space-y-1.5">
                    <Label htmlFor="cedula_prefix">Nacionalidad *</Label>
                    <select
                      id="cedula_prefix"
                      {...register("cedula_prefix")}
                      className="flex h-12 w-full rounded-2xl border border-[#F8BFDC] bg-white px-3 py-2 text-sm text-[#121316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF007E]"
                    >
                      <option value="V">V - Venezolano</option>
                      <option value="E">E - Extranjero</option>
                    </select>
                  </div>

                  <div className="sm:col-span-9 space-y-1.5">
                    <Label htmlFor="cedula_number">Número de Cédula *</Label>
                    <Input
                      id="cedula_number"
                      placeholder="Ej. 18456789"
                      type="text"
                      inputMode="numeric"
                      {...register("cedula_number")}
                    />
                    {errors.cedula_number && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.cedula_number.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="birth_date">Fecha de Nacimiento *</Label>
                    <div className="relative">
                      <Input
                        id="birth_date"
                        type="date"
                        {...register("birth_date")}
                      />
                      <Calendar className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF] pointer-events-none" />
                    </div>
                    {errors.birth_date && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.birth_date.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Teléfono Móvil (WhatsApp) *</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="Ej. 04141234567"
                        type="tel"
                        {...register("phone")}
                      />
                      <Phone className="absolute right-3.5 top-3.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    {errors.phone && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
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
                    A esta dirección te enviaremos tu confirmación y tu número asignado (dorsal).
                  </p>
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Botón Siguiente */}
                <div className="pt-4 flex flex-col sm:flex-row justify-end w-full">
                  <Button
                    type="button"
                    variant="sport"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto shadow-md"
                  >
                    <span className="hidden sm:inline">Continuar a Contacto de Emergencia</span>
                    <span className="sm:hidden">Siguiente: Contacto de Emergencia</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: CONTACTO DE EMERGENCIA */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                      Paso 2: Contacto de Emergencia
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

                {/* Banner de aclaración exigido en el requerimiento */}
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
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="emergency_contact_name">Nombre de Contacto *</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-[#9CA3AF] cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Preferiblemente que no esté participando en el evento
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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

                {/* Checkbox Aceptación de Aptitud Física */}
                <div className="pt-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-[#FAF7F8] p-4 border border-[#F8BFDC]">
                    <Controller
                      name="accept_terms"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="accept_terms"
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-[#F8BFDC] text-[#EF007E] focus:ring-[#EF007E]"
                        />
                      )}
                    />
                    <label htmlFor="accept_terms" className="text-xs text-[#525866] leading-relaxed cursor-pointer select-none">
                      Certifico que gozo de buena salud y aptitud física para participar en la Caminata 5K recreativa.
                      Autorizo al comité organizador de Dream Home a coordinar asistencia médica en caso de requerirse.
                    </label>
                  </div>
                  {errors.accept_terms && (
                    <p className="text-xs font-medium text-red-500 mt-1.5">
                      {errors.accept_terms.message}
                    </p>
                  )}
                </div>

                {/* Botones Navegación */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto justify-center"
                  >
                    ← Volver a Datos
                  </Button>
                  <Button
                    type="button"
                    variant="sport"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto shadow-md"
                  >
                    <span className="hidden sm:inline">Ir a Datos de Pago y Comprobante</span>
                    <span className="sm:hidden">Siguiente: Pago y Capture</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PAGO Y COMPROBANTE DE CAPTURE */}
            {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="border-b border-[#F4D7DE] pb-3 mb-4">
                  <h3 className="font-sport uppercase text-2xl font-black text-[#121316]">
                    Paso 3: Verificación de Pago & Capture
                  </h3>
                  <p className="text-xs text-[#525866]">
                    Realiza tu pago móvil o transferencia y sube la captura para validar tu cupo y asignarte tu dorsal oficial.
                  </p>
                </div>

                {/* Card de Datos Bancarios Oficiales */}
                <div className="rounded-3xl bg-gradient-to-br from-[#072430] via-[#0b1b24] to-[#121316] text-white p-6 shadow-xl relative overflow-hidden border border-[#2FC7EA]/30">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-[#EF007E]/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#2FC7EA]" />
                      <span className="font-bold text-xs uppercase tracking-wider text-[#2FC7EA]">
                        Pago Móvil Oficial
                      </span>
                    </div>
                    <Badge variant="celeste" className="text-[11px] font-bold">
                      Kit Benéfico 5K
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-white/60">Banco Receptor:</span>
                      <strong className="text-sm font-black text-white">
                        Banesco (0134) / Banco Mercantil (0105)
                      </strong>
                    </div>

                    <div>
                      <span className="block text-white/60">Cédula / RIF:</span>
                      <strong className="text-sm font-black text-white">
                        J-50123456-7
                      </strong>
                    </div>

                    <div>
                      <span className="block text-white/60">Teléfono Pago Móvil:</span>
                      <strong className="text-sm font-black text-[#2FC7EA]">
                        0424-112.87.78
                      </strong>
                    </div>

                    <div>
                      <span className="block text-white/60">Beneficiario:</span>
                      <strong className="text-sm font-black text-white">
                        Inmobiliaria Dream Home Venezuela C.A.
                      </strong>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-white/70">Aporte Benéfico: </span>
                      <strong className="text-white font-extrabold">
                        Ref. $10 / Tasa oficial BCV
                      </strong>
                    </div>

                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      onClick={handleCopyPaymentInfo}
                      className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-[#121316] text-xs h-8"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400 mr-1.5" />
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
                    ← Volver a Contacto
                  </Button>

                  <Button
                    type="submit"
                    variant="sport"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin shrink-0" />
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

      {/* DIALOG MODAL DE ÉXITO INTERACTIVO (Requerido en las instrucciones) */}
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

          {/* Mensaje de éxito exacto especificado en el requerimiento */}
          <div className="my-4 rounded-2xl bg-[#FDF0F6] border border-[#F8BFDC] p-4 text-center">
            <p className="text-sm font-extrabold text-[#EF007E] leading-relaxed">
              «¡Inscripción recibida! Una vez comprobado tu pago, enviaremos tu número asignado para la carrera a tu correo.»
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
                <span className="text-[#6B7280]">Correo:</span>
                <strong className="text-[#121316]">{registeredData.email}</strong>
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
