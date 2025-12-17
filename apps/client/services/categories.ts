import { request } from './request'

// Helper para adaptar la respuesta de tu backend al formato que espera el componente visual
// Tu backend devuelve { belongsTo: "...", genres: ["Acción", "Comedia"] }
// El componente espera objetos con { name, imgUrl, category }
// COMO TU BACKEND NO GUARDA IMÁGENES AÚN, usaremos un placeholder.
const mapBackendGenresToPins = (genreList: string[], categoryName: string) => {
  return genreList.map((genre) => ({
    name: genre,
    imgUrl: '/images/wavebig.svg', // Placeholder temporal o un icono genérico
    subCategories: [genre], // Ajuste para compatibilidad
    category: categoryName
  }))
}

const movies = {
  get: async () => {
    // LLamada a TU backend
    const response = await request(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dbseed/listMovies`
    )
    // response debería ser: { _id: "...", belongsTo: "Películas", genres: [...] }
    return mapBackendGenresToPins(response.genres, 'Películas')
  },
  search: async (query: string) => {
    // Por ahora, el search lo haremos filtrando en memoria o llamando al get,
    // ya que tu backend no tiene endpoint de búsqueda específico aún.
    const all = await movies.get()
    return all.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}

const series = {
  get: async () => {
    const response = await request(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dbseed/listSeries`
    )
    return mapBackendGenresToPins(response.genres, 'Series')
  },
  search: async (query: string) => {
    const all = await series.get()
    return all.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}

const animes = {
  get: async () => {
    const response = await request(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dbseed/listAnimes`
    )
    return mapBackendGenresToPins(response.genres, 'Anime')
  },
  search: async (query: string) => {
    const all = await animes.get()
    return all.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}

const videogames = {
  get: async () => {
    const response = await request(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dbseed/listVideogames`
    )
    return mapBackendGenresToPins(response.genres, 'Videojuegos')
  },
  search: async (query: string) => {
    const all = await videogames.get()
    return all.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}

const music = {
  get: async () => {
    const response = await request(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dbseed/listMusic`
    )
    return mapBackendGenresToPins(response.genres, 'Música')
  },
  search: async (query: string) => {
    const all = await music.get()
    return all.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}

export const API = {
  movies,
  series,
  animes,
  videogames,
  music
}
