import ExcelJS from "exceljs"
import { formatBibNumber, type RegistrationRecord } from "./supabase"

export interface ExportExcelOptions {
  records: RegistrationRecord[]
  filename?: string
  filterDescription?: string
}

/**
 * Paleta de colores oficiales de la marca (formato ARGB para ExcelJS)
 */
const BRAND_COLORS = {
  // Fucsia Principal
  fuchsiaPrimary: "FFEF007E",
  fuchsiaHover: "FFC9006A",
  fuchsiaTint: "FFFDF0F6",
  fuchsiaBorder: "FFF8BFDC",
  fuchsiaText: "FFC9006A",

  // Celeste Secundario
  celestePrimary: "FF2FC7EA",
  celesteDeep: "FF0E8EA8",
  celesteTint: "FFE8FAFD",
  celesteBorder: "FFAEEAF7",

  // Neutros
  carbon: "FF121316",
  carbonLight: "FF23272F",
  grayText: "FF525866",
  grayLight: "FF6B7280",
  white: "FFFFFFFF",
  cardBg: "FFFAF7F8",
  borderLight: "FFF4D7DE",
  borderGrid: "FFE5E7EB",

  // Estados
  approvedBg: "FFD1FAE5",
  approvedText: "FF065F46",
  pendingBg: "FFFEF3C7",
  pendingText: "FF92400E",
  rejectedBg: "FFFEE2E2",
  rejectedText: "FF991B1B",
}

/**
 * Genera y descarga un archivo Excel (.xlsx) con diseño profesional,
 * casillas estructuradas, formatos adecuados e identidad visual de la marca.
 */
