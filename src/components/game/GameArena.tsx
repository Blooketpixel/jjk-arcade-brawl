import { useEffect, useRef } from 'react'
import type { CharacterData, GameMode } from '../../game/types'
import { createInitialGameState } from '../../game/engine'
import { useGameLoop } from '../../game/useGameLoop'
import { CANVAS } from '../../game/renderer'
import GameHUD from './GameHUD'

interface Props {
  p1Char: CharacterData
  p2Char: CharacterData
  mode: GameMode
  onGameOver: (state: any) => void
}

export default function GameArena({ p1Char, p2Char, mode, onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialState = createInitialGameState(p1Char, p2Char)
  const isAI = mode === '1p'

  const { gameState, start, stop, restart, keysRef } = useGameLoop(canvasRef, initialState, isAI)

  const handleUltimate = (playerNum: 1 | 2) => {
    if (playerNum === 1) {
      keysRef.current['q'] = true
      setTimeout(() => { keysRef.current['q'] = false }, 100)
    } else {
      keysRef.current['5'] = true
      setTimeout(() => { keysRef.current['5'] = false }, 100)
    }
  }

  useEffect(() => {
    start()
    return () => stop()
  }, [start, stop])

  useEffect(() => {
    if (gameState.roundPhase === 'game-over') {
      const t = setTimeout(() => onGameOver(gameState), 1500)
      return () => clearTimeout(t)
    }
  }, [gameState.roundPhase, gameState, onGameOver])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#02020A]">
      {/* Game frame */}
      <div
        className="relative"
        style={{
          border: '3px solid rgba(123,47,255,0.4)',
          boxShadow: '0 0 40px rgba(123,47,255,0.2), 0 0 80px rgba(123,47,255,0.1), inset 0 0 20px rgba(0,0,0,0.5)',
          borderRadius: '4px',
        }}
      >
        {/* HUD overlay */}
        <div
          className="absolute inset-x-0 top-0 z-10"
          style={{ pointerEvents: 'none' }}
        >
          <GameHUD 
            state={gameState} 
            onUltimateP1={() => handleUltimate(1)}
            onUltimateP2={() => handleUltimate(2)}
          />
        </div>

        {/* 2D Canvas arena */}
        <canvas
          ref={canvasRef}
          width={CANVAS.W}
          height={CANVAS.H}
          className="block"
          style={{
            imageRendering: 'pixelated',
            display: 'block',
            maxWidth: '100vw',
          }}
        />

        {/* Scanlines on top */}
        <div
          className="absolute inset-0 scanlines pointer-events-none"
          style={{ borderRadius: '4px', zIndex: 5 }}
        />

        {/* Corner decorations */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-6 h-6`}
            style={{
              borderTop: i < 2 ? '2px solid #FF3131' : 'none',
              borderBottom: i >= 2 ? '2px solid #FF3131' : 'none',
              borderLeft: (i === 0 || i === 2) ? '2px solid #FF3131' : 'none',
              borderRight: (i === 1 || i === 3) ? '2px solid #FF3131' : 'none',
            }}
          />
        ))}
      </div>

      {/* Mobile controls hint */}
      <div className="mt-4 text-center">
        <div className="font-arcade text-xs" style={{ color: '#333' }}>
          P1: A/D+W • U/I/O/P/K &nbsp;|&nbsp; {isAI ? 'CPU' : 'P2: ←/→+↑ • 1/2/3/4/0'}
        </div>
      </div>

      {/* Mobile touch controls */}
      <MobileControls isAI={isAI} />
    </div>
  )
}

// Simple mobile touch controls (P1 only for now)
function MobileControls({ isAI }: { isAI: boolean }) {
  const simulateKey = (key: string, down: boolean) => {
    const event = new KeyboardEvent(down ? 'keydown' : 'keyup', { key, bubbles: true })
    window.dispatchEvent(event)
  }

  return (
    <div className="mt-4 flex gap-8 md:hidden">
      {/* Left side */}
      <div className="flex flex-col gap-2 items-center">
        <div className="font-arcade text-xs mb-1" style={{ color: '#FF3131' }}>P1 MOVE</div>
        <div className="flex gap-2">
          {[
            { label: '←', key: 'ArrowLeft' },
            { label: '↑', key: 'ArrowUp' },
            { label: '→', key: 'ArrowRight' },
          ].map(btn => (
            <button
              key={btn.key}
              onPointerDown={() => simulateKey(btn.key, true)}
              onPointerUp={() => simulateKey(btn.key, false)}
              className="w-12 h-12 rounded font-arcade text-sm border-2 active:scale-95 select-none"
              style={{ borderColor: '#FF3131', color: '#FF3131', background: 'rgba(255,49,49,0.1)' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-2 items-center">
        <div className="font-arcade text-xs mb-1" style={{ color: '#FF3131' }}>P1 ATTACK</div>
        <div className="grid grid-cols-2 gap-1">
          {[
            { label: 'L', key: 'u', color: '#FFAA00' },
            { label: 'H', key: 'i', color: '#FF3131' },
            { label: 'K', key: 'o', color: '#A855F7' },
            { label: '⚡', key: 'p', color: '#00FFFF' },
            { label: '🔥', key: 'q', color: '#FFCC00' },
          ].map(btn => (
            <button
              key={btn.key}
              onPointerDown={() => simulateKey(btn.key, true)}
              onPointerUp={() => simulateKey(btn.key, false)}
              className="w-12 h-12 rounded font-arcade text-xs border-2 active:scale-95 select-none"
              style={{ borderColor: btn.color, color: btn.color, background: `${btn.color}15` }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
