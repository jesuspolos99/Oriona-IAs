"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  User,
  Plus,
  LogOut,
  MessageSquare,
  Globe,
  Brain,
  Sparkles,
  Search,
  MessageCircle,
  Lightbulb,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import type { Chat, Mensaje } from "@/lib/types"
import SimpleStats from "./simple-stats"

interface SearchResult {
  title: string
  snippet: string
  url: string
}

interface MensajeConFuentes extends Mensaje {
  searchResults?: SearchResult[]
  hasLearning?: boolean
}

type ModoRespuesta = "investigacion" | "conversacion"

export default function ChatInterface() {
  const { usuario, cerrarSesion } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [chatActual, setChatActual] = useState<string | null>(null)
  const [mensajes, setMensajes] = useState<MensajeConFuentes[]>([])
  const [inputMensaje, setInputMensaje] = useState("")
  const [cargandoChats, setCargandoChats] = useState(true)
  const [enviandoMensaje, setEnviandoMensaje] = useState(false)
  const [creandoChat, setCreandoChat] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false)
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [modoRespuesta, setModoRespuesta] = useState<ModoRespuesta>("conversacion")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (usuario) {
      cargarChats()
    }
  }, [usuario])

  useEffect(() => {
    if (chatActual) {
      cargarMensajesChat()
    }
  }, [chatActual])

  useEffect(() => {
    scrollToBottom()
  }, [mensajes])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const cargarChats = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/chats?usuarioId=${usuario?.id}`)
      const data = await response.json()

      if (response.ok) {
        setChats(data.chats || [])
        if (data.chats && data.chats.length > 0 && !chatActual) {
          setChatActual(data.chats[0].id)
        }
      } else {
        throw new Error(data.error || "Error cargando chats")
      }
    } catch (error) {
      console.error("Error cargando chats:", error)
      setError("No se pudieron cargar los chats")
    } finally {
      setCargandoChats(false)
    }
  }

  const cargarMensajesChat = async () => {
    if (!chatActual) return

    try {
      const chat = chats.find((c) => c.id === chatActual)
      if (chat && "mensajes" in chat) {
        setMensajes((chat as any).mensajes || [])
      }
    } catch (error) {
      console.error("Error cargando mensajes:", error)
    }
  }

  const crearNuevoChat = async () => {
    if (creandoChat) return

    setCreandoChat(true)
    setError(null)

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId: usuario?.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error HTTP: ${response.status}`)
      }

      if (!data || !data.chat) {
        throw new Error("La respuesta del servidor no contiene un chat válido")
      }

      const nuevoChat = data.chat

      const chatCompleto: Chat = {
        id: nuevoChat.id,
        usuario_id: nuevoChat.usuario_id,
        titulo: nuevoChat.titulo || "Nueva conversación",
        created_at: nuevoChat.created_at || new Date().toISOString(),
        updated_at: nuevoChat.updated_at || new Date().toISOString(),
      }

      setChats([chatCompleto, ...chats])
      setChatActual(chatCompleto.id)
      setMensajes([])
    } catch (error) {
      console.error("Error creando chat:", error)
      setError(`Error creando chat: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setCreandoChat(false)
    }
  }

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMensaje.trim() || enviandoMensaje || !chatActual) return

    const mensajeUsuario: MensajeConFuentes = {
      id: Date.now().toString(),
      chat_id: chatActual,
      contenido: inputMensaje,
      es_usuario: true,
      created_at: new Date().toISOString(),
    }

    setMensajes((prev) => [...prev, mensajeUsuario])
    const mensajeParaEnviar = inputMensaje
    setInputMensaje("")
    setEnviandoMensaje(true)

    try {
      // Construir historial de mensajes para la API
      const historialMensajes = [...mensajes, mensajeUsuario].map((msg) => ({
        role: msg.es_usuario ? "user" : "assistant",
        content: msg.contenido,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: historialMensajes,
          chatId: chatActual,
          usuarioId: usuario?.id,
          modoRespuesta: modoRespuesta, // Enviar el modo seleccionado
        }),
      })

      const data = await response.json()

      if (response.ok && data.message) {
        const mensajeIA: MensajeConFuentes = {
          id: (Date.now() + 1).toString(),
          chat_id: chatActual,
          contenido: data.message,
          es_usuario: false,
          created_at: new Date().toISOString(),
          searchResults: data.searchResults || undefined,
          hasLearning: data.hasLearning || false,
        }
        setMensajes((prev) => [...prev, mensajeIA])
      } else {
        throw new Error(data.error || "Error en la respuesta")
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error)
      const mensajeError: MensajeConFuentes = {
        id: (Date.now() + 1).toString(),
        chat_id: chatActual,
        contenido: "Lo siento, hubo un error procesando tu mensaje. Por favor, inténtalo de nuevo.",
        es_usuario: false,
        created_at: new Date().toISOString(),
      }
      setMensajes((prev) => [...prev, mensajeError])
    } finally {
      setEnviandoMensaje(false)
    }
  }

  const getModoPlaceholder = () => {
    if (modoRespuesta === "investigacion") {
      return "Pregúntame algo para investigar en internet... 🔍"
    }
    return "Chatea conmigo, me adapto a tu estilo... 😊"
  }

  const getModoIndicator = () => {
    if (modoRespuesta === "investigacion") {
      return "🔍 Modo Investigación - Buscaré información actualizada"
    }
    return "💬 Modo Conversación - Charla personalizada y empática"
  }

  const sugerirPregunta = (pregunta: string) => {
    setInputMensaje(pregunta)
  }

  const preguntasSugeridas = [
    "¿Cómo estás hoy? 😊",
    "¿Qué es lo más interesante que has aprendido?",
    "¿Cuál es tu película favorita?",
    "¿Qué te hace feliz?",
    "¿Hay algo que te preocupe?",
    "¿Cuál es tu sueño más grande?",
    "¿Qué opinas sobre la inteligencia artificial?",
    "¿Tienes algún hobby favorito?",
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-purple-200 flex flex-col shadow-lg">
        <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-lg font-bold">Oriona IA</h2>
            </div>
            <Button onClick={crearNuevoChat} size="sm" disabled={creandoChat} variant="secondary">
              {creandoChat ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-purple-600 rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="text-xs opacity-90 mb-2">IA creada por Jesus Monsalvo</div>

          <div className="flex items-center justify-between text-sm">
            <span>Hola, {usuario?.nombre} 👋</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarEstadisticas(true)}
                title="Ver mi perfil aprendido"
                className="text-white hover:bg-white/20"
              >
                <Brain className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={cerrarSesion} className="text-white hover:bg-white/20">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-purple-50">
          <div className="space-y-2">
            <div className="text-xs text-blue-600 flex items-center gap-1 bg-blue-100 p-2 rounded-md">
              <Globe className="w-3 h-3" />
              Acceso a internet en tiempo real
            </div>
            <div className="text-xs text-purple-600 flex items-center gap-1 bg-purple-100 p-2 rounded-md">
              <Brain className="w-3 h-3" />
              Memoria adaptativa personalizada
            </div>
            <div className="text-xs text-green-600 flex items-center gap-1 bg-green-100 p-2 rounded-md">
              <Sparkles className="w-3 h-3" />
              Conversaciones naturales expandidas
            </div>
            <div className="text-xs text-orange-600 flex items-center gap-1 bg-orange-100 p-2 rounded-md">
              <Lightbulb className="w-3 h-3" />
              Preguntas inteligentes y engagement
            </div>
          </div>

          {error && <div className="mt-2 text-xs text-red-600 p-2 rounded-md bg-red-50">{error}</div>}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {cargandoChats ? (
              <div className="text-center text-gray-500 py-4">Cargando conversaciones...</div>
            ) : chats.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p>¡Empecemos a charlar! 💬</p>
                <Button onClick={crearNuevoChat} size="sm" className="mt-2" disabled={creandoChat}>
                  Primera conversación
                </Button>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setChatActual(chat.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    chatActual === chat.id
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.titulo}</p>
                      <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {chatActual ? (
          <>
            <div className="bg-white border-b border-purple-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Oriona IA
                  </h1>
                  <p className="text-sm text-gray-600">
                    Tu asistente con personalidad humana • Conversaciones naturales • Acceso a internet
                  </p>
                  <p className="text-xs text-gray-500">IA creada por Jesus Monsalvo</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {mensajes.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">¡Hola! Soy Oriona IA 😊</h3>
                    <p className="mb-4">
                      Una IA con personalidad humana creada por Jesus Monsalvo. Me adapto a tu estilo y tengo
                      conversaciones naturales.
                    </p>

                    {/* Preguntas sugeridas */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">💡 Algunas ideas para empezar:</p>
                      <div className="grid grid-cols-2 gap-2 max-w-2xl mx-auto">
                        {preguntasSugeridas.slice(0, 6).map((pregunta, index) => (
                          <button
                            key={index}
                            onClick={() => sugerirPregunta(pregunta)}
                            className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg transition-colors text-left"
                          >
                            {pregunta}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 max-w-md mx-auto">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <Brain className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="font-medium">Memoria Adaptativa</p>
                        <p className="text-xs">Recuerdo nuestras charlas y me adapto a ti</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="font-medium">Internet en Tiempo Real</p>
                        <p className="text-xs">Busco información actualizada para ti</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <Sparkles className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="font-medium">Conversaciones Naturales</p>
                        <p className="text-xs">Respuestas variadas y preguntas inteligentes</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="font-medium">Engagement Inteligente</p>
                        <p className="text-xs">Preguntas que mantienen la conversación viva</p>
                      </div>
                    </div>
                  </div>
                )}

                {mensajes.map((mensaje) => (
                  <div
                    key={mensaje.id}
                    className={`flex items-start gap-3 ${mensaje.es_usuario ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        mensaje.es_usuario
                          ? "bg-blue-500 text-white"
                          : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      }`}
                    >
                      {mensaje.es_usuario ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[70%] p-4 rounded-lg shadow-sm ${
                        mensaje.es_usuario
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white border border-purple-100 rounded-bl-none"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <p className="m-0 whitespace-pre-line">{mensaje.contenido}</p>
                      </div>

                      {/* Indicador de búsqueda web */}
                      {!mensaje.es_usuario && mensaje.searchResults && mensaje.searchResults.length > 0 && (
                        <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          Información encontrada en internet
                        </div>
                      )}

                      {/* Indicador de aprendizaje */}
                      {!mensaje.es_usuario && mensaje.hasLearning && !mensaje.searchResults && (
                        <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          Respuesta personalizada con mi memoria
                        </div>
                      )}

                      <div className={`text-xs mt-2 ${mensaje.es_usuario ? "text-blue-100" : "text-gray-500"}`}>
                        {new Date(mensaje.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {enviandoMensaje && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-purple-100 p-4 rounded-lg rounded-bl-none shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {modoRespuesta === "investigacion"
                            ? "Investigando en internet... 🔍"
                            : "Oriona está pensando... 🤔"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="bg-white border-t border-purple-200 p-4 shadow-lg">
              <div className="max-w-4xl mx-auto">
                {/* Botón para mostrar/ocultar selector */}
                <div className="flex justify-center mb-2">
                  <button
                    onClick={() => setMostrarSelector(!mostrarSelector)}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {modoRespuesta === "investigacion" ? (
                      <Search className="w-3 h-3" />
                    ) : (
                      <MessageCircle className="w-3 h-3" />
                    )}
                    <span>{getModoIndicator()}</span>
                    <span className="ml-1">{mostrarSelector ? "▲" : "▼"}</span>
                  </button>
                </div>

                {/* Selector de Modo (ocultable) */}
                {mostrarSelector && (
                  <div className="mb-2 animate-fadeIn">
                    <div className="flex items-center justify-center">
                      <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                        <button
                          onClick={() => setModoRespuesta("conversacion")}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
                            modoRespuesta === "conversacion"
                              ? "bg-purple-500 text-white shadow-sm"
                              : "text-gray-600 hover:text-purple-600"
                          }`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          Conversación
                        </button>
                        <button
                          onClick={() => setModoRespuesta("investigacion")}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
                            modoRespuesta === "investigacion"
                              ? "bg-blue-500 text-white shadow-sm"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          <Search className="w-3 h-3" />
                          Investigación
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={enviarMensaje} className="flex gap-2">
                  <Input
                    value={inputMensaje}
                    onChange={(e) => setInputMensaje(e.target.value)}
                    placeholder={getModoPlaceholder()}
                    disabled={enviandoMensaje}
                    className={`flex-1 border-purple-200 focus:border-purple-400 ${
                      modoRespuesta === "investigacion" ? "border-blue-300 focus:border-blue-400" : ""
                    }`}
                  />
                  <Button
                    type="submit"
                    disabled={enviandoMensaje || !inputMensaje.trim()}
                    className={`${
                      modoRespuesta === "investigacion"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    }`}
                  >
                    {modoRespuesta === "investigacion" ? <Search className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Oriona IA • Conversaciones naturales expandidas • Memoria adaptativa • IA creada por Jesus Monsalvo
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">¡Hola! Soy Oriona IA</h3>
              <p className="mb-4">Selecciona una conversación o empecemos a charlar</p>
              {chats.length === 0 && (
                <Button onClick={crearNuevoChat} className="mt-4" disabled={creandoChat}>
                  Comenzar conversación
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <SimpleStats isOpen={mostrarEstadisticas} onClose={() => setMostrarEstadisticas(false)} />
    </div>
  )
}
