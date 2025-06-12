import { memoryLearningSystem, type MemoriaConversacion, type PerfilUsuario } from "./memory-learning-system"
import { localAI } from "./local-ai"

interface SearchResult {
  title: string
  snippet: string
  url: string
}

class EnhancedAI {
  private ultimosResultadosBusqueda: SearchResult[] = []

  async generatePersonalizedResponse(
    prompt: string,
    usuarioId: string,
    conversationHistory: Array<{ contenido: string; es_usuario: boolean; id: string }> = [],
  ): Promise<string> {
    try {
      // 1. Obtener perfil del usuario
      const perfilUsuario = memoryLearningSystem.obtenerPerfilUsuario(usuarioId)

      // 2. Obtener memoria relevante
      const memoriaRelevante = memoryLearningSystem.obtenerMemoriaRelevante(usuarioId, prompt)

      // 3. Obtener vocabulario del usuario
      const vocabularioUsuario = memoryLearningSystem.obtenerVocabularioUsuario(usuarioId, 10)

      // 4. Generar respuesta base usando el sistema existente
      const respuestaBase = await localAI.generateResponse(
        prompt,
        conversationHistory.map((m) => m.contenido),
      )

      // 5. Personalizar la respuesta
      const respuestaPersonalizada = this.personalizarRespuesta(
        respuestaBase,
        prompt,
        perfilUsuario,
        memoriaRelevante,
        vocabularioUsuario,
      )

      // 6. Aprender de esta conversación
      memoryLearningSystem.aprenderDeConversacion(usuarioId, [
        ...conversationHistory,
        { contenido: prompt, es_usuario: true, id: Date.now().toString() },
      ])

      // 7. Obtener resultados de búsqueda si los hay
      this.ultimosResultadosBusqueda = localAI.getLastSearchResults()

      return respuestaPersonalizada
    } catch (error) {
      console.error("Error generando respuesta personalizada:", error)
      // Fallback a respuesta básica
      return await localAI.generateResponse(
        prompt,
        conversationHistory.map((m) => m.contenido),
      )
    }
  }

  private personalizarRespuesta(
    respuestaBase: string,
    prompt: string,
    perfil: PerfilUsuario,
    memoria: MemoriaConversacion[],
    vocabulario: any[],
  ): string {
    let respuestaPersonalizada = respuestaBase

    // Personalizar según el perfil del usuario
    if (perfil) {
      // Ajustar formalidad
      if (perfil.nivel_formalidad === "alto") {
        respuestaPersonalizada = this.hacerMasFormal(respuestaPersonalizada)
      } else if (perfil.nivel_formalidad === "bajo") {
        respuestaPersonalizada = this.hacerMasInformal(respuestaPersonalizada)
      }

      // Ajustar estilo de comunicación
      if (perfil.estilo_comunicacion === "entusiasta") {
        respuestaPersonalizada = this.hacerMasEntusiasta(respuestaPersonalizada)
      } else if (perfil.estilo_comunicacion === "detallado") {
        respuestaPersonalizada = this.añadirMasDetalles(respuestaPersonalizada)
      } else if (perfil.estilo_comunicacion === "cortés") {
        respuestaPersonalizada = this.hacerMasCortés(respuestaPersonalizada)
      }
    }

    // Incorporar memoria relevante
    if (memoria.length > 0) {
      const referenciaMemoria = this.crearReferenciaMemoria(memoria)
      if (referenciaMemoria) {
        respuestaPersonalizada = `${referenciaMemoria}\n\n${respuestaPersonalizada}`
      }
    }

    // Usar vocabulario del usuario cuando sea apropiado
    if (vocabulario.length > 0) {
      respuestaPersonalizada = this.incorporarVocabularioUsuario(respuestaPersonalizada, vocabulario)
    }

    return respuestaPersonalizada
  }

  private hacerMasFormal(texto: string): string {
    return texto
      .replace(/\bhola\b/gi, "Buenos días")
      .replace(/\bgenial\b/gi, "excelente")
      .replace(/\bsúper\b/gi, "muy")
      .replace(/\bokay\b/gi, "de acuerdo")
      .replace(/\btú\b/gi, "usted")
      .replace(/\b¿qué tal\?\b/gi, "¿cómo se encuentra?")
  }

