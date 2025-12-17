import style from './style.module.scss'
import { useState, useEffect } from 'react'
import { type Category } from 'types'
import { API } from 'services/categories'

interface Props {
  setPins: React.Dispatch<React.SetStateAction<Category['pins']>>;
  selected: string; // Ej: "Anime,Musica"
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SearchPins ({ setPins, selected, setIsLoading }: Props) {
  const [search, setSearch] = useState('')

  const handleChange = ({ target }: { target: HTMLInputElement }) =>
    setSearch(target.value)

  useEffect(() => {
    // Si no hay categorías seleccionadas, limpiamos los pines y no hacemos nada
    if (!selected) {
      setPins([])
      return
    }

    let isActive = true // Flag para evitar race conditions si el usuario escribe rápido

    async function fetchPins () {
      setIsLoading(true)
      const categoriesList = selected.split(',')
      const fetchers: Promise<Category['pins']>[] = []

      // Lógica dinámica: ¿Buscamos o Traemos todo?
      categoriesList.forEach((category) => {
        // Mapeo seguro de string a la API
        // Usamos notación de corchetes si API tiene las claves exactas, o el switch sucio pero seguro
        switch (category) {
          case 'Anime':
            fetchers.push(
              search ? API.animes.search(search) : API.animes.get()
            )
            break
          case 'Juegos':
            fetchers.push(
              search ? API.videogames.search(search) : API.videogames.get()
            )
            break
          case 'Peliculas':
            fetchers.push(
              search ? API.movies.search(search) : API.movies.get()
            )
            break
          case 'Musica':
            fetchers.push(search ? API.music.search(search) : API.music.get())
            break
          case 'Series':
            fetchers.push(
              search ? API.series.search(search) : API.series.get()
            )
            break
        }
      })

      try {
        // Ejecutamos todas las peticiones en paralelo
        const results = await Promise.all(fetchers)

        // Aplanamos el array de arrays [[pin1, pin2], [pin3]] -> [pin1, pin2, pin3]
        const allPins = results.flatMap((r: unknown) => r)

        if (isActive) {
          setPins(allPins)
        }
      } catch (e) {
        console.error('Error cargando pines:', e)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    // Debounce: Esperamos 300ms antes de disparar la petición
    const timeout = setTimeout(() => {
      fetchPins()
    }, 300)

    // Cleanup: Si el usuario sigue escribiendo o cambia categorías, cancelamos la ejecución anterior
    return () => {
      isActive = false
      clearTimeout(timeout)
    }
  }, [search, selected]) // <--- AQUI ESTABA EL ERROR: Faltaba 'selected'

  return (
    <div className={style.form__searchPins}>
      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Buscar intereses..."
        autoFocus // UX: Pone el foco directo para escribir
      />
    </div>
  )
}
