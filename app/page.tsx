"use client"

import { useAuth } from "@/lib/auth/auth-context"
import AuthForm from "@/components/auth/auth-form"
import ChatInterface from "@/components/chat/chat-interface"

export default function Home() {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando IA local...</p>
        </div>
      </div>
    )
  }

  return usuario ? <ChatInterface /> : <AuthForm />
}
