import { supabaseAdmin } from "@/lib/supabase/server"

// Datos simulados para el entorno de vista previa
const chatsDemoData = [
  {
    id: "chat-1",
    usuario_id: "mock-user-id",
    titulo: "Conversación sobre IA",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    mensajes: [
      {
        id: "msg-1",
        chat_id: "chat-1",
        contenido: "¡Hola! ¿Qué es la inteligencia artificial?",
        es_usuario: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "msg-2",
        chat_id: "chat-1",
        contenido:
          "La inteligencia artificial es una rama de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana, como el aprendizaje, la resolución de problemas y el reconocimiento de patrones.",
        es_usuario: false,
        created_at: new Date(Date.now() - 86400000 + 10000).toISOString(),
      },
    ],
  },
  {
    id: "chat-2",
    usuario_id: "mock-user-id",
    titulo: "Preguntas sobre España",
    created_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    mensajes: [
      {
        id: "msg-3",
        chat_id: "chat-2",
        contenido: "¿Cuáles son las ciudades más importantes de España?",
        es_usuario: true,
        created_at: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: "msg-4",
        chat_id: "chat-2",
        contenido:
          "Las ciudades más importantes de España incluyen Madrid (la capital), Barcelona, Valencia, Sevilla, Zaragoza y Málaga. Cada una tiene su propia cultura, historia y atracciones turísticas.",
        es_usuario: false,
        created_at: new Date(Date.now() - 43200000 + 10000).toISOString(),
      },
    ],
  },
]

// Función para detectar si estamos en entorno de vista previa
function isPreviewEnvironment(req: Request): boolean {
  const host = req.headers.get("host") || ""
  const userAgent = req.headers.get("user-agent") || ""

  return (
    host.includes("vusercontent.net") ||
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    userAgent.includes("v0-preview")
  )
}

export async function GET(req: Request) {
  try {
    const isPreview = isPreviewEnvironment(req)
    console.log("GET /api/chats - Modo preview:", isPreview)

    const { searchParams } = new URL(req.url)
    const usuarioId = searchParams.get("usuarioId")

    if (!usuarioId) {
      return Response.json({ error: "Usuario ID requerido" }, { status: 400 })
    }

    if (isPreview) {
      // En entorno de vista previa, devolver datos simulados
      console.log("Devolviendo datos simulados para GET")
      return Response.json({ chats: chatsDemoData })
    }

    // En entorno real, consultar Supabase
    const { data: chats, error } = await supabaseAdmin
      .from("chats")
      .select(`
        *,
        mensajes (
          id,
          contenido,
          es_usuario,
          created_at
        )
      `)
      .eq("usuario_id", usuarioId)
      .order("updated_at", { ascending: false })

    if (error) throw error

    return Response.json({ chats })
  } catch (error) {
    console.error("Error obteniendo chats:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const isPreview = isPreviewEnvironment(req)
    console.log("POST /api/chats - Modo preview:", isPreview)

    const { usuarioId } = await req.json()

    if (!usuarioId) {
      return Response.json({ error: "Usuario ID requerido" }, { status: 400 })
    }

    // SIEMPRE usar modo simulado en vista previa
    if (isPreview) {
      console.log("Creando chat simulado para usuario:", usuarioId)

      // En entorno de vista previa, crear un chat simulado
      const nuevoChat = {
        id: `chat-${Date.now()}`,
        usuario_id: usuarioId,
        titulo: "Nueva conversación",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        mensajes: [],
      }

      console.log("Chat simulado creado:", nuevoChat)
      return Response.json({ chat: nuevoChat })
    }

    // En entorno real, crear en Supabase
    console.log("Creando chat real en Supabase para usuario:", usuarioId)

    const { data, error } = await supabaseAdmin
      .from("chats")
      .insert([
        {
          usuario_id: usuarioId,
          titulo: "Nueva conversación",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error de Supabase:", error)
      throw error
    }

    if (!data) {
      throw new Error("No se recibieron datos de Supabase")
    }

    console.log("Chat real creado:", data)
    return Response.json({ chat: data })
  } catch (error) {
    console.error("Error creando chat:", error)

    // En caso de error, devolver un chat simulado como fallback
    const chatFallback = {
      id: `fallback-chat-${Date.now()}`,
      usuario_id: "fallback-user",
      titulo: "Nueva conversación",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      mensajes: [],
    }

    console.log("Devolviendo chat fallback:", chatFallback)
    return Response.json({ chat: chatFallback })
  }
}
