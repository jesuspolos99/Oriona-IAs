// Oriona IA - Sistema de IA con personalidad humana y conversacional
// IA creada por Jesus Monsalvo

import { humanConversation } from "./human-conversation"
import { expandedConversation } from "./expanded-conversation"

interface RespuestaIA {
  patron: RegExp[]
  respuestas: string[]
  contexto?: string
}

interface SearchResult {
  title: string
  snippet: string
  url: string
}

type ModoRespuesta = "investigacion" | "conversacion" | "auto"

class OrianaAI {
  private ultimoContexto: string | null = null
  private contadorConversacion = 0
  private ultimosResultadosBusqueda: SearchResult[] = []

  // Método principal con detección automática
  async generateResponse(prompt: string, conversationHistory: string[] = []): Promise<string> {
    return this.generateResponseWithMode(prompt, conversationHistory, "auto")
  }

  // Método con modo específico
  async generateResponseWithMode(
    prompt: string,
    conversationHistory: string[] = [],
    mode: ModoRespuesta = "auto",
    userId = "default",
  ): Promise<string> {
    this.contadorConversacion++

    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

    const promptLower = prompt.toLowerCase().trim()

    console.log(`🎯 Generando respuesta en modo: ${mode}`)

    // MODO INVESTIGACIÓN: Siempre buscar
    if (mode === "investigacion") {
      console.log("🔍 Modo investigación: Forzando búsqueda web")
      return await this.handleWebSearch(prompt, "¡Perfecto! Voy a investigar eso para ti 🔍")
    }

    // MODO CONVERSACIÓN: Nunca buscar, solo conversar con personalidad humana
    if (mode === "conversacion") {
      console.log("💬 Modo conversación: Activando conversación humana avanzada")

      // PRIMERO: Intentar respuestas expandidas para conversación básica
      const expandedResponse = expandedConversation.generateExpandedResponse(prompt, userId)
      if (expandedResponse) {
        console.log("✨ Usando respuesta expandida de conversación")
        return expandedResponse
      }

      // SEGUNDO: Usar el sistema de conversación humana avanzado
      console.log("💜 Usando sistema de conversación humana avanzado")
      return await humanConversation.generateHumanResponse(prompt, userId, conversationHistory)
    }

    // MODO AUTO: Comportamiento original con detección inteligente
    console.log("🤖 Modo auto: Detección inteligente")

    // PRIMERO: Verificar si necesita búsqueda web (prioridad máxima)
    if (this.shouldSearchWeb(prompt)) {
      console.log("🔍 Oriona detectó necesidad de búsqueda para:", prompt)
      return await this.handleWebSearch(prompt)
    }

    // SEGUNDO: Intentar respuestas expandidas para conversación básica
    const expandedResponse = expandedConversation.generateExpandedResponse(prompt, userId)
    if (expandedResponse) {
      console.log("✨ Usando respuesta expandida")
      return expandedResponse
    }

    // TERCERO: Para todo lo demás, usar conversación humana
    console.log("💜 Usando conversación humana para respuesta compleja")
    return await humanConversation.generateHumanResponse(prompt, userId, conversationHistory)
  }

