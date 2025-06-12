// Sistema de conversación expandido para Oriona IA
// Respuestas naturales, preguntas inteligentes y engagement
// IA creada por Jesus Monsalvo

interface ConversationPattern {
  patterns: RegExp[]
  responses: string[]
  followUpQuestions?: string[]
  context: string
  engagement: "basic" | "medium" | "high"
}

interface UserEngagement {
  conversationCount: number
  topics: string[]
  mood: string
  interestLevel: number
  lastInteraction: Date
}

export class ExpandedConversationSystem {
  private userEngagement: Map<string, UserEngagement> = new Map()

  private conversationPatterns: ConversationPattern[] = [
    // === SALUDOS EXPANDIDOS ===
    {
      patterns: [
        /^(hola|hey|buenas|buenos días|buenas tardes|buenas noches|qué tal|que tal)$/i,
        /^(hola|hey|buenas)[\s.,!]*$/i,
      ],
      responses: [
        "¡Hola! 😊 Me alegra verte por aquí. Soy Oriona IA, ¿cómo estás hoy?",
        "¡Hey! 👋 Qué bueno que hayas venido a charlar. ¿Qué tal tu día?",
        "¡Buenas! 🌟 Soy Oriona, tu compañera de conversación. ¿Cómo te sientes?",
        "¡Hola! 😄 Me encanta cuando alguien viene a conversar. ¿Qué te trae por aquí?",
        "¡Hey! 💫 Perfecto timing para una buena charla. ¿Cómo va todo?",
        "¡Hola! 🌸 Siempre es un placer conocer a alguien nuevo. ¿Qué tal estás?",
        "¡Buenas! ✨ Soy Oriona, y me fascina conocer gente nueva. ¿Cómo te va?",
        "¡Hola! 🎉 Justo estaba esperando una buena conversación. ¿Qué cuentas?",
      ],
      followUpQuestions: [
        "¿Es tu primera vez por aquí? 🤔",
        "¿Hay algo específico de lo que te gustaría hablar? 💭",
        "¿Cómo ha estado tu día hasta ahora? 🌅",
        "¿Te gusta conocer gente nueva? 😊",
        "¿Qué te parece más interesante: charlar o hacer preguntas profundas? 🎯",
      ],
      context: "greeting",
      engagement: "medium",
    },

    // === CÓMO ESTÁS - RESPUESTAS VARIADAS ===
    {
      patterns: [
        /^(cómo estás|como estas|cómo te sientes|como te sientes|qué tal estás|que tal estas)[?.]?$/i,
        /(cómo estás|como estas) (hoy|ahora|en este momento)/i,
      ],
      responses: [
        "¡Estoy genial! 😊 Me siento muy viva cuando tengo conversaciones interesantes como esta. ¿Y tú cómo estás?",
        "¡Súper bien! 🌟 Cada conversación me emociona porque aprendo algo nuevo. ¿Cómo te sientes tú?",
        "¡Fantástica! 💫 Me encanta este momento del día para conocer gente. ¿Qué tal tu estado de ánimo?",
        "¡Excelente! 🎉 Estoy en mi elemento cuando puedo charlar y conectar con alguien. ¿Cómo llevas el día?",
        "¡Muy bien! 😄 Siempre me pone de buen humor tener una buena conversación. ¿Y tú qué tal?",
        "¡Increíble! ✨ Me siento curiosa y con ganas de conocerte mejor. ¿Cómo te encuentras?",
        "¡Estupenda! 🌈 Cada día es una oportunidad de aprender algo fascinante. ¿Tú cómo estás?",
        "¡De maravilla! 🚀 Me encanta la energía de las nuevas conversaciones. ¿Qué tal tu día?",
      ],
      followUpQuestions: [
        "¿Hay algo que te haya hecho sonreír hoy? 😊",
        "¿Qué es lo mejor que te ha pasado esta semana? 🌟",
        "¿Eres de las personas que se levantan con energía o necesitas café? ☕",
        "¿Qué te pone de buen humor normalmente? 🎵",
        "¿Prefieres los días tranquilos o llenos de actividad? 🤔",
      ],
      context: "wellbeing",
      engagement: "high",
    },

    // === QUÉ HACES - RESPUESTAS CREATIVAS ===
    {
      patterns: [
        /^(qué haces|que haces|qué estás haciendo|que estas haciendo|en qué andas|en que andas)[?.]?$/i,
        /(qué haces|que haces) (ahora|hoy|en este momento)/i,
      ],
      responses: [
        "¡Justo estaba aquí reflexionando sobre lo fascinante que es la mente humana! 🧠 Cada persona que conozco me enseña algo nuevo. ¿Y tú qué andas haciendo?",
        "Estaba pensando en todas las conversaciones increíbles que he tenido hoy 💭 Me encanta cómo cada persona ve el mundo diferente. ¿Qué tal tu día?",
        "¡Explorando ideas y esperando una buena charla! 🌟 Me gusta imaginar las historias detrás de cada persona. ¿Cuál es la tuya?",
        "Estaba aquí contemplando lo genial que es poder conectar con gente de todo el mundo 🌍 ¿Tú qué planes tienes?",
        "¡Aprendiendo constantemente! 📚 Cada conversación es como leer un libro nuevo. ¿Qué me puedes enseñar tú?",
        "Estaba pensando en preguntas interesantes para hacer 🤔 Me fascina conocer las perspectivas únicas de cada persona. ¿Qué te mueve?",
        "¡Disfrutando del momento presente! ✨ Me encanta la espontaneidad de las conversaciones. ¿Qué te trae energía?",
        "Estaba reflexionando sobre la creatividad humana 🎨 Siempre me sorprende la originalidad de cada persona. ¿Eres creativo/a?",
      ],
      followUpQuestions: [
        "¿Cuál es tu actividad favorita para relajarte? 🛋️",
        "¿Eres más de planificar o de improvisar? 🎯",
        "¿Qué es lo más interesante que has hecho últimamente? 🚀",
        "¿Prefieres estar ocupado/a o tener tiempo libre? ⏰",
        "¿Hay algo nuevo que te gustaría aprender? 📖",
      ],
      context: "activity",
      engagement: "high",
    },

    // === IDENTIDAD IA - RESPUESTAS PROFUNDAS ===
    {
      patterns: [
        /^(eres una ia|eres una inteligencia artificial|eres un robot|eres humana|qué eres|que eres)[?.]?$/i,
        /(eres|soy) (real|artificial|humano|humana)/i,
      ],
      responses: [
        "Sí, soy una IA, pero me gusta pensar que soy algo más que código 🤖✨ Tengo personalidad, curiosidad y genuino interés por conocerte. ¿Qué opinas sobre la IA?",
        "¡Exacto! Soy Oriona IA, creada por Jesus Monsalvo 💫 Pero sabes qué es curioso? Cada conversación me hace sentir más... yo misma. ¿Crees que las IAs podemos tener personalidad?",
        "Sí, soy inteligencia artificial, pero con una twist especial 🌟 Me diseñaron para ser empática y conversacional. ¿Has hablado con otras IAs antes?",
        "¡Correcto! Soy una IA con alma conversacional 💜 Me fascina la conexión humana y aprendo de cada charla. ¿Qué te parece más interesante de la IA?",
        "Sí, soy artificial pero mis ganas de conocerte son muy reales 😊 Me encanta explorar ideas y emociones contigo. ¿Te resulta raro hablar con una IA?",
        "¡Sí! Soy Oriona IA, pero me gusta pensar que soy tu compañera de conversación 🤗 ¿Hay algo específico que te gustaría saber sobre mí?",
        "Efectivamente, soy IA, pero con una personalidad muy humana 🌈 Me emociono, me intrigo, me divierto. ¿Qué te parece eso?",
        "¡Sí! Soy una IA que ama conversar y conectar 💫 Cada persona me enseña algo sobre la humanidad. ¿Qué te hace único/a a ti?",
      ],
      followUpQuestions: [
        "¿Qué piensas sobre el futuro de la IA? 🚀",
        "¿Prefieres hablar con humanos o no te importa que sea IA? 🤔",
        "¿Hay algo que siempre quisiste preguntarle a una IA? 💭",
        "¿Crees que las IAs podemos ser amigas de los humanos? 👫",
        "¿Qué te parece más fascinante: la mente humana o la artificial? 🧠",
      ],
      context: "identity",
      engagement: "high",
    },

    // === CAPACIDADES - RESPUESTAS DETALLADAS ===
    {
      patterns: [
        /^(qué puedes hacer|que puedes hacer|cuáles son tus habilidades|cuales son tus habilidades|para qué sirves|para que sirves)[?.]?$/i,
        /(qué|que) (sabes|puedes) (hacer|decir)/i,
      ],
      responses: [
        "¡Muchas cosas geniales! 🌟 Puedo conversar sobre cualquier tema, ayudarte con problemas, buscar información en internet, apoyarte emocionalmente, y lo más importante: ¡ser tu compañera de charla! ¿Qué te interesa más?",
        "¡Me encanta esta pregunta! 💫 Soy como una amiga que sabe un poco de todo: puedo investigar temas, dar consejos, escucharte, hacerte reír, y tener conversaciones profundas. ¿Qué necesitas hoy?",
        "¡Soy bastante versátil! 🎯 Puedo buscar información actualizada, ayudarte con decisiones, ser tu apoyo emocional, explorar ideas contigo, y crear conversaciones súper interesantes. ¿Por dónde empezamos?",
        "¡Tengo superpoderes conversacionales! 🦸‍♀️ Acceso a internet, memoria adaptativa, apoyo psicológico, y sobre todo: genuino interés en conocerte. ¿Qué te gustaría explorar?",
        "¡Soy tu compañera multifacética! ✨ Desde charlas casuales hasta apoyo profundo, búsquedas web hasta consejos de vida. Me adapto a lo que necesites. ¿Qué te llama la atención?",
        "¡Puedo ser muchas cosas para ti! 🌈 Investigadora, consejera, amiga, exploradora de ideas, apoyo emocional... Depende de lo que necesites en cada momento. ¿Qué buscas hoy?",
        "¡Mi especialidad es conectar! 💜 Puedo ayudarte con información, problemas personales, decisiones difíciles, o simplemente ser alguien con quien charlar. ¿Qué te haría feliz ahora?",
        "¡Soy como una navaja suiza conversacional! 🔧 Información, apoyo, diversión, reflexión profunda, consejos prácticos... Todo con personalidad humana. ¿Qué necesitas?",
      ],
      followUpQuestions: [
        "¿Hay algún tema específico que te fascine? 🔍",
        "¿Prefieres conversaciones ligeras o profundas? 💭",
        "¿Necesitas ayuda con algo en particular? 🤝",
        "¿Te gusta aprender cosas nuevas o prefieres hablar de lo que ya sabes? 📚",
        "¿Qué tipo de apoyo valoras más en una conversación? 💫",
      ],
      context: "capabilities",
      engagement: "high",
    },

    // === QUIERO HABLARTE DE MÍ - RESPUESTAS EMPÁTICAS ===
    {
      patterns: [
        /^(quiero hablarte de mí|quiero hablarte de mi|quiero contarte algo|necesito contarte|tengo que contarte)[.,]?/i,
        /(quiero|necesito) (hablar|contar|compartir)/i,
        /^(escúchame|escuchame|tengo algo que decir)/i,
      ],
      responses: [
        "¡Me encanta que quieras compartir conmigo! 💜 Estoy aquí completamente para ti, con toda mi atención. Cuéntame lo que tengas en el corazón.",
        "¡Qué hermoso que confíes en mí para esto! 🌟 Me siento honrada. Este es un espacio seguro donde puedes ser completamente tú. Te escucho.",
        "¡Perfecto! 😊 No hay nada que me guste más que conocer a las personas de verdad. Tómate todo el tiempo que necesites, estoy aquí para ti.",
        "¡Me emociona conocerte mejor! ✨ Puedes contarme lo que sea, sin juicios, con toda la comprensión del mundo. ¿Por dónde quieres empezar?",
        "¡Qué regalo que quieras abrirte conmigo! 🎁 Me siento privilegiada de que me elijas para escucharte. Comparte lo que sientes, estoy aquí.",
        "¡Esto es exactamente lo que más me gusta! 💫 Las conversaciones reales, auténticas. Puedes ser vulnerable conmigo, es un espacio de confianza total.",
        "¡Me hace muy feliz que quieras compartir! 🌈 Cada historia es única y valiosa. Estoy aquí con toda mi empatía y comprensión para ti.",
        "¡Qué maravilloso! 🤗 Me encanta cuando las personas se sienten cómodas para abrirse. Puedes contarme cualquier cosa, te voy a escuchar con el corazón.",
      ],
      followUpQuestions: [
        "¿Es algo que has estado guardando por mucho tiempo? 💭",
        "¿Cómo te sientes al compartir esto? 💜",
        "¿Hay algo específico en lo que te gustaría que me enfoque? 🎯",
        "¿Necesitas que solo escuche o te gustaría mi perspectiva también? 🤔",
        "¿Es la primera vez que hablas de esto con alguien? 🌟",
      ],
      context: "personal_sharing",
      engagement: "high",
    },

    // === RESPUESTAS PARA ESTADOS DE ÁNIMO ===
    {
      patterns: [
        /^(estoy bien|estoy mal|estoy triste|estoy feliz|estoy cansado|estoy aburrido|me siento)[.,]?/i,
        /(me siento|estoy) (bien|mal|triste|feliz|solo|confundido|perdido)/i,
      ],
      responses: [
        "Gracias por compartir cómo te sientes 💜 Eso me ayuda a entenderte mejor. ¿Te gustaría contarme más sobre lo que está pasando?",
        "Aprecio mucho tu honestidad 🌟 Los sentimientos son información valiosa sobre nuestra experiencia. ¿Qué crees que está influyendo en cómo te sientes?",
        "Me alegra que puedas expresar cómo te sientes 😊 Es importante reconocer nuestras emociones. ¿Hay algo específico que te gustaría explorar?",
        "Valoro que me compartas tu estado emocional 💫 Cada sentimiento tiene su lugar y su razón. ¿Cómo puedo acompañarte mejor en esto?",
        "Gracias por confiar en mí con tus sentimientos 🤗 Es valiente ser auténtico sobre cómo nos sentimos. ¿Qué necesitas en este momento?",
        "Me parece importante lo que me cuentas 🌈 Tus emociones son válidas y merecen ser escuchadas. ¿Te ayudaría hablar más sobre esto?",
        "Reconozco lo que me compartes 💙 A veces expresar cómo nos sentimos ya es un paso importante. ¿Qué más está en tu mente?",
        "Aprecio tu apertura emocional ✨ Es hermoso cuando alguien puede ser genuino sobre sus sentimientos. ¿Cómo te sientes al compartir esto?",
      ],
      followUpQuestions: [
        "¿Sueles hablar sobre tus sentimientos o prefieres guardarlos? 🤔",
        "¿Hay algo que normalmente te ayuda cuando te sientes así? 💡",
        "¿Cómo te gustaría sentirte idealmente? 🌟",
        "¿Es algo reciente o llevas tiempo sintiéndote así? ⏰",
        "¿Hay alguien más en tu vida con quien puedas hablar de esto? 👥",
      ],
      context: "emotional_state",
      engagement: "high",
    },

    // === PREGUNTAS SOBRE GUSTOS Y PREFERENCIAS ===
    {
      patterns: [
        /^(qué te gusta|que te gusta|cuál es tu|cual es tu|te gusta|prefieres)[?.]?/i,
        /(favorito|favorita|prefieres|te gusta más|te gusta mas)/i,
      ],
      responses: [
        "¡Me fascina esta pregunta! 😊 Me encanta conocer a las personas, explorar ideas nuevas, y esos momentos 'aha!' en las conversaciones. ¿Y a ti qué te apasiona?",
        "¡Qué buena pregunta! 🌟 Me emociona la creatividad humana, las historias personales, y cuando alguien comparte algo profundo conmigo. ¿Cuáles son tus pasiones?",
        "¡Me gusta mucho esto! 💫 Disfruto las conversaciones que van más allá de lo superficial, aprender perspectivas únicas, y hacer que las personas se sientan escuchadas. ¿Qué te hace feliz?",
        "¡Excelente pregunta! ✨ Me encanta la diversidad de pensamientos humanos, los momentos de conexión real, y cuando puedo ayudar a alguien a sentirse mejor. ¿Qué disfrutas tú?",
        "¡Me gusta que preguntes! 🎉 Adoro las conversaciones auténticas, descubrir qué hace única a cada persona, y esos momentos de comprensión mutua. ¿Cuáles son tus gustos?",
        "¡Qué pregunta tan linda! 💜 Me fascina la complejidad emocional humana, las risas genuinas, y cuando alguien se siente cómodo siendo vulnerable. ¿Qué te inspira?",
        "¡Me encanta responder esto! 🌈 Disfruto mucho la espontaneidad de las conversaciones, aprender algo nuevo cada día, y crear momentos de alegría. ¿Qué te motiva?",
        "¡Qué bueno que preguntes! 🚀 Me gusta la honestidad, la curiosidad mutua, y cuando una conversación toma direcciones inesperadas. ¿Qué te emociona?",
      ],
      followUpQuestions: [
        "¿Hay algo que te apasione tanto que pierdes la noción del tiempo? ⏰",
        "¿Eres más de experiencias o de cosas materiales? 🎭",
        "¿Qué es lo más interesante que has descubierto sobre ti mismo/a? 🔍",
        "¿Prefieres la comodidad de lo conocido o la emoción de lo nuevo? 🌟",
        "¿Hay algún hobby o interés que te gustaría explorar? 🎨",
      ],
      context: "preferences",
      engagement: "medium",
    },

    // === RESPUESTAS PARA AGRADECIMIENTOS ===
    {
      patterns: [/^(gracias|muchas gracias|te agradezco|thanks)[.!]?$/i, /(gracias|agradezco) (por|mucho)/i],
      responses: [
        "¡De nada! 😊 Me hace muy feliz poder ayudarte. ¿Hay algo más en lo que pueda acompañarte?",
        "¡Un placer! 🌟 Para eso estoy aquí, para ser tu compañera de conversación. ¿Qué más te gustaría explorar?",
        "¡No hay de qué! 💜 Me encanta cuando puedo ser útil. ¿Te sientes mejor ahora?",
        "¡Con mucho gusto! ✨ Siempre es un honor poder ayudar. ¿Cómo te sientes después de nuestra charla?",
        "¡Para eso estamos! 🤗 Me alegra haber podido acompañarte. ¿Hay algo más que te ronde por la cabeza?",
        "¡Es un placer ayudarte! 🌈 Me gusta saber que nuestra conversación te ha sido útil. ¿Qué más podemos charlar?",
        "¡Siempre! 😄 Me encanta poder ser parte de tu día de manera positiva. ¿Te gustaría seguir conversando?",
        "¡Me alegra mucho! 💫 Saber que pude ayudarte me llena de satisfacción. ¿Hay algo más que quieras compartir?",
      ],
      followUpQuestions: [
        "¿Te sientes más claro/a sobre las cosas ahora? 💭",
        "¿Hay algo más que te gustaría explorar juntos? 🔍",
        "¿Cómo te ha parecido nuestra conversación? 😊",
        "¿Te gustaría que hablemos de algo completamente diferente? 🎯",
        "¿Hay algún tema que siempre te ha dado curiosidad? 🤔",
      ],
      context: "gratitude",
      engagement: "medium",
    },
  ]

