// APIs de búsqueda web avanzadas (opcionales)
// Estas requieren claves API pero proporcionan acceso completo a internet

interface SearchResult {
  title: string
  snippet: string
  url: string
}

// SerpAPI - Acceso completo a Google Search
export async function searchWithSerpAPI(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERP_API_KEY
  if (!apiKey) {
    console.log("SerpAPI key no disponible")
    return []
  }

  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=6&hl=es&gl=es`

    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.organic_results) {
        for (const result of data.organic_results.slice(0, 6)) {
          results.push({
            title: result.title,
            snippet: result.snippet || result.rich_snippet?.top?.detected_extensions || "Sin descripción disponible",
            url: result.link,
          })
        }
      }

      console.log(`🔍 SerpAPI encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en SerpAPI:", error)
  }

  return []
}

// Bing Search API
export async function searchWithBingAPI(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.BING_SEARCH_API_KEY
  if (!apiKey) {
    console.log("Bing API key no disponible")
    return []
  }

  try {
    const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=6&mkt=es-ES`

    const response = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    })

    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.webPages?.value) {
        for (const result of data.webPages.value.slice(0, 6)) {
          results.push({
            title: result.name,
            snippet: result.snippet,
            url: result.url,
          })
        }
      }

      console.log(`🔍 Bing API encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en Bing API:", error)
  }

  return []
}

// RapidAPI - Múltiples fuentes de búsqueda
export async function searchWithRapidAPI(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.RAPID_API_KEY
  if (!apiKey) {
    console.log("RapidAPI key no disponible")
    return []
  }

  try {
    const url = `https://google-search3.p.rapidapi.com/api/v1/search/q=${encodeURIComponent(query)}&num=6`

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "google-search3.p.rapidapi.com",
      },
    })

    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.results) {
        for (const result of data.results.slice(0, 6)) {
          results.push({
            title: result.title,
            snippet: result.description,
            url: result.link,
          })
        }
      }

      console.log(`🔍 RapidAPI encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en RapidAPI:", error)
  }

  return []
}

// Web Scraping ético para sitios específicos
export async function scrapeWebContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Oriona-AI-Bot/1.0 (Educational Purpose)",
      },
    })

    if (response.ok) {
      const html = await response.text()

      // Extraer texto básico (esto es muy simplificado)
      const textContent = html
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<style[^>]*>.*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      return textContent.substring(0, 500)
    }
  } catch (error) {
    console.error("Error en web scraping:", error)
  }

  return ""
}

// Función principal que combina todas las APIs disponibles
export async function performAdvancedWebSearch(query: string): Promise<SearchResult[]> {
  const allResults: SearchResult[] = []

  // Intentar con todas las APIs disponibles
  const serpResults = await searchWithSerpAPI(query)
  allResults.push(...serpResults)

  const bingResults = await searchWithBingAPI(query)
  allResults.push(...bingResults)

  const rapidResults = await searchWithRapidAPI(query)
  allResults.push(...rapidResults)

  // Eliminar duplicados
  const uniqueResults = allResults.filter(
    (result, index, self) => index === self.findIndex((r) => r.url === result.url),
  )

  return uniqueResults.slice(0, 6)
}
