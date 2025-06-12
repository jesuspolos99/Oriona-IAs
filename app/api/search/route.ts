import type { NextRequest } from "next/server"

interface SearchResult {
  title: string
  snippet: string
  url: string
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query requerido" }, { status: 400 })
    }

    console.log("🔍 Búsqueda web real solicitada:", query)

    // Realizar búsqueda web real
    const results = await performRealWebSearch(query)

    console.log("📊 Resultados web encontrados:", results.length)

    return Response.json({ results })
  } catch (error) {
    console.error("❌ Error en búsqueda web:", error)
    return Response.json({ error: "Error en la búsqueda web" }, { status: 500 })
  }
}

async function performRealWebSearch(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []

  try {
    console.log("🌐 Iniciando búsqueda web real para:", query)

    // 1. Intentar con DuckDuckGo (API gratuita y sin límites)
    const duckDuckGoResults = await searchDuckDuckGo(query)
    results.push(...duckDuckGoResults)

    // 2. Búsqueda en sitios específicos con scraping ético
    const siteSpecificResults = await searchSpecificSites(query)
    results.push(...siteSpecificResults)

    // 3. Búsqueda en APIs públicas disponibles
    const publicApiResults = await searchPublicAPIs(query)
    results.push(...publicApiResults)

    console.log(`📊 Total de resultados web reales: ${results.length}`)

    // Eliminar duplicados y limitar resultados
    const uniqueResults = removeDuplicates(results)
    return uniqueResults.slice(0, 6)
  } catch (error) {
    console.error("Error en búsqueda web real:", error)
    return []
  }
}

// Búsqueda usando DuckDuckGo Instant Answer API
async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    console.log("🦆 Buscando en DuckDuckGo:", query)

    // DuckDuckGo Instant Answer API
    const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`

    const response = await fetch(duckUrl, {
      headers: {
        "User-Agent": "Oriona-AI-Bot/1.0",
      },
    })

    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      // Respuesta abstracta principal
      if (data.Abstract && data.Abstract.length > 50) {
        results.push({
          title: data.Heading || "DuckDuckGo - Información",
          snippet: data.Abstract,
          url: data.AbstractURL || "https://duckduckgo.com",
        })
      }

      // Resultados relacionados
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 3)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(" - ")[0] || "Información relacionada",
              snippet: topic.Text,
              url: topic.FirstURL,
            })
          }
        }
      }

      console.log(`🦆 DuckDuckGo encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en DuckDuckGo:", error)
  }

  return []
}

// Búsqueda en sitios específicos usando técnicas de scraping ético
async function searchSpecificSites(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []

  try {
    // Wikipedia (API oficial)
    const wikiResults = await searchWikipediaAPI(query)
    results.push(...wikiResults)

    // Reddit (API pública)
    const redditResults = await searchReddit(query)
    results.push(...redditResults)

    // GitHub (API pública)
    if (isTechQuery(query)) {
      const githubResults = await searchGitHub(query)
      results.push(...githubResults)
    }

    // Stack Overflow (API pública)
    if (isTechQuery(query)) {
      const stackResults = await searchStackOverflow(query)
      results.push(...stackResults)
    }
  } catch (error) {
    console.error("Error en búsqueda de sitios específicos:", error)
  }

  return results
}

