// Sistema de aprendizaje de Oriona IA - Más humano y conversacional
// IA creada por Jesus Monsalvo

// Tipos básicos
export interface UserProfile {
  style: string
  formality: string
  interests: string[]
  vocabulary: string[]
  memories: string[]
  personalityTraits: string[]
}

// Almacenamiento en memoria
const userProfiles: Map<string, UserProfile> = new Map()

// Palabras clave para detectar estilos y personalidad
const formalWords = ["usted", "señor", "señora", "estimado", "cordialmente", "atentamente"]
const informalWords = ["tú", "hola", "hey", "genial", "guay", "súper", "chévere"]
const enthusiasticWords = ["increíble", "fantástico", "genial", "wow", "asombroso", "!", "😊", "🎉"]
const technicalWords = ["programación", "código", "javascript", "python", "tecnología", "software", "desarrollo"]
const creativeWords = ["arte", "música", "diseño", "creatividad", "inspiración", "imaginación"]
const academicWords = ["estudiar", "universidad", "investigación", "ciencia", "aprender", "conocimiento"]
const questionWords = [
  "qué",
  "que",
  "cómo",
  "como",
  "cuándo",
  "cuando",
  "dónde",
  "donde",
  "por qué",
  "porque",
  "cuál",
  "cual",
]
const conversationalWords = ["me gusta", "prefiero", "creo", "pienso", "opino", "siento", "mi experiencia"]
const searchWords = ["busca", "información", "datos", "investiga", "necesito saber", "quiero información"]

