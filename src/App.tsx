import { useState } from 'react'
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import ScoreScreen from './components/ScoreScreen'
import type { GraphNode, GraphEdge, GamePhase } from './types'

interface GameResult {
  nodes: GraphNode[]
  edges: GraphEdge[]
  longestStreak: number
  timeSurvived: number
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('start')
  const [gameKey, setGameKey] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)

  function handleStart() {
    setPhase('playing')
  }

  function handleEnd(nodes: GraphNode[], edges: GraphEdge[], longestStreak: number, timeSurvived: number) {
    setResult({ nodes, edges, longestStreak, timeSurvived })
    setPhase('over')
  }

  function handleRestart() {
    setResult(null)
    setGameKey(k => k + 1)
    setPhase('playing')
  }

  if (phase === 'start') return <StartScreen onStart={handleStart} />

  if (phase === 'playing') return <Game key={gameKey} onEnd={handleEnd} />

  if (!result) return null

  return (
    <ScoreScreen
      nodes={result.nodes}
      edges={result.edges}
      longestStreak={result.longestStreak}
      timeSurvived={result.timeSurvived}
      onRestart={handleRestart}
    />
  )
}
