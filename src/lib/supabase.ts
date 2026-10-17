import { createClient } from "@supabase/supabase-js"

export interface RegistrationRecord {
  id?: string
  created_at?: string
  first_name: string
  last_name: string
  cedula: string
  birth_date: string
  phone: string
  email: string
  emergency_contact_phone: string
  emergency_contact_name: string
  kit_type: "basico" | "premium"
  shirt_size?: string | null
  payment_reference: string
  payment_amount: number
  payment_proof_url: string
  status?: "pending" | "approved" | "rejected"
  bib_number?: number | null
  notes?: string | null
}

/**
 * Formatea el número de dorsal para mostrarlo con dos dígitos mínimos
 * según el orden de aprobación (ej. 1 -> "01", 9 -> "09", 10 -> "10")
 */
export const formatBibNumber = (bib: number | string | null | undefined): string => {
  if (bib === null || bib === undefined || bib === "") return ""
  const num = typeof bib === "string" ? parseInt(bib, 10) : bib
  if (isNaN(num)) return String(bib)
  return num < 10 && num >= 0 ? `0${num}` : String(num)
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("tu-proyecto") &&
  !supabaseAnonKey.includes("tu-anon-key")
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const STORAGE_KEY = "dream_home_registrations_demo_v3"

// Semilla inicial de demostración cuando no hay Supabase configurado
const INITIAL_DEMO_RECORDS: RegistrationRecord[] = [
  {
    id: "demo-001",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    first_name: "Mariana",
    last_name: "González",
    cedula: "V-24.891.234",
    birth_date: "1994-06-15",
    phone: "0414-2345678",
    email: "mariana.gonzalez@example.com",
    emergency_contact_name: "Carlos González",
    emergency_contact_phone: "0424-9876543",
    kit_type: "basico",
    shirt_size: null,
    payment_reference: "489201",
    payment_amount: 10,
    payment_proof_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    bib_number: null,
    notes: "Pago Móvil Banesco Ref: 489201 por $10 a Tasa BCV.",
  },
  {
    id: "demo-002",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    first_name: "Alejandro",
    last_name: "Rondón",
    cedula: "V-19.452.887",
    birth_date: "1989-11-20",
    phone: "0424-1123498",
    email: "alejandro.rondon@example.com",
    emergency_contact_name: "Patricia Rondón",
    emergency_contact_phone: "0412-5551234",
    kit_type: "premium",
    shirt_size: "L",
    payment_reference: "882104",
    payment_amount: 15,
    payment_proof_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    status: "approved",
    bib_number: 1,
    notes: "Comprobante verificado. Kit Premium Talla L. Dorsal #01.",
  },
  {
    id: "demo-003",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    first_name: "Elena",
    last_name: "Castillo",
    cedula: "V-26.331.092",
    birth_date: "1998-03-08",
    phone: "0416-8877665",
    email: "elena.castillo@example.com",
    emergency_contact_name: "María Castillo",
    emergency_contact_phone: "0414-9988776",
    kit_type: "basico",
    shirt_size: null,
    payment_reference: "119042",
    payment_amount: 10,
    payment_proof_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    status: "rejected",
    bib_number: null,
    notes: "Captura borrosa sin fecha visible.",
  },
]

const getLocalDemoRecords = (): RegistrationRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS))
    return INITIAL_DEMO_RECORDS
  } catch {
    return INITIAL_DEMO_RECORDS
  }
}

const saveLocalDemoRecords = (records: RegistrationRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    sessionStorage.setItem("demo_registrations", JSON.stringify(records))
  } catch {
    // Manejo seguro si almacenamiento está deshabilitado
  }
}

export const uploadPaymentProof = async (file: File): Promise<{ url: string; error: string | null }> => {
  if (!isSupabaseConfigured || !supabase) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const simulatedUrl = URL.createObjectURL(file)
    return { url: simulatedUrl, error: null }
  }

  try {
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      return { url: "", error: uploadError.message }
    }

    const { data: publicUrlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al subir comprobante"
    return { url: "", error: message }
  }
}

