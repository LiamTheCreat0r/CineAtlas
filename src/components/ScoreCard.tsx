import { calculateScore } from '../utils/scoring'

interface Props {
  nodes: number
  longestStreak: number
  timeSurvived: number
}

export default function ScoreCard({ nodes, longestStreak, timeSurvived }: Props) {
  const score = calculateScore(nodes, longestStreak, timeSurvived)
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Score</h2>
      <div className="space-y-3">
        <Row label="Nodes Discovered" value={nodes} points={score.nodes} />
        <Row label="Longest Streak" value={longestStreak} points={score.streak} />
        <Row label="Time Survived" value={`${timeSurvived}s`} points={score.time} />
        <div className="border-t border-neutral-700 pt-3 mt-3">
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>{score.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, points }: { label: string; value: number | string; points: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-400">{label}</span>
      <span className="text-white font-medium">{value} <span className="text-neutral-500">(+{points})</span></span>
    </div>
  )
}