export const exportRegistrationsToExcel = async ({
  records,
  filename,
  filterDescription,
}: ExportExcelOptions): Promise<void> => {
  if (records.length === 0) {
    alert("No hay registros disponibles para exportar.")
    return
  }

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Inmobiliaria Dream Home"
  workbook.lastModifiedBy = "Panel Administrador 5K"
  workbook.created = new Date()
  workbook.modified = new Date()

  // -------------------------------------------------------------
  // HOJA 1: CONTROL DE PARTICIPANTES (Hoja Principal)
  // -------------------------------------------------------------
  const worksheet = workbook.addWorksheet("Inscripciones 5K", {
    properties: {
      tabColor: { argb: BRAND_COLORS.fuchsiaPrimary },
    },
    views: [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 7, // Congelar hasta la fila de encabezados
        showGridLines: true,
      },
    ],
  })

  // Métricas para el resumen superior
  const total = records.length
  const approved = records.filter((r) => r.status === "approved").length
  const pending = records.filter((r) => r.status === "pending").length
  const rejected = records.filter((r) => r.status === "rejected").length
  const basicos = records.filter((r) => r.kit_type === "basico").length
  const premiums = records.filter((r) => r.kit_type === "premium").length
  const totalRecaudado = records
    .filter((r) => r.status === "approved")
    .reduce((acc, r) => acc + (r.payment_amount || (r.kit_type === "premium" ? 15 : 10)), 0)

  // ==========================================
  // FILA 1: BANNER PRINCIPAL (Fucsia de Marca)
  // ==========================================
  worksheet.mergeCells("A1:R1")
  const titleCell = worksheet.getCell("A1")
  titleCell.value = "CAMINATA 5K • CAMINA Y RENACE CON DREAM HOME 2026"
  titleCell.font = {
    name: "Calibri",
    size: 15,
    bold: true,
    color: { argb: BRAND_COLORS.white },
  }
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND_COLORS.fuchsiaPrimary },
  }
  titleCell.alignment = { horizontal: "center", vertical: "middle" }
  worksheet.getRow(1).height = 34

  // ==========================================
  // FILA 2: SUBTÍTULO Y METADATOS (Celeste de Marca)
  // ==========================================
  worksheet.mergeCells("A2:R2")
  const subtitleCell = worksheet.getCell("A2")
  const fechaGeneracion = new Date().toLocaleString("es-VE", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  const filterNotice = filterDescription ? ` • [FILTRO: ${filterDescription.toUpperCase()}]` : ""
  subtitleCell.value = `INMOBILIARIA DREAM HOME • REPORTE OFICIAL DE PARTICIPANTES • GENERADO: ${fechaGeneracion.toUpperCase()}${filterNotice}`
  subtitleCell.font = {
    name: "Calibri",
    size: 10,
    bold: true,
    color: { argb: BRAND_COLORS.white },
  }
  subtitleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND_COLORS.celesteDeep },
  }
  subtitleCell.alignment = { horizontal: "center", vertical: "middle" }
  worksheet.getRow(2).height = 22

  // FILA 3: Espaciador
  worksheet.getRow(3).height = 8

  // ==========================================
  // FILAS 4 & 5: TARJETAS KPI DE RESUMEN
  // ==========================================
  // KPI 1: Total Inscritos (B4:D5)
  worksheet.mergeCells("B4:D4")
  worksheet.mergeCells("B5:D5")
  const kpiTotalHeader = worksheet.getCell("B4")
  kpiTotalHeader.value = "TOTAL REGISTRADOS"
  kpiTotalHeader.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRAND_COLORS.grayText } }
  kpiTotalHeader.alignment = { horizontal: "center", vertical: "bottom" }
  kpiTotalHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.cardBg } }

  const kpiTotalVal = worksheet.getCell("B5")
  kpiTotalVal.value = `${total} (${basicos} Bás. / ${premiums} Prem.)`
  kpiTotalVal.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND_COLORS.carbon } }
  kpiTotalVal.alignment = { horizontal: "center", vertical: "top" }
  kpiTotalVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.cardBg } }

  // KPI 2: Validados / Aprobados (F4:H5)
  worksheet.mergeCells("F4:H4")
  worksheet.mergeCells("F5:H5")
  const kpiApprHeader = worksheet.getCell("F4")
  kpiApprHeader.value = "APROBADOS (CON DORSAL)"
  kpiApprHeader.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRAND_COLORS.approvedText } }
  kpiApprHeader.alignment = { horizontal: "center", vertical: "bottom" }
  kpiApprHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.approvedBg } }

  const kpiApprVal = worksheet.getCell("F5")
  kpiApprVal.value = `${approved} (${total > 0 ? Math.round((approved / total) * 100) : 0}%)`
  kpiApprVal.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND_COLORS.approvedText } }
  kpiApprVal.alignment = { horizontal: "center", vertical: "top" }
  kpiApprVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.approvedBg } }

  // KPI 3: Pendientes (J4:L5)
  worksheet.mergeCells("J4:L4")
  worksheet.mergeCells("J5:L5")
  const kpiPendHeader = worksheet.getCell("J4")
  kpiPendHeader.value = "PENDIENTES POR VALIDAR"
  kpiPendHeader.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRAND_COLORS.pendingText } }
  kpiPendHeader.alignment = { horizontal: "center", vertical: "bottom" }
  kpiPendHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.pendingBg } }

  const kpiPendVal = worksheet.getCell("J5")
  kpiPendVal.value = `${pending}`
  kpiPendVal.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND_COLORS.pendingText } }
  kpiPendVal.alignment = { horizontal: "center", vertical: "top" }
  kpiPendVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.pendingBg } }

  // KPI 4: Recaudación Validada (N4:Q5)
  worksheet.mergeCells("N4:Q4")
  worksheet.mergeCells("N5:Q5")
  const kpiMoneyHeader = worksheet.getCell("N4")
  kpiMoneyHeader.value = "RECAUDACIÓN VALIDADA ($)"
  kpiMoneyHeader.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRAND_COLORS.celesteDeep } }
  kpiMoneyHeader.alignment = { horizontal: "center", vertical: "bottom" }
  kpiMoneyHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.celesteTint } }

  const kpiMoneyVal = worksheet.getCell("N5")
  kpiMoneyVal.value = totalRecaudado
  kpiMoneyVal.numFmt = '"$"#,##0.00'
  kpiMoneyVal.font = { name: "Calibri", size: 13, bold: true, color: { argb: BRAND_COLORS.celesteDeep } }
  kpiMoneyVal.alignment = { horizontal: "center", vertical: "top" }
  kpiMoneyVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.celesteTint } }

  // Aplicar bordes a las tarjetas KPI
  const kpiRanges = [
    { startCol: 2, endCol: 4 }, // B-D
    { startCol: 6, endCol: 8 }, // F-H
    { startCol: 10, endCol: 12 }, // J-L
    { startCol: 14, endCol: 17 }, // N-Q
  ]
  kpiRanges.forEach((range) => {
    for (let r = 4; r <= 5; r++) {
      for (let c = range.startCol; c <= range.endCol; c++) {
        worksheet.getCell(r, c).border = {
          top: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
          bottom: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
          left: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
          right: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
        }
      }
    }
  })

  worksheet.getRow(4).height = 18
  worksheet.getRow(5).height = 22

  // FILA 6: Espaciador
  worksheet.getRow(6).height = 10

  // ==========================================
  // FILA 7: ENCABEZADOS DE COLUMNA DE LA TABLA
  // ==========================================
  const headers = [
    { key: "num", label: "N°", width: 7 },
    { key: "bib", label: "Dorsal Oficial", width: 16 },
    { key: "status", label: "Estado Pago", width: 16 },
    { key: "firstName", label: "Nombres", width: 18 },
    { key: "lastName", label: "Apellidos", width: 18 },
    { key: "cedula", label: "Cédula", width: 16 },
    { key: "phone", label: "Teléfono", width: 17 },
    { key: "email", label: "Correo Electrónico", width: 28 },
    { key: "birthDate", label: "Fecha Nac.", width: 14 },
    { key: "kitType", label: "Modalidad Kit", width: 16 },
    { key: "amount", label: "Inversión ($)", width: 15 },
    { key: "reference", label: "Ref. Bancaria", width: 18 },
    { key: "emergencyName", label: "Contacto Emergencia", width: 24 },
    { key: "emergencyPhone", label: "Tel. Emergencia", width: 17 },
    { key: "createdAt", label: "Fecha Registro", width: 20 },
    { key: "proofUrl", label: "Comprobante", width: 18 },
    { key: "notes", label: "Notas / Observaciones", width: 30 },
    { key: "id", label: "ID Registro", width: 34 },
  ]

  const headerRow = worksheet.getRow(7)
  headerRow.height = 28

  headers.forEach((h, idx) => {
    const colNumber = idx + 1
    const cell = headerRow.getCell(colNumber)
    cell.value = h.label
    cell.font = {
      name: "Calibri",
      size: 10.5,
      bold: true,
      color: { argb: BRAND_COLORS.white },
    }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND_COLORS.fuchsiaPrimary },
    }
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    }
    cell.border = {
      top: { style: "medium", color: { argb: BRAND_COLORS.fuchsiaHover } },
      bottom: { style: "medium", color: { argb: BRAND_COLORS.fuchsiaHover } },
      left: { style: "thin", color: { argb: BRAND_COLORS.fuchsiaBorder } },
      right: { style: "thin", color: { argb: BRAND_COLORS.fuchsiaBorder } },
    }

    worksheet.getColumn(colNumber).width = h.width
  })

  // Activar AutoFiltro nativo de Excel en la fila de cabecera
  worksheet.autoFilter = {
    from: { row: 7, column: 1 },
    to: { row: 7, column: headers.length },
  }

  // ==========================================
  // FILAS 8 EN ADELANTE: DATOS DE PARTICIPANTES
  // ==========================================
  const startRowIndex = 8

  records.forEach((record, idx) => {
    const currentRowIndex = startRowIndex + idx
    const row = worksheet.getRow(currentRowIndex)
    row.height = 24 // Altura cómoda para visualización en pantalla y lectura

    const isEven = idx % 2 === 0
    const rowBgColor = isEven ? BRAND_COLORS.white : BRAND_COLORS.fuchsiaTint

    // Formatear fecha de registro
    let fechaRegStr = ""
    if (record.created_at) {
      try {
        const d = new Date(record.created_at)
        fechaRegStr = d.toLocaleString("es-VE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      } catch {
        fechaRegStr = record.created_at
      }
    }

    const status = record.status || "pending"
    const statusLabel =
      status === "approved" ? "APROBADO" : status === "rejected" ? "RECHAZADO" : "PENDIENTE"

    const bibDisplay = record.bib_number ? `#${formatBibNumber(record.bib_number)}` : "-"
    const kitLabel = record.kit_type === "premium" ? "Kit Premium" : "Kit Básico"
    const amountVal = record.payment_amount ?? (record.kit_type === "premium" ? 15 : 10)

    const rowValues = [
      idx + 1, // 1: N°
      bibDisplay, // 2: Dorsal
      statusLabel, // 3: Estado
      record.first_name || "", // 4: Nombres
      record.last_name || "", // 5: Apellidos
      record.cedula || "", // 6: Cédula
      record.phone || "", // 7: Teléfono
      record.email || "", // 8: Correo
      record.birth_date || "", // 9: Fecha Nac.
      kitLabel, // 10: Kit
      amountVal, // 11: Inversión
      String(record.payment_reference || "").trim(), // 12: Ref. Bancaria (Texto explícito)
      record.emergency_contact_name || "", // 13: Contacto Emergencia
      record.emergency_contact_phone || "", // 14: Tel. Emergencia
      fechaRegStr, // 15: Fecha Registro
      record.payment_proof_url ? "Ver Recibo" : "Sin comprobante", // 16: Comprobante
      record.notes || "", // 17: Notas
      record.id || "", // 18: ID
    ]

    rowValues.forEach((val, valIdx) => {
      const colNum = valIdx + 1
      const cell = row.getCell(colNum)
      cell.value = val

      // Estilo base
      cell.font = {
        name: "Calibri",
        size: 9.5,
        color: { argb: BRAND_COLORS.carbon },
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowBgColor },
      }
      cell.border = {
        top: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        bottom: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        left: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        right: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
      }

      cell.alignment = { vertical: "middle", horizontal: "center" }

      // Personalizaciones según la columna
      if (colNum === 1) {
        cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: BRAND_COLORS.grayLight } }
      }

      // Dorsal Oficial
      if (colNum === 2) {
        if (record.bib_number) {
          cell.font = {
            name: "Calibri",
            size: 11,
            bold: true,
            color: { argb: BRAND_COLORS.celesteDeep },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: BRAND_COLORS.celesteTint },
          }
        } else {
          cell.font = { name: "Calibri", size: 9, italic: true, color: { argb: BRAND_COLORS.grayLight } }
        }
      }

      // Estado de Pago (Badge con color)
      if (colNum === 3) {
        if (status === "approved") {
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.approvedText } }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: BRAND_COLORS.approvedBg },
          }
        } else if (status === "rejected") {
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.rejectedText } }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: BRAND_COLORS.rejectedBg },
          }
        } else {
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.pendingText } }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: BRAND_COLORS.pendingBg },
          }
        }
      }

      // Nombres y Apellidos
      if (colNum === 4 || colNum === 5) {
        cell.alignment = { vertical: "middle", horizontal: "left" }
        cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.carbon } }
      }

      // Cédula
      if (colNum === 6) {
        cell.numFmt = "@"
        cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.carbon } }
      }

      // Teléfono
      if (colNum === 7) {
        cell.numFmt = "@"
      }

      // Correo
      if (colNum === 8) {
        cell.alignment = { vertical: "middle", horizontal: "left" }
      }

      // Kit (Fucsia para Premium, Celeste para Básico)
      if (colNum === 10) {
        if (record.kit_type === "premium") {
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.fuchsiaText } }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: BRAND_COLORS.fuchsiaTint },
          }
        } else {
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.celesteDeep } }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: BRAND_COLORS.celesteTint },
          }
        }
      }

      // Inversión en $
      if (colNum === 11) {
        cell.alignment = { vertical: "middle", horizontal: "right" }
        cell.numFmt = '"$"#,##0.00'
        cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.carbon } }
      }

      // Ref. Bancaria (Texto explícito para preservar ceros a la izquierda)
      if (colNum === 12) {
        cell.numFmt = "@"
        cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: BRAND_COLORS.carbon } }
      }

      // Contacto Emergencia
      if (colNum === 13) {
        cell.alignment = { vertical: "middle", horizontal: "left" }
      }

      // Teléfono Emergencia
      if (colNum === 14) {
        cell.numFmt = "@"
      }

      // Comprobante (Hipervínculo clickeable)
      if (colNum === 16) {
        const url = record.payment_proof_url
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
          cell.value = {
            text: "🔗 Ver Recibo",
            hyperlink: url,
            tooltip: "Clic para abrir el comprobante en el navegador",
          }
          cell.font = {
            name: "Calibri",
            size: 9.5,
            bold: true,
            underline: true,
            color: { argb: "FF0284C7" },
          }
        } else {
          cell.value = "Sin comprobante"
          cell.font = { name: "Calibri", size: 9, italic: true, color: { argb: BRAND_COLORS.grayLight } }
        }
      }

      // Notas
      if (colNum === 17) {
        cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true }
      }

      // ID Interno
      if (colNum === 18) {
        cell.font = { name: "Calibri", size: 8, color: { argb: BRAND_COLORS.grayLight } }
      }
    })
  })

  // ==========================================
  // FILA FINAL DE TOTALES (Pie de tabla)
  // ==========================================
  const lastDataRowIndex = startRowIndex + records.length - 1
  const totalsRowIndex = lastDataRowIndex + 1
  const totalsRow = worksheet.getRow(totalsRowIndex)
  totalsRow.height = 26

  worksheet.mergeCells(`A${totalsRowIndex}:J${totalsRowIndex}`)
  const totalLabelCell = worksheet.getCell(`A${totalsRowIndex}`)
  totalLabelCell.value = "TOTAL RECAUDADO POR INSCRIPCIONES APROBADAS:"
  totalLabelCell.font = {
    name: "Calibri",
    size: 10,
    bold: true,
    color: { argb: BRAND_COLORS.carbon },
  }
  totalLabelCell.alignment = { vertical: "middle", horizontal: "right" }
  totalLabelCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND_COLORS.celesteTint },
  }

  const totalAmountCell = totalsRow.getCell(11)
  totalAmountCell.value = totalRecaudado
  totalAmountCell.numFmt = '"$"#,##0.00'
  totalAmountCell.font = {
    name: "Calibri",
    size: 11,
    bold: true,
    color: { argb: BRAND_COLORS.celesteDeep },
  }
  totalAmountCell.alignment = { vertical: "middle", horizontal: "right" }
  totalAmountCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND_COLORS.celesteTint },
  }

  for (let c = 1; c <= headers.length; c++) {
    const cCell = totalsRow.getCell(c)
    cCell.border = {
      top: { style: "medium", color: { argb: BRAND_COLORS.celestePrimary } },
      bottom: { style: "double", color: { argb: BRAND_COLORS.celestePrimary } },
      left: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      right: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
    }
    if (c > 11) {
      cCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BRAND_COLORS.celesteTint },
      }
    }
  }

  // Ajuste fino dinámico de anchos de columna
  worksheet.columns.forEach((column) => {
    let maxLength = 0
    column.eachCell?.({ includeEmpty: false }, (cell, rowNum) => {
      // Ignorar filas 1 a 6 (banners y KPIs fusionados) y fila de totales
      if (rowNum <= 6 || rowNum === totalsRowIndex) return

      let cellLen = 0
      if (cell.value !== null && cell.value !== undefined) {
        if (typeof cell.value === "object") {
          if ("text" in cell.value) {
            cellLen = String(cell.value.text).length
          } else {
            cellLen = String(cell.value).length
          }
        } else {
          cellLen = String(cell.value).length
        }
      }
      if (cellLen > maxLength) {
        maxLength = cellLen
      }
    })

    const currentWidth = column.width || 12
    const calculatedWidth = Math.max(maxLength + 4, 10)
    column.width = Math.max(currentWidth, Math.min(calculatedWidth, 42))
  })

  // -------------------------------------------------------------
  // HOJA 2: RESUMEN EJECUTIVO (Dashboard y Desglose de Kits)
  // -------------------------------------------------------------
  const summarySheet = workbook.addWorksheet("Resumen Ejecutivo", {
    properties: {
      tabColor: { argb: BRAND_COLORS.celestePrimary },
    },
    views: [{ showGridLines: true }],
  })

  summarySheet.mergeCells("A1:E1")
  const sTitle = summarySheet.getCell("A1")
  sTitle.value = "RESUMEN GENERAL Y ESTADÍSTICAS • CAMINATA 5K DREAM HOME"
  sTitle.font = { name: "Calibri", size: 13, bold: true, color: { argb: BRAND_COLORS.white } }
  sTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND_COLORS.fuchsiaPrimary },
  }
  sTitle.alignment = { horizontal: "center", vertical: "middle" }
  summarySheet.getRow(1).height = 32

  // Tabla 1: Desglose por Modalidad de Kit
  summarySheet.mergeCells("A3:D3")
  const kitTitle = summarySheet.getCell("A3")
  kitTitle.value = "1. DESGLOSE POR MODALIDAD DE KIT"
  kitTitle.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND_COLORS.fuchsiaText } }
  summarySheet.getRow(3).height = 22

  const kitHeaders = ["Modalidad", "Precio Unitario", "Cantidad Inscritos", "Total Recaudado (Aprobados)"]
  const kitHeaderRow = summarySheet.getRow(4)
  kitHeaderRow.height = 24
  kitHeaders.forEach((kh, i) => {
    const c = kitHeaderRow.getCell(i + 1)
    c.value = kh
    c.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND_COLORS.white } }
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.celesteDeep } }
    c.alignment = { horizontal: "center", vertical: "middle" }
    c.border = {
      top: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      bottom: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      left: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      right: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
    }
  })

  const basicosAprobados = records.filter((r) => r.kit_type === "basico" && r.status === "approved").length
  const premiumsAprobados = records.filter((r) => r.kit_type === "premium" && r.status === "approved").length
  const recaudacionBasico = basicosAprobados * 10
  const recaudacionPremium = premiumsAprobados * 15

  const kitData = [
    ["Kit Básico", 10, basicos, recaudacionBasico],
    ["Kit Premium", 15, premiums, recaudacionPremium],
  ]

  kitData.forEach((kd, rIdx) => {
    const row = summarySheet.getRow(5 + rIdx)
    row.height = 22
    kd.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1)
      cell.value = val
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND_COLORS.carbon } }
      cell.border = {
        top: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        bottom: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        left: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        right: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
      }
      if (cIdx === 0) cell.alignment = { horizontal: "left", vertical: "middle" }
      else if (cIdx === 1 || cIdx === 3) {
        cell.numFmt = '"$"#,##0.00'
        cell.alignment = { horizontal: "right", vertical: "middle" }
      } else {
        cell.alignment = { horizontal: "center", vertical: "middle" }
      }
    })
  })

  // Fila Total Kits
  const totalKitsRow = summarySheet.getRow(7)
  totalKitsRow.height = 24
  totalKitsRow.getCell(1).value = "TOTAL"
  totalKitsRow.getCell(1).font = { name: "Calibri", size: 10, bold: true }
  totalKitsRow.getCell(2).value = "-"
  totalKitsRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" }
  totalKitsRow.getCell(3).value = total
  totalKitsRow.getCell(3).font = { name: "Calibri", size: 10, bold: true }
  totalKitsRow.getCell(3).alignment = { horizontal: "center", vertical: "middle" }
  totalKitsRow.getCell(4).value = totalRecaudado
  totalKitsRow.getCell(4).numFmt = '"$"#,##0.00'
  totalKitsRow.getCell(4).font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND_COLORS.celesteDeep } }
  totalKitsRow.getCell(4).alignment = { horizontal: "right", vertical: "middle" }
  for (let c = 1; c <= 4; c++) {
    totalKitsRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.fuchsiaTint } }
    totalKitsRow.getCell(c).border = {
      top: { style: "medium", color: { argb: BRAND_COLORS.fuchsiaPrimary } },
      bottom: { style: "double", color: { argb: BRAND_COLORS.fuchsiaPrimary } },
      left: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      right: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
    }
  }

  // Tabla 2: Estado de Validaciones
  summarySheet.mergeCells("A9:C9")
  const statusTitle = summarySheet.getCell("A9")
  statusTitle.value = "2. ESTADO DE LAS SOLICITUDES"
  statusTitle.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND_COLORS.fuchsiaText } }
  summarySheet.getRow(9).height = 22

  const statusHeaders = ["Estado", "Cantidad", "Porcentaje (%)"]
  const statusHeaderRow = summarySheet.getRow(10)
  statusHeaderRow.height = 24
  statusHeaders.forEach((sh, i) => {
    const c = statusHeaderRow.getCell(i + 1)
    c.value = sh
    c.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND_COLORS.white } }
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_COLORS.fuchsiaPrimary } }
    c.alignment = { horizontal: "center", vertical: "middle" }
    c.border = {
      top: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      bottom: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      left: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
      right: { style: "thin", color: { argb: BRAND_COLORS.borderLight } },
    }
  })

  const statusData = [
    ["Aprobados (Validados con Dorsal)", approved, total > 0 ? (approved / total) * 100 : 0],
    ["Pendientes (Por revisar)", pending, total > 0 ? (pending / total) * 100 : 0],
    ["Rechazados (Pagos no conformes)", rejected, total > 0 ? (rejected / total) * 100 : 0],
  ]

  statusData.forEach((sd, rIdx) => {
    const row = summarySheet.getRow(11 + rIdx)
    row.height = 22
    sd.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1)
      cell.value = val
      cell.font = { name: "Calibri", size: 10, color: { argb: BRAND_COLORS.carbon } }
      cell.border = {
        top: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        bottom: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        left: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
        right: { style: "thin", color: { argb: BRAND_COLORS.borderGrid } },
      }
      if (cIdx === 0) cell.alignment = { horizontal: "left", vertical: "middle" }
      else if (cIdx === 2) {
        cell.numFmt = '0.0"%"'
        cell.alignment = { horizontal: "right", vertical: "middle" }
      } else {
        cell.alignment = { horizontal: "center", vertical: "middle" }
      }
    })
  })

  summarySheet.columns = [
    { width: 34 },
    { width: 18 },
    { width: 22 },
    { width: 28 },
  ]

  // ==========================================
  // GENERAR ARCHIVO Y DESCARGAR EN EL NAVEGADOR
  // ==========================================
  const dateStamp = new Date().toISOString().slice(0, 10)
  const finalFilename =
    filename || `Inscripciones_Caminata_5K_Dream_Home_${dateStamp}.xlsx`

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = finalFilename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exportación alternativa a CSV con delimitador de punto y coma (;)
 * y cabecera BOM UTF-8 para garantizar apertura perfecta en columnas en Windows Excel.
 */
