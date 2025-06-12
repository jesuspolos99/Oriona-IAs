export interface Usuario {
  id: string
  email: string
  nombre: string
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  usuario_id: string
  titulo: string
  created_at: string
  updated_at: string
}

export interface Mensaje {
  id: string
  chat_id: string
  contenido: string
  es_usuario: boolean
  created_at: string
}

export interface ChatConMensajes extends Chat {
  mensajes: Mensaje[]
}
