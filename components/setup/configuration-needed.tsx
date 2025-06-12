"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Database, Key, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import DemoChat from "@/components/demo/demo-chat"

export default function ConfigurationNeeded() {
  const [mostrarDemo, setMostrarDemo] = useState(false)

  if (mostrarDemo) {
    return <DemoChat />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-gray-800">Configuración Requerida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-600 mb-6">
            <p>Para usar esta aplicación, necesitas configurar las siguientes integraciones:</p>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">1. Supabase (Base de Datos)</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Crea una cuenta gratuita en Supabase</p>
                <p>• Crea un nuevo proyecto</p>
                <p>• Ejecuta el script SQL para crear las tablas</p>
                <p>• Configura las variables de entorno</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  Ir a Supabase <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>

            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <Key className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">2. OpenAI (IA)</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Crea una cuenta en OpenAI</p>
                <p>• Obtén tu API key</p>
                <p>• Agrega créditos a tu cuenta</p>
                <p>• Configura la variable de entorno</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">
                  Ir a OpenAI <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Variables de entorno requeridas:</h4>
            <div className="text-sm font-mono bg-gray-800 text-green-400 p-3 rounded">
              <div>NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima</div>
              <div>SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio</div>
              <div>OPENAI_API_KEY=tu_clave_de_openai</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => setMostrarDemo(true)} variant="outline" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Probar Demo
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Verificar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
