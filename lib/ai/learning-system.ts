import { supabase } from "@/lib/supabase/client"

export interface PatronLenguaje {
  id: string
  patron: string
  respuesta_tipo: string
  frecuencia: number
  contexto: any
  usuario_origen: string
}

export interface VocabularioUsuario {
  id: string
  usuario_id: string
  palabra: string
  significado: string
  contexto: string
  frecuencia_uso: number
  categoria: string
}

export interface MemoriaConversacion {
  id: string
  usuario_id: string
  tema: string
  resumen: string
  palabras_clave: string[]
  sentimiento: string
  importancia: number
  ultima_mencion: string
  frecuencia_mencion: number
}

export interface PerfilUsuario {
  id: string
  usuario_id: string
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

class LearningSystem {
  // Analizar sentimientos en el texto
  async analizarSentimiento(texto: string): Promise<AnalisisEmocional> {
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
    ]

    // Palabras neutras/interrogativas
    const palabrasNeutras = ["qué", "que", "cómo", "como", "cuándo", "cuando", "dónde", "donde", "por qué", "porque"]

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
      "llevar",
      "poner",
      "salir",
      "volver",
      "tomar",
      "conocer",
      "sentir",
      "vivir",
      "hablar",
      "llevar",
      "seguir",
      "encontrar",
      "llamar",
      "trabajar",
      "estudiar",
      "jugar",
      "pensar",
      "creer",
      "recordar",
      "olvidar",
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
      tecnología: ["programación", "código", "javascript", "python", "computadora", "software", "internet", "web"],
      ciencia: ["física", "química", "biología", "matemáticas", "ciencia", "experimento", "teoría"],
      cultura: ["españa", "madrid", "barcelona", "historia", "arte", "música", "literatura", "cultura"],
      educación: ["aprender", "estudiar", "escuela", "universidad", "conocimiento", "enseñar"],
      personal: ["familia", "amigos", "trabajo", "vida", "sentimientos", "emociones", "problemas"],
      entretenimiento: ["película", "libro", "juego", "deporte", "música", "diversión"],
      salud: ["salud", "medicina", "doctor", "enfermedad", "ejercicio", "bienestar"],
    }

    let mejorCategoria = "general"
    let mayorCoincidencias = 0

    for (const [categoria, palabrasCategoria] of Object.entries(categorias)) {
      const coincidencias = palabrasClave.filter((palabra) =>
        palabrasCategoria.some((palabraCategoria) => palabra.includes(palabraCategoria)),
      ).length

      if (coincidencias > mayorCoincidencias) {
        mayorCoincidencias = coincidencias
        mejorCategoria = categoria
      }
    }

