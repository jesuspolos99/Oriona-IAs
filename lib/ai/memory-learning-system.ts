// Sistema de aprendizaje y memoria que funciona completamente en memoria
// Compatible con el entorno de vista previa

export interface PatronLenguaje {
  patron: string
  respuesta_tipo: string
  frecuencia: number
  contexto: any
  usuario_origen: string
}

export interface VocabularioUsuario {
  palabra: string
  significado: string
  contexto: string
  frecuencia_uso: number
  categoria: string
}

export interface MemoriaConversacion {
  tema: string
  resumen: string
  palabras_clave: string[]
  sentimiento: string
  importancia: number
  ultima_mencion: Date
  frecuencia_mencion: number
}

export interface PerfilUsuario {
  estilo_comunicacion: string
  temas_interes: string[]
  nivel_formalidad: string
  preferencias_respuesta: any
  personalidad_detectada: any
}

export interface AnalisisEmocional {
  sentimiento: string
  intensidad: number
  emociones_detectadas: string[]
  contexto_emocional: string
}

class MemoryLearningSystem {
  // Almacenamiento en memoria por usuario
  private usuariosData: Map<
    string,
    {
      vocabulario: Map<string, VocabularioUsuario>
      memorias: MemoriaConversacion[]
      perfil: PerfilUsuario
      patrones: PatronLenguaje[]
      analisisEmocional: AnalisisEmocional[]
    }
  > = new Map()

  // Inicializar datos para un usuario
  private inicializarUsuario(usuarioId: string) {
    if (!this.usuariosData.has(usuarioId)) {
      this.usuariosData.set(usuarioId, {
        vocabulario: new Map(),
        memorias: [],
        perfil: {
          estilo_comunicacion: "neutral",
          temas_interes: [],
          nivel_formalidad: "medio",
          preferencias_respuesta: {},
          personalidad_detectada: {},
        },
        patrones: [],
        analisisEmocional: [],
      })
    }
  }

  // Analizar sentimientos en el texto
  analizarSentimiento(texto: string): AnalisisEmocional {
    const textoLower = texto.toLowerCase()

    // Palabras positivas
    const palabrasPositivas = [
      "excelente",
      "genial",
      "fantástico",
      "perfecto",
      "increíble",
      "maravilloso",
      "bueno",
      "bien",
      "gracias",
      "me gusta",
      "feliz",
      "contento",
      "alegre",
      "satisfecho",
      "amor",
      "encanta",
      "fascina",
      "impresionante",
      "brillante",
    ]

    // Palabras negativas
    const palabrasNegativas = [
      "malo",
      "terrible",
      "horrible",
      "odio",
      "detesto",
      "molesto",
      "triste",
      "enojado",
      "frustrado",
      "decepcionado",
      "aburrido",
      "cansado",
      "preocupado",
      "ansioso",
      "estresado",
      "confundido",
      "perdido",
      "difícil",
      "complicado",
    ]

    // Palabras neutras/interrogativas
    const palabrasNeutras = [
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
      "explica",
      "información",
      "datos",
      "ayuda",
    ]

    let puntuacionPositiva = 0
    let puntuacionNegativa = 0
    let puntuacionNeutra = 0

    // Contar palabras de cada tipo
    palabrasPositivas.forEach((palabra) => {
      if (textoLower.includes(palabra)) puntuacionPositiva++
    })

    palabrasNegativas.forEach((palabra) => {
      if (textoLower.includes(palabra)) puntuacionNegativa++
    })

    palabrasNeutras.forEach((palabra) => {
      if (textoLower.includes(palabra)) puntuacionNeutra++
    })

    // Determinar sentimiento principal
    let sentimiento = "neutral"
    let intensidad = 0.5
    const emociones: string[] = []

    if (puntuacionPositiva > puntuacionNegativa) {
      sentimiento = "positivo"
      intensidad = Math.min(0.9, 0.5 + puntuacionPositiva * 0.1)
      emociones.push("alegría", "satisfacción")
    } else if (puntuacionNegativa > puntuacionPositiva) {
      sentimiento = "negativo"
      intensidad = Math.min(0.9, 0.5 + puntuacionNegativa * 0.1)
      emociones.push("frustración", "descontento")
    } else if (puntuacionNeutra > 0) {
      sentimiento = "curioso"
      intensidad = 0.6
      emociones.push("curiosidad", "interés")
    }

    // Detectar emociones específicas
    if (textoLower.includes("gracias") || textoLower.includes("agradezco")) {
      emociones.push("gratitud")
    }
    if (textoLower.includes("ayuda") || textoLower.includes("ayúdame")) {
      emociones.push("necesidad de apoyo")
    }
    if (textoLower.includes("no entiendo") || textoLower.includes("confundido")) {
      emociones.push("confusión")
    }

    return {
      sentimiento,
      intensidad,
      emociones_detectadas: emociones,
      contexto_emocional: `Análisis basado en ${puntuacionPositiva} palabras positivas, ${puntuacionNegativa} negativas, ${puntuacionNeutra} neutras`,
    }
  }

