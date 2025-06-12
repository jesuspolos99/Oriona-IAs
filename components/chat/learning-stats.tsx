"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, MessageSquare, User, X } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

interface EstadisticasAprendizaje {
  vocabulario_aprendido: number
  memorias_almacenadas: number
  analisis_emocionales: number
  temas_interes: number
  estilo_comunicacion: string
  nivel_formalidad: string
}

interface LearningStatsProps {
  isOpen: boolean
  onClose: () => void
}

export default function LearningStats({ isOpen, onClose }: LearningStatsProps) {
  const { usuario } = useAuth()
  const [estadisticas, setEstadisticas] = useState<EstadisticasAprendizaje | null>(null)

  useEffect(() => {
    if (isOpen && usuario) {
      // Simular estadísticas ya que estamos en modo preview
      setEstadisticas({
        vocabulario_aprendido: Math.floor(Math.random() * 50) + 10,
        memorias_almacenadas: Math.floor(Math.random() * 10) + 2,
        analisis_emocionales: Math.floor(Math.random() * 20) + 5,
        temas_interes: Math.floor(Math.random() * 8) + 3,
        estilo_comunicacion: ["cortés", "entusiasta", "directo", "inquisitivo"][Math.floor(Math.random() * 4)],
        nivel_formalidad: ["alto", "medio", "bajo"][Math.floor(Math.random() * 3)],
      })
    }
  }, [isOpen, usuario])

  if (!isOpen) return null

  const getEstiloColor = (estilo: string) => {
    switch (estilo) {
      case "cortés":
        return "text-blue-600"
      case "entusiasta":
        return "text-orange-600"
      case "directo":
        return "text-green-600"
      case "inquisitivo":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getFormalidadColor = (nivel: string) => {
    switch (nivel) {
      case "alto":
        return "text-indigo-600"
      case "medio":
        return "text-yellow-600"
      case "bajo":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <CardTitle>Estadísticas de Aprendizaje</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {estadisticas ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Vocabulario</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.vocabulario_aprendido}</div>
                  <div className="text-sm text-blue-600">palabras aprendidas</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Memorias</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{estadisticas.memorias_almacenadas}</div>
                  <div className="text-sm text-green-600">conversaciones recordadas</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Análisis</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{estadisticas.analisis_emocionales}</div>
                  <div className="text-sm text-purple-600">análisis emocionales</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-800">Intereses</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{estadisticas.temas_interes}</div>
                  <div className="text-sm text-orange-600">temas de interés</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Perfil de Comunicación</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estilo de comunicación:</span>
                      <span className={`font-medium capitalize ${getEstiloColor(estadisticas.estilo_comunicacion)}`}>
                        {estadisticas.estilo_comunicacion}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nivel de formalidad:</span>
                      <span className={`font-medium capitalize ${getFormalidadColor(estadisticas.nivel_formalidad)}`}>
                        {estadisticas.nivel_formalidad}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-800">🧠 Cómo aprendo de ti:</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Analizo las palabras que usas frecuentemente</li>
                    <li>• Detecto tu estilo de comunicación y nivel de formalidad</li>
                    <li>• Recuerdo los temas que te interesan</li>
                    <li>• Analizo el sentimiento de tus mensajes</li>
                    <li>• Adapto mis respuestas a tu personalidad</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-medium mb-2 text-yellow-800">💡 Modo Preview</h3>
                  <p className="text-sm text-yellow-700">
                    Estas estadísticas son simuladas para la vista previa. En la versión completa, todos los datos se
                    almacenarían de forma persistente y el aprendizaje sería real.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Cargando estadísticas de aprendizaje...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
