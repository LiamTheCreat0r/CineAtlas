import { useState, useEffect, useRef } from 'react'
import TimerBar from './TimerBar'
import GraphMap from './GraphMap'
import InputBar from './InputBar'
import { useTimer } from '../hooks/useTimer'
import { fetchRandomStarter } from '../hooks/useTMDB'
import { validateGuess } from '../utils/validation'
import type { GraphNode, GraphEdge, TMDBMultiResult } from '../types'

const GUESS_POINTS = 20

interface Props {
  onEnd: (nodes: GraphNode[], edges: GraphEdge[], longestStreak: number, timeSurvived: number, score: number) => void
}

export default function Game({ onEnd }: Props) {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [longestStreak, setLongestStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [ready, setReady] = useState(false)
  const { timeLeft, isExpired, start, addTime } = useTimer()
  const timerStarted = useRef(false)
  const ended = useRef(false)
  const startTimeRef = useRef(0)
  const streakRef = useRef(0)

  useEffect(() => {
    fetchRandomStarter().then(movie => {
      const starter: GraphNode = {
        id: `film-${movie.id}`,
        type: 'film',
        label: movie.title,
        tmdbId: movie.id,
        posterPath: movie.poster_path,
        profilePath: null,
      }
      setNodes([starter])
      startTimeRef.current = Date.now()
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (ready && !timerStarted.current) {
      timerStarted.current = true
      start()
    }
  }, [ready, start])

  useEffect(() => {
    if (isExpired && !ended.current) {
      ended.current = true
      const timeSurvived = Math.round((Date.now() - startTimeRef.current) / 1000)
      onEnd(nodes, edges, longestStreak, timeSurvived, score)
    }
  }, [isExpired, nodes, edges, longestStreak, score, onEnd])

  const filmNodes = nodes.filter(n => n.type === 'film')
  const actorNodes = nodes.filter(n => n.type === 'actor')

  async function handleGuess(result: TMDBMultiResult): Promise<boolean> {
    const candidate: GraphNode = {
      id: `${result.media_type}-${result.id}`,
      type: result.media_type === 'movie' ? 'film' : 'actor',
      label: result.media_type === 'movie' ? result.title! : result.name!,
      tmdbId: result.id,
      posterPath: result.media_type === 'movie' ? result.poster_path! : null,
      profilePath: result.media_type === 'person' ? result.profile_path! : null,
    }
    if (nodes.some(n => n.tmdbId === candidate.tmdbId)) {
      streakRef.current = 0
      return false
    }
    const connectedTo = await validateGuess(candidate, filmNodes, actorNodes)
    if (connectedTo.length === 0) {
      streakRef.current = 0
      return false
    }
    setNodes(prev => [...prev, candidate])
    const newEdges: GraphEdge[] = connectedTo.map(ct => ({
      source: ct.id,
      target: candidate.id,
    }))
    setEdges(prev => [...prev, ...newEdges])
    streakRef.current += 1
    setLongestStreak(l => Math.max(l, streakRef.current))
    setScore(prev => prev + GUESS_POINTS)
    addTime(candidate.type)
    return true
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-950 text-white">
        Loading…
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-neutral-950 flex flex-col">
      <TimerBar timeLeft={timeLeft} />
      <div className="absolute top-3 right-4 z-50">
        <span className="text-white font-mono font-bold text-lg">{score}</span>
      </div>
      <div className="flex-1 relative">
        <GraphMap nodes={nodes} edges={edges} />
      </div>
      <div className="flex justify-center pb-6 pt-2">
        <InputBar onGuess={handleGuess} />
      </div>
    </div>
  )
}
