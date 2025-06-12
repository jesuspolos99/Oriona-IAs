"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/auth-context"
import { Bot, AlertTriangle } from "lucide-react"

export default function AuthForm() {
  const [esLogin, setEsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const { iniciarSesion, registrarse, modoSimulado } = useAuth()

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError("")

    try {
      let resultado
      if (esLogin) {
        resultado = await iniciarSesion(email, password)
      } else {
        resultado = await registrarse(email, password, nombre)
      }

      if (resultado.error) {
        setError(resultado.error)
      }
    } catch (error) {
      setError("Error inesperado")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bot className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{esLogin ? "Iniciar Sesión" : "Registrarse"}</CardTitle>
          <p className="text-sm text-gray-600">IA Local en Español - Sin límites</p>
        </CardHeader>
        <CardContent>
          {modoSimulado && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div className="text-sm">
                <p className="font-medium">Modo simulado (vista previa)</p>
                <p className="text-xs mt-1">
                  Cualquier email y contraseña funcionarán en este modo. Los datos no se guardan.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={manejarSubmit} className="space-y-4">
            {!esLogin && (
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={cargando}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={cargando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={cargando}
                minLength={6}
              />
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={cargando}>
              {cargando ? "Cargando..." : esLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            type="button"
            onClick={() => setEsLogin(!esLogin)}
            className="text-green-600 hover:underline text-sm"
            disabled={cargando}
          >
            {esLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