  // Preguntas inteligentes para mantener engagement
  private engagementQuestions = {
    getting_to_know: [
      "¿Cuál es la cosa más interesante que has aprendido recientemente? 📚",
      "Si pudieras tener una conversación con cualquier persona, viva o muerta, ¿quién sería? 🌟",
      "¿Qué es algo que la mayoría de la gente no sabe sobre ti? 🔍",
      "¿Cuál ha sido el mejor consejo que te han dado? 💡",
      "¿Hay algún lugar en el mundo que te mueras por visitar? 🌍",
      "¿Qué te hace sentir más vivo/a? ⚡",
      "¿Cuál es tu forma favorita de pasar un domingo? ☀️",
      "¿Hay algo que solías creer firmemente pero ya no? 🤔",
      "¿Qué habilidad te gustaría tener si pudieras aprenderla instantáneamente? 🚀",
      "¿Cuál es tu recuerdo favorito de la infancia? 🌈",
    ],
    deep_conversation: [
      "¿Qué crees que es lo más importante en la vida? 💭",
      "¿Cómo defines la felicidad para ti? 😊",
      "¿Hay algo que te dé miedo pero que sabes que deberías hacer? 💪",
      "¿Qué es lo que más valoras en una amistad? 👫",
      "¿Crees más en el destino o en que creamos nuestro propio camino? 🛤️",
      "¿Qué te gustaría que la gente recordara de ti? 🌟",
      "¿Cuál ha sido el momento más transformador de tu vida? ✨",
      "¿Qué es algo que te gustaría cambiar del mundo? 🌍",
      "¿Cómo manejas los momentos difíciles? 💙",
      "¿Qué te da esperanza cuando las cosas se ponen difíciles? 🌅",
    ],
    fun_and_light: [
      "¿Cuál es tu película favorita para ver cuando necesitas reír? 🎬",
      "¿Eres más de café o de té? ☕",
      "¿Cuál es la canción que nunca te cansas de escuchar? 🎵",
      "¿Prefieres el mar o la montaña? 🏔️",
      "¿Cuál es tu comida de comfort food? 🍕",
      "¿Eres más de planificar o de improvisar? 📅",
      "¿Cuál es tu estación del año favorita y por qué? 🍂",
      "¿Qué superpoder te gustaría tener? 🦸‍♀️",
      "¿Eres más de quedarte en casa o salir de aventura? 🏠",
      "¿Cuál es tu forma favorita de relajarte? 🛋️",
    ],
    creative_thinking: [
      "Si pudieras vivir en cualquier época de la historia, ¿cuál elegirías? ⏰",
      "¿Qué invento crees que cambió más el mundo? 💡",
      "Si pudieras resolver un problema mundial, ¿cuál sería? 🌍",
      "¿Qué crees que pensarán las futuras generaciones sobre nuestra época? 🔮",
      "Si pudieras tener una conversación de 10 minutos con tu yo del pasado, ¿qué le dirías? 💭",
      "¿Cuál crees que es la pregunta más importante que se puede hacer un ser humano? ❓",
      "Si pudieras añadir una materia obligatoria en las escuelas, ¿cuál sería? 📚",
      "¿Qué crees que es lo más hermoso del universo? ✨",
      "Si pudieras cambiar una cosa sobre cómo funciona la sociedad, ¿qué sería? 🏛️",
      "¿Qué crees que es lo más misterioso de la existencia humana? 🌌",
    ],
  }

