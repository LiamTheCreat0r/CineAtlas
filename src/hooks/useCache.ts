import { CACHE_TTL } from '../constants'

interface CacheEntry<T> {
  data: T
  ts: number
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.ts > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    /* storage full */
  }
}

const inFlight = new Map<string, Promise<unknown>>()

export async function fetchOrWait<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key)
  if (cached) return cached

  const existing = inFlight.get(key) as Promise<T> | undefined
  if (existing) return existing

  const promise = fetcher()
    .then(data => {
      setCache(key, data)
      inFlight.delete(key)
      return data
    })
    .catch(err => {
      inFlight.delete(key)
      throw err
    })

  inFlight.set(key, promise)
  return promise
}