  // Extraer palabras clave de un texto
  extraerPalabrasClave(texto: string): string[] {
    const palabrasComunes = [
      "el",
      "la",
      "los",
      "las",
      "un",
      "una",
      "y",
      "o",
      "pero",
      "si",
      "no",
      "me",
      "te",
      "se",
      "le",
      "nos",
      "os",
      "les",
      "mi",
      "tu",
      "su",
      "que",
      "como",
      "cuando",
      "donde",
      "por",
      "para",
      "con",
      "sin",
      "sobre",
      "entre",
      "hasta",
      "desde",
      "hacia",
      "de",
      "del",
      "al",
      "en",
      "a",
      "es",
      "son",
      "está",
      "están",
      "fue",
      "fueron",
      "ser",
      "estar",
      "tener",
      "hacer",
      "decir",
      "poder",
      "deber",
      "querer",
      "saber",
      "ver",
      "dar",
      "ir",
      "venir",
    ]

    const palabras = texto
      .toLowerCase()
      .replace(/[^\w\sáéíóúñü]/g, "")
      .split(/\s+/)
      .filter((palabra) => palabra.length > 2 && !palabrasComunes.includes(palabra))

    // Contar frecuencia de palabras
    const frecuencia: { [key: string]: number } = {}
    palabras.forEach((palabra) => {
      frecuencia[palabra] = (frecuencia[palabra] || 0) + 1
    })

    // Ordenar por frecuencia y tomar las más relevantes
    return Object.entries(frecuencia)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([palabra]) => palabra)
  }

  // Detectar el tema principal de una conversación
  detectarTema(mensajes: string[]): string {
    const todoElTexto = mensajes.join(" ").toLowerCase()
    const palabrasClave = this.extraerPalabrasClave(todoElTexto)

    // Categorías temáticas
    const categorias = {
      tecnología: [
        "programación",
        "código",
        "javascript",
        "python",
        "computadora",
        "software",
        "internet",
        "web",
        "tecnología",
      ],
      ciencia: ["física", "química", "biología", "matemáticas", "ciencia", "experimento", "teoría", "investigación"],
      cultura: ["españa", "madrid", "barcelona", "historia", "arte", "música", "literatura", "cultura", "tradición"],
      educación: ["aprender", "estudiar", "escuela", "universidad", "conocimiento", "enseñar", "educación"],
      personal: ["familia", "amigos", "trabajo", "vida", "sentimientos", "emociones", "problemas", "personal"],
      entretenimiento: ["película", "libro", "juego", "deporte", "música", "diversión", "entretenimiento"],
      salud: ["salud", "medicina", "doctor", "enfermedad", "ejercicio", "bienestar", "médico"],
    }

    let mejorCategoria = "general"
    let mayorCoincidencias = 0

    for (const [categoria, palabrasCategoria] of Object.entries(categorias)) {
      const coincidencias = palabrasClave.filter((palabra) =>
        palabrasCategoria.some(
          (palabraCategoria) => palabra.includes(palabraCategoria) || palabraCategoria.includes(palabra),
        ),
      ).length

      if (coincidencias > mayorCoincidencias) {
        mayorCoincidencias = coincidencias
        mejorCategoria = categoria
      }
    }

    return mejorCategoria
  }

  // Aprender de una conversación
  aprenderDeConversacion(
    usuarioId: string,
    mensajes: Array<{ contenido: string; es_usuario: boolean; id: string }>,
  ): void {
    this.inicializarUsuario(usuarioId)
    const userData = this.usuariosData.get(usuarioId)!

    try {
      // Analizar cada mensaje del usuario
      for (const mensaje of mensajes.filter((m) => m.es_usuario)) {
        // Análisis emocional
        const analisisEmocional = this.analizarSentimiento(mensaje.contenido)
        userData.analisisEmocional.push(analisisEmocional)

        // Extraer y aprender vocabulario
        this.aprenderVocabulario(usuarioId, mensaje.contenido)
      }

      // Crear memoria de la conversación
      this.crearMemoriaConversacion(usuarioId, mensajes)

      // Actualizar perfil del usuario
      this.actualizarPerfilUsuario(usuarioId, mensajes)

      console.log(`Aprendizaje completado para usuario ${usuarioId}:`, {
        vocabulario: userData.vocabulario.size,
        memorias: userData.memorias.length,
        analisisEmocional: userData.analisisEmocional.length,
      })
    } catch (error) {
      console.error("Error aprendiendo de conversación:", error)
    }
  }

  // Aprender vocabulario del usuario
  aprenderVocabulario(usuarioId: string, texto: string): void {
    const userData = this.usuariosData.get(usuarioId)!
    const palabrasClave = this.extraerPalabrasClave(texto)

    for (const palabra of palabrasClave) {
      if (userData.vocabulario.has(palabra)) {
        // Incrementar frecuencia
        const palabraExistente = userData.vocabulario.get(palabra)!
        palabraExistente.frecuencia_uso++
        palabraExistente.contexto = texto.substring(0, 200)
      } else {
        // Crear nueva entrada
        userData.vocabulario.set(palabra, {
          palabra: palabra,
          significado: `Palabra utilizada por el usuario en contexto de conversación`,
          contexto: texto.substring(0, 200),
          frecuencia_uso: 1,
          categoria: "conversacional",
        })
      }
    }
  }

  // Crear memoria de conversación
  crearMemoriaConversacion(usuarioId: string, mensajes: Array<{ contenido: string; es_usuario: boolean }>): void {
    const userData = this.usuariosData.get(usuarioId)!
    const textoCompleto = mensajes.map((m) => m.contenido).join(" ")
    const tema = this.detectarTema(mensajes.map((m) => m.contenido))
    const palabrasClave = this.extraerPalabrasClave(textoCompleto)
    const analisisEmocional = this.analizarSentimiento(textoCompleto)

    // Crear resumen de la conversación
    const resumen = this.crearResumenConversacion(mensajes)

    // Verificar si ya existe una memoria para este tema
    const memoriaExistente = userData.memorias.find((m) => m.tema === tema)

    if (memoriaExistente) {
      // Actualizar memoria existente
      memoriaExistente.resumen = `${memoriaExistente.resumen}\n\n${resumen}`
      memoriaExistente.palabras_clave = [...new Set([...memoriaExistente.palabras_clave, ...palabrasClave])]
      memoriaExistente.ultima_mencion = new Date()
      memoriaExistente.frecuencia_mencion++
    } else {
      // Crear nueva memoria
      userData.memorias.push({
        tema: tema,
        resumen: resumen,
        palabras_clave: palabrasClave,
        sentimiento: analisisEmocional.sentimiento,
        importancia: Math.min(5, Math.max(1, Math.round(analisisEmocional.intensidad * 5))),
        ultima_mencion: new Date(),
        frecuencia_mencion: 1,
      })
    }

    // Mantener solo las 20 memorias más recientes
    userData.memorias.sort((a, b) => b.ultima_mencion.getTime() - a.ultima_mencion.getTime())
    userData.memorias = userData.memorias.slice(0, 20)
  }

  // Crear resumen de conversación
  crearResumenConversacion(mensajes: Array<{ contenido: string; es_usuario: boolean }>): string {
    const mensajesUsuario = mensajes.filter((m) => m.es_usuario).map((m) => m.contenido)

    if (mensajesUsuario.length === 0) return "Conversación sin mensajes del usuario"

    const temasPrincipales = this.extraerPalabrasClave(mensajesUsuario.join(" "))
    const primerMensaje = mensajesUsuario[0].substring(0, 100)

    return `El usuario habló sobre: ${temasPrincipales.join(", ")}. Comenzó preguntando: "${primerMensaje}..."`
  }

  // Actualizar perfil del usuario
  actualizarPerfilUsuario(usuarioId: string, mensajes: Array<{ contenido: string; es_usuario: boolean }>): void {
    const userData = this.usuariosData.get(usuarioId)!
    const mensajesUsuario = mensajes.filter((m) => m.es_usuario)
    const textoCompleto = mensajesUsuario.map((m) => m.contenido).join(" ")

    // Detectar estilo de comunicación
    const estiloComunicacion = this.detectarEstiloComunicacion(textoCompleto)

    // Detectar nivel de formalidad
    const nivelFormalidad = this.detectarNivelFormalidad(textoCompleto)

    // Detectar temas de interés
    const temasInteres = this.extraerPalabrasClave(textoCompleto)

    // Actualizar perfil
    userData.perfil.estilo_comunicacion = estiloComunicacion
    userData.perfil.nivel_formalidad = nivelFormalidad
    userData.perfil.temas_interes = [...new Set([...userData.perfil.temas_interes, ...temasInteres])]

    // Mantener solo los 15 temas más relevantes
    userData.perfil.temas_interes = userData.perfil.temas_interes.slice(0, 15)
  }

  // Detectar estilo de comunicación
  detectarEstiloComunicacion(texto: string): string {
    const textoLower = texto.toLowerCase()

    if (textoLower.includes("por favor") || textoLower.includes("gracias") || textoLower.includes("disculpe")) {
      return "cortés"
    }

    if (textoLower.includes("!") || textoLower.includes("genial") || textoLower.includes("increíble")) {
      return "entusiasta"
    }

    if (textoLower.includes("?") && textoLower.split("?").length > 2) {
      return "inquisitivo"
    }

    if (texto.length / texto.split(" ").length > 8) {
      return "detallado"
    }

    return "directo"
  }

  // Detectar nivel de formalidad
  detectarNivelFormalidad(texto: string): string {
    const textoLower = texto.toLowerCase()

    const palabrasFormales = ["usted", "señor", "señora", "estimado", "cordialmente", "atentamente"]
    const palabrasInformales = ["tú", "che", "chaval", "colega", "genial", "súper", "chévere"]

    const formalCount = palabrasFormales.filter((palabra) => textoLower.includes(palabra)).length
    const informalCount = palabrasInformales.filter((palabra) => textoLower.includes(palabra)).length

    if (formalCount > informalCount) return "alto"
    if (informalCount > formalCount) return "bajo"
    return "medio"
  }

  // Obtener memoria relevante para una consulta
  obtenerMemoriaRelevante(usuarioId: string, consulta: string): MemoriaConversacion[] {
    this.inicializarUsuario(usuarioId)
    const userData = this.usuariosData.get(usuarioId)!
    const palabrasClave = this.extraerPalabrasClave(consulta)

    // Filtrar memorias relevantes basadas en palabras clave
    return userData.memorias
      .filter((memoria) =>
        palabrasClave.some(
          (palabra) =>
            memoria.palabras_clave.includes(palabra) ||
            memoria.tema.includes(palabra) ||
            memoria.resumen.toLowerCase().includes(palabra),
        ),
      )
      .sort((a, b) => b.ultima_mencion.getTime() - a.ultima_mencion.getTime())
      .slice(0, 3)
  }

  // Obtener perfil del usuario
  obtenerPerfilUsuario(usuarioId: string): PerfilUsuario {
    this.inicializarUsuario(usuarioId)
    return this.usuariosData.get(usuarioId)!.perfil
  }

  // Obtener vocabulario del usuario
  obtenerVocabularioUsuario(usuarioId: string, limite = 20): VocabularioUsuario[] {
    this.inicializarUsuario(usuarioId)
    const userData = this.usuariosData.get(usuarioId)!

    return Array.from(userData.vocabulario.values())
      .sort((a, b) => b.frecuencia_uso - a.frecuencia_uso)
      .slice(0, limite)
  }

  // Obtener estadísticas del usuario
  obtenerEstadisticasUsuario(usuarioId: string) {
    this.inicializarUsuario(usuarioId)
    const userData = this.usuariosData.get(usuarioId)!

    return {
      vocabulario_aprendido: userData.vocabulario.size,
      memorias_almacenadas: userData.memorias.length,
      analisis_emocionales: userData.analisisEmocional.length,
      temas_interes: userData.perfil.temas_interes.length,
      estilo_comunicacion: userData.perfil.estilo_comunicacion,
      nivel_formalidad: userData.perfil.nivel_formalidad,
    }
  }
}

export const memoryLearningSystem = new MemoryLearningSystem()
