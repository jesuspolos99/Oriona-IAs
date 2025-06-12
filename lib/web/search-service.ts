// Este archivo ya no es necesario, la búsqueda se hace desde el servidor
// Mantenemos solo las interfaces para compatibilidad

export interface SearchResult {
  title: string
  snippet: string
  url: string
}

// Función para determinar si una consulta requiere búsqueda web
export function shouldSearchWeb(query: string): boolean {
  // Palabras clave que indican que probablemente se necesite información actualizada
  const searchKeywords = [
    "qué es",
    "que es",
    "cómo",
    "como",
    "cuándo",
    "cuando",
    "dónde",
    "donde",
    "quién",
    "quien",
    "por qué",
    "porque",
    "cuál",
    "cual",
    "cuánto",
    "cuanto",
    "explica",
    "define",
    "información",
    "informacion",
    "datos",
    "historia",
    "noticias",
    "actualidad",
    "reciente",
    "último",
    "ultimo",
    "recientes",
    "wikipedia",
    "busca",
    "encuentra",
    "dime sobre",
    "háblame de",
    "hablame de",
  ]

  const queryLower = query.toLowerCase()

  // Verificar si la consulta contiene alguna palabra clave de búsqueda
  return searchKeywords.some((keyword) => queryLower.includes(keyword))
}
