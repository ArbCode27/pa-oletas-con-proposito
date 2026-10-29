import { useEffect, useState, useMemo, useCallback } from "react"
import confetti from "canvas-confetti"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  Download,
  Eye,
  Phone,
  Copy,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Database,
  Hash,
  MessageCircle,
  AlertCircle,
  FileSpreadsheet,
  ShoppingBag,
  Sparkles,
  FileDown,
  FileText,
  Paperclip,
  Loader2,
  Send,
  Pencil,
  Trash2,
  Save,
  User,
  ChevronDown,
  Filter,
  Layers,
} from "lucide-react"
import {
  getRegistrations,
  updateRegistrationStatus,
  updateRegistration,
  deleteRegistration,
  isSupabaseConfigured,
  formatBibNumber,
  type RegistrationRecord,
} from "@/lib/supabase"
import {
  downloadTicketPdf,
  generateTicketPdfFile,
} from "@/lib/generateTicketPdf"
import {
  exportRegistrationsToExcel,
  exportRegistrationsToCSV,
} from "@/lib/exportExcel"
import { Button } from "@/components/ui/button"

interface AdminDashboardProps {
  onBack: () => void
}

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [records, setRecords] = useState<RegistrationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [kitFilter, setKitFilter] = useState<"all" | "basico" | "premium">("all")
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name" | "bib">("date_desc")

  // Modal para inspección de comprobante
  const [inspectRecord, setInspectRecord] = useState<RegistrationRecord | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [adminNotes, setAdminNotes] = useState("")
  const [customBib, setCustomBib] = useState<string>("")
  const [actionLoading, setActionLoading] = useState(false)

  // Modal de "Participante Confirmado" con Número de Participante
  const [confirmedData, setConfirmedData] = useState<{
    record: RegistrationRecord
    bib: number
  } | null>(null)

  // Feedback de copiado al portapapeles
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Estados para descarga y envío de PDF
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null)
  const [whatsAppGuideActive, setWhatsAppGuideActive] = useState(false)

  // Estados para modal de edición de información
  const [editRecord, setEditRecord] = useState<RegistrationRecord | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<RegistrationRecord>>({})
  const [isEditSaving, setIsEditSaving] = useState(false)

  // Estados para modal de confirmación de eliminación
  const [recordToDelete, setRecordToDelete] = useState<RegistrationRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estados para exportación profesional a Excel
  const [isExporting, setIsExporting] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)

  // Carga de registros
  const handleFetchRecords = useCallback(async () => {
    setLoading(true)
    const { data } = await getRegistrations()
    setRecords(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    handleFetchRecords()
  }, [handleFetchRecords])

  // Próximo número de dorsal disponible (asignado en orden estricto de aprobación, inicia en 1 -> 01)
  const nextAvailableBib = useMemo(() => {
    const usedBibs = records
      .map((r) => r.bib_number)
      .filter((b): b is number => typeof b === "number" && !isNaN(b) && b > 0)

    if (usedBibs.length === 0) return 1
    return Math.max(...usedBibs) + 1
  }, [records])

  // Disparar confeti al confirmar participante
  const fireSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#EF007E", "#2FC7EA", "#10B981", "#FF3B9E", "#FDF0F6"],
      })
    } catch {
      // Ignorar si canvas-confetti falla
    }
  }

  // Abrir modal de inspección
  const handleOpenInspect = (record: RegistrationRecord) => {
    setInspectRecord(record)
    setZoomLevel(1)
    setRotationAngle(0)
    setAdminNotes(record.notes || "")
    setCustomBib(
      record.bib_number ? formatBibNumber(record.bib_number) : formatBibNumber(nextAvailableBib)
    )
  }

  const handleCloseInspect = () => {
    setInspectRecord(null)
    setZoomLevel(1)
    setRotationAngle(0)
    setAdminNotes("")
    setCustomBib("")
  }

  // Copiar cédula o teléfono
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Descargar Comprobante PDF oficial
  const handleDownloadRecordPdf = async (record: RegistrationRecord, bib: number | string) => {
    try {
      setIsPdfLoading(true)
      const filename = await downloadTicketPdf({ record, bib })
      setPdfSuccessMessage(`Comprobante descargado: ${filename}`)
      setTimeout(() => setPdfSuccessMessage(null), 6000)
    } catch (err) {
      console.error("Error al descargar PDF:", err)
      alert("No se pudo generar el comprobante PDF. Por favor intenta nuevamente.")
    } finally {
      setIsPdfLoading(false)
    }
  }

  // Enviar PDF y mensaje oficial por WhatsApp
  const handleSendPdfWhatsApp = async (record: RegistrationRecord, bib: number | string) => {
    try {
      setIsPdfLoading(true)
      const bibStr = formatBibNumber(bib)
      const kitStr = record.kit_type === "premium" ? "Kit Premium" : "Kit Básico"

      const messageText =
        `¡Hola ${record.first_name}! 👋 Te saluda el equipo de Inmobiliaria Dream Home.\n\n` +
        `🎉 ¡Tu inscripción para la Caminata 5K 'Camina y Renace con Dream Home 2026' ha sido APROBADA con éxito!\n\n` +
        `🎽 Número Oficial de Dorsal: #${bibStr}\n` +
        `📦 Modalidad de Kit: ${kitStr}\n` +
        `📅 Fecha: Sábado 31 de Octubre de 2026\n` +
        `⏰ Inicio: 7:00 AM (Bailoterapia en el Fórum)\n` +
        `🏃 Salida Oficial 5K: 8:00 AM puntual\n` +
        `🎉 Llegada, Salud & Premiación: 10:00 AM a 11:00 AM\n` +
        `💃 Bailoterapia de Cierre: 11:00 AM a 12:00 M\n` +
        `🏁 Cierre del Evento: 12:00 M\n` +
        `📍 Salida: Fórum Charallave ➔ Meta: El Campito\n\n` +
        `📄 Te adjuntamos tu Comprobante Oficial en formato PDF para que lo tengas a mano y lo presentes al retirar tu kit físico. ¡Nos vemos en la meta!`

      // Generar el archivo PDF
      const { file, filename } = await generateTicketPdfFile({ record, bib })

      // Verificar si el navegador soporta Web Share API con archivos (Móviles / Tablets / Chrome Android)
      const nav = navigator as unknown as {
        canShare?: (data: { files?: File[] }) => boolean
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>
      }

      if (
        typeof nav.canShare === "function" &&
        nav.canShare({ files: [file] }) &&
        typeof nav.share === "function"
      ) {
        try {
          await nav.share({
            files: [file],
            title: `Comprobante Dorsal #${bibStr} - ${record.first_name}`,
            text: messageText,
          })
          setPdfSuccessMessage(`¡Comprobante compartido exitosamente!`)
          return
        } catch (shareErr: unknown) {
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            return
          }
        }
      }

      // Si no soporta Web Share directo de archivos (como WhatsApp Web en computadora):
      // 1. Descargar el archivo PDF automáticamente
      await downloadTicketPdf({ record, bib })

      // 2. Abrir WhatsApp Web con el mensaje pre-cargado
      const waLink = formatWhatsAppLink(record.phone, messageText)
      window.open(waLink, "_blank")

      // 3. Activar guía interactiva en el modal
      setWhatsAppGuideActive(true)
      setPdfSuccessMessage(`Se descargó "${filename}". Adjúntalo en el chat de WhatsApp que se acaba de abrir.`)
    } catch (err) {
      console.error("Error al procesar envío por WhatsApp:", err)
      alert("Ocurrió un error al preparar el PDF. Puedes descargarlo con el botón de descarga.")
    } finally {
      setIsPdfLoading(false)
    }
  }

  // Abrir modal de edición
  const handleOpenEdit = (record: RegistrationRecord) => {
    setEditRecord(record)
    setEditFormData({
      first_name: record.first_name,
      last_name: record.last_name,
      cedula: record.cedula,
      birth_date: record.birth_date,
      phone: record.phone,
      email: record.email,
      emergency_contact_name: record.emergency_contact_name,
      emergency_contact_phone: record.emergency_contact_phone,
      kit_type: record.kit_type,
      shirt_size: record.shirt_size,
      payment_reference: record.payment_reference,
      payment_amount: record.payment_amount,
      status: record.status,
      bib_number: record.bib_number,
      notes: record.notes,
    })
  }

  const handleCloseEdit = () => {
    setEditRecord(null)
    setEditFormData({})
  }

  // Guardar cambios de edición
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord?.id) return

    setIsEditSaving(true)
    const { data: updated, error } = await updateRegistration(editRecord.id, editFormData)
    setIsEditSaving(false)

    if (error) {
      alert(`Error al guardar los cambios: ${error}`)
      return
    }

    const savedRecord = updated || { ...editRecord, ...editFormData }
    setRecords((prev) => prev.map((item) => (item.id === editRecord.id ? savedRecord : item)))
    handleCloseEdit()
  }

  // Abrir modal de eliminación
  const handleOpenDelete = (record: RegistrationRecord) => {
    setRecordToDelete(record)
  }

  const handleCloseDelete = () => {
    setRecordToDelete(null)
  }

  // Confirmar eliminación de la petición
  const handleConfirmDelete = async () => {
    if (!recordToDelete?.id) return

    setIsDeleting(true)
    const { error } = await deleteRegistration(recordToDelete.id)
    setIsDeleting(false)

    if (error) {
      alert(`Error al eliminar la petición: ${error}`)
      return
    }

    setRecords((prev) => prev.filter((item) => item.id !== recordToDelete.id))
    handleCloseDelete()
  }

  // Actualizar estado de registro
  const handleStatusChange = async (
    record: RegistrationRecord,
    newStatus: "approved" | "rejected" | "pending",
    assignedBib?: number | null,
    notesToSave?: string | null
  ) => {
    if (!record.id) return

    setActionLoading(true)
    // El dorsal se asigna por orden de aprobación: empieza en 01 y se incrementa
    const bib =
      newStatus === "approved"
        ? (assignedBib ?? record.bib_number ?? nextAvailableBib)
        : null

    const { error, data: updated } = await updateRegistrationStatus(
      record.id,
      newStatus,
      bib,
      notesToSave !== undefined ? notesToSave : record.notes
    )

    setActionLoading(false)

    if (error) {
      alert(`Error al actualizar el registro: ${error}`)
      return
    }

    const updatedRecord: RegistrationRecord = updated || {
      ...record,
      status: newStatus,
      bib_number: bib,
      notes: notesToSave ?? record.notes,
    }

    setRecords((prev) => prev.map((item) => (item.id === record.id ? updatedRecord : item)))

    if (inspectRecord && inspectRecord.id === record.id) {
      handleCloseInspect()
    }

    // Si fue aprobado con dorsal, mostrar el modal de Participante Confirmado
    if (newStatus === "approved" && bib) {
      setPdfSuccessMessage(null)
      setWhatsAppGuideActive(false)
      setConfirmedData({
        record: updatedRecord,
        bib,
      })
      fireSuccessConfetti()
    }
  }

  // Descripción legible del filtro actualmente activo en pantalla
  const activeFilterDescription = useMemo(() => {
    const parts: string[] = []
    if (searchQuery.trim()) {
      parts.push(`Búsqueda: "${searchQuery.trim()}"`)
    }
    if (statusFilter !== "all") {
      parts.push(
        statusFilter === "approved"
          ? "Estado: Aprobados"
          : statusFilter === "pending"
          ? "Estado: Pendientes"
          : "Estado: Rechazados"
      )
    }
    if (kitFilter !== "all") {
      parts.push(kitFilter === "premium" ? "Kit: Premium ($15)" : "Kit: Básico ($10)")
    }
    return parts.length > 0 ? parts.join(" • ") : null
  }, [searchQuery, statusFilter, kitFilter])

  // Ejecutar exportación profesional a Microsoft Excel (.xlsx)
  const handleExecuteExcelExport = async (
    recordsToExport: RegistrationRecord[],
    filterDesc?: string
  ) => {
    if (recordsToExport.length === 0) {
      alert("No hay registros disponibles para exportar con los filtros seleccionados.")
      return
    }

    try {
      setIsExporting(true)
      const dateStr = new Date().toISOString().slice(0, 10)
      const isFiltered = Boolean(filterDesc && recordsToExport.length !== records.length)
      const filename = isFiltered
        ? `Inscripciones_5K_Dream_Home_Filtrado_${dateStr}.xlsx`
        : `Inscripciones_Caminata_5K_Dream_Home_${dateStr}.xlsx`

      await exportRegistrationsToExcel({
        records: recordsToExport,
        filename,
        filterDescription: filterDesc,
      })
      setExportModalOpen(false)
    } catch (err) {
      console.error("Error al exportar a Excel:", err)
      alert("Ocurrió un error al generar el archivo Excel. Por favor intenta de nuevo.")
    } finally {
      setIsExporting(false)
    }
  }

  // Ejecutar exportación alternativa a CSV estructurado (BOM UTF-8 y delimitador ;)
  const handleExecuteCSVExport = (recordsToExport: RegistrationRecord[]) => {
    if (recordsToExport.length === 0) return
    const dateStr = new Date().toISOString().slice(0, 10)
    exportRegistrationsToCSV({
      records: recordsToExport,
      filename: `inscripciones_caminata_5k_dream_home_${dateStr}.csv`,
    })
    setExportModalOpen(false)
  }

  // Acción al hacer clic en el botón principal de Exportar Excel
  const handleTriggerExport = () => {
    if (records.length === 0) return

    // Si el administrador tiene filtros o búsquedas aplicadas, abrir modal para darle la opción
    if (activeFilterDescription) {
      setExportModalOpen(true)
    } else {
      // Si no hay ningún filtro, exportar inmediatamente el padrón completo
      handleExecuteExcelExport(records, "Padrón Completo")
    }
  }

  // Filtrado y ordenamiento de registros
  const filteredAndSortedRecords = useMemo(() => {
    let result = records.filter((r) => {
      const q = searchQuery.toLowerCase().trim()
      const bibFormatted = r.bib_number ? formatBibNumber(r.bib_number) : ""
      const matchesSearch =
        !q ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.cedula.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.payment_reference || "").toLowerCase().includes(q) ||
        String(r.bib_number || "").includes(q) ||
        bibFormatted.includes(q)

      const matchesStatus = statusFilter === "all" || r.status === statusFilter
      const matchesKit = kitFilter === "all" || r.kit_type === kitFilter

      return matchesSearch && matchesStatus && matchesKit
    })

    result = [...result].sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      }
      if (sortBy === "date_asc") {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      }
      if (sortBy === "name") {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      }
      if (sortBy === "bib") {
        return (a.bib_number || 999999) - (b.bib_number || 999999)
      }
      return 0
    })

    return result
  }, [records, searchQuery, statusFilter, kitFilter, sortBy])

  // Métricas rápidas
  const stats = useMemo(() => {
    const total = records.length
    const pending = records.filter((r) => r.status === "pending").length
    const approved = records.filter((r) => r.status === "approved").length
    const rejected = records.filter((r) => r.status === "rejected").length

    const basicoCount = records.filter((r) => r.kit_type === "basico").length
    const premiumCount = records.filter((r) => r.kit_type === "premium").length

    // Recaudación de los aprobados
    const estimatedRaised = records
      .filter((r) => r.status === "approved")
      .reduce((acc, r) => acc + (r.payment_amount || (r.kit_type === "premium" ? 15 : 10)), 0)

    return { total, pending, approved, rejected, basicoCount, premiumCount, estimatedRaised }
  }, [records])

  // Formatear WhatsApp
  const formatWhatsAppLink = (phone: string, text?: string) => {
    const cleaned = phone.replace(/\D/g, "")
    const intlNumber = cleaned.startsWith("0") ? `58${cleaned.slice(1)}` : cleaned.startsWith("58") ? cleaned : `58${cleaned}`
    const defaultMsg = "Hola! Te escribimos de Inmobiliaria Dream Home respecto a tu inscripción en la Caminata 5K 'Camina y Renace'."
    return `https://wa.me/${intlNumber}?text=${encodeURIComponent(text || defaultMsg)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F8] via-white to-[#FDF0F6] text-[#121316] font-sans pb-16">
      {/* Barra superior de navegación del Admin */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F8BFDC] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-[#F8BFDC] hover:border-[#EF007E] text-[#121316] hover:bg-[#FDF0F6] gap-1.5 font-bold h-9 px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a la Landing</span>
            </Button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#F4D7DE]">
              <img
                src="/logo-dream-home.png"
                alt="Dream Home Logo"
                className="h-8 w-8 rounded-full object-contain border border-[#AEEAF7]"
              />
              <div>
                <h1 className="font-sport uppercase text-lg sm:text-xl font-black text-[#121316] leading-none">
                  PANEL ADMINISTRATIVO 5K
                </h1>
                <span className="text-[10px] uppercase font-bold text-[#EF007E] tracking-wider">
                  Inmobiliaria Dream Home • Mes Rosa 2026
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSupabaseConfigured ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Database className="h-3.5 w-3.5" />
                <span>Supabase Conectado</span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
                title="Para conectar Supabase en vivo, añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env"
              >
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>Modo Local / Demo</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleFetchRecords}
              disabled={loading}
              className="border-[#AEEAF7] hover:bg-[#E8FAFD] text-[#0E8EA8] h-9 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refrescar</span>
            </Button>

            {/* Botón Profesional de Exportación a Excel */}
            <div className="inline-flex items-center rounded-xl shadow-md shadow-[#EF007E]/20 overflow-hidden">
              <Button
                variant="default"
                size="sm"
                onClick={handleTriggerExport}
                disabled={records.length === 0 || isExporting}
                className="bg-[#EF007E] hover:bg-[#C9006A] text-white h-9 px-3 gap-1.5 font-bold rounded-r-none border-r border-[#C9006A] transition-all cursor-pointer disabled:opacity-60"
                title="Exportar a Microsoft Excel (.xlsx) con diseño corporativo y casillas estructuradas"
              >
                {isExporting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isExporting ? "Generando..." : "Exportar Excel"}
                </span>
                <span className="sm:hidden">Excel</span>
                {activeFilterDescription && (
                  <span
                    className="ml-0.5 px-1.5 py-0.5 text-[10px] bg-white/20 rounded font-black tracking-tight"
                    title={`Filtros aplicados: ${activeFilterDescription}`}
                  >
                    {filteredAndSortedRecords.length}
                  </span>
                )}
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => setExportModalOpen(true)}
                disabled={records.length === 0 || isExporting}
                className="bg-[#EF007E] hover:bg-[#C9006A] text-white h-9 px-2 rounded-l-none font-bold transition-all cursor-pointer disabled:opacity-60"
                title="Opciones de exportación (filtrados, total o CSV)"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Banner informativo de configuración si está en modo demo */}
        {!isSupabaseConfigured && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Actualmente en modo de almacenamiento local:</strong>
                <p className="text-amber-800/90 mt-0.5 leading-relaxed">
                  Para guardar y sincronizar los datos en tiempo real con Supabase en la nube, coloca tus credenciales en el archivo{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-amber-200">.env</code>.
                </p>
              </div>
            </div>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-amber-900 underline hover:text-amber-950 whitespace-nowrap"
            >
              Panel Supabase <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {/* Tarjetas KPI de resumen */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-white border border-[#F8BFDC] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#525866]">
                Total Inscritos
              </span>
              <div className="h-7 w-7 rounded-lg bg-[#FDF0F6] text-[#EF007E] flex items-center justify-center">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-sport text-3xl sm:text-4xl font-black text-[#121316]">
                {stats.total}
              </span>
              <span className="text-[11px] text-[#6B7280] block mt-0.5">
                {stats.basicoCount} Básicos • {stats.premiumCount} Premium
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-amber-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Por Validar
              </span>
              <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-sport text-3xl sm:text-4xl font-black text-amber-700">
                {stats.pending}
              </span>
              <span className="text-[11px] text-amber-800/80 block mt-0.5">Comprobantes pendientes</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-emerald-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Aprobados
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-sport text-3xl sm:text-4xl font-black text-emerald-700">
                {stats.approved}
              </span>
              <span className="text-[11px] text-emerald-800/80 block mt-0.5">
                Dorsales asignados ({stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%)
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-rose-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                Rechazados
              </span>
              <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-sport text-3xl sm:text-4xl font-black text-rose-700">
                {stats.rejected}
              </span>
              <span className="text-[11px] text-rose-800/80 block mt-0.5">Pagos no conformes</span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 rounded-2xl bg-gradient-to-br from-[#E8FAFD] via-white to-[#FDF0F6] border border-[#AEEAF7] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E8EA8]">
                Recaudación Validada
              </span>
              <div className="h-7 w-7 rounded-lg bg-[#E8FAFD] text-[#2FC7EA] font-black flex items-center justify-center text-xs">
                $
              </div>
            </div>
            <div className="mt-3">
              <span className="font-sport text-3xl sm:text-4xl font-black text-[#0E8EA8]">
                ${stats.estimatedRaised}
              </span>
              <span className="text-[11px] text-[#525866] block mt-0.5">Total recaudado</span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros, Buscador y Orden */}
        <div className="bg-white rounded-3xl border border-[#F8BFDC] p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Buscador en tiempo real */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Buscar por cédula, nombre, teléfono, ref. bancaria o dorsal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F8] border border-[#F8BFDC]/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EF007E]/30 focus:border-[#EF007E] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-[#9CA3AF] hover:text-[#121316] p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#525866] font-medium hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-[#FAF7F8] border border-[#AEEAF7] rounded-xl text-xs font-semibold text-[#121316] focus:outline-none focus:border-[#2FC7EA]"
              >
                <option value="date_desc">Más recientes primero</option>
                <option value="date_asc">Más antiguos primero</option>
                <option value="name">Por nombre (A-Z)</option>
                <option value="bib">Por dorsal (Orden de aprobación)</option>
              </select>
            </div>
          </div>

          {/* Filtros por pestaña de estado y kits */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F4D7DE]">
            {/* Filtro Estado */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === "all"
                    ? "bg-[#121316] text-white shadow-sm"
                    : "bg-[#FAF7F8] text-[#525866] hover:bg-[#FDF0F6] border border-[#F4D7DE]"
                }`}
              >
                Todos ({records.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  statusFilter === "pending"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Clock className="h-3 w-3" />
                Pendientes ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  statusFilter === "approved"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <CheckCircle className="h-3 w-3" />
                Aprobados ({stats.approved})
              </button>
              <button
                onClick={() => setStatusFilter("rejected")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  statusFilter === "rejected"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <XCircle className="h-3 w-3" />
                Rechazados ({stats.rejected})
              </button>
            </div>

            {/* Filtro Modalidad Kit */}
            <div className="flex items-center gap-1.5 py-1">
              <span className="text-[11px] font-bold text-[#6B7280]">Kit:</span>
              <button
                onClick={() => setKitFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  kitFilter === "all" ? "bg-[#2FC7EA] text-[#072430]" : "text-[#525866] hover:bg-[#E8FAFD]"
                }`}
              >
                Ambos
              </button>
              <button
                onClick={() => setKitFilter("basico")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  kitFilter === "basico" ? "bg-[#2FC7EA] text-[#072430]" : "text-[#525866] hover:bg-[#E8FAFD]"
                }`}
              >
                Básico ($10)
              </button>
              <button
                onClick={() => setKitFilter("premium")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  kitFilter === "premium" ? "bg-[#EF007E] text-white" : "text-[#525866] hover:bg-[#FDF0F6]"
                }`}
              >
                Premium ($15)
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Participantes */}
        <div className="bg-white rounded-3xl border border-[#F8BFDC] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gradient-to-r from-[#FAF7F8] to-[#FDF0F6] border-b border-[#F8BFDC] text-[#525866] font-bold uppercase text-[10px] tracking-wider select-none">
                <tr>
                  <th className="p-4">Dorsal</th>
                  <th className="p-4">Participante</th>
                  <th className="p-4">Cédula</th>
                  <th className="p-4">Modalidad Kit</th>
                  <th className="p-4">Ref. Bancaria & Tel.</th>
                  <th className="p-4">Comprobante</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4D7DE]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-[#6B7280]">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#EF007E] mb-2" />
                      <span>Cargando participantes...</span>
                    </td>
                  </tr>
                ) : filteredAndSortedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <AlertCircle className="h-8 w-8 text-[#9CA3AF] mx-auto" />
                        <h4 className="font-bold text-[#121316]">No se encontraron participantes</h4>
                        <p className="text-xs text-[#6B7280]">
                          {searchQuery
                            ? "No hay coincidencias con los términos de búsqueda aplicados."
                            : "Aún no se han registrado inscripciones con este filtro."}
                        </p>
                        {searchQuery && (
                          <Button size="sm" variant="outline" onClick={() => setSearchQuery("")} className="mt-2 text-xs">
                            Limpiar búsqueda
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedRecords.map((record) => {
                    const isCopied = copiedId === record.id
                    const isRefCopied = copiedId === `ref-${record.id}`

                    return (
                      <tr key={record.id || record.cedula} className="hover:bg-[#FAF7F8]/80 transition-colors">
                        {/* Dorsal */}
                        <td className="p-4 whitespace-nowrap">
                          {record.bib_number ? (
                            <span className="inline-flex items-center justify-center font-sport font-black text-sm px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#2FC7EA] to-[#0E8EA8] text-white shadow-sm shadow-[#2FC7EA]/20">
                              #{formatBibNumber(record.bib_number)}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#9CA3AF] italic">Sin dorsal</span>
                          )}
                        </td>

                        {/* Participante */}
                        <td className="p-4">
                          <strong className="block text-sm font-bold text-[#121316]">
                            {record.first_name} {record.last_name}
                          </strong>
                          <span className="text-[11px] text-[#525866] block">{record.email}</span>
                          {record.birth_date && (
                            <span className="text-[10px] text-[#9CA3AF] block mt-0.5">
                              Nac: {record.birth_date}
                            </span>
                          )}
                        </td>

                        {/* Cédula */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#121316]">
                            <span>{record.cedula}</span>
                            <button
                              onClick={() => handleCopyText(record.cedula, record.id || record.cedula)}
                              title="Copiar cédula"
                              className="text-[#9CA3AF] hover:text-[#EF007E] transition-colors p-1"
                            >
                              {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Modalidad Kit */}
                        <td className="p-4 whitespace-nowrap">
                          {record.kit_type === "premium" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDF0F6] text-[#EF007E] border border-[#F8BFDC]">
                              <Sparkles className="h-3 w-3" /> Kit Premium ($15)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAFD] text-[#0E8EA8] border border-[#AEEAF7]">
                              Kit Básico ($10)
                            </span>
                          )}
                        </td>

                        {/* Ref. Bancaria & Teléfono */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {record.payment_reference ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-xs text-[#121316] bg-[#FAF7F8] px-2 py-0.5 rounded border border-[#F4D7DE]">
                                  Ref: {record.payment_reference}
                                </span>
                                <button
                                  onClick={() => handleCopyText(record.payment_reference, `ref-${record.id}`)}
                                  title="Copiar número de referencia"
                                  className="text-[#9CA3AF] hover:text-[#0E8EA8] p-1"
                                >
                                  {isRefCopied ? (
                                    <Check className="h-3 w-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#9CA3AF] italic">Sin referencia</span>
                            )}

                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-[#525866]">{record.phone}</span>
                              {record.phone && (
                                <a
                                  href={formatWhatsAppLink(record.phone)}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Escribir por WhatsApp"
                                  className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Comprobante de Pago */}
                        <td className="p-4 whitespace-nowrap">
                          {record.payment_proof_url ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenInspect(record)}
                                className="h-9 w-9 rounded-xl border border-[#AEEAF7] overflow-hidden bg-[#FAF7F8] shrink-0 hover:scale-105 transition-transform cursor-pointer relative group"
                                title="Ver comprobante en grande"
                              >
                                <img
                                  src={record.payment_proof_url}
                                  alt="Miniatura comprobante"
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                  <Eye className="h-3.5 w-3.5" />
                                </div>
                              </button>
                              <button
                                onClick={() => handleOpenInspect(record)}
                                className="text-xs font-bold text-[#0E8EA8] hover:text-[#2FC7EA] hover:underline cursor-pointer"
                              >
                                Revisar Recibo
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-600 font-bold">Sin comprobante</span>
                          )}
                        </td>

                        {/* Estado */}
                        <td className="p-4 whitespace-nowrap">
                          {record.status === "approved" && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-xs">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Aprobado
                            </span>
                          )}
                          {record.status === "pending" && (
                            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-xs">
                              <Clock className="h-3.5 w-3.5 text-amber-600" /> Pendiente
                            </span>
                          )}
                          {record.status === "rejected" && (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-bold text-xs">
                              <XCircle className="h-3.5 w-3.5 text-rose-600" /> Rechazado
                            </span>
                          )}
                        </td>

                        {/* Botones de acción rápida */}
                        <td className="p-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {record.status !== "approved" && (
                              <button
                                onClick={() => handleStatusChange(record, "approved")}
                                title={`Aprobar pago y asignar siguiente dorsal (#${formatBibNumber(record.bib_number ?? nextAvailableBib)})`}
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors cursor-pointer"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}

                            {record.status !== "rejected" && (
                              <button
                                onClick={() => handleStatusChange(record, "rejected")}
                                title="Marcar como rechazado"
                                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenInspect(record)}
                              title="Ver detalles completos e inspeccionar comprobante"
                              className="p-2 rounded-xl bg-[#E8FAFD] text-[#0E8EA8] hover:bg-[#2FC7EA] hover:text-white border border-[#AEEAF7] transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {record.status === "approved" && record.bib_number && (
                              <button
                                onClick={() => handleDownloadRecordPdf(record, record.bib_number!)}
                                title={`Descargar Comprobante PDF Oficial (Dorsal #${formatBibNumber(record.bib_number)})`}
                                className="p-2 rounded-xl bg-[#FDF0F6] text-[#EF007E] hover:bg-[#EF007E] hover:text-white border border-[#F8BFDC] transition-colors cursor-pointer"
                              >
                                <FileDown className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEdit(record)}
                              title="Editar información de la inscripción"
                              className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleOpenDelete(record)}
                              title="Eliminar petición de inscripción"
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: INSPECCIÓN Y VALIDACIÓN DEL COMPROBANTE */}
      {/* ============================================================== */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F8BFDC] overflow-hidden">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between p-5 border-b border-[#F4D7DE] bg-gradient-to-r from-white via-[#FAF7F8] to-[#FDF0F6]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#FDF0F6] border border-[#F8BFDC] flex items-center justify-center text-[#EF007E] font-sport text-lg font-black">
                  5K
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#121316]">
                    Validación de Comprobante: {inspectRecord.first_name} {inspectRecord.last_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#525866]">
                    <span>Cédula: {inspectRecord.cedula}</span>
                    <span>•</span>
                    <span className="font-bold text-[#EF007E]">
                      {inspectRecord.kit_type === "premium"
                        ? "Kit Premium ($15)"
                        : "Kit Básico ($10)"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseInspect}
                className="h-8 w-8 rounded-full bg-[#FAF7F8] hover:bg-[#FDF0F6] text-[#6B7280] hover:text-[#121316] flex items-center justify-center transition-colors font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del modal (2 Columnas) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
              {/* Columna Izquierda: Visor del Comprobante (Span 7) */}
              <div className="md:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#525866] uppercase tracking-wider">
                    Capture / Transferencia
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.25))}
                      title="Alejar"
                      className="p-1.5 rounded-lg bg-[#FAF7F8] hover:bg-[#E8FAFD] text-[#525866] border text-xs"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[11px] font-mono px-1 font-bold text-[#6B7280]">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                      title="Acercar"
                      className="p-1.5 rounded-lg bg-[#FAF7F8] hover:bg-[#E8FAFD] text-[#525866] border text-xs"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setRotationAngle((r) => (r + 90) % 360)}
                      title="Girar 90 grados"
                      className="p-1.5 rounded-lg bg-[#FAF7F8] hover:bg-[#E8FAFD] text-[#525866] border text-xs"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={inspectRecord.payment_proof_url}
                      target="_blank"
                      rel="noreferrer"
                      title="Abrir imagen original completa"
                      className="p-1.5 rounded-lg bg-[#FAF7F8] hover:bg-[#E8FAFD] text-[#0E8EA8] border text-xs flex items-center gap-1 font-bold"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex-1 min-h-[340px] max-h-[500px] rounded-2xl border-2 border-dashed border-[#F8BFDC] bg-[#FAF7F8] p-2 flex items-center justify-center overflow-hidden relative">
                  {inspectRecord.payment_proof_url ? (
                    <img
                      src={inspectRecord.payment_proof_url}
                      alt="Comprobante de pago"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
                        transition: "transform 0.2s ease-out",
                      }}
                      className="max-h-[460px] max-w-full object-contain rounded-lg drop-shadow-sm select-none"
                    />
                  ) : (
                    <div className="text-center p-6 text-rose-600 space-y-2">
                      <AlertCircle className="h-8 w-8 mx-auto" />
                      <p className="font-bold text-xs">No se subió archivo de comprobante.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Datos y Validación (Span 5) */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Resumen del Kit & Referencia Bancaria */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#E8FAFD]/50 to-[#FDF0F6]/50 border border-[#AEEAF7] p-4 text-xs space-y-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#0E8EA8] block">
                      Detalles de la Inscripción
                    </span>

                    <div className="flex justify-between border-b border-[#F4D7DE] pb-1.5">
                      <span className="text-[#6B7280]">Kit Registrado:</span>
                      <strong className="text-[#EF007E] font-bold">
                        {inspectRecord.kit_type === "premium" ? "Kit Premium ($15)" : "Kit Básico ($10)"}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-[#F4D7DE] pb-1.5">
                      <span className="text-[#6B7280]">Ref. Bancaria:</span>
                      <strong className="text-[#121316] font-mono font-bold">
                        {inspectRecord.payment_reference || "No indicada"}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Monto a Verificar:</span>
                      <strong className="text-[#0E8EA8] font-bold">
                        ${inspectRecord.payment_amount || (inspectRecord.kit_type === "premium" ? 15 : 10)} (Tasa BCV)
                      </strong>
                    </div>
                  </div>

                  {/* Ficha del Participante */}
                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F4D7DE] p-4 text-xs space-y-2">
                    <div>
                      <span className="text-[#6B7280]">Nombre Completo:</span>
                      <strong className="block text-[#121316] font-bold">
                        {inspectRecord.first_name} {inspectRecord.last_name}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Teléfono:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <strong className="text-[#121316] font-bold">{inspectRecord.phone}</strong>
                        {inspectRecord.phone && (
                          <a
                            href={formatWhatsAppLink(inspectRecord.phone)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline"
                          >
                            <Phone className="h-3 w-3" /> WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Contacto de Emergencia:</span>
                      <strong className="block text-[#121316]">
                        {inspectRecord.emergency_contact_name} ({inspectRecord.emergency_contact_phone})
                      </strong>
                    </div>
                  </div>

                  {/* Asignación de Dorsal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#121316] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Hash className="h-3.5 w-3.5 text-[#2FC7EA]" />
                        Número Dorsal (Orden de Aprobación):
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Siguiente disponible: #{formatBibNumber(nextAvailableBib)}
                      </span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customBib}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "")
                        setCustomBib(val)
                      }}
                      placeholder={`Ej. ${formatBibNumber(nextAvailableBib)}`}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#AEEAF7] rounded-xl font-sport font-black text-lg text-[#0E8EA8] focus:outline-none focus:border-[#2FC7EA]"
                    />
                  </div>

                  {/* Notas internas del Administrador */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#121316]">
                      Notas / Observaciones (Opcional):
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Ej. Ref 489201 confirmada en cuenta Banesco."
                      className="w-full px-3 py-2 text-xs bg-white border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>
                </div>

                {/* Botones de acción del Modal */}
                <div className="pt-3 border-t border-[#F4D7DE] space-y-2">
                  {inspectRecord.status === "approved" && inspectRecord.bib_number && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleDownloadRecordPdf(inspectRecord, inspectRecord.bib_number!)}
                      disabled={isPdfLoading}
                      className="w-full border-[#F8BFDC] hover:bg-[#FDF0F6] text-[#EF007E] font-bold text-xs py-2.5 rounded-xl gap-2 cursor-pointer shadow-sm"
                    >
                      {isPdfLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4" />
                      )}
                      <span>Descargar Comprobante PDF (Dorsal #{formatBibNumber(inspectRecord.bib_number)})</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      const bibNum = customBib
                        ? parseInt(customBib, 10)
                        : (inspectRecord.bib_number ?? nextAvailableBib)
                      handleStatusChange(inspectRecord, "approved", bibNum, adminNotes)
                    }}
                    disabled={actionLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      Aprobar Pago y Asignar Dorsal #{formatBibNumber(customBib || inspectRecord.bib_number || nextAvailableBib)}
                    </span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(inspectRecord, "rejected", null, adminNotes)}
                      disabled={actionLoading}
                      className="border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs py-2.5 rounded-xl gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Rechazar Pago</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(inspectRecord, "pending", null, adminNotes)}
                      disabled={actionLoading}
                      className="border-amber-300 hover:bg-amber-50 text-amber-800 font-bold text-xs py-2.5 rounded-xl gap-1.5"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Dejar Pendiente</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: PARTICIPANTE CONFIRMADO & NOTIFICACIÓN DORSAL */}
      {/* ============================================================== */}
      {confirmedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border-2 border-emerald-300 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Fondo de brillo decorativo */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#E8FAFD] rounded-full blur-2xl pointer-events-none" />

            {/* Icono de verificación */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
              <CheckCircle className="h-9 w-9 stroke-[2.5]" />
            </div>

            <span className="text-[11px] uppercase tracking-widest font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pago Verificado
            </span>

            <h3 className="font-sport uppercase text-3xl font-black text-[#121316] mt-2 leading-none">
              ¡PARTICIPANTE CONFIRMADO!
            </h3>

            <p className="text-xs text-[#525866] mt-1.5">
              Se ha validado la inscripción de{" "}
              <strong className="text-[#121316] font-bold">
                {confirmedData.record.first_name} {confirmedData.record.last_name}
              </strong>{" "}
              ({confirmedData.record.cedula}).
            </p>

            {/* Tarjeta con el Número de Participante / Dorsal Oficial */}
            <div className="my-5 rounded-2xl bg-gradient-to-br from-[#E8FAFD] via-white to-[#FDF0F6] border-2 border-[#2FC7EA] p-5 shadow-sm">
              <span className="text-xs font-black uppercase tracking-wider text-[#0E8EA8] block">
                Número Oficial de Participante
              </span>
              <div className="font-sport text-5xl sm:text-6xl font-black text-[#EF007E] leading-none mt-1">
                #{formatBibNumber(confirmedData.bib)}
              </div>
              <span className="text-xs font-bold text-[#121316] block mt-1.5">
                {confirmedData.record.kit_type === "premium"
                  ? "Kit Premium ($15)"
                  : "Kit Básico ($10)"}
              </span>
              <span className="text-[11px] text-[#525866] font-medium block mt-0.5">
                Caminata 5K • Sábado 31 de Octubre • Inicio 7:00 AM • Salida 8:00 AM • Cierre 12:00 M
              </span>
            </div>

            {/* Mensajes de estado / Feedback de generación de PDF */}
            {pdfSuccessMessage && (
              <div className="my-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold flex items-center gap-2 text-left animate-in fade-in-0">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="flex-1 leading-snug">{pdfSuccessMessage}</span>
              </div>
            )}

            {/* Guía de instrucciones para adjuntar en WhatsApp Web / Desktop */}
            {whatsAppGuideActive && (
              <div className="my-3 rounded-2xl bg-[#E8FAFD] border border-[#AEEAF7] p-3.5 text-xs text-[#072430] text-left space-y-1.5 animate-in fade-in-0 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-[#0E8EA8]">
                  <Paperclip className="h-4 w-4 shrink-0" />
                  <span>Comprobante descargado listo para adjuntar:</span>
                </div>
                <p className="text-[11px] text-[#525866] leading-relaxed">
                  1. El chat de WhatsApp ya está abierto en otra pestaña con el mensaje oficial redactado.<br />
                  2. El archivo PDF oficial se descargó en tu equipo.<br />
                  3. En el chat de WhatsApp del participante, haz clic en el icono de <strong>clip (📎 Documento)</strong> y selecciona el archivo PDF para enviárselo.
                </p>
              </div>
            )}

            {/* Acciones: Enviar por WhatsApp con PDF, Descargar PDF o Cerrar */}
            <div className="space-y-2.5 mt-4">
              {confirmedData.record.phone && (
                <button
                  type="button"
                  onClick={() => handleSendPdfWhatsApp(confirmedData.record, confirmedData.bib)}
                  disabled={isPdfLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isPdfLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Enviar PDF por WhatsApp al Participante</span>
                </button>
              )}

              <Button
                variant="outline"
                type="button"
                onClick={() => handleDownloadRecordPdf(confirmedData.record, confirmedData.bib)}
                disabled={isPdfLoading}
                className="w-full border-[#F8BFDC] hover:border-[#EF007E] hover:bg-[#FDF0F6] text-[#EF007E] text-xs font-bold py-2.5 rounded-xl gap-2 cursor-pointer shadow-sm disabled:opacity-70"
              >
                {isPdfLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                <span>Descargar Comprobante PDF Oficial</span>
              </Button>

              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setConfirmedData(null)
                  setPdfSuccessMessage(null)
                  setWhatsAppGuideActive(false)
                }}
                className="w-full text-[#6B7280] hover:text-[#121316] text-xs font-semibold py-2 rounded-xl cursor-pointer"
              >
                Cerrar Ventana
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: EDITAR INFORMACIÓN DE LA INSCRIPCIÓN */}
      {/* ============================================================== */}
      {editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F8BFDC] overflow-hidden">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between p-5 border-b border-[#F4D7DE] bg-gradient-to-r from-white via-[#FAF7F8] to-[#FDF0F6]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#121316]">
                    Editar Información del Participante
                  </h3>
                  <span className="text-xs text-[#525866]">
                    {editRecord.first_name} {editRecord.last_name} • {editRecord.cedula}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                className="h-8 w-8 rounded-full bg-[#FAF7F8] hover:bg-[#FDF0F6] text-[#6B7280] hover:text-[#121316] flex items-center justify-center transition-colors font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Formulario de edición */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Sección 1: Datos Personales */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E8EA8] mb-3 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Datos Personales</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.first_name || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, first_name: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.last_name || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, last_name: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Cédula de Identidad *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.cedula || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, cedula: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl font-mono focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="text"
                      value={editFormData.birth_date || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, birth_date: e.target.value }))
                      }
                      placeholder="YYYY-MM-DD o DD/MM/AAAA"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Teléfono Personal (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editFormData.phone || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={editFormData.email || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Contacto de Emergencia */}
              <div className="pt-2 border-t border-[#F4D7DE]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#EF007E] mb-3 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Contacto de Emergencia</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Nombre del Contacto
                    </label>
                    <input
                      type="text"
                      value={editFormData.emergency_contact_name || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          emergency_contact_name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Teléfono de Emergencia
                    </label>
                    <input
                      type="tel"
                      value={editFormData.emergency_contact_phone || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          emergency_contact_phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Modalidad de Kit y Pago */}
              <div className="pt-2 border-t border-[#F4D7DE]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E8EA8] mb-3 flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Modalidad de Kit y Pago</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Tipo de Kit *
                    </label>
                    <select
                      value={editFormData.kit_type || "basico"}
                      onChange={(e) => {
                        const newKit = e.target.value as "basico" | "premium"
                        setEditFormData((prev) => ({
                          ...prev,
                          kit_type: newKit,
                          payment_amount: newKit === "premium" ? 15 : 10,
                          shirt_size: null,
                        }))
                      }}
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#AEEAF7] rounded-xl font-bold focus:outline-none focus:border-[#2FC7EA]"
                    >
                      <option value="basico">Kit Básico ($10)</option>
                      <option value="premium">Kit Premium ($15)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Monto Registrado ($)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editFormData.payment_amount ?? 10}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          payment_amount: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#AEEAF7] rounded-xl font-bold focus:outline-none focus:border-[#2FC7EA]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Número de Referencia Bancaria
                    </label>
                    <input
                      type="text"
                      value={editFormData.payment_reference || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          payment_reference: e.target.value,
                        }))
                      }
                      placeholder="Ej. 489201"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl font-mono focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Estado y Dorsal */}
              <div className="pt-2 border-t border-[#F4D7DE]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#EF007E] mb-3 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  <span>Estado y Asignación de Dorsal</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Estado de la Inscripción *
                    </label>
                    <select
                      value={editFormData.status || "pending"}
                      onChange={(e) => {
                        const newStatus = e.target.value as "pending" | "approved" | "rejected"
                        setEditFormData((prev) => ({
                          ...prev,
                          status: newStatus,
                          bib_number:
                            newStatus === "approved"
                              ? prev.bib_number || nextAvailableBib
                              : null,
                        }))
                      }}
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl font-bold focus:outline-none focus:border-[#EF007E]"
                    >
                      <option value="pending">Pendiente (Por validar)</option>
                      <option value="approved">Aprobado (Validado)</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Número de Dorsal Oficial
                    </label>
                    <input
                      type="number"
                      value={editFormData.bib_number ?? ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          bib_number: e.target.value ? parseInt(e.target.value, 10) : null,
                        }))
                      }
                      placeholder="Ej. 1, 2, 10..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#AEEAF7] rounded-xl font-sport font-black text-sm text-[#0E8EA8] focus:outline-none focus:border-[#2FC7EA]"
                    />
                    <span className="text-[10px] text-[#6B7280]">
                      Se visualizará como #{formatBibNumber(editFormData.bib_number)}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#121316] block mb-1">
                      Notas / Observaciones Internas
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.notes || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      placeholder="Notas del administrador..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F8] border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-[#F4D7DE] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEdit}
                  disabled={isEditSaving}
                  className="text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={isEditSaving}
                  className="bg-[#EF007E] hover:bg-[#C9006A] text-white text-xs font-bold py-2.5 px-5 rounded-xl gap-1.5 shadow-md shadow-[#EF007E]/20 cursor-pointer disabled:opacity-70"
                >
                  {isEditSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Guardar Cambios</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: CONFIRMAR ELIMINACIÓN DE REGISTRO */}
      {/* ============================================================== */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-red-200 relative overflow-hidden animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 shadow-inner">
              <Trash2 className="h-7 w-7" />
            </div>

            <span className="text-[11px] uppercase tracking-widest font-black text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Confirmar Eliminación
            </span>

            <h3 className="font-sport uppercase text-2xl font-black text-[#121316] mt-2.5 leading-none">
              ¿ELIMINAR ESTA PETICIÓN?
            </h3>

            <p className="text-xs text-[#525866] mt-2 leading-relaxed">
              Estás a punto de eliminar permanentemente la petición de inscripción de{" "}
              <strong className="text-[#121316] font-bold">
                {recordToDelete.first_name} {recordToDelete.last_name}
              </strong>{" "}
              (Cédula: <strong>{recordToDelete.cedula}</strong>).
            </p>

            {recordToDelete.bib_number && (
              <div className="my-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                ⚠️ Este participante tenía asignado el dorsal{" "}
                <strong className="font-bold">#{formatBibNumber(recordToDelete.bib_number)}</strong>. Al eliminarlo, este dorsal quedará liberado.
              </div>
            )}

            <p className="text-[11px] text-red-600 font-bold mb-4">
              Esta acción no se puede deshacer.
            </p>

            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl gap-2 shadow-md shadow-red-600/20 cursor-pointer disabled:opacity-70"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Sí, Eliminar Permanentemente</span>
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={handleCloseDelete}
                disabled={isDeleting}
                className="w-full border-[#F4D7DE] hover:bg-[#FAF7F8] text-[#525866] text-xs font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: OPCIONES DE EXPORTACIÓN A EXCEL (.XLSX) / CSV */}
      {/* ============================================================== */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#F8BFDC] relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Brillo de fondo decorativo */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FDF0F6] rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#E8FAFD] rounded-full blur-2xl pointer-events-none" />

            {/* Cabecera del modal */}
            <div className="flex items-start justify-between pb-4 border-b border-[#F4D7DE]">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#FDF0F6] border border-[#F8BFDC] flex items-center justify-center text-[#EF007E] shrink-0 shadow-sm">
                  <FileSpreadsheet className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-sport uppercase text-2xl font-black text-[#121316] leading-none">
                    EXPORTAR A EXCEL (.XLSX)
                  </h3>
                  <p className="text-xs text-[#525866] mt-1">
                    Libro oficial con colores de marca, casillas estructuradas e hipervínculos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="h-8 w-8 rounded-full bg-[#FAF7F8] hover:bg-[#FDF0F6] text-[#6B7280] hover:text-[#121316] flex items-center justify-center transition-colors font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Lista de mejoras visuales incluidas */}
            <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-br from-[#FAF7F8] to-[#FDF0F6] border border-[#F8BFDC]/80 space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px] text-[#EF007E] block">
                Características del Diseño Generado:
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#525866]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF007E]" />
                  <span><strong>Formato Nativo .xlsx:</strong> Información dividida en columnas independientes y autoajustadas (sin apiñarse).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2FC7EA]" />
                  <span><strong>Colores de la Marca:</strong> Cabeceras en Fucsia Dream Home (#EF007E) y acentos en Celeste (#0E8EA8).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span><strong>Badges de Estado:</strong> Aprobados, Pendientes y Rechazados destacados con colores visuales.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                  <span><strong>Hipervínculos a Recibos:</strong> Enlaces directos para abrir los captures de pago en el navegador.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF007E]" />
                  <span><strong>Hoja 2 (Resumen Ejecutivo):</strong> Desglose por Kits (Básico / Premium) y métricas de recaudación.</span>
                </li>
              </ul>
            </div>

            {/* Aviso de filtro activo si corresponde */}
            {activeFilterDescription && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#E8FAFD] border border-[#AEEAF7] text-xs text-[#072430] flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-[#0E8EA8] shrink-0" />
                <span className="text-[11px] font-medium leading-snug">
                  Filtro activo en pantalla: <strong>{activeFilterDescription}</strong>
                </span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-2.5">
              {/* Opción 1: Exportar filtrados (si hay filtro activo) */}
              {activeFilterDescription && (
                <button
                  type="button"
                  onClick={() =>
                    handleExecuteExcelExport(
                      filteredAndSortedRecords,
                      activeFilterDescription
                    )
                  }
                  disabled={isExporting || filteredAndSortedRecords.length === 0}
                  className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-[#EF007E] to-[#C9006A] text-white hover:brightness-105 transition-all shadow-md shadow-[#EF007E]/25 cursor-pointer disabled:opacity-60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                      {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <Filter className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <strong className="block text-xs font-bold">
                        Exportar Vista Filtrada Actual
                      </strong>
                      <span className="text-[11px] text-white/80 block mt-0.5">
                        {filteredAndSortedRecords.length} participantes que coinciden con los filtros aplicados
                      </span>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-white shrink-0 ml-2" />
                </button>
              )}

              {/* Opción 2: Exportar Todo el Padrón */}
              <button
                type="button"
                onClick={() => handleExecuteExcelExport(records, "Padrón Completo")}
                disabled={isExporting || records.length === 0}
                className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-between ${
                  activeFilterDescription
                    ? "bg-[#FAF7F8] hover:bg-[#FDF0F6] border border-[#F8BFDC] text-[#121316]"
                    : "bg-gradient-to-r from-[#EF007E] to-[#C9006A] text-white shadow-md shadow-[#EF007E]/25 hover:brightness-105"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      activeFilterDescription
                        ? "bg-[#FDF0F6] text-[#EF007E]"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Layers className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <strong className="block text-xs font-bold">
                      Exportar Padrón Completo
                    </strong>
                    <span
                      className={`text-[11px] block mt-0.5 ${
                        activeFilterDescription ? "text-[#525866]" : "text-white/80"
                      }`}
                    >
                      Todos los {records.length} participantes registrados en el sistema
                    </span>
                  </div>
                </div>
                <Download
                  className={`h-4 w-4 shrink-0 ml-2 ${
                    activeFilterDescription ? "text-[#EF007E]" : "text-white"
                  }`}
                />
              </button>

              {/* Opción 3: Exportar CSV como alternativa */}
              <button
                type="button"
                onClick={() =>
                  handleExecuteCSVExport(
                    activeFilterDescription ? filteredAndSortedRecords : records
                  )
                }
                disabled={isExporting || records.length === 0}
                className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#FAF7F8] border border-[#F4D7DE] text-[#525866] transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#6B7280]" />
                  <span>
                    Descargar en formato alternativo <strong>CSV (.csv)</strong>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">
                  BOM UTF-8
                </span>
              </button>
            </div>

            {/* Botón Cerrar */}
            <div className="mt-4 pt-3 border-t border-[#F4D7DE]">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="w-full text-[#6B7280] hover:text-[#121316] text-xs font-semibold py-2 rounded-xl cursor-pointer"
              >
                Cerrar Ventana
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
