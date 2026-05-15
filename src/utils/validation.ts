import { getMovieCredits, getPersonCredits } from '../services/tmdbApi'
import { getCached, setCache } from '../hooks/useCache'
import type { GraphNode } from '../types'

export async function validateGuess(
  candidate: GraphNode,
  filmNodes: GraphNode[],
  actorNodes: GraphNode[],
): Promise<GraphNode[]> {
  if (candidate.type === 'actor') {
    const cacheKey = `person:${candidate.tmdbId}:credits`
    let credits = getCached<number[]>(cacheKey)
    if (!credits) {
      const raw = await getPersonCredits(candidate.tmdbId)
      credits = raw.map(c => c.id)
      setCache(cacheKey, credits)
    }
    const creditSet = new Set(credits)
    return filmNodes.filter(n => creditSet.has(n.tmdbId))
  } else {
    const cacheKey = `movie:${candidate.tmdbId}:credits`
    let credits = getCached<number[]>(cacheKey)
    if (!credits) {
      const raw = await getMovieCredits(candidate.tmdbId)
      credits = raw.map(c => c.id)
      setCache(cacheKey, credits)
    }
    const creditSet = new Set(credits)
    return actorNodes.filter(n => creditSet.has(n.tmdbId))
  }
}