export const submitRegistration = async (
  record: Omit<RegistrationRecord, "id" | "created_at" | "status" | "bib_number">
): Promise<{ data: RegistrationRecord | null; error: string | null; isDemoMode: boolean }> => {
  if (!isSupabaseConfigured || !supabase) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const mockRecord: RegistrationRecord = {
      ...record,
      id: crypto.randomUUID ? crypto.randomUUID() : `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: "pending",
      bib_number: null,
      notes: null,
    }

    const current = getLocalDemoRecords()
    const updated = [mockRecord, ...current]
    saveLocalDemoRecords(updated)

    return { data: mockRecord, error: null, isDemoMode: true }
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          first_name: record.first_name,
          last_name: record.last_name,
          cedula: record.cedula,
          birth_date: record.birth_date,
          phone: record.phone,
          email: record.email,
          emergency_contact_phone: record.emergency_contact_phone,
          emergency_contact_name: record.emergency_contact_name,
          kit_type: record.kit_type,
          shirt_size: record.shirt_size || null,
          payment_reference: record.payment_reference,
          payment_amount: record.payment_amount,
          payment_proof_url: record.payment_proof_url,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return {
          data: null,
          error: "Ya existe un registro con esta Cédula de Identidad.",
          isDemoMode: false,
        }
      }
      return { data: null, error: error.message, isDemoMode: false }
    }

    return { data: data as RegistrationRecord, error: null, isDemoMode: false }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar la inscripción"
    return { data: null, error: message, isDemoMode: false }
  }
}

export const getRegistrations = async (): Promise<{
  data: RegistrationRecord[]
  error: string | null
  isDemoMode: boolean
}> => {
  if (!isSupabaseConfigured || !supabase) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      data: getLocalDemoRecords(),
      error: null,
      isDemoMode: true,
    }
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return { data: [], error: error.message, isDemoMode: false }
    }

    return { data: (data as RegistrationRecord[]) || [], error: null, isDemoMode: false }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al consultar inscripciones"
    return { data: [], error: message, isDemoMode: false }
  }
}

export const updateRegistrationStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected",
  bibNumber?: number | null,
  notes?: string | null
): Promise<{ data: RegistrationRecord | null; error: string | null; isDemoMode: boolean }> => {
  if (!isSupabaseConfigured || !supabase) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const current = getLocalDemoRecords()
    let updatedRecord: RegistrationRecord | null = null

    const updated = current.map((item) => {
      if (item.id === id) {
        updatedRecord = {
          ...item,
          status,
          bib_number: status === "approved" ? (bibNumber ?? item.bib_number) : null,
          notes: notes !== undefined ? notes : item.notes,
        }
        return updatedRecord
      }
      return item
    })

    saveLocalDemoRecords(updated)
    return { data: updatedRecord, error: null, isDemoMode: true }
  }

  try {
    const payload: Partial<RegistrationRecord> = { status }
    if (status === "approved") {
      payload.bib_number = bibNumber ?? null
    } else {
      payload.bib_number = null
    }

    if (notes !== undefined) {
      payload.notes = notes
    }

    const { data, error } = await supabase
      .from("registrations")
      .update(payload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message, isDemoMode: false }
    }

    return { data: data as RegistrationRecord, error: null, isDemoMode: false }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar inscripción"
    return { data: null, error: message, isDemoMode: false }
  }
}

/**
 * Actualiza la información completa o parcial de una inscripción
 */
export const updateRegistration = async (
  id: string,
  updatedData: Partial<RegistrationRecord>
): Promise<{ data: RegistrationRecord | null; error: string | null; isDemoMode: boolean }> => {
  if (!isSupabaseConfigured || !supabase) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const current = getLocalDemoRecords()
    let updatedRecord: RegistrationRecord | null = null

    const updated = current.map((item) => {
      if (item.id === id) {
        updatedRecord = {
          ...item,
          ...updatedData,
        }
        return updatedRecord
      }
      return item
    })

    saveLocalDemoRecords(updated)
    return { data: updatedRecord, error: null, isDemoMode: true }
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message, isDemoMode: false }
    }

    return { data: data as RegistrationRecord, error: null, isDemoMode: false }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar inscripción"
    return { data: null, error: message, isDemoMode: false }
  }
}

export const deleteRegistration = async (
  id: string
): Promise<{ error: string | null; isDemoMode: boolean }> => {
  if (!isSupabaseConfigured || !supabase) {
    const current = getLocalDemoRecords()
    const updated = current.filter((r) => r.id !== id)
    saveLocalDemoRecords(updated)
    return { error: null, isDemoMode: true }
  }

  try {
    const { error } = await supabase.from("registrations").delete().eq("id", id)
    if (error) {
      return { error: error.message, isDemoMode: false }
    }
    return { error: null, isDemoMode: false }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar inscripción"
    return { error: message, isDemoMode: false }
  }
}
