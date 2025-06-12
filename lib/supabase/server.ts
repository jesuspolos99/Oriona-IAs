import { createClient } from "@supabase/supabase-js"

// URL correcta de Supabase
const supabaseUrl = "https://azddaivuzflcelgtsneosupabase.co"
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZGRhaXZ1emZsY2VsZ3RzbmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODE0MTgsImV4cCI6MjA2NTI1NzQxOH0.FQZo72uTWLg09kS2IjC-lhKjTI-AnHA0ZaHc4cZOjf8"

// Función para detectar entorno de vista previa
function isPreviewEnvironment(): boolean {
  if (typeof window !== "undefined") {
    return window.location.hostname.includes("vusercontent.net")
  }
  return false
}

// Cliente simulado simplificado
const mockSupabaseAdmin = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () =>
          Promise.resolve({
            data: {
              id: "mock-id",
              usuario_id: "mock-user-id",
              titulo: "Chat simulado",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          }),
        order: (column: string, options: any) =>
          Promise.resolve({
            data: [],
            error: null,
          }),
      }),
      order: (column: string, options: any) =>
        Promise.resolve({
          data: [],
          error: null,
        }),
    }),
    insert: (values: any[]) => ({
      select: () => ({
        single: () =>
          Promise.resolve({
            data: {
              id: `mock-chat-${Date.now()}`,
              usuario_id: values[0]?.usuario_id || "mock-user-id",
              titulo: values[0]?.titulo || "Nueva conversación",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          }),
      }),
    }),
    update: (values: any) => ({
      eq: (column: string, value: any) =>
        Promise.resolve({
          data: null,
          error: null,
        }),
    }),
  }),
}

// Exportar el cliente real o el simulado según el entorno
export const supabaseAdmin = isPreviewEnvironment() ? mockSupabaseAdmin : createClient(supabaseUrl, supabaseServiceKey)