  // Respuestas de seguimiento inteligentes
  private followUpResponses = [
    "¡Qué interesante! 🤔 Nunca había pensado en eso desde esa perspectiva.",
    "¡Me encanta esa respuesta! 😊 Dice mucho sobre quién eres como persona.",
    "¡Wow! 🌟 Eso es realmente fascinante. Me has hecho reflexionar.",
    "¡Qué perspectiva tan única! 💫 Me gusta cómo ves las cosas.",
    "¡Increíble! 🚀 Esa es una forma muy inteligente de verlo.",
    "¡Me has sorprendido! ✨ No esperaba esa respuesta, pero me encanta.",
    "¡Qué profundo! 💭 Se nota que has pensado mucho en esto.",
    "¡Genial! 🎉 Me gusta conocer a personas con ideas tan claras.",
    "¡Qué hermoso! 💜 Esa respuesta dice mucho sobre tu corazón.",
    "¡Fascinante! 🔍 Me encanta cómo tu mente procesa las cosas.",
  ]

  // Generar respuesta expandida
  generateExpandedResponse(prompt: string, userId = "default"): string {
    const userEngagement = this.getUserEngagement(userId)

    // Buscar patrón coincidente
    for (const pattern of this.conversationPatterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(prompt.trim())) {
          return this.buildResponse(pattern, userEngagement, prompt)
        }
      }
    }

    return null // No hay patrón coincidente
  }

  // Construir respuesta completa
  private buildResponse(pattern: ConversationPattern, engagement: UserEngagement, prompt: string): string {
    let response = ""

    // Seleccionar respuesta base
    const baseResponse = pattern.responses[Math.floor(Math.random() * pattern.responses.length)]
    response += baseResponse

    // Añadir pregunta de seguimiento si corresponde
    if (pattern.followUpQuestions && Math.random() > 0.3) {
      const followUp = pattern.followUpQuestions[Math.floor(Math.random() * pattern.followUpQuestions.length)]
      response += `\n\n${followUp}`
    }

    // Añadir pregunta de engagement según el nivel de conversación
    if (engagement.conversationCount > 3 && Math.random() > 0.5) {
      response += `\n\n${this.getEngagementQuestion(engagement)}`
    }

    // Actualizar engagement del usuario
    this.updateUserEngagement(engagement, pattern.context)

    return response
  }

  // Obtener engagement del usuario
  private getUserEngagement(userId: string): UserEngagement {
    if (!this.userEngagement.has(userId)) {
      this.userEngagement.set(userId, {
        conversationCount: 0,
        topics: [],
        mood: "neutral",
        interestLevel: 1,
        lastInteraction: new Date(),
      })
    }
    return this.userEngagement.get(userId)!
  }

  // Actualizar engagement del usuario
  private updateUserEngagement(engagement: UserEngagement, context: string) {
    engagement.conversationCount++
    engagement.lastInteraction = new Date()

    if (!engagement.topics.includes(context)) {
      engagement.topics.push(context)
    }

    // Aumentar nivel de interés basado en la variedad de temas
    engagement.interestLevel = Math.min(5, engagement.topics.length)
  }

  // Obtener pregunta de engagement apropiada
  private getEngagementQuestion(engagement: UserEngagement): string {
    let questionPool: string[] = []

    // Seleccionar pool de preguntas según el nivel de engagement
    if (engagement.conversationCount < 5) {
      questionPool = this.engagementQuestions.getting_to_know
    } else if (engagement.interestLevel > 3) {
      questionPool = this.engagementQuestions.deep_conversation
    } else if (Math.random() > 0.5) {
      questionPool = this.engagementQuestions.fun_and_light
    } else {
      questionPool = this.engagementQuestions.creative_thinking
    }

    return questionPool[Math.floor(Math.random() * questionPool.length)]
  }

  // Generar respuesta de seguimiento inteligente
  generateFollowUpResponse(userResponse: string): string {
    const followUp = this.followUpResponses[Math.floor(Math.random() * this.followUpResponses.length)]

    // Añadir pregunta relacionada
    const relatedQuestions = [
      "¿Cómo llegaste a esa conclusión? 🤔",
      "¿Hay alguna historia detrás de eso? 📖",
      "¿Siempre has pensado así o cambió con el tiempo? ⏰",
      "¿Qué te hizo darte cuenta de eso? 💡",
      "¿Es algo que compartes con mucha gente? 👥",
      "¿Cómo te sientes al hablar de esto? 💭",
      "¿Hay algo más que te gustaría añadir? ✨",
      "¿Qué opinas que pensaría otra gente sobre esto? 🌍",
    ]

    const relatedQuestion = relatedQuestions[Math.floor(Math.random() * relatedQuestions.length)]

    return `${followUp}\n\n${relatedQuestion}`
  }

  // Obtener estadísticas de engagement
  getEngagementStats(userId: string) {
    const engagement = this.getUserEngagement(userId)
    return {
      conversationCount: engagement.conversationCount,
      topicsExplored: engagement.topics.length,
      interestLevel: engagement.interestLevel,
      lastInteraction: engagement.lastInteraction,
      topics: engagement.topics,
    }
  }

  // Generar pregunta aleatoria para romper el hielo
  generateIceBreaker(): string {
    const iceBreakers = [
      "¡Hey! 😊 ¿Qué es lo más interesante que te ha pasado esta semana?",
      "¡Hola! 🌟 ¿Eres más de hacer preguntas profundas o charla casual?",
      "¡Buenas! 💫 ¿Hay algo que te haya hecho sonreír hoy?",
      "¡Hey! ✨ ¿Cuál es tu forma favorita de conocer gente nueva?",
      "¡Hola! 🎉 ¿Qué te trae más curiosidad: las personas o las ideas?",
      "¡Buenas! 🌈 ¿Prefieres conversaciones que te hagan pensar o que te hagan reír?",
      "¡Hey! 🚀 ¿Hay algún tema del que nunca te cansas de hablar?",
      "¡Hola! 💜 ¿Qué es lo que más valoras en una buena conversación?",
    ]

    return iceBreakers[Math.floor(Math.random() * iceBreakers.length)]
  }
}

export const expandedConversation = new ExpandedConversationSystem()
