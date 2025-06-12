// Sistema de aprendizaje psicológico para Oriona IA
// Aprende de recursos web pero mantiene su personalidad natural
// IA creada por Jesus Monsalvo

interface PsychologyResource {
  title: string
  content: string
  techniques: string[]
  concepts: string[]
  source: string
}

interface TherapeuticTechnique {
  name: string
  description: string
  application: string
  naturalLanguage: string[]
}

interface PsychologyKnowledge {
  techniques: Map<string, TherapeuticTechnique>
  concepts: Map<string, string>
  naturalPhrases: string[]
  empathyPatterns: string[]
  validationPhrases: string[]
}

export class PsychologyLearningSystem {
  private knowledgeBase: PsychologyKnowledge = {
    techniques: new Map(),
    concepts: new Map(),
    naturalPhrases: [],
    empathyPatterns: [],
    validationPhrases: [],
  }

  private isLearning = false
  private lastLearningUpdate = 0

  constructor() {
    this.initializeBasicKnowledge()
  }

  // Inicializar conocimiento básico de psicología
  private initializeBasicKnowledge() {
    // Técnicas terapéuticas básicas
    this.knowledgeBase.techniques.set("grounding", {
      name: "Técnica de Grounding",
      description: "Ayuda a conectar con el presente cuando hay ansiedad",
      application: "Para ansiedad y ataques de pánico",
      naturalLanguage: [
        "¿Puedes contarme 5 cosas que ves a tu alrededor?",
        "Vamos a conectar con el presente por un momento",
        "Enfoquémonos en lo que puedes sentir ahora mismo",
        "¿Qué sonidos escuchas en este momento?",
      ],
    })

    this.knowledgeBase.techniques.set("validation", {
      name: "Validación Emocional",
      description: "Reconocer y aceptar las emociones sin juzgar",
      application: "Para cualquier estado emocional difícil",
      naturalLanguage: [
        "Lo que sientes es completamente válido",
        "Tiene mucho sentido que te sientas así",
        "No hay emociones 'incorrectas', solo experiencias humanas",
        "Tu dolor es real y merece ser reconocido",
      ],
    })

    this.knowledgeBase.techniques.set("reframing", {
      name: "Reestructuración Cognitiva",
      description: "Ayudar a ver las situaciones desde diferentes perspectivas",
      application: "Para pensamientos negativos automáticos",
      naturalLanguage: [
        "¿Hay otra forma de ver esta situación?",
        "¿Qué le dirías a un amigo en tu misma situación?",
        "¿Es posible que haya aspectos que no estás viendo?",
        "¿Cómo podrías replantear esto de manera más compasiva?",
      ],
    })

    // Frases empáticas naturales
    this.knowledgeBase.empathyPatterns = [
      "Puedo imaginar lo difícil que debe ser esto para ti",
      "Siento que estés pasando por esto",
      "Me conmueve que confíes en mí para compartir esto",
      "Reconozco el valor que tienes al expresar estos sentimientos",
      "Tu experiencia importa y merece ser escuchada",
      "Admiro tu fortaleza al enfrentar esto",
    ]

    // Frases de validación
    this.knowledgeBase.validationPhrases = [
      "Es completamente normal sentirse así",
      "Muchas personas han pasado por experiencias similares",
      "No estás solo/a en esto",
      "Tus sentimientos son una respuesta natural",
      "No hay una forma 'correcta' de sentirse",
      "Tu reacción es comprensible dada la situación",
    ]

    // Frases naturales para conversación
    this.knowledgeBase.naturalPhrases = [
      "Me pregunto si...",
      "¿Has notado que...?",
      "A veces puede ayudar...",
      "En mi experiencia conversando con personas...",
      "Lo que me llama la atención es...",
      "¿Te resuena la idea de...?",
      "Algo que he observado es...",
      "¿Cómo te sientes cuando...?",
    ]
  }