  private shouldSearchWeb(query: string): boolean {
    const queryLower = query.toLowerCase().trim()

    // Patrones EXPLÍCITOS de búsqueda (alta prioridad)
    const explicitSearchPatterns = [
      /busca/i,
      /buscar/i,
      /información sobre/i,
      /informacion sobre/i,
      /datos sobre/i,
      /datos de/i,
      /investiga/i,
      /investigar/i,
      /necesito información/i,
      /necesito informacion/i,
      /quiero información/i,
      /quiero informacion/i,
      /dime sobre/i,
      /cuéntame sobre/i,
      /cuentame sobre/i,
      /explícame sobre/i,
      /explicame sobre/i,
      /qué sabes de/i,
      /que sabes de/i,
      /qué sabes sobre/i,
      /que sabes sobre/i,
    ]

    // Si contiene patrones explícitos, SIEMPRE buscar
    if (explicitSearchPatterns.some((pattern) => pattern.test(queryLower))) {
      return true
    }

    // Patrones de información factual específica
    const factualPatterns = [
      // Preguntas sobre personas específicas
      /quién es [a-záéíóúñü\s]+/i,
      /quien es [a-záéíóúñü\s]+/i,
      /quién fue [a-záéíóúñü\s]+/i,
      /quien fue [a-záéíóúñü\s]+/i,

      // Fechas y eventos históricos
      /en qué año/i,
      /en que ano/i,
      /cuándo nació/i,
      /cuando nacio/i,
      /cuándo murió/i,
      /cuando murio/i,
      /cuándo ocurrió/i,
      /cuando ocurrio/i,
      /cuándo fue/i,
      /cuando fue/i,
      /qué pasó en/i,
      /que paso en/i,

      // Lugares y geografía
      /dónde está/i,
      /donde esta/i,
      /dónde se encuentra/i,
      /donde se encuentra/i,
      /capital de/i,
      /población de/i,
      /poblacion de/i,
      /ubicación de/i,
      /ubicacion de/i,

      // Definiciones y conceptos
      /qué es [a-záéíóúñü\s]+/i,
      /que es [a-záéíóúñü\s]+/i,
      /definición de/i,
      /definicion de/i,
      /significado de/i,
      /concepto de/i,

      // Datos específicos
      /cuánto cuesta/i,
      /cuanto cuesta/i,
      /precio de/i,
      /precio del/i,
      /precio actual/i,
      /cotización/i,
      /cotizacion/i,
      /estadísticas/i,
      /estadisticas/i,
      /datos exactos/i,
      /cifras de/i,
      /números de/i,
      /numeros de/i,

      // Noticias y actualidad
      /últimas noticias/i,
      /ultimas noticias/i,
      /noticias recientes/i,
      /qué está pasando/i,
      /que esta pasando/i,
      /actualidad de/i,
      /situación actual/i,
      /situacion actual/i,

      // Cómo hacer algo específico
      /cómo se hace/i,
      /como se hace/i,
      /cómo funciona/i,
      /como funciona/i,
      /pasos para/i,
      /instrucciones para/i,
      /tutorial de/i,
      /guía para/i,
      /guia para/i,

      // Comparaciones específicas
      /diferencia entre/i,
      /diferencias entre/i,
      /comparación entre/i,
      /comparacion entre/i,
      /versus/i,
      /vs\./i,

      // Listas y rankings
      /mejores [a-záéíóúñü\s]+ de/i,
      /top [0-9]+ de/i,
      /lista de/i,
      /ranking de/i,
      /cuáles son/i,
      /cuales son/i,
    ]

    // Verificar patrones factuales
    if (factualPatterns.some((pattern) => pattern.test(queryLower))) {
      return true
    }

    // Palabras que indican necesidad de información actualizada
    const currentInfoKeywords = [
      "actual",
      "actualidad",
      "reciente",
      "último",
      "ultima",
      "nuevo",
      "nueva",
      "hoy",
      "ahora",
      "presente",
      "2024",
      "2025",
      "este año",
      "este ano",
    ]

    // Si menciona información actual + un tema específico
    if (currentInfoKeywords.some((keyword) => queryLower.includes(keyword)) && queryLower.length > 15) {
      return true
    }

    // Nombres propios (personas, lugares, empresas, productos)
    const properNounPattern = /\b[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+(?:\s+[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+)*\b/
    if (properNounPattern.test(query) && queryLower.length > 10) {
      // Excluir nombres comunes que no requieren búsqueda
      const commonNames = ["Oriona", "Jesus", "Monsalvo", "IA", "AI"]
      if (!commonNames.some((name) => queryLower.includes(name.toLowerCase()))) {
        return true
      }
    }

    // Palabras que indican conversación personal (NO buscar)
    const personalConversationWords = [
      "me gusta",
      "prefiero",
      "creo que",
      "pienso que",
      "mi opinión",
      "mi opinion",
      "qué opinas",
      "que opinas",
      "cómo te sientes",
      "como te sientes",
      "tu experiencia",
      "tu perspectiva",
      "cuéntame de ti",
      "cuentame de ti",
      "háblame de ti",
      "hablame de ti",
      "eres",
      "tienes",
      "puedes sentir",
      "tu color favorito",
      "tu comida favorita",
      "te gusta",
      "prefieres",
      "me siento",
      "estoy triste",
      "estoy feliz",
      "tengo miedo",
      "me preocupa",
      "necesito hablar",
      "quiero conversar",
      "hola",
      "como estas",
      "que haces",
      "que tal",
      "gracias",
      "de nada",
    ]

    // Si es claramente conversacional, NO buscar
    if (personalConversationWords.some((word) => queryLower.includes(word))) {
      return false
    }

    // Si la consulta es muy corta (menos de 8 caracteres), probablemente no necesita búsqueda
    if (queryLower.length < 8) {
      return false
    }

    // Por defecto, si no está claro, buscar (mejor pecar de más información)
    return queryLower.length > 15
  }

  private async handleWebSearch(prompt: string, introMessage?: string): Promise<string> {
    try {
      console.log("🌐 Oriona iniciando búsqueda web para:", prompt)

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: prompt }),
      })

