import { useState } from 'react'

interface Settings {
  movieEnabled: boolean
  tvEnabled: boolean
  streakEnabled: boolean
  baseTime: number
  maxTimeEnabled: boolean
  maxTime: number
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    movieEnabled: true,
    tvEnabled: false,
    streakEnabled: true,
    baseTime: 45,
    maxTimeEnabled: false,
    maxTime: 120,
  })

  function toggle(key: keyof Settings) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] as never }))
  }

  return (
    <div className="w-full max-w-xs mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col gap-3">
      <span className="text-sm text-neutral-300">Settings</span>

      <label className="flex items-center justify-between text-sm text-neutral-300">
        Movies
        <button onClick={() => toggle('movieEnabled')} className={`relative w-10 h-5 rounded-full transition-colors ${settings.movieEnabled ? 'bg-red-600' : 'bg-neutral-700'}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.movieEnabled ? 'translate-x-5' : ''}`} />
        </button>
      </label>

      <label className="flex items-center justify-between text-sm text-neutral-300">
        TV Shows
        <button onClick={() => toggle('tvEnabled')} className={`relative w-10 h-5 rounded-full transition-colors ${settings.tvEnabled ? 'bg-red-600' : 'bg-neutral-700'}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.tvEnabled ? 'translate-x-5' : ''}`} />
        </button>
      </label>

      <label className="flex items-center justify-between text-sm text-neutral-300">
        Streak System
        <button onClick={() => toggle('streakEnabled')} className={`relative w-10 h-5 rounded-full transition-colors ${settings.streakEnabled ? 'bg-red-600' : 'bg-neutral-700'}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.streakEnabled ? 'translate-x-5' : ''}`} />
        </button>
      </label>

      <div className="flex items-center justify-between text-sm text-neutral-300">
        Base Time
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={15}
            max={120}
            step={5}
            value={settings.baseTime}
            onChange={e => setSettings(prev => ({ ...prev, baseTime: Number(e.target.value) }))}
            className="w-24 accent-red-600"
          />
          <span className="text-neutral-300 w-8 text-right">{settings.baseTime}s</span>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-3 flex flex-col gap-3">
        <label className="flex items-center justify-between text-sm text-neutral-300">
          Max Time Mode
          <button onClick={() => setSettings(prev => ({ ...prev, maxTimeEnabled: !prev.maxTimeEnabled }))} className={`relative w-10 h-5 rounded-full transition-colors ${settings.maxTimeEnabled ? 'bg-red-600' : 'bg-neutral-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.maxTimeEnabled ? 'translate-x-5' : ''}`} />
          </button>
        </label>

        {settings.maxTimeEnabled && (
          <div className="flex items-center justify-between text-sm text-neutral-300 pl-4">
            Duration
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={30}
                max={300}
                step={10}
                value={settings.maxTime}
                onChange={e => setSettings(prev => ({ ...prev, maxTime: Number(e.target.value) }))}
                className="w-24 accent-red-600"
              />
              <span className="text-neutral-300 w-8 text-right">{settings.maxTime}s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
