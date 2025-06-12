"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSimulatedMode } from "@/lib/supabase/client"
import type { Usuario } from "@/lib/types"

interface AuthContextType {
  usuario: Usuario | null
  cargando: boolean
  modoSimulado: boolean
  iniciarSesion: (email: string, password: string) => Promise<{ error?: string }>
  registrarse: (email: string, password: string, nombre: string) => Promise<{ error?: string }>
  cerrarSesion: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const modoSimulado = isSimulatedMode()

  useEffect(() => {
    if (modoSimulado) {
      // En modo simulado, establecemos un usuario de demostración después de un breve retraso
      const timer = setTimeout(() => {
        setUsuario({
          id: "mock-user-id",
          email: "usuario@ejemplo.com",
          nombre: "Usuario Demo",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        setCargando(false)
      }, 1000)

      return () => clearTimeout(timer)
    }

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        obtenerUsuario(session.user.id)
      } else {
        setCargando(false)
      }
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await obtenerUsuario(session.user.id)
      } else {
        setUsuario(null)
        setCargando(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [modoSimulado])

  const obtenerUsuario = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("usuarios").select("*").eq("id", userId).single()

      if (error) throw error
      setUsuario(data)
    } catch (error) {
      console.error("Error obteniendo usuario:", error)
    } finally {
      setCargando(false)
    }
  }

  const iniciarSesion = async (email: string, password: string) => {
    if (modoSimulado) {
      // En modo simulado, simulamos un inicio de sesión exitoso
      setUsuario({
        id: "mock-user-id",
        email: email,
        nombre: "Usuario Demo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      return {}
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return { error: error.message }
      return {}
    } catch (error) {
      return { error: "Error al iniciar sesión" }
    }
  }

  const registrarse = async (email: string, password: string, nombre: string) => {
    if (modoSimulado) {
      // En modo simulado, simulamos un registro exitoso
      setUsuario({
        id: "mock-user-id",
        email: email,
        nombre: nombre,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      return {}
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) return { error: error.message }

      if (data.user) {
        // Crear perfil de usuario
        const { error: profileError } = await supabase.from("usuarios").insert([
          {
            id: data.user.id,
            email,
            nombre,
          },
        ])

        if (profileError) return { error: profileError.message }
      }

      return {}
    } catch (error) {
      return { error: "Error al registrarse" }
    }
  }

  const cerrarSesion = async () => {
    if (modoSimulado) {
      // En modo simulado, simplemente limpiamos el estado
      setUsuario(null)
      return
    }

    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        modoSimulado,
        iniciarSesion,
        registrarse,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}
