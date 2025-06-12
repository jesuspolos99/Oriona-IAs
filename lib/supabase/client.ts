import { createClient } from "@supabase/supabase-js"

// En el entorno de vista previa, usamos un cliente simulado
const isPreviewEnvironment = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

// URL correcta de Supabase (asegurando que tenga https://)
const supabaseUrl = "https://azddaivuzflcelgtsneosupabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZGRhaXZ1emZsY2VsZ3RzbmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODE0MTgsImV4cCI6MjA2NTI1NzQxOH0.FQZo72uTWLg09kS2IjC-lhKjTI-AnHA0ZaHc4cZOjf8"

// Cliente simulado para el entorno de vista previa
const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: { user: { id: "mock-user-id" } }, error: null }),
    signUp: () => Promise.resolve({ data: { user: { id: "mock-user-id" } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () =>
          Promise.resolve({
            data: { id: "mock-id", email: "usuario@ejemplo.com", nombre: "Usuario Demo" },
            error: null,
          }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ data: { id: "mock-id" }, error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
  }),
}

// Exportar el cliente real o el simulado según el entorno
export const supabase = isPreviewEnvironment ? mockSupabase : createClient(supabaseUrl, supabaseAnonKey)

// Función para verificar si estamos en modo simulado
export const isSimulatedMode = () => isPreviewEnvironment
