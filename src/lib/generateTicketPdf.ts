import { jsPDF } from "jspdf"
import { formatBibNumber, type RegistrationRecord } from "./supabase"

export interface TicketPdfOptions {
  record: RegistrationRecord
  bib: number | string
}

// Cargar imagen como DataURL de forma segura
const loadImageAsDataUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/**
 * Genera el documento PDF oficial del Comprobante de Inscripción y Dorsal
 */
export const buildTicketPdf = async ({ record, bib }: TicketPdfOptions): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4", // 210mm x 297mm
  })

  const formattedBib = formatBibNumber(bib)
  const isPremium = record.kit_type === "premium"

  // Intentar cargar logo y pañoleta desde /public
  const logoDataUrl = await loadImageAsDataUrl("/logo-dream-home.png")
  const ribbonDataUrl = await loadImageAsDataUrl("/paoleta-referencia.png")

  // --- FONDO Y MARCO PRINCIPAL ---
  // Fondo suave
  doc.setFillColor(250, 247, 248)
  doc.rect(0, 0, 210, 297, "F")

  // Marco exterior
  doc.setDrawColor(248, 191, 220)
  doc.setLineWidth(1)
  doc.roundedRect(12, 12, 186, 273, 5, 5, "S")

  // Barra superior decorativa (Gradiente simulado)
  doc.setFillColor(239, 0, 126) // Fucsia #EF007E
  doc.rect(12, 12, 186, 6, "F")
  doc.setFillColor(47, 199, 234) // Celeste #2FC7EA
  doc.rect(12, 18, 186, 2, "F")

  // --- CABECERA ---
  let headerY = 28

  // Si hay logo, colocarlo
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", 18, headerY, 22, 22)
    } catch {
      // Ignorar si falla
    }
  }

  // Títulos
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(18, 19, 22)
  doc.text("INMOBILIARIA DREAM HOME", 45, headerY + 6)

  doc.setFontSize(12)
  doc.setTextColor(239, 0, 126) // Fucsia
  doc.text("CAMINATA 5K «CAMINA Y RENACE CON DREAM HOME 2026»", 45, headerY + 12)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(82, 88, 102)
  doc.text("Campaña Oficial Mes Rosa • «Una Pañoleta con Propósito» • Fórum Charallave", 45, headerY + 17)

  // Línea divisoria
  doc.setDrawColor(244, 215, 222)
  doc.setLineWidth(0.5)
  doc.line(18, 55, 192, 55)

  // --- BANNER DE ESTADO: PAGO VERIFICADO ---
  doc.setFillColor(232, 250, 253) // #E8FAFD
  doc.roundedRect(18, 60, 174, 14, 3, 3, "F")
  doc.setDrawColor(174, 234, 247)
  doc.roundedRect(18, 60, 174, 14, 3, 3, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(14, 142, 168)
  doc.text("COMPROBANTE OFICIAL DE INSCRIPCION - PAGO VERIFICADO", 105, 69, { align: "center" })

  // --- TARJETA PRINCIPAL DEL DORSAL ---
  const bibBoxY = 80
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(18, bibBoxY, 174, 60, 4, 4, "F")
  doc.setDrawColor(47, 199, 234)
  doc.setLineWidth(1.2)
  doc.roundedRect(18, bibBoxY, 174, 60, 4, 4, "S")

  // Texto dorsal
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(14, 142, 168)
  doc.text("NUMERO OFICIAL DE PARTICIPANTE", 105, bibBoxY + 10, { align: "center" })

  // Número Gigante
  doc.setFontSize(44)
  doc.setTextColor(239, 0, 126) // Fucsia
  doc.text(`#${formattedBib}`, 105, bibBoxY + 28, { align: "center" })

  // Si hay ribbon / lazo rosa, agregarlo como sello decorativo
  if (ribbonDataUrl) {
    try {
      doc.addImage(ribbonDataUrl, "PNG", 160, bibBoxY + 6, 24, 24)
    } catch {
      // Ignorar si falla
    }
  }

  // Modalidad Kit destacada en el box
  doc.setFontSize(12)
  doc.setTextColor(18, 19, 22)
  const kitLabel = isPremium
    ? `KIT PREMIUM ($15)${record.shirt_size ? ` - TALLA ${record.shirt_size}` : ""}`
    : "KIT BASICO ($10)"
  doc.text(kitLabel, 105, bibBoxY + 40, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text("Presenta este comprobante al momento de retirar tu kit oficial", 105, bibBoxY + 49, {
    align: "center",
  })

  // --- DATOS DEL PARTICIPANTE Y PAGO (2 COLUMNAS) ---
  const dataY = 148

  // Columna Izquierda: Datos del Corredor
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(18, dataY, 84, 62, 3, 3, "F")
  doc.setDrawColor(244, 215, 222)
  doc.setLineWidth(0.5)
  doc.roundedRect(18, dataY, 84, 62, 3, 3, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9.5)
  doc.setTextColor(239, 0, 126)
  doc.text("DATOS DEL PARTICIPANTE", 24, dataY + 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(107, 114, 128)

  let rowY = dataY + 16
  const addDataRow = (x: number, y: number, label: string, val: string) => {
    doc.setFont("helvetica", "normal")
    doc.setTextColor(107, 114, 128)
    doc.text(label, x, y)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(18, 19, 22)
    doc.text(val, x, y + 4.5)
  }

  addDataRow(24, rowY, "Nombre Completo:", `${record.first_name} ${record.last_name}`)
  addDataRow(24, rowY + 11, "Cédula de Identidad:", record.cedula)
  addDataRow(24, rowY + 22, "Teléfono / WhatsApp:", record.phone)
  addDataRow(24, rowY + 33, "Contacto Emergencia:", `${record.emergency_contact_name} (${record.emergency_contact_phone})`)

  // Columna Derecha: Detalles del Evento y Validación
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(108, dataY, 84, 62, 3, 3, "F")
  doc.roundedRect(108, dataY, 84, 62, 3, 3, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9.5)
  doc.setTextColor(14, 142, 168)
  doc.text("DETALLES DE LA CONVOCATORIA", 114, dataY + 8)

  rowY = dataY + 16
  addDataRow(114, rowY, "Fecha del Evento:", "Sábado, 31 de Octubre de 2026")
  addDataRow(114, rowY + 11, "Hora de Concentración:", "7:00 AM (Salida oficial 7:30 AM)")
  addDataRow(114, rowY + 22, "Lugar de Encuentro:", "Fórum Charallave, Edo. Miranda")
  addDataRow(
    114,
    rowY + 33,
    "Referencia Bancaria:",
    record.payment_reference ? `${record.payment_reference} (Aprobada)` : "Confirmada"
  )

  // --- RESUMEN DE BENEFICIOS DEL KIT ---
  const kitInfoY = 216
  doc.setFillColor(253, 240, 246) // #FDF0F6
  doc.roundedRect(18, kitInfoY, 174, 28, 3, 3, "F")
  doc.setDrawColor(248, 191, 220)
  doc.roundedRect(18, kitInfoY, 174, 28, 3, 3, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(239, 0, 126)
  doc.text("ITEMS INCLUIDOS EN TU KIT:", 24, kitInfoY + 7)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(82, 88, 102)

  if (isPremium) {
    doc.text(
      `• Camisa Oficial Dry-Fit (Talla ${record.shirt_size || "Asignada"})   • Cooler Conmemorativo Dream Home\n• Pañoleta Oficial Mes Rosa   • Llavero Conmemorativo   • Dorsal Oficial Asignado (#${formattedBib})\n• 3 Puntos de Hidratación   • Certificado Digital   • Obsequios de Patrocinantes`,
      24,
      kitInfoY + 13
    )
  } else {
    doc.text(
      `• Pañoleta Oficial Mes Rosa   • Llavero Conmemorativo   • Dorsal Oficial Asignado (#${formattedBib})\n• 3 Puntos de Hidratación en Ruta   • Certificado Digital de Participación\n• Asistencia Médica en Ruta   • Obsequios de Patrocinantes y Bailoterapia`,
      24,
      kitInfoY + 13
    )
  }

  // --- PIE DE PÁGINA Y VALIDACIÓN ---
  const footerY = 250
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(18, 19, 22)
  doc.text("INSTRUCCIONES IMPORTANTES PARA EL DIA DEL EVENTO:", 18, footerY)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(107, 114, 128)
  doc.text(
    "1. Llega puntual con tu ropa deportiva, calzado adecuado y número dorsal visible fijado con imperdibles.\n2. La entrega de kits físicos se realizará en la sede de Inmobiliaria Dream Home Charallave durante la semana previa.\n3. Dudas o consultas: Contáctanos a través de nuestro WhatsApp oficial o vía Instagram @dreamhome.ve.",
    18,
    footerY + 5
  )

  // Barra inferior decorativa y fecha de emisión
  doc.setFillColor(239, 0, 126)
  doc.rect(12, 279, 186, 6, "F")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  const now = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" })
  doc.text(
    `Comprobante generado el ${now} • Inmobiliaria Dream Home Venezuela • RIF J-XXXXXXXX-X`,
    105,
    283,
    { align: "center" }
  )

  return doc
}

/**
 * Genera el Blob y File del PDF para compartir o descargar
 */
export const generateTicketPdfFile = async ({
  record,
  bib,
}: TicketPdfOptions): Promise<{ blob: Blob; file: File; filename: string }> => {
  const doc = await buildTicketPdf({ record, bib })
  const formattedBib = formatBibNumber(bib)
  const cleanName = `${record.first_name}_${record.last_name}`.replace(/\s+/g, "_")
  const filename = `Comprobante_Dorsal_${formattedBib}_${cleanName}.pdf`

  const blob = doc.output("blob")
  const file = new File([blob], filename, { type: "application/pdf" })

  return { blob, file, filename }
}

/**
 * Descarga directamente el PDF en el navegador del usuario
 */
export const downloadTicketPdf = async ({
  record,
  bib,
}: TicketPdfOptions): Promise<string> => {
  const { blob, filename } = await generateTicketPdfFile({ record, bib })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return filename
}
