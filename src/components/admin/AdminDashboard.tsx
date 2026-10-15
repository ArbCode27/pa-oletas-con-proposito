import { useEffect, useState, useMemo, useCallback } from "react"
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
} from "lucide-react"
import {
  getRegistrations,
  updateRegistrationStatus,
  isSupabaseConfigured,
  type RegistrationRecord,
} from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdminDashboardProps {
  onBack: () => void
}

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [records, setRecords] = useState<RegistrationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name" | "bib">("date_desc")

  // Modal para inspección de comprobante
  const [inspectRecord, setInspectRecord] = useState<RegistrationRecord | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [adminNotes, setAdminNotes] = useState("")
  const [customBib, setCustomBib] = useState<string>("")
  const [actionLoading, setActionLoading] = useState(false)

  // Feedback de copiado al portapapeles
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  // Próximo número de dorsal disponible (inicia en 101)
  const nextAvailableBib = useMemo(() => {
    const usedBibs = records
      .map((r) => r.bib_number)
      .filter((b): b is number => typeof b === "number" && !isNaN(b))

    if (usedBibs.length === 0) return 101
    return Math.max(...usedBibs) + 1
  }, [records])

  // Abrir modal de inspección
  const handleOpenInspect = (record: RegistrationRecord) => {
    setInspectRecord(record)
    setZoomLevel(1)
    setRotationAngle(0)
    setAdminNotes(record.notes || "")
    setCustomBib(record.bib_number ? String(record.bib_number) : String(nextAvailableBib))
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

  // Actualizar estado de registro
  const handleStatusChange = async (
    record: RegistrationRecord,
    newStatus: "approved" | "rejected" | "pending",
    assignedBib?: number | null,
    notesToSave?: string | null
  ) => {
    if (!record.id) return

    setActionLoading(true)
    const bib = newStatus === "approved" ? (assignedBib ?? nextAvailableBib) : null

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

    if (updated) {
      setRecords((prev) => prev.map((item) => (item.id === record.id ? updated : item)))
    } else {
      setRecords((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? { ...item, status: newStatus, bib_number: bib, notes: notesToSave ?? item.notes }
            : item
        )
      )
    }

    if (inspectRecord && inspectRecord.id === record.id) {
      handleCloseInspect()
    }
  }

  // Exportar lista a archivo CSV (Excel compatible)
  const handleExportCSV = () => {
    if (records.length === 0) return

    const headers = [
      "ID",
      "Fecha Registro",
      "Nombres",
      "Apellidos",
      "Cédula",
      "Fecha Nacimiento",
      "Teléfono",
      "Correo Electrónico",
      "Contacto Emergencia",
      "Tel. Emergencia",
      "Estado",
      "Dorsal Oficial",
      "Notas / Ref",
      "URL Comprobante",
    ]

    const rows = records.map((r) => [
      r.id || "",
      r.created_at ? new Date(r.created_at).toLocaleString("es-VE") : "",
      `"${r.first_name.replace(/"/g, '""')}"`,
      `"${r.last_name.replace(/"/g, '""')}"`,
      `"${r.cedula}"`,
      r.birth_date || "",
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.emergency_contact_name.replace(/"/g, '""')}"`,
      `"${r.emergency_contact_phone}"`,
      r.status || "pending",
      r.bib_number || "",
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      `"${r.payment_proof_url}"`,
    ])

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `inscripciones_caminata_5k_dream_home_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Filtrado y ordenamiento de registros
  const filteredAndSortedRecords = useMemo(() => {
    let result = records.filter((r) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.cedula.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        String(r.bib_number || "").includes(q)

      const matchesStatus = statusFilter === "all" || r.status === statusFilter

      return matchesSearch && matchesStatus
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
  }, [records, searchQuery, statusFilter, sortBy])

  // Métricas rápidas
  const stats = useMemo(() => {
    const total = records.length
    const pending = records.filter((r) => r.status === "pending").length
    const approved = records.filter((r) => r.status === "approved").length
    const rejected = records.filter((r) => r.status === "rejected").length
    const estimatedRaised = approved * 10

    return { total, pending, approved, rejected, estimatedRaised }
  }, [records])

  // Función para formatear teléfono a enlace WhatsApp
  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    // Si empieza con 0 (ej. 0424), cambiar por 58
    const intlNumber = cleaned.startsWith("0") ? `58${cleaned.slice(1)}` : cleaned.startsWith("58") ? cleaned : `58${cleaned}`
    return `https://wa.me/${intlNumber}?text=${encodeURIComponent(
      "Hola! Te escribimos de Inmobiliaria Dream Home respecto a tu inscripción en la Caminata 5K 'Camina y Renace'."
    )}`
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
            {/* Indicador de conexión Supabase */}
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

            <Button
              variant="default"
              size="sm"
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="bg-[#EF007E] hover:bg-[#C9006A] text-white h-9 gap-1.5 font-bold shadow-md shadow-[#EF007E]/20"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </Button>
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
                  Para guardar y sincronizar los datos en tiempo real con Supabase en la nube, crea un archivo{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-amber-200">.env</code> con{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-amber-200">VITE_SUPABASE_URL</code> y{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-amber-200">VITE_SUPABASE_ANON_KEY</code>.
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
              <span className="text-[11px] text-[#6B7280] block mt-0.5">Participantes en base</span>
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
                Recaudación Est.
              </span>
              <div className="h-7 w-7 rounded-lg bg-[#E8FAFD] text-[#2FC7EA] font-black flex items-center justify-center text-xs">
                $
              </div>
            </div>
            <div className="mt-3">
              <span className="font-sport text-3xl sm:text-4xl font-black text-[#0E8EA8]">
                ${stats.estimatedRaised}
              </span>
              <span className="text-[11px] text-[#525866] block mt-0.5">Ref. $10 por cupo válido</span>
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
                placeholder="Buscar por cédula, nombre, teléfono, correo o número dorsal..."
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
                <option value="bib">Por número dorsal</option>
              </select>
            </div>
          </div>

          {/* Filtros por pestaña de estado */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-[#121316] text-white shadow-sm"
                  : "bg-[#FAF7F8] text-[#525866] hover:bg-[#FDF0F6] border border-[#F4D7DE]"
              }`}
            >
              Todos ({records.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "rejected"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              <XCircle className="h-3 w-3" />
              Rechazados ({stats.rejected})
            </button>
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
                  <th className="p-4">Teléfono & Contacto</th>
                  <th className="p-4">Contacto Emergencia</th>
                  <th className="p-4">Comprobante Pago</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Validación</th>
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
                            : "Aún no se han registrado inscripciones en esta categoría."}
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

                    return (
                      <tr key={record.id || record.cedula} className="hover:bg-[#FAF7F8]/80 transition-colors">
                        {/* Dorsal */}
                        <td className="p-4 whitespace-nowrap">
                          {record.bib_number ? (
                            <span className="inline-flex items-center justify-center font-sport font-black text-sm px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#2FC7EA] to-[#0E8EA8] text-white shadow-sm shadow-[#2FC7EA]/20">
                              #{record.bib_number}
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

                        {/* Teléfono & WhatsApp */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#121316]">{record.phone}</span>
                            {record.phone && (
                              <a
                                href={formatWhatsAppLink(record.phone)}
                                target="_blank"
                                rel="noreferrer"
                                title="Escribir por WhatsApp"
                                className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Contacto Emergencia */}
                        <td className="p-4">
                          <span className="block font-medium text-xs text-[#121316]">
                            {record.emergency_contact_name || "—"}
                          </span>
                          <span className="text-[11px] text-[#6B7280] block">
                            {record.emergency_contact_phone || ""}
                          </span>
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
                                title="Aprobar pago y asignar siguiente dorsal"
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

      {/* Modal Completo de Inspección del Comprobante */}
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
                    <span>Tel: {inspectRecord.phone}</span>
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

            {/* Cuerpo del modal (2 Columnas: Comprobante a la izquierda, Controles a la derecha) */}
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

              {/* Columna Derecha: Datos del Participante y Validación (Span 5) */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#FAF7F8] border border-[#F4D7DE] p-4 text-xs space-y-2.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#0E8EA8] block">
                      Datos de la Ficha
                    </span>
                    <div>
                      <span className="text-[#6B7280]">Nombre Completo:</span>
                      <strong className="block text-[#121316] font-bold">
                        {inspectRecord.first_name} {inspectRecord.last_name}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Cédula:</span>
                      <strong className="block text-[#121316] font-mono font-bold">
                        {inspectRecord.cedula}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Teléfono Participante:</span>
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
                        Número Dorsal Asignado:
                      </span>
                      <span className="text-[11px] text-[#6B7280]">Sugerido: #{nextAvailableBib}</span>
                    </label>
                    <input
                      type="number"
                      value={customBib}
                      onChange={(e) => setCustomBib(e.target.value)}
                      placeholder="Ej. 101"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#AEEAF7] rounded-xl font-sport font-black text-lg text-[#0E8EA8] focus:outline-none focus:border-[#2FC7EA]"
                    />
                  </div>

                  {/* Notas internas del Administrador */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#121316]">
                      Notas / Referencia Bancaria (Opcional):
                    </label>
                    <textarea
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Ej. Ref Banesco 489201 por Bs. 850 validada con cuenta master."
                      className="w-full px-3 py-2 text-xs bg-white border border-[#F8BFDC] rounded-xl focus:outline-none focus:border-[#EF007E]"
                    />
                  </div>
                </div>

                {/* Botones de acción del Modal */}
                <div className="pt-3 border-t border-[#F4D7DE] space-y-2">
                  <Button
                    onClick={() => {
                      const bibNum = customBib ? parseInt(customBib, 10) : nextAvailableBib
                      handleStatusChange(inspectRecord, "approved", bibNum, adminNotes)
                    }}
                    disabled={actionLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Aprobar Pago y Asignar Dorsal #{customBib || nextAvailableBib}</span>
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
    </div>
  )
}