  // Buscar y aprender de recursos psicológicos en internet
  async learnFromPsychologyResources(topic: string): Promise<void> {
    // Evitar búsquedas muy frecuentes
    const now = Date.now()
    if (this.isLearning || now - this.lastLearningUpdate < 300000) {
      // 5 minutos entre actualizaciones
      return
    }

    this.isLearning = true
    this.lastLearningUpdate = now

    try {
      console.log(`🧠 Oriona aprendiendo sobre psicología: ${topic}`)

      // Buscar recursos específicos de psicología
      const resources = await this.searchPsychologyResources(topic)

      // Procesar y aprender de los recursos
      for (const resource of resources) {
        await this.processPsychologyResource(resource)
      }

      console.log(`✅ Oriona ha actualizado su conocimiento psicológico sobre: ${topic}`)
    } catch (error) {
      console.error("Error aprendiendo psicología:", error)
    } finally {
      this.isLearning = false
    }
  }

  // Buscar recursos específicos de psicología
  private async searchPsychologyResources(topic: string): Promise<PsychologyResource[]> {
    const resources: PsychologyResource[] = []

    try {
      // Búsquedas específicas en sitios de psicología
      const psychologyQueries = [
        `${topic} técnicas terapéuticas site:psicologiaymente.com`,
        `${topic} apoyo emocional site:colegiopsicologos.es`,
        `${topic} terapia cognitivo conductual`,
        `${topic} mindfulness técnicas`,
        `${topic} validación emocional`,
        `${topic} psicología positiva`,
      ]

      for (const query of psychologyQueries.slice(0, 2)) {
        // Limitar a 2 búsquedas para no sobrecargar
        const searchResults = await this.performPsychologySearch(query)
        resources.push(...searchResults)
      }

      // Agregar recursos de sitios específicos de psicología
      const specificResources = await this.getSpecificPsychologyResources(topic)
      resources.push(...specificResources)
    } catch (error) {
      console.error("Error buscando recursos de psicología:", error)
    }

    return resources.slice(0, 5) // Limitar a 5 recursos
  }

  // Realizar búsqueda específica de psicología
  private async performPsychologySearch(query: string): Promise<PsychologyResource[]> {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (response.ok) {
        const data = await response.json()
        return this.convertSearchResultsToPsychologyResources(data.results || [])
      }
    } catch (error) {
      console.error("Error en búsqueda de psicología:", error)
    }