    return mejorCategoria
  }

  // Aprender de una conversación
  async aprenderDeConversacion(
    usuarioId: string,
    mensajes: Array<{ contenido: string; es_usuario: boolean; id: string }>,
  ): Promise<void> {
    try {
      // Analizar cada mensaje del usuario
      for (const mensaje of mensajes.filter((m) => m.es_usuario)) {
        // Análisis emocional
        const analisisEmocional = await this.analizarSentimiento(mensaje.contenido)

        // Guardar análisis emocional
        await supabase.from("analisis_emocional").insert({
          usuario_id: usuarioId,
          mensaje_id: mensaje.id,
          sentimiento: analisisEmocional.sentimiento,
          intensidad: analisisEmocional.intensidad,
          emociones_detectadas: analisisEmocional.emociones_detectadas,
          contexto_emocional: analisisEmocional.contexto_emocional,
        })

        // Extraer y aprender vocabulario
        await this.aprenderVocabulario(usuarioId, mensaje.contenido)
      }

      // Crear memoria de la conversación
      await this.crearMemoriaConversacion(usuarioId, mensajes)

      // Actualizar perfil del usuario
      await this.actualizarPerfilUsuario(usuarioId, mensajes)
    } catch (error) {
      console.error("Error aprendiendo de conversación:", error)
    }
  }

  // Aprender vocabulario del usuario
  async aprenderVocabulario(usuarioId: string, texto: string): Promise<void> {
    const palabrasClave = this.extraerPalabrasClave(texto)

    for (const palabra of palabrasClave) {
      try {
        // Verificar si la palabra ya existe
        const { data: palabraExistente } = await supabase
          .from("vocabulario_usuario")
          .select("*")
          .eq("usuario_id", usuarioId)
          .eq("palabra", palabra)
          .single()

        if (palabraExistente) {
          // Incrementar frecuencia
          await supabase
            .from("vocabulario_usuario")
            .update({
              frecuencia_uso: palabraExistente.frecuencia_uso + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", palabraExistente.id)
        } else {
          // Crear nueva entrada
          await supabase.from("vocabulario_usuario").insert({
            usuario_id: usuarioId,
            palabra: palabra,
            significado: `Palabra utilizada por el usuario en contexto de conversación`,
            contexto: texto.substring(0, 200),
            frecuencia_uso: 1,
            categoria: "conversacional",
          })
        }
      } catch (error) {
        console.error("Error aprendiendo vocabulario:", error)
      }
    }
  }

  // Crear memoria de conversación
  async crearMemoriaConversacion(
    usuarioId: string,
    mensajes: Array<{ contenido: string; es_usuario: boolean }>,
  ): Promise<void> {
    const textoCompleto = mensajes.map((m) => m.contenido).join(" ")
    const tema = this.detectarTema(mensajes.map((m) => m.contenido))
    const palabrasClave = this.extraerPalabrasClave(textoCompleto)
    const analisisEmocional = await this.analizarSentimiento(textoCompleto)

    // Crear resumen de la conversación
    const resumen = this.crearResumenConversacion(mensajes)

    try {
      // Verificar si ya existe una memoria para este tema
      const { data: memoriaExistente } = await supabase
        .from("memoria_conversaciones")
        .select("*")
        .eq("usuario_id", usuarioId)
        .eq("tema", tema)
        .single()

      if (memoriaExistente) {
        // Actualizar memoria existente
        await supabase
          .from("memoria_conversaciones")
          .update({
            resumen: `${memoriaExistente.resumen}\n\n${resumen}`,
            palabras_clave: [...new Set([...memoriaExistente.palabras_clave, ...palabrasClave])],
            ultima_mencion: new Date().toISOString(),
            frecuencia_mencion: memoriaExistente.frecuencia_mencion + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", memoriaExistente.id)
      } else {
        // Crear nueva memoria
        await supabase.from("memoria_conversaciones").insert({
          usuario_id: usuarioId,
          tema: tema,
          resumen: resumen,
          palabras_clave: palabrasClave,
          sentimiento: analisisEmocional.sentimiento,
          importancia: Math.min(5, Math.max(1, Math.round(analisisEmocional.intensidad * 5))),
          ultima_mencion: new Date().toISOString(),
          frecuencia_mencion: 1,
        })
      }
    } catch (error) {
      console.error("Error creando memoria de conversación:", error)
    }
  }

  // Crear resumen de conversación
  crearResumenConversacion(mensajes: Array<{ contenido: string; es_usuario: boolean }>): string {
    const mensajesUsuario = mensajes.filter((m) => m.es_usuario).map((m) => m.contenido)
    const mensajesIA = mensajes.filter((m) => !m.es_usuario).map((m) => m.contenido)

    if (mensajesUsuario.length === 0) return "Conversación sin mensajes del usuario"

    const temasPrincipales = this.extraerPalabrasClave(mensajesUsuario.join(" "))
    const primerMensaje = mensajesUsuario[0].substring(0, 100)

    return `El usuario habló sobre: ${temasPrincipales.join(", ")}. Comenzó preguntando: "${primerMensaje}..."`
  }

  // Actualizar perfil del usuario
  async actualizarPerfilUsuario(
    usuarioId: string,
    mensajes: Array<{ contenido: string; es_usuario: boolean }>,
  ): Promise<void> {
    try {
      const mensajesUsuario = mensajes.filter((m) => m.es_usuario)
      const textoCompleto = mensajesUsuario.map((m) => m.contenido).join(" ")

      // Detectar estilo de comunicación
      const estiloComunicacion = this.detectarEstiloComunicacion(textoCompleto)

      // Detectar nivel de formalidad
      const nivelFormalidad = this.detectarNivelFormalidad(textoCompleto)

      // Detectar temas de interés
      const temasInteres = this.extraerPalabrasClave(textoCompleto)

      // Obtener perfil existente
      const { data: perfilExistente } = await supabase
        .from("perfil_usuario")
        .select("*")
        .eq("usuario_id", usuarioId)
        .single()

      if (perfilExistente) {
        // Actualizar perfil existente
        const temasActualizados = [...new Set([...perfilExistente.temas_interes, ...temasInteres])]

        await supabase
          .from("perfil_usuario")
          .update({
            estilo_comunicacion: estiloComunicacion,
            temas_interes: temasActualizados,
            nivel_formalidad: nivelFormalidad,
            updated_at: new Date().toISOString(),
          })
          .eq("id", perfilExistente.id)
      } else {
        // Crear nuevo perfil
        await supabase.from("perfil_usuario").insert({
          usuario_id: usuarioId,
          estilo_comunicacion: estiloComunicacion,
          temas_interes: temasInteres,
          nivel_formalidad: nivelFormalidad,
        })
      }
    } catch (error) {
      console.error("Error actualizando perfil de usuario:", error)
    }
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
  async obtenerMemoriaRelevante(usuarioId: string, consulta: string): Promise<MemoriaConversacion[]> {
    try {
      const palabrasClave = this.extraerPalabrasClave(consulta)

      const { data: memorias } = await supabase
        .from("memoria_conversaciones")
        .select("*")
        .eq("usuario_id", usuarioId)
        .order("ultima_mencion", { ascending: false })
        .limit(10)

      if (!memorias) return []

      // Filtrar memorias relevantes basadas en palabras clave
      return memorias.filter((memoria) =>
        palabrasClave.some((palabra) => memoria.palabras_clave.includes(palabra) || memoria.tema.includes(palabra)),
      )
    } catch (error) {
      console.error("Error obteniendo memoria relevante:", error)
      return []
    }
  }

  // Obtener perfil del usuario
  async obtenerPerfilUsuario(usuarioId: string): Promise<PerfilUsuario | null> {
    try {
      const { data: perfil } = await supabase.from("perfil_usuario").select("*").eq("usuario_id", usuarioId).single()

      return perfil
    } catch (error) {
      console.error("Error obteniendo perfil de usuario:", error)
      return null
    }
  }

  // Obtener vocabulario del usuario
  async obtenerVocabularioUsuario(usuarioId: string, limite = 20): Promise<VocabularioUsuario[]> {
    try {
      const { data: vocabulario } = await supabase
        .from("vocabulario_usuario")
        .select("*")
        .eq("usuario_id", usuarioId)
        .order("frecuencia_uso", { ascending: false })
        .limit(limite)

      return vocabulario || []
    } catch (error) {
      console.error("Error obteniendo vocabulario de usuario:", error)
      return []
    }
  }
}

export const learningSystem = new LearningSystem()