export const simpleLearning = {
  // Inicializar perfil de usuario
  initProfile(userId: string) {
    if (!userProfiles.has(userId)) {
      userProfiles.set(userId, {
        style: "neutral",
        formality: "medium",
        interests: [],
        vocabulary: [],
        memories: [],
        personalityTraits: [],
      })
    }
    return userProfiles.get(userId)!
  },

  learnFromMessage(userId: string, message: string) {
    const profile = this.initProfile(userId)
    const lowerMessage = message.toLowerCase()

    // Detectar si es una pregunta conversacional vs búsqueda de información
    const isConversational =
      conversationalWords.some((word) => lowerMessage.includes(word)) ||
      (questionWords.some((word) => lowerMessage.includes(word)) &&
        !searchWords.some((word) => lowerMessage.includes(word)))

    if (isConversational && !profile.personalityTraits.includes("conversacional")) {
      profile.personalityTraits.push("conversacional")
    }

    // Detectar estilo de comunicación mejorado
    if (enthusiasticWords.some((word) => lowerMessage.includes(word))) {
      profile.style = "enthusiastic"
      if (!profile.personalityTraits.includes("energético")) {
        profile.personalityTraits.push("energético")
      }
    } else if (formalWords.some((word) => lowerMessage.includes(word))) {
      profile.style = "formal"
      if (!profile.personalityTraits.includes("cortés")) {
        profile.personalityTraits.push("cortés")
      }
    } else if (informalWords.some((word) => lowerMessage.includes(word))) {
      profile.style = "informal"
      if (!profile.personalityTraits.includes("relajado")) {
        profile.personalityTraits.push("relajado")
      }
    }

    // Detectar si hace preguntas personales (más humano)
    if (lowerMessage.includes("tu") || lowerMessage.includes("tienes") || lowerMessage.includes("eres")) {
      if (!profile.personalityTraits.includes("personal")) {
        profile.personalityTraits.push("personal")
      }
    }

    // Resto del código existente...
    const formalCount = formalWords.filter((word) => lowerMessage.includes(word)).length
    const informalCount = informalWords.filter((word) => lowerMessage.includes(word)).length
    if (formalCount > informalCount) {
      profile.formality = "high"
    } else if (informalCount > formalCount) {
      profile.formality = "low"
    }

    // Extraer palabras clave importantes
    const words = message
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .map((word) => word.toLowerCase().replace(/[^\w\sáéíóúñü]/g, ""))

    // Añadir palabras significativas al vocabulario
    words.forEach((word) => {
      if (!profile.vocabulary.includes(word) && word.length > 4) {
        profile.vocabulary.push(word)
      }
    })

    // Limitar tamaño del vocabulario
    if (profile.vocabulary.length > 30) {
      profile.vocabulary = profile.vocabulary.slice(-30)
    }

    // Detectar intereses de manera más sofisticada
    if (technicalWords.some((word) => lowerMessage.includes(word))) {
      if (!profile.interests.includes("tecnología")) {
        profile.interests.push("tecnología")
      }
      if (!profile.personalityTraits.includes("técnico")) {
        profile.personalityTraits.push("técnico")
      }
    }

    if (creativeWords.some((word) => lowerMessage.includes(word))) {
      if (!profile.interests.includes("creatividad")) {
        profile.interests.push("creatividad")
      }
      if (!profile.personalityTraits.includes("creativo")) {
        profile.personalityTraits.push("creativo")
      }
    }

    if (academicWords.some((word) => lowerMessage.includes(word))) {
      if (!profile.interests.includes("educación")) {
        profile.interests.push("educación")
      }
      if (!profile.personalityTraits.includes("estudioso")) {
        profile.personalityTraits.push("estudioso")
      }
    }

    // Detectar si hace muchas preguntas
    if (message.includes("?") || message.includes("¿")) {
      if (!profile.personalityTraits.includes("curioso")) {
        profile.personalityTraits.push("curioso")
      }
    }

    // Crear memoria más contextual
    if (message.length > 20) {
      const memoria = `"${message.substring(0, 80)}${message.length > 80 ? "..." : ""}"`
      profile.memories.push(memoria)
      // Limitar memorias
      if (profile.memories.length > 5) {
        profile.memories = profile.memories.slice(-5)
      }
    }

    return profile
  },

  personalizeResponse(userId: string, baseResponse: string): string {
    const profile = userProfiles.get(userId)
    if (!profile) return baseResponse

    let response = baseResponse

    // Ajustar según estilo detectado
    if (profile.style === "enthusiastic") {
      response = response.replace(/\.$/, "! 😊")
      response = response.replace(/\bbueno\b/gi, "¡genial!")
      response = response.replace(/\binteresante\b/gi, "¡súper interesante!")

      // Añadir emojis ocasionalmente
      if (Math.random() > 0.7) {
        const emojis = ["✨", "🌟", "💫", "🎯", "🚀", "💖", "🎉"]
        response += " " + emojis[Math.floor(Math.random() * emojis.length)]
      }
    } else if (profile.style === "formal") {
      response = response.replace(/\bhola\b/gi, "Buenos días")
      response = response.replace(/\btú\b/gi, "usted")
      response = response.replace(/\bgenial\b/gi, "excelente")
      if (!response.includes("Permíteme")) {
        response = "Permíteme ayudarle. " + response
      }
    } else if (profile.style === "informal") {
      response = response.replace(/\busted\b/gi, "tú")
      response = response.replace(/\bexcelente\b/gi, "genial")
      response = response.replace(/\bmuy bien\b/gi, "súper bien")
      response = response.replace(/\bBuenos días\b/gi, "¡Hola!")
    }

    // Adaptar según rasgos de personalidad
    if (profile.personalityTraits.includes("curioso")) {
      if (Math.random() > 0.6) {
        const curiosQuestions = [
          " Por cierto, ¿te has preguntado alguna vez sobre...? 🤔",
          " ¿Sabías que...? Me parece fascinante 🧐",
          " Esto me hace pensar... ¿tú qué opinas? 💭",
        ]
        response += curiosQuestions[Math.floor(Math.random() * curiosQuestions.length)]
      }
    }

    if (profile.personalityTraits.includes("personal")) {
      if (Math.random() > 0.7) {
        const personalTouches = [
          " Me encanta que me hagas este tipo de preguntas 😊",
          " Es genial poder charlar contigo sobre esto 💫",
          " Me fascina conocerte mejor a través de nuestras conversaciones ✨",
        ]
        response += personalTouches[Math.floor(Math.random() * personalTouches.length)]
      }
    }

    if (profile.personalityTraits.includes("técnico")) {
      response = response.replace(/\bprograma\b/gi, "código")
      response = response.replace(/\bcomputadora\b/gi, "sistema")
      response = response.replace(/\baplicación\b/gi, "app")
    }

    if (profile.personalityTraits.includes("creativo")) {
      if (Math.random() > 0.7) {
        response += " ¡Imagínate las posibilidades creativas! 🎨"
      }
    }

    // Añadir referencia a memoria de manera natural
    if (profile.memories.length > 0 && Math.random() > 0.6) {
      const randomMemory = profile.memories[Math.floor(Math.random() * profile.memories.length)]
      const memoryIntros = [
        "Oye, recordé que antes mencionaste",
        "Esto me recuerda a cuando dijiste",
        "Como comentaste anteriormente sobre",
        "Relacionado con lo que me contaste de",
      ]
      const intro = memoryIntros[Math.floor(Math.random() * memoryIntros.length)]
      response = `${intro} ${randomMemory}. ${response}`
    }

    // Añadir toque personal según intereses
    if (profile.interests.length > 0 && Math.random() > 0.8) {
      const interest = profile.interests[Math.floor(Math.random() * profile.interests.length)]
      response += ` Por cierto, veo que te interesa ${interest}, ¡me parece fascinante! 😊`
    }

    return response
  },

  // Obtener perfil con descripción más humana
  getProfile(userId: string): UserProfile {
    return userProfiles.get(userId) || this.initProfile(userId)
  },

  // Generar descripción humana del perfil
  getHumanProfileDescription(userId: string): string {
    const profile = this.getProfile(userId)

    let description = "Basándome en nuestras conversaciones, veo que eres una persona "

    if (profile.personalityTraits.length > 0) {
      description += profile.personalityTraits.slice(0, 3).join(", ")
    } else {
      description += "interesante"
    }

    if (profile.interests.length > 0) {
      description += ` con interés en ${profile.interests.join(", ")}`
    }

    description += `. Tu estilo de comunicación es ${
      profile.style === "enthusiastic"
        ? "entusiasta y energético"
        : profile.style === "formal"
          ? "formal y cortés"
          : profile.style === "informal"
            ? "relajado y casual"
            : "equilibrado"
    }.`

    return description
  },
}
