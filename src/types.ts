export type NodeType = 'film' | 'actor'

export interface GraphNode {
  id: string
  type: NodeType
  label: string
  tmdbId: number
  posterPath: string | null
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

export interface GraphEdge {
  source: string
  target: string
}

export type GamePhase = 'start' | 'playing' | 'over'

export interface GameState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  phase: GamePhase
  streak: number
  longestStreak: number
  startTime: number
  endTime: number | null
}

export interface TMDBMultiResult {
  id: number
  media_type: 'movie' | 'person'
  title?: string
  name?: string
  poster_path?: string | null
  profile_path?: string | null
}

export interface TMDBMovieCredit {
  id: number
  cast: { id: number }[]
}

export interface TMDBPersonCredit {
  cast: { id: number; title?: string; name?: string }[]
}
