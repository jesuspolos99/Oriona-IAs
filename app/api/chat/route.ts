import { localAI } from "@/lib/ai/local-ai"
import { simpleLearning } from "@/lib/ai/simple-learning"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, chatId, usuarioId, modoRespuesta } = await req.json()

    if (!messages || !chatId || !usuarioId) {
      return Response.json({ error: "Datos requeridos faltantes" }, { status: 400 })
    }

    // Obtener el último mensaje del usuario
    const ultimoMensaje = messages[messages.length - 1]
    if (!ultimoMensaje || ultimoMensaje.role !== "user") {
      return Response.json({ error: "Mensaje de usuario requerido" }, { status: 400 })
    }

    console.log(`🎯 Modo seleccionado: ${modoRespuesta || "auto"}`)

    // Aprender del mensaje del usuario
    simpleLearning.learnFromMessage(usuarioId, ultimoMensaje.content)

    // Generar respuesta según el modo seleccionado
    let respuestaPersonalizada: string
    let resultadosBusqueda: any[] = []

    if (modoRespuesta === "investigacion") {
      // Modo investigación: SIEMPRE buscar en internet
      console.log("🔍 Modo investigación activado - Forzando búsqueda web")
      respuestaPersonalizada = await localAI.generateResponseWithMode(
        ultimoMensaje.content,
        messages.slice(0, -1).map((msg: any) => msg.content),
        "investigacion",
        usuarioId,
      )
      resultadosBusqueda = localAI.getLastSearchResults()
    } else if (modoRespuesta === "conversacion") {
      // Modo conversación: NUNCA buscar, solo conversar con personalidad humana
      console.log("💬 Modo conversación activado - Conversación humana avanzada")
      respuestaPersonalizada = await localAI.generateResponseWithMode(
        ultimoMensaje.content,
        messages.slice(0, -1).map((msg: any) => msg.content),
        "conversacion",
        usuarioId,
      )
    } else {
      // Modo automático (comportamiento original)
      console.log("🤖 Modo automático - Detección inteligente")
      const respuestaBase = await localAI.generateResponseWithMode(
        ultimoMensaje.content,
        messages.slice(0, -1).map((msg: any) => msg.content),
        "auto",
        usuarioId,
      )
      respuestaPersonalizada = simpleLearning.personalizeResponse(usuarioId, respuestaBase)
      resultadosBusqueda = localAI.getLastSearchResults()
    }

    // Personalizar respuesta si no es modo investigación puro
    if (modoRespuesta !== "investigacion") {
      respuestaPersonalizada = simpleLearning.personalizeResponse(usuarioId, respuestaPersonalizada)
    }

    // Devolver respuesta
    return Response.json({
      message: respuestaPersonalizada,
      success: true,
      searchResults: resultadosBusqueda.length > 0 ? resultadosBusqueda : null,
      hasLearning: modoRespuesta === "conversacion",
      mode: modoRespuesta || "auto",
    })
  } catch (error) {
    console.error("Error en chat:", error)
    return Response.json(
      {
        error: "Error procesando tu mensaje. Por favor, inténtalo de nuevo.",
        message: "Lo siento, hubo un problema procesando tu mensaje. ¿Podrías intentarlo de nuevo?",
      },
      { status: 500 },
    )
  }
}
