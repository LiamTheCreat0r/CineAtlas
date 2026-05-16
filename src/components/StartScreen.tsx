import SettingsPanel from './SettingsPanel'

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-neutral-950 text-white gap-6">
      <h1 className="text-5xl font-bold tracking-tight">CINE<span className="text-red-600">ATLAS</span></h1>
      <p className="text-neutral-400 text-lg max-w-md text-center leading-relaxed">
        Build a film knowledge graph under time pressure.<br />
        Name actors and films connected to anything on your map.
      </p>
      <button
        onClick={onStart}
        className="mt-4 px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-lg"
      >
        Start
      </button>
      <SettingsPanel />
    </div>
  )
}
