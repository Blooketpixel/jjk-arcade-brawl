import { useState, useCallback } from 'react'
import type { CharacterData, GameMode } from './game/types'
import type { GameState } from './game/types'
import MenuScreen from './components/game/MenuScreen'
import CharacterSelect from './components/game/CharacterSelect'
import GameArena from './components/game/GameArena'
import GameOver from './components/game/GameOver'

type Screen = 'menu' | 'select' | 'game' | 'gameover'

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [mode, setMode] = useState<GameMode>('1p')
  const [p1Char, setP1Char] = useState<CharacterData | null>(null)
  const [p2Char, setP2Char] = useState<CharacterData | null>(null)
  const [finalState, setFinalState] = useState<GameState | null>(null)

  const handleStartMode = useCallback((m: GameMode) => {
    setMode(m)
    setScreen('select')
  }, [])

  const handleConfirmChars = useCallback((p1: CharacterData, p2: CharacterData) => {
    setP1Char(p1)
    setP2Char(p2)
    setScreen('game')
  }, [])

  const handleGameOver = useCallback((state: GameState) => {
    setFinalState(state)
    setScreen('gameover')
  }, [])

  const handleRestart = useCallback(() => {
    if (p1Char && p2Char) {
      setScreen('game')
    }
  }, [p1Char, p2Char])

  const handleMenu = useCallback(() => {
    setScreen('menu')
    setP1Char(null)
    setP2Char(null)
    setFinalState(null)
  }, [])

  return (
    <div className="min-h-screen bg-[#05050F]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {screen === 'menu' && (
        <MenuScreen onStart={handleStartMode} />
      )}

      {screen === 'select' && (
        <CharacterSelect
          mode={mode}
          onConfirm={handleConfirmChars}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'game' && p1Char && p2Char && (
        <GameArena
          key={`${p1Char.id}-${p2Char.id}-${Date.now()}`}
          p1Char={p1Char}
          p2Char={p2Char}
          mode={mode}
          onGameOver={handleGameOver}
        />
      )}

      {screen === 'gameover' && finalState && (
        <GameOver
          state={finalState}
          mode={mode}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  )
}
