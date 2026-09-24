import { useEffect, useRef, useState, useCallback } from 'react'
import type { GameState, InputMap } from './types'
import { tickGameState } from './engine'
import { renderGame } from './renderer'

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  initialState: GameState,
  isAI: boolean
) {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const stateRef = useRef<GameState>(initialState)
  const keysRef = useRef<InputMap>({})
  const lastTimeRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const [isRunning, setIsRunning] = useState(false)

  // Sync state ref
  useEffect(() => {
    stateRef.current = gameState
  }, [gameState])

  const loop = useCallback((timestamp: number) => {
    if (!canvasRef.current) return
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.033) // cap at ~30fps delta
    lastTimeRef.current = timestamp
    timeRef.current += dt

    const next = tickGameState(stateRef.current, dt, keysRef.current, isAI)
    stateRef.current = next
    setGameState(next)

    renderGame(canvasRef.current, next, timeRef.current)

    if (next.roundPhase !== 'game-over') {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      setIsRunning(false)
    }
  }, [canvasRef, isAI])

  const start = useCallback(() => {
    setIsRunning(true)
    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  const stop = useCallback(() => {
    setIsRunning(false)
    cancelAnimationFrame(rafRef.current)
  }, [])

  const restart = useCallback((newState: GameState) => {
    stateRef.current = newState
    setGameState(newState)
    timeRef.current = 0
    lastTimeRef.current = performance.now()
    setIsRunning(true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      // Prevent scroll
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return { gameState, start, stop, restart, isRunning, keysRef }
}
