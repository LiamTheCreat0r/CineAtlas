import { getMovieCredits, getPersonCredits } from '../services/tmdbApi'
import { fetchOrWait } from '../hooks/useCache'
import type { GraphNode } from '../types'

export async function validateGuess(
  candidate: GraphNode,
  filmNodes: GraphNode[],
  actorNodes: GraphNode[],
): Promise<GraphNode[]> {
  if (candidate.type === 'actor') {
    const cacheKey = `person:${candidate.tmdbId}:credits`
    const credits = await fetchOrWait(cacheKey, async () => {
      const raw = await getPersonCredits(candidate.tmdbId)
      return raw.map(c => c.id)
    })
    const creditSet = new Set(credits)
    return filmNodes.filter(n => creditSet.has(n.tmdbId))
  } else {
    const cacheKey = `movie:${candidate.tmdbId}:credits`
    const credits = await fetchOrWait(cacheKey, async () => {
      const raw = await getMovieCredits(candidate.tmdbId)
      return raw.map(c => c.id)
    })
    const creditSet = new Set(credits)
    return actorNodes.filter(n => creditSet.has(n.tmdbId))
  }
}

export async function preloadNodeCredits(node: GraphNode): Promise<void> {
  if (node.type === 'film') {
    const cacheKey = `movie:${node.tmdbId}:credits`
    await fetchOrWait(cacheKey, async () => {
      const raw = await getMovieCredits(node.tmdbId)
      return raw.map(c => c.id)
    })
  } else {
    const cacheKey = `person:${node.tmdbId}:credits`
    await fetchOrWait(cacheKey, async () => {
      const raw = await getPersonCredits(node.tmdbId)
      return raw.map(c => c.id)
    })
  }
}