export const exportRegistrationsToCSV = ({
  records,
  filename,
}: {
  records: RegistrationRecord[]
  filename?: string
}): void => {
  if (records.length === 0) return

  const delimiter = ";"

  const headers = [
    "N°",
    "Dorsal Oficial",
    "Estado",
    "Nombres",
    "Apellidos",
    "Cédula",
    "Teléfono",
    "Correo Electrónico",
    "Fecha Nacimiento",
    "Modalidad Kit",
    "Inversión ($)",
    "Ref. Bancaria",
    "Contacto Emergencia",
    "Tel. Emergencia",
    "Fecha Registro",
    "URL Comprobante",
    "Notas / Observaciones",
    "ID Registro",
  ]

  const escapeField = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }

  const rows = records.map((r, idx) => {
    const bibStr = r.bib_number ? `#${formatBibNumber(r.bib_number)}` : ""
    const kitStr = r.kit_type === "premium" ? "Kit Premium" : "Kit Básico"
    const amount = r.payment_amount ?? (r.kit_type === "premium" ? 15 : 10)
    const fechaReg = r.created_at ? new Date(r.created_at).toLocaleString("es-VE") : ""
    const statusLabel =
      r.status === "approved" ? "Aprobado" : r.status === "rejected" ? "Rechazado" : "Pendiente"

    return [
      idx + 1,
      escapeField(bibStr),
      escapeField(statusLabel),
      escapeField(r.first_name),
      escapeField(r.last_name),
      escapeField(r.cedula),
      escapeField(r.phone),
      escapeField(r.email),
      escapeField(r.birth_date),
      escapeField(kitStr),
      amount,
      escapeField(r.payment_reference),
      escapeField(r.emergency_contact_name),
      escapeField(r.emergency_contact_phone),
      escapeField(fechaReg),
      escapeField(r.payment_proof_url),
      escapeField(r.notes),
      escapeField(r.id),
    ].join(delimiter)
  })

  // Prefijo BOM \uFEFF para que Excel reconozca codificación UTF-8
  const csvContent = "\uFEFF" + [headers.join(delimiter), ...rows].join("\r\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download =
    filename || `inscripciones_caminata_5k_dream_home_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
