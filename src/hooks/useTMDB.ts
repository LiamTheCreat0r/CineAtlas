import { useState, useEffect, useRef } from 'react'
import { searchMulti, getPopularMovies } from '../services/tmdbApi'
import { getCached, setCache } from './useCache'
import type { TMDBMultiResult } from '../types'
import { POPULAR_FETCH_COUNT } from '../constants'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBMultiResult[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const cacheKey = `search:${query}`
      const cached = getCached<TMDBMultiResult[]>(cacheKey)
      if (cached) {
        setResults(cached)
        setLoading(false)
        return
      }
      try {
        const data = await searchMulti(query)
        const mapped = data.map(d => ({
          id: d.id,
          media_type: d.media_type as 'movie' | 'person',
          title: d.title,
          name: d.name,
          poster_path: d.poster_path ?? null,
          profile_path: d.profile_path ?? null,
        }))
        setCache(cacheKey, mapped)
        setResults(mapped)
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer.current)
  }, [query])

  return { query, setQuery, results, loading }
}

export async function fetchRandomStarter(): Promise<{ id: number; title: string; poster_path: string | null }> {
  const cacheKey = 'popular:page1'
  let movies = getCached<{ id: number; title: string; poster_path: string | null }[]>(cacheKey)
  if (!movies) {
    movies = await getPopularMovies(1)
    setCache(cacheKey, movies)
  }
  const pool = movies.slice(0, POPULAR_FETCH_COUNT)
  return pool[Math.floor(Math.random() * pool.length)]
}
