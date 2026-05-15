import { INITIAL_TIME } from '../constants'

interface Props {
  timeLeft: number
}

export default function TimerBar({ timeLeft }: Props) {
  const pct = (timeLeft / INITIAL_TIME) * 100
  const color =
    timeLeft > 20 ? 'bg-green-500' :
    timeLeft > 10 ? 'bg-yellow-500' :
    'bg-red-500 animate-pulse'

  return (
    <div className="w-full bg-neutral-800 h-2 fixed top-0 left-0 z-50">
      <div
        className={`h-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
