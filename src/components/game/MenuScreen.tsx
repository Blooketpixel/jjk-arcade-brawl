import { useState, useEffect } from 'react'

interface Props {
  onStart: (mode: '1p' | '2p') => void
}

export default function MenuScreen({ onStart }: Props) {
  const [blink, setBlink] = useState(true)
  const [selected, setSelected] = useState<'1p' | '2p'>('1p')

  useEffect(() => {
    const iv = setInterval(() => setBlink(b => !b), 600)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setSelected(s => s === '1p' ? '2p' : '1p')
      }
      if (e.key === 'Enter' || e.key === ' ') {
        onStart(selected)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, onStart])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#05050F]">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(123,47,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123,47,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'scrollGrid 20s linear infinite',
        }}
      />

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3131] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7B2FFF] to-transparent" />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="font-arcade text-xs tracking-widest uppercase"
            style={{ color: '#FF3131', textShadow: '0 0 10px #FF3131' }}
          >
            ⚡ Cursed Energy Entertainment ⚡
          </div>

          <h1
            className="font-arcade text-5xl md:text-7xl font-black tracking-wider text-center leading-tight"
            style={{
              color: '#FFCC00',
              textShadow: '0 0 20px #FFCC00, 0 0 40px #FF8800, 4px 4px 0px #B45309',
            }}
          >
            JJK
          </h1>
          <h2
            className="font-arcade text-3xl md:text-5xl font-black tracking-widest text-center"
            style={{
              color: '#FF3131',
              textShadow: '0 0 15px #FF3131, 0 0 30px #FF3131, 3px 3px 0px #7B0000',
            }}
          >
            ARCADE BRAWL
          </h2>
          <div
            className="font-arcade text-sm tracking-widest text-center"
            style={{ color: '#A855F7', textShadow: '0 0 8px #A855F7' }}
          >
            ─── JUJUTSU KAISEN ───
          </div>
        </div>

        {/* Character preview strip */}
        <div className="flex gap-4">
          {['YUJI', 'MEGUMI', 'GOJO', 'SUKUNA'].map((name, i) => {
            const colors = ['#FF3131', '#3B82F6', '#A855F7', '#DC2626']
            return (
              <div
                key={name}
                className="font-arcade text-xs px-3 py-2 rounded border"
                style={{
                  borderColor: colors[i] + '60',
                  color: colors[i],
                  textShadow: `0 0 8px ${colors[i]}`,
                  boxShadow: `0 0 10px ${colors[i]}30`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {name}
              </div>
            )
          })}
        </div>

        {/* Mode select */}
        <div className="flex flex-col items-center gap-4">
          <div className="font-arcade text-sm tracking-widest" style={{ color: '#888' }}>
            SELECT MODE
          </div>
          <div className="flex gap-4">
            {(['1p', '2p'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setSelected(mode); onStart(mode) }}
                onMouseEnter={() => setSelected(mode)}
                className="relative font-arcade text-lg px-8 py-4 rounded transition-all duration-200 border-2"
                style={{
                  borderColor: selected === mode ? '#FFCC00' : '#333',
                  color: selected === mode ? '#FFCC00' : '#888',
                  textShadow: selected === mode ? '0 0 10px #FFCC00' : 'none',
                  boxShadow: selected === mode
                    ? '0 0 20px rgba(255,204,0,0.3), inset 0 0 10px rgba(255,204,0,0.05)'
                    : 'none',
                  background: selected === mode ? 'rgba(255,204,0,0.08)' : 'transparent',
                  transform: selected === mode ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {mode === '1p' ? '1P VS CPU' : '2P LOCAL'}
              </button>
            ))}
          </div>
        </div>

        {/* Blinking prompt */}
        <div
          className="font-arcade text-base tracking-widest"
          style={{
            color: '#FF3131',
            textShadow: '0 0 8px #FF3131',
            opacity: blink ? 1 : 0.3,
            transition: 'opacity 0.1s',
          }}
        >
          ► PRESS ENTER OR CLICK TO START ◄
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-6 mt-2">
          <div className="text-center">
            <div className="font-arcade text-xs mb-2" style={{ color: '#FF3131' }}>PLAYER 1</div>
            <div className="text-xs space-y-1" style={{ color: '#888', fontFamily: 'IBM Plex Mono' }}>
              <div>MOVE: A/D or ←/→</div>
              <div>JUMP: W or ↑</div>
              <div>LIGHT: U</div>
              <div>HEAVY: I</div>
              <div>KICK: O</div>
              <div>SPECIAL: P</div>
              <div>BLOCK: K</div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-arcade text-xs mb-2" style={{ color: '#A855F7' }}>PLAYER 2</div>
            <div className="text-xs space-y-1" style={{ color: '#888', fontFamily: 'IBM Plex Mono' }}>
              <div>MOVE: ←/→</div>
              <div>JUMP: ↑</div>
              <div>LIGHT: 1</div>
              <div>HEAVY: 2</div>
              <div>KICK: 3</div>
              <div>SPECIAL: 4</div>
              <div>BLOCK: 0</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollGrid {
          from { background-position: 0 0; }
          to { background-position: 0 60px; }
        }
      `}</style>
    </div>
  )
}
