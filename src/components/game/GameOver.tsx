import { useEffect, useState } from 'react'
import type { GameState } from '../../game/types'

interface Props {
  state: GameState
  mode: '1p' | '2p'
  onRestart: () => void
  onMenu: () => void
}

export default function GameOver({ state, mode, onRestart, onMenu }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300)
    return () => clearTimeout(t)
  }, [])

  const winner = state.p1Wins > state.p2Wins ? 'p1' : 'p2'
  const winnerFighter = winner === 'p1' ? state.p1 : state.p2
  const isPlayerWin = mode === '1p' ? winner === 'p1' : true

  const title = state.p1Wins === state.p2Wins
    ? 'DRAW!'
    : isPlayerWin && winner === 'p1'
    ? 'YOU WIN!'
    : mode === '1p' && winner === 'p2'
    ? 'GAME OVER'
    : `${winnerFighter.character.name.split(' ')[0]} WINS!`

  const titleColor = state.p1Wins === state.p2Wins
    ? '#AAAAAA'
    : winner === 'p1'
    ? '#FFCC00'
    : '#FF3131'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onRestart()
      if (e.key === 'Escape') onMenu()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onRestart, onMenu])

  // Save high score
  useEffect(() => {
    if (winner === 'p1') {
      const current = parseInt(localStorage.getItem('jjk-wins') || '0')
      localStorage.setItem('jjk-wins', String(current + 1))
    }
  }, [winner])

  const totalWins = parseInt(localStorage.getItem('jjk-wins') || '0')

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#05050F] overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      {/* Particle effects */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: winnerFighter.character.colors.primary,
            boxShadow: `0 0 6px ${winnerFighter.character.colors.primary}`,
            animation: `float-up ${1 + Math.random() * 2}s ease-out ${Math.random() * 2}s infinite`,
            opacity: Math.random(),
          }}
        />
      ))}

      <div
        className={`relative z-10 flex flex-col items-center gap-8 px-4 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Winner character name */}
        <div
          className="font-arcade text-sm tracking-widest"
          style={{ color: '#666' }}
        >
          ─── MATCH COMPLETE ───
        </div>

        {/* Big title */}
        <div className="flex flex-col items-center">
          <h1
            className="font-arcade text-6xl md:text-8xl font-black tracking-wider"
            style={{
              color: titleColor,
              textShadow: `0 0 30px ${titleColor}, 0 0 60px ${titleColor}80, 4px 4px 0 rgba(0,0,0,0.5)`,
            }}
          >
            {title}
          </h1>

          {state.p1Wins !== state.p2Wins && (
            <div
              className="font-arcade text-2xl mt-2 font-bold"
              style={{ color: winnerFighter.character.colors.primary, textShadow: `0 0 12px ${winnerFighter.character.colors.primary}` }}
            >
              {winnerFighter.character.name}
            </div>
          )}
        </div>

        {/* Score display */}
        <div
          className="flex items-center gap-6 px-8 py-4 rounded-lg border"
          style={{
            borderColor: '#333',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <div className="text-center">
            <div className="font-arcade text-xs mb-1" style={{ color: '#888' }}>
              {state.p1.character.name.split(' ')[0]}
            </div>
            <div
              className="font-arcade text-4xl font-black"
              style={{ color: state.p1.character.colors.primary, textShadow: `0 0 15px ${state.p1.character.colors.primary}` }}
            >
              {state.p1Wins}
            </div>
          </div>

          <div className="font-arcade text-2xl" style={{ color: '#444' }}>—</div>

          <div className="text-center">
            <div className="font-arcade text-xs mb-1" style={{ color: '#888' }}>
              {state.p2.character.name.split(' ')[0]}
            </div>
            <div
              className="font-arcade text-4xl font-black"
              style={{ color: state.p2.character.colors.primary, textShadow: `0 0 15px ${state.p2.character.colors.primary}` }}
            >
              {state.p2Wins}
            </div>
          </div>
        </div>

        {/* Total wins */}
        <div className="text-center">
          <div className="font-arcade text-xs" style={{ color: '#666' }}>
            TOTAL VICTORIES: <span style={{ color: '#FFCC00' }}>{totalWins}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onMenu}
            className="font-arcade text-sm px-6 py-3 rounded border-2 transition-all duration-200 hover:scale-105"
            style={{ borderColor: '#444', color: '#888' }}
          >
            ← MAIN MENU
          </button>

          <button
            onClick={onRestart}
            className="font-arcade text-base px-10 py-4 rounded border-2 transition-all duration-200 hover:scale-105 pulse-neon"
            style={{
              borderColor: '#FFCC00',
              color: '#FFCC00',
              textShadow: '0 0 10px #FFCC00',
              boxShadow: '0 0 20px rgba(255,204,0,0.3)',
              background: 'rgba(255,204,0,0.06)',
            }}
          >
            ⚡ REMATCH ⚡
          </button>
        </div>

        <div className="font-arcade text-xs" style={{ color: '#444' }}>
          ENTER = REMATCH · ESC = MENU
        </div>
      </div>
    </div>
  )
}