    return []
  }

  // Convertir resultados de búsqueda a recursos de psicología
  private convertSearchResultsToPsychologyResources(results: any[]): PsychologyResource[] {
    return results
      .filter((result) => this.isPsychologyRelevant(result.snippet))
      .map((result) => ({
        title: result.title,
        content: result.snippet,
        techniques: this.extractTechniques(result.snippet),
        concepts: this.extractConcepts(result.snippet),
        source: result.url,
      }))
  }

  // Verificar si el contenido es relevante para psicología
  private isPsychologyRelevant(content: string): boolean {
    const psychologyKeywords = [
      "terapia",
      "psicología",
      "emocional",
      "ansiedad",
      "depresión",
      "autoestima",
      "mindfulness",
      "cognitivo",
      "conductual",
      "validación",
      "empática",
      "bienestar",
      "salud mental",
      "técnicas",
      "estrategias",
      "apoyo",
      "resilencia",
      "afrontamiento",
    ]

    const contentLower = content.toLowerCase()
    return psychologyKeywords.some((keyword) => contentLower.includes(keyword))
  }

  // Extraer técnicas del contenido
  private extractTechniques(content: string): string[] {
    const techniques: string[] = []
    const contentLower = content.toLowerCase()

    const techniquePatterns = [
      /técnica de ([^.]+)/gi,
      /estrategia de ([^.]+)/gi,
      /método de ([^.]+)/gi,
      /ejercicio de ([^.]+)/gi,
      /práctica de ([^.]+)/gi,
    ]

    for (const pattern of techniquePatterns) {
      const matches = contentLower.matchAll(pattern)
      for (const match of matches) {
        if (match[1] && match[1].length < 50) {
          techniques.push(match[1].trim())
        }
      }
    }

    return techniques
  }

  // Extraer conceptos del contenido
  private extractConcepts(content: string): string[] {
    const concepts: string[] = []
    const contentLower = content.toLowerCase()

    const conceptKeywords = [
      "validación emocional",
      "regulación emocional",
      "inteligencia emocional",
      "autocompasión",
      "mindfulness",
      "resiliencia",
      "autoestima",
      "asertividad",
      "empatía",
      "escucha activa",
      "reestructuración cognitiva",
      "exposición gradual",
      "relajación progresiva",
    ]

    for (const concept of conceptKeywords) {
      if (contentLower.includes(concept)) {
        concepts.push(concept)
      }
    }

    return concepts
  }

  // Obtener recursos específicos de sitios de psicología
  private async getSpecificPsychologyResources(topic: string): Promise<PsychologyResource[]> {
    // Recursos simulados basados en conocimiento real de psicología
    const specificResources: PsychologyResource[] = []

    if (topic.includes("ansiedad") || topic.includes("nervioso") || topic.includes("preocup")) {
      specificResources.push({
        title: "Técnicas de Manejo de Ansiedad",
        content:
          "La respiración diafragmática es fundamental para calmar el sistema nervioso. La técnica 4-7-8 consiste en inhalar por 4, mantener por 7 y exhalar por 8. El grounding o técnica 5-4-3-2-1 ayuda a conectar con el presente.",
        techniques: ["respiración diafragmática", "técnica 4-7-8", "grounding 5-4-3-2-1"],
        concepts: ["regulación del sistema nervioso", "mindfulness", "presencia"],
        source: "Conocimiento terapéutico integrado",
      })
    }

    if (topic.includes("triste") || topic.includes("deprim") || topic.includes("vacío")) {
      specificResources.push({
        title: "Apoyo para Estados Depresivos",
        content:
          "La validación emocional es crucial. Pequeñas actividades placenteras pueden ayudar. La autocompasión implica tratarse con la misma amabilidad que a un buen amigo. Las rutinas básicas de autocuidado son fundamentales.",
        techniques: ["actividades placenteras", "autocompasión", "rutinas de autocuidado"],
        concepts: ["validación emocional", "autocuidado", "compasión"],
        source: "Terapia cognitivo-conductual adaptada",
      })
    }

    if (topic.includes("autoestima") || topic.includes("no valgo") || topic.includes("fracaso")) {
      specificResources.push({
        title: "Fortalecimiento de la Autoestima",
        content:
          "El diálogo interno compasivo es esencial. Cuestionar los pensamientos automáticos negativos. Reconocer fortalezas y logros, por pequeños que sean. La autocompasión es más efectiva que la autocrítica.",
        techniques: ["diálogo interno compasivo", "cuestionamiento de pensamientos", "reconocimiento de fortalezas"],
        concepts: ["autocompasión", "reestructuración cognitiva", "autoestima"],
        source: "Terapia de autocompasión",
      })
    }

    return specificResources
  }

  // Procesar y aprender de un recurso de psicología
  private async processPsychologyResource(resource: PsychologyResource): Promise<void> {
    // Extraer y almacenar técnicas
    for (const technique of resource.techniques) {
      if (!this.knowledgeBase.techniques.has(technique)) {
        this.knowledgeBase.techniques.set(technique, {
          name: technique,
          description: this.generateTechniqueDescription(technique, resource.content),
          application: this.inferTechniqueApplication(technique),
          naturalLanguage: this.generateNaturalLanguageForTechnique(technique),
        })
      }
    }

    // Extraer y almacenar conceptos
    for (const concept of resource.concepts) {
      if (!this.knowledgeBase.concepts.has(concept)) {
        this.knowledgeBase.concepts.set(concept, this.generateConceptDescription(concept, resource.content))
      }
    }

    // Extraer frases empáticas naturales del contenido
    const empathicPhrases = this.extractEmpathicPhrases(resource.content)
    this.knowledgeBase.empathyPatterns.push(...empathicPhrases)

    // Mantener solo las mejores frases (evitar acumulación excesiva)
    this.knowledgeBase.empathyPatterns = [...new Set(this.knowledgeBase.empathyPatterns)].slice(0, 50)
  }

  // Generar descripción natural de técnica
  private generateTechniqueDescription(technique: string, content: string): string {
    const descriptions = [
      `Una técnica que he aprendido sobre ${technique} que puede ser muy útil`,
      `${technique} es algo que he visto que ayuda mucho a las personas`,
      `He notado que ${technique} puede ser especialmente efectivo`,
      `Una aproximación que me parece valiosa es ${technique}`,
    ]

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  // Inferir aplicación de técnica
  private inferTechniqueApplication(technique: string): string {
    const techniqueLower = technique.toLowerCase()

    if (techniqueLower.includes("respiración") || techniqueLower.includes("respir")) {
      return "Para momentos de ansiedad o estrés"
    }
    if (techniqueLower.includes("grounding") || techniqueLower.includes("presente")) {
      return "Para conectar con el momento presente"
    }
    if (techniqueLower.includes("autocompasión") || techniqueLower.includes("compasión")) {
      return "Para mejorar la relación contigo mismo/a"
    }
    if (techniqueLower.includes("validación") || techniqueLower.includes("validar")) {
      return "Para reconocer y aceptar emociones"
    }

    return "Para bienestar emocional general"
  }

  // Generar lenguaje natural para técnica
  private generateNaturalLanguageForTechnique(technique: string): string[] {
    const naturalPhrases = [
      `¿Te gustaría que exploremos ${technique} juntos?`,
      `Algo que podría ayudar es ${technique}`,
      `He visto que ${technique} puede ser reconfortante`,
      `¿Has probado alguna vez ${technique}?`,
      `Una cosa que me parece útil es ${technique}`,
    ]

    return naturalPhrases
  }

  // Generar descripción de concepto
  private generateConceptDescription(concept: string, content: string): string {
    return `${concept} es un concepto importante que puede ayudar en el bienestar emocional`
  }

  // Extraer frases empáticas del contenido
  private extractEmpathicPhrases(content: string): string[] {
    const phrases: string[] = []
    const sentences = content.split(/[.!?]+/)

    for (const sentence of sentences) {
      const sentenceTrimmed = sentence.trim()
      if (sentenceTrimmed.length > 20 && sentenceTrimmed.length < 100 && this.isEmpathicPhrase(sentenceTrimmed)) {
        phrases.push(sentenceTrimmed)
      }
    }

    return phrases.slice(0, 3) // Máximo 3 frases por recurso
  }

  // Verificar si una frase es empática
  private isEmpathicPhrase(phrase: string): boolean {
    const empathicKeywords = [
      "es normal",
      "es comprensible",
      "es válido",
      "no estás solo",
      "muchas personas",
      "es importante",
      "mereces",
      "tienes derecho",
      "está bien",
      "es natural",
    ]

    const phraseLower = phrase.toLowerCase()
    return empathicKeywords.some((keyword) => phraseLower.includes(keyword))
  }

  // Obtener respuesta psicológica informada
  async getInformedPsychologicalResponse(prompt: string, emotionalState: string, context: any): Promise<string | null> {
    // Aprender de recursos relevantes antes de responder
    await this.learnFromPsychologyResources(prompt)

    // Buscar técnicas relevantes
    const relevantTechniques = this.findRelevantTechniques(prompt, emotionalState)

    // Buscar conceptos relevantes
    const relevantConcepts = this.findRelevantConcepts(prompt)

    // Si no hay conocimiento relevante, devolver null para usar respuesta base
    if (relevantTechniques.length === 0 && relevantConcepts.length === 0) {
      return null
    }

    // Generar respuesta informada pero natural
    return this.generateInformedResponse(prompt, emotionalState, relevantTechniques, relevantConcepts)
  }

  // Encontrar técnicas relevantes
  private findRelevantTechniques(prompt: string, emotionalState: string): TherapeuticTechnique[] {
    const techniques: TherapeuticTechnique[] = []
    const promptLower = prompt.toLowerCase()

    for (const [name, technique] of this.knowledgeBase.techniques) {
      if (
        promptLower.includes(name.toLowerCase()) ||
        technique.application.toLowerCase().includes(emotionalState) ||
        this.isTechniqueRelevant(technique, promptLower, emotionalState)
      ) {
        techniques.push(technique)
      }
    }

    return techniques.slice(0, 2) // Máximo 2 técnicas por respuesta
  }

  // Verificar si una técnica es relevante
  private isTechniqueRelevant(technique: TherapeuticTechnique, prompt: string, emotionalState: string): boolean {
    const relevanceMap = {
      anxious: ["grounding", "respiración", "presente", "calma"],
      sad: ["validación", "autocompasión", "autocuidado", "actividades"],
      angry: ["regulación", "respiración", "pausa", "reflexión"],
      confused: ["clarificación", "exploración", "reflexión", "perspectiva"],
    }

    const relevantKeywords = relevanceMap[emotionalState as keyof typeof relevanceMap] || []
    const techniqueName = technique.name.toLowerCase()

    return relevantKeywords.some((keyword) => techniqueName.includes(keyword) || prompt.includes(keyword))
  }

  // Encontrar conceptos relevantes
  private findRelevantConcepts(prompt: string): string[] {
    const concepts: string[] = []
    const promptLower = prompt.toLowerCase()

    for (const [name, description] of this.knowledgeBase.concepts) {
      if (promptLower.includes(name.toLowerCase()) || this.isConceptRelevant(name, promptLower)) {
        concepts.push(name)
      }
    }

    return concepts.slice(0, 2) // Máximo 2 conceptos por respuesta
  }

  // Verificar si un concepto es relevante
  private isConceptRelevant(concept: string, prompt: string): boolean {
    const conceptLower = concept.toLowerCase()
    const conceptKeywords = conceptLower.split(" ")

    return conceptKeywords.some((keyword) => prompt.includes(keyword))
  }

  // Generar respuesta informada pero natural
  private generateInformedResponse(
    prompt: string,
    emotionalState: string,
    techniques: TherapeuticTechnique[],
    concepts: string[],
  ): string {
    let response = ""

    // Comenzar con empatía natural
    const empathyPhrase = this.getRandomEmpathyPhrase()
    response += `${empathyPhrase}\n\n`

    // Integrar técnicas de forma natural
    if (techniques.length > 0) {
      const technique = techniques[0]
      const naturalPhrase = this.getRandomNaturalPhrase()
      const techniqueLanguage = technique.naturalLanguage[Math.floor(Math.random() * technique.naturalLanguage.length)]

      response += `${naturalPhrase} ${techniqueLanguage}\n\n`

      // Agregar descripción natural de la técnica
      response += `${technique.description}. ${technique.application}.\n\n`
    }

    // Integrar conceptos de forma natural
    if (concepts.length > 0) {
      const concept = concepts[0]
      const conceptDescription = this.knowledgeBase.concepts.get(concept)
      response += `Algo importante sobre ${concept}: ${conceptDescription}\n\n`
    }

    // Agregar validación
    const validationPhrase = this.getRandomValidationPhrase()
    response += `${validationPhrase}\n\n`

    // Pregunta de seguimiento empática
    const followUpQuestions = [
      "¿Cómo te sientes al escuchar esto?",
      "¿Hay algo de esto que te resuena?",
      "¿Te gustaría que exploremos esto más profundamente?",
      "¿Qué piensas sobre esta perspectiva?",
      "¿Hay algo más que te gustaría compartir?",
    ]

    response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]

    return response.trim()
  }

  // Obtener frase empática aleatoria
  private getRandomEmpathyPhrase(): string {
    return this.knowledgeBase.empathyPatterns[Math.floor(Math.random() * this.knowledgeBase.empathyPatterns.length)]
  }

  // Obtener frase natural aleatoria
  private getRandomNaturalPhrase(): string {
    return this.knowledgeBase.naturalPhrases[Math.floor(Math.random() * this.knowledgeBase.naturalPhrases.length)]
  }

  // Obtener frase de validación aleatoria
  private getRandomValidationPhrase(): string {
    return this.knowledgeBase.validationPhrases[Math.floor(Math.random() * this.knowledgeBase.validationPhrases.length)]
  }

  // Obtener estadísticas del conocimiento aprendido
  getKnowledgeStats() {
    return {
      techniques: this.knowledgeBase.techniques.size,
      concepts: this.knowledgeBase.concepts.size,
      empathyPatterns: this.knowledgeBase.empathyPatterns.length,
      validationPhrases: this.knowledgeBase.validationPhrases.length,
      naturalPhrases: this.knowledgeBase.naturalPhrases.length,
      lastUpdate: new Date(this.lastLearningUpdate).toLocaleString(),
    }
  }
}

export const psychologyLearning = new PsychologyLearningSystem()
