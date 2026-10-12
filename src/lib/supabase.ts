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
  payment_proof_url: string
  status?: "pending" | "approved" | "rejected"
  bib_number?: number | null
  notes?: string | null
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("tu-proyecto") &&
  !supabaseAnonKey.includes("tu-anon-key")
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const uploadPaymentProof = async (file: File): Promise<{ url: string; error: string | null }> => {
  if (!isSupabaseConfigured || !supabase) {
    // Modo simulación local cuando aún no se han configurado credenciales reales
    await new Promise((resolve) => setTimeout(resolve, 800))
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
    // Simulación realista con retraso de red
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockRecord: RegistrationRecord = {
      ...record,
      id: crypto.randomUUID ? crypto.randomUUID() : `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: "pending",
      bib_number: null,
    }

    // Guardar en sessionStorage para demostración local si es necesario
    try {
      const existing = JSON.parse(sessionStorage.getItem("demo_registrations") || "[]")
      sessionStorage.setItem("demo_registrations", JSON.stringify([...existing, mockRecord]))
    } catch {
      // Ignorar si sessionStorage falla
    }

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

    return { data, error: null, isDemoMode: false }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar la inscripción"
    return { data: null, error: message, isDemoMode: false }
  }
}
