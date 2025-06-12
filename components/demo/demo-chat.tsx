"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"

interface Mensaje {
  id: number
  texto: string
  esUsuario: boolean
  timestamp: Date
}

export default function DemoChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 1,
      texto:
        "¡Hola! 👋 Esta es una versión demo. Para la funcionalidad completa con IA real, configura Supabase y OpenAI.",
      esUsuario: false,
      timestamp: new Date(),
    },
  ])
  const [inputMensaje, setInputMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const respuestasDemo = [
    "Esta es una respuesta de demostración. Para usar IA real, configura OpenAI.",
    "¡Interesante pregunta! En la versión completa, tendría acceso a información actualizada.",
    "Me encantaría ayudarte más, pero necesitas configurar las integraciones primero.",
    "Esta es solo una demo. La IA real puede responder mucho mejor a tus preguntas.",
    "Para obtener respuestas inteligentes, configura OpenAI en las variables de entorno.",
  ]

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMensaje.trim() || cargando) return

    const nuevoMensajeUsuario: Mensaje = {
      id: Date.now(),
      texto: inputMensaje,
      esUsuario: true,
      timestamp: new Date(),
    }

    setMensajes((prev) => [...prev, nuevoMensajeUsuario])
    setInputMensaje("")
    setCargando(true)

    // Simular respuesta después de 1 segundo
    setTimeout(() => {
      const respuestaAleatoria = respuestasDemo[Math.floor(Math.random() * respuestasDemo.length)]
      const mensajeIA: Mensaje = {
        id: Date.now() + 1,
        texto: respuestaAleatoria,
        esUsuario: false,
        timestamp: new Date(),
      }
      setMensajes((prev) => [...prev, mensajeIA])
      setCargando(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] shadow-xl">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Bot className="w-8 h-8" />
            Demo - Chat IA
          </CardTitle>
          <p className="text-center text-sm opacity-90">
            Versión de demostración - Configura las integraciones para la funcionalidad completa
          </p>
        </CardHeader>

        <CardContent className="p-0 h-[calc(600px-120px)] flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`flex items-start gap-3 ${mensaje.esUsuario ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      mensaje.esUsuario ? "bg-blue-500 text-white" : "bg-amber-200 text-amber-800"
                    }`}
                  >
                    {mensaje.esUsuario ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      mensaje.esUsuario
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-amber-100 text-amber-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{mensaje.texto}</p>
                    <span className={`text-xs mt-1 block ${mensaje.esUsuario ? "text-blue-100" : "text-amber-700"}`}>
                      {mensaje.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {cargando && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-amber-100 text-amber-900 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={enviarMensaje} className="flex gap-2">
              <Input
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                placeholder="Prueba el chat demo..."
                disabled={cargando}
                className="flex-1"
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={cargando || !inputMensaje.trim()}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Demo mode - Configura Supabase y OpenAI para la funcionalidad completa
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
