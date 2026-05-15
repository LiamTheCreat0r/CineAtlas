import { useState, useRef } from 'react'
import AutocompleteDropdown from './AutocompleteDropdown'
import { useSearch } from '../hooks/useTMDB'
import type { TMDBMultiResult } from '../types'

interface Props {
  onGuess: (result: TMDBMultiResult) => Promise<boolean>
}

export default function InputBar({ onGuess }: Props) {
  const { query, setQuery, results, loading } = useSearch()
  const [shaking, setShaking] = useState(false)
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSelect(result: TMDBMultiResult) {
    setPending(true)
    setQuery('')
    const ok = await onGuess(result)
    setPending(false)
    if (!ok) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="relative w-full max-w-lg">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for a film or actor…"
        disabled={pending}
        className={`w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 outline-none focus:border-white/40 transition-colors ${
          shaking ? 'animate-shake border-red-500' : ''
        }`}
      />
      <AutocompleteDropdown
        results={results}
        loading={loading}
        onSelect={handleSelect}
      />
    </div>
  )
}