  private hacerMasInformal(texto: string): string {
    return texto
      .replace(/\bBuenos días\b/gi, "¡Hola!")
      .replace(/\bexcelente\b/gi, "genial")
      .replace(/\bmuy bien\b/gi, "súper bien")
      .replace(/\bde acuerdo\b/gi, "okay")
      .replace(/\busted\b/gi, "tú")
  }

  private hacerMasEntusiasta(texto: string): string {
    if (!texto.includes("!")) {
      texto = texto.replace(/\.$/, "!")
    }
    return texto
      .replace(/\bbueno\b/gi, "¡genial!")
      .replace(/\binteresante\b/gi, "¡súper interesante!")
      .replace(/\bperfecto\b/gi, "¡perfecto!")
      .replace(/\bbien\b/gi, "¡fantástico!")
  }

  private hacerMasCortés(texto: string): string {
    if (!texto.includes("por favor") && !texto.includes("gracias")) {
      texto = texto.replace(/\.$/, ", por favor.")
    }
    return texto.replace(/^/, "Permíteme ayudarte. ").replace(/\bpuedo\b/gi, "me complace poder")
  }

  private añadirMasDetalles(texto: string): string {
    const frasesDetalle = [
      " Para darte más contexto,",
      " Es importante mencionar que",
      " Además de esto,",
      " Vale la pena señalar que",
      " Basándome en nuestras conversaciones anteriores,",
    ]

    const fraseAleatoria = frasesDetalle[Math.floor(Math.random() * frasesDetalle.length)]
    return texto + fraseAleatoria + " esto se fundamenta en mi análisis de tu estilo de comunicación."
  }

  private crearReferenciaMemoria(memoria: MemoriaConversacion[]): string | null {
    if (memoria.length === 0) return null

    const memoriaReciente = memoria[0]
    const tiempoTranscurrido = this.calcularTiempoTranscurrido(memoriaReciente.ultima_mencion)

    if (memoriaReciente.frecuencia_mencion > 1) {
      return `🧠 Recuerdo que ${tiempoTranscurrido} hablamos sobre ${memoriaReciente.tema}. ${memoriaReciente.resumen.substring(0, 100)}...`
    }

    return `💭 Veo que te interesa el tema de ${memoriaReciente.tema}, como mencionaste ${tiempoTranscurrido}.`
  }

  private calcularTiempoTranscurrido(fecha: Date): string {
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()

    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (dias > 0) return `hace ${dias} día${dias > 1 ? "s" : ""}`
    if (horas > 0) return `hace ${horas} hora${horas > 1 ? "s" : ""}`
    if (minutos > 5) return `hace ${minutos} minutos`
    return "hace un momento"
  }

  private incorporarVocabularioUsuario(texto: string, vocabulario: any[]): string {
    const palabrasUsuario = vocabulario.map((v) => v.palabra)

    // Si el usuario usa mucho términos técnicos, usar un lenguaje más técnico
    const terminosTecnicos = palabrasUsuario.filter((palabra) =>
      ["programación", "código", "javascript", "python", "tecnología", "software", "desarrollo"].includes(palabra),
    )

    if (terminosTecnicos.length > 2) {
      texto = texto.replace(/\bprograma\b/gi, "código")
      texto = texto.replace(/\bcomputadora\b/gi, "sistema")
      texto = texto.replace(/\baplicación\b/gi, "app")
    }

    // Si usa términos científicos, ser más preciso
    const terminosCientificos = palabrasUsuario.filter((palabra) =>
      ["ciencia", "investigación", "experimento", "teoría", "análisis"].includes(palabra),
    )

    if (terminosCientificos.length > 1) {
      texto = texto.replace(/\bestudio\b/gi, "investigación")
      texto = texto.replace(/\bprueba\b/gi, "experimento")
    }

    return texto
  }

  // Obtener estadísticas de aprendizaje
  obtenerEstadisticasAprendizaje(usuarioId: string) {
    return memoryLearningSystem.obtenerEstadisticasUsuario(usuarioId)
  }

  getLastSearchResults(): SearchResult[] {
    return this.ultimosResultadosBusqueda
  }

  isReady(): boolean {
    return true
  }
}

export const enhancedAI = new EnhancedAI()