// Wikipedia API oficial
async function searchWikipediaAPI(query: string): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3`

    const response = await fetch(searchUrl)
    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.query?.search) {
        for (const item of data.query.search.slice(0, 2)) {
          results.push({
            title: `Wikipedia: ${item.title}`,
            snippet: item.snippet.replace(/<[^>]*>/g, ""),
            url: `https://es.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
          })
        }
      }

      console.log(`📖 Wikipedia encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en Wikipedia API:", error)
  }

  return []
}

// Reddit API pública
async function searchReddit(query: string): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=3&sort=relevance`

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Oriona-AI-Bot/1.0",
      },
    })

    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.data?.children) {
        for (const post of data.data.children.slice(0, 2)) {
          const postData = post.data
          if (postData.title && postData.selftext) {
            results.push({
              title: `Reddit: ${postData.title}`,
              snippet: postData.selftext.substring(0, 200) + "...",
              url: `https://reddit.com${postData.permalink}`,
            })
          }
        }
      }

      console.log(`🔴 Reddit encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en Reddit API:", error)
  }

  return []
}

// GitHub API pública
async function searchGitHub(query: string): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=2`

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Oriona-AI-Bot/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.items) {
        for (const repo of data.items.slice(0, 2)) {
          results.push({
            title: `GitHub: ${repo.full_name}`,
            snippet: repo.description || "Repositorio de código en GitHub",
            url: repo.html_url,
          })
        }
      }

      console.log(`🐙 GitHub encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en GitHub API:", error)
  }

  return []
}

// Stack Overflow API pública
async function searchStackOverflow(query: string): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=2`

    const response = await fetch(searchUrl)

    if (response.ok) {
      const data = await response.json()
      const results: SearchResult[] = []

      if (data.items) {
        for (const item of data.items.slice(0, 2)) {
          results.push({
            title: `Stack Overflow: ${item.title}`,
            snippet: `Pregunta con ${item.score} puntos y ${item.answer_count} respuestas`,
            url: item.link,
          })
        }
      }

      console.log(`📚 Stack Overflow encontró ${results.length} resultados`)
      return results
    }
  } catch (error) {
    console.error("Error en Stack Overflow API:", error)
  }

  return []
}

// Búsqueda en APIs públicas adicionales
async function searchPublicAPIs(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []

  try {
    // News API (si tienes clave, sino usar alternativas)
    const newsResults = await searchNewsAPI(query)
    results.push(...newsResults)

    // JSONPlaceholder para datos de ejemplo
    const placeholderResults = await searchJSONPlaceholder(query)
    results.push(...placeholderResults)
  } catch (error) {
    console.error("Error en APIs públicas:", error)
  }

  return results
}

// Simulación de News API (en producción usarías una clave real)
async function searchNewsAPI(query: string): Promise<SearchResult[]> {
  try {
    // En un entorno real, usarías: https://newsapi.org/
    // Por ahora, simulamos con datos relevantes

    const newsTopics = [
      {
        title: `Noticias recientes sobre: ${query}`,
        snippet: `Últimas noticias y actualizaciones relacionadas con "${query}" de fuentes internacionales.`,
        url: "https://news.google.com/search?q=" + encodeURIComponent(query),
      },
    ]

    console.log(`📰 News API simulado: 1 resultado`)
    return newsTopics
  } catch (error) {
    console.error("Error en News API:", error)
  }

  return []
}

// JSONPlaceholder para datos de ejemplo
async function searchJSONPlaceholder(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=2")

    if (response.ok) {
      const posts = await response.json()
      const results: SearchResult[] = []

      for (const post of posts) {
        if (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            title: `Contenido relacionado: ${post.title}`,
            snippet: post.body.substring(0, 150) + "...",
            url: `https://jsonplaceholder.typicode.com/posts/${post.id}`,
          })
        }
      }

      return results
    }
  } catch (error) {
    console.error("Error en JSONPlaceholder:", error)
  }

  return []
}

// Función para detectar consultas técnicas
function isTechQuery(query: string): boolean {
  const techKeywords = [
    "programación",
    "programacion",
    "código",
    "codigo",
    "javascript",
    "python",
    "java",
    "html",
    "css",
    "react",
    "node",
    "angular",
    "vue",
    "tecnología",
    "tecnologia",
    "software",
    "hardware",
    "computadora",
    "ordenador",
    "app",
    "aplicación",
    "aplicacion",
    "web",
    "internet",
    "inteligencia artificial",
    "machine learning",
    "blockchain",
    "criptomoneda",
    "bitcoin",
    "github",
    "stack overflow",
    "desarrollo",
    "developer",
    "programming",
  ]
  return techKeywords.some((keyword) => query.toLowerCase().includes(keyword))
}

// Función para eliminar duplicados
function removeDuplicates(results: SearchResult[]): SearchResult[] {
  const seen = new Set()
  return results.filter((result) => {
    const key = result.title.toLowerCase()
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}