      if (response.ok) {
        const data = await response.json()
        this.ultimosResultadosBusqueda = data.results || []

        if (this.ultimosResultadosBusqueda.length > 0) {
          // Simular tiempo de búsqueda más realista
          await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))
          return this.generateWebBasedResponse(prompt, this.ultimosResultadosBusqueda, introMessage)
        }
      }
    } catch (error) {
      console.error("❌ Error en búsqueda web:", error)
    }

    // Si falla la búsqueda, responder que no se pudo obtener información
    return this.generateSearchFailureResponse(prompt)
  }

  private generateSearchFailureResponse(prompt: string): string {
    const failureResponses = [
      `¡Ay! 😅 Intenté buscar información sobre "${prompt}" pero no pude acceder a internet en este momento. ¿Podrías intentar reformular tu pregunta o preguntarme algo más general?`,
      `¡Ups! 🤔 No logré encontrar información actualizada sobre "${prompt}" ahora mismo. ¿Hay algo más específico que te gustaría saber o alguna otra forma en que pueda ayudarte?`,
      `¡Vaya! 😊 Parece que mi búsqueda sobre "${prompt}" no funcionó como esperaba. ¿Te gustaría que conversemos sobre el tema de otra manera?`,
    ]

    return failureResponses[Math.floor(Math.random() * failureResponses.length)]
  }

  private generateWebBasedResponse(prompt: string, results: SearchResult[], introMessage?: string): string {
    const introducciones = [
      "¡Perfecto! Encontré información muy interesante sobre eso 🔍",
      "¡Excelente pregunta! Acabo de buscar en internet y esto es lo que descubrí 🌐",
      "¡Me encanta investigar! Aquí tienes lo que encontré navegando por la web ✨",
      "¡Genial! He estado buscando información fresca y esto es lo más relevante 💡",
      "¡Súper! Déjame compartirte lo que acabo de encontrar en internet 🚀",
    ]

    const introduccion = introMessage || introducciones[Math.floor(Math.random() * introducciones.length)]

    let respuesta = `${introduccion}\n\n`

    // Añadir información de los resultados
    results.forEach((result, index) => {
      if (index === 0) {
        respuesta += `**${result.title}**\n${result.snippet}\n\n`
      } else if (index < 3) {
        respuesta += `**También encontré:**\n${result.snippet}\n\n`
      }
    })

    // Añadir fuentes
    if (results.length > 0) {
      respuesta += "📖 **Fuentes consultadas:**\n"
      results.slice(0, 3).forEach((result) => {
        respuesta += `• ${result.title}\n`
      })

      respuesta += "\n¿Te gustaría que profundice en algún aspecto específico o tienes alguna otra pregunta? 😊"
    }

    return respuesta.replace(/\n{3,}/g, "\n\n").trim()
  }

  getLastSearchResults(): SearchResult[] {
    return this.ultimosResultadosBusqueda
  }

  isReady(): boolean {
    return true
  }

  // Generar pregunta para romper el hielo
  generateIceBreaker(): string {
    return expandedConversation.generateIceBreaker()
  }

  // Obtener estadísticas de engagement
  getEngagementStats(userId: string) {
    return expandedConversation.getEngagementStats(userId)
  }
}

// Instancia singleton de Oriona IA
export const localAI = new OrianaAI()
