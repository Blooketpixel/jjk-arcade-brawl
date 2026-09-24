import type { GameState } from '../../game/types'

interface Props {
  state: GameState
  onUltimateP1?: () => void
  onUltimateP2?: () => void
}

function HealthBar({ current, max, color, flipped }: { current: number; max: number; color: string; flipped: boolean }) {
  const pct = Math.max(0, (current / max) * 100)
  const isLow = pct < 25
  const isMed = pct < 50

  const barColor = isLow ? '#FF3131' : isMed ? '#FFAA00' : color

  return (
    <div className="flex flex-col gap-1 flex-1">
      <div
        className="relative h-5 rounded overflow-hidden"
        style={{ background: '#0A0A1A', border: '1px solid #333' }}
      >
        {/* Background track */}
        <div className="absolute inset-0" style={{ background: '#1A0A1A' }} />

        {/* Health fill */}
        <div
          className="absolute top-0 h-full transition-all duration-150"
          style={{
            width: `${pct}%`,
            right: flipped ? 0 : undefined,
            left: flipped ? undefined : 0,
            background: `linear-gradient(90deg, ${barColor}AA, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}80`,
          }}
        />

        {/* Tick marks */}
        {[25, 50, 75].map(tick => (
          <div
            key={tick}
            className="absolute top-0 h-full w-px"
            style={{ left: `${tick}%`, background: '#333' }}
          />
        ))}

        {/* HP text */}
        <div
          className="absolute inset-0 flex items-center justify-center font-arcade text-xs font-bold"
          style={{ color: '#FFF', textShadow: '0 0 4px rgba(0,0,0,0.8)', fontSize: '10px' }}
        >
          {Math.ceil(current)} / {max}
        </div>
      </div>
    </div>
  )
}

function CursedBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = (current / max) * 100
  return (
    <div
      className="h-2 rounded overflow-hidden"
      style={{ background: '#0A0A1A', border: '1px solid #222' }}
    >
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          boxShadow: `0 0 6px ${color}60`,
        }}
      />
    </div>
  )
}

function WinDots({ wins, color }: { wins: number; color: string }) {
  return (
    <div className="flex gap-1 justify-center">
      {[0, 1].map(i => (
        <div
          key={i}
          className="w-3 h-3 rounded-full border transition-all duration-300"
          style={{
            borderColor: color,
            background: i < wins ? color : 'transparent',
            boxShadow: i < wins ? `0 0 8px ${color}` : 'none',
          }}
        />
      ))}
    </div>
  )
}

function UltimateBar({ current, max, color, isReady, onClick }: { current: number; max: number; color: string; isReady: boolean; onClick?: () => void }) {
  const pct = (current / max) * 100
  return (
    <div
      className={`relative h-6 rounded cursor-pointer group transition-all duration-300 ${isReady ? 'pulse-neon' : ''}`}
      style={{
        background: '#0A0A1A',
        border: `1px solid ${isReady ? color : '#333'}`,
        boxShadow: isReady ? `0 0 15px ${color}40` : 'none',
        width: '180px'
      }}
      onClick={onClick}
    >
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${pct}%`,
          background: isReady 
            ? `linear-gradient(90deg, ${color}AA, #FFF, ${color}AA)` 
            : `linear-gradient(90deg, ${color}44, ${color}88)`,
          boxShadow: isReady ? `0 0 10px ${color}` : 'none',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center font-arcade text-[9px] font-bold" style={{ color: isReady ? '#FFF' : '#666' }}>
        {isReady ? 'ULTIMATE READY' : `ULTIMATE ${Math.floor(pct)}%`}
      </div>
    </div>
  )
}

export default function GameHUD({ state, onUltimateP1, onUltimateP2 }: Props) {
  const { p1, p2, timer, round, p1Wins, p2Wins } = state

  const timerColor = timer <= 10 ? '#FF3131' : timer <= 30 ? '#FFAA00' : '#FFCC00'

  // We can't actually trigger the ultimate from here easily without a callback to the engine,
  // but we can provide the visual. The engine will handle the key press.
  
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 px-4 pt-3 pb-2 pointer-events-auto">
        <div className="flex items-start gap-3">
          {/* P1 side */}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-2">
              <div
                className="font-arcade text-xs font-bold truncate"
                style={{ color: p1.character.colors.primary, textShadow: `0 0 6px ${p1.character.colors.primary}` }}
              >
                {p1.character.name.split(' ')[0].toUpperCase()}
              </div>
              <WinDots wins={p1Wins} color={p1.character.colors.primary} />
            </div>
            <HealthBar
              current={p1.health}
              max={p1.maxHealth}
              color={p1.character.colors.primary}
              flipped={false}
            />
            <CursedBar current={p1.cursedEnergy} max={p1.maxCursedEnergy} color="#A855F7" />
            {/* Combo */}
            {p1.comboCount > 1 && (
              <div
                className="font-arcade text-xs animate-fade-in"
                style={{ color: '#FFCC00', textShadow: '0 0 8px #FFCC00' }}
              >
                {p1.comboCount}× COMBO
              </div>
            )}
          </div>

          {/* Center — timer & round */}
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <div
              className="font-arcade text-xs"
              style={{ color: '#666' }}
            >
              ROUND {round}
            </div>
            <div
              className="font-arcade text-3xl font-black w-16 text-center tabular-nums"
              style={{
                color: timerColor,
                textShadow: `0 0 12px ${timerColor}`,
                border: `1px solid ${timerColor}40`,
                background: `${timerColor}10`,
                padding: '2px 0',
                borderRadius: '4px',
              }}
            >
              {Math.ceil(timer).toString().padStart(2, '0')}
            </div>
          </div>

          {/* P2 side */}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center justify-end gap-2">
              <WinDots wins={p2Wins} color={p2.character.colors.primary} />
              <div
                className="font-arcade text-xs font-bold truncate text-right"
                style={{ color: p2.character.colors.primary, textShadow: `0 0 6px ${p2.character.colors.primary}` }}
              >
                {p2.character.name.split(' ')[0].toUpperCase()}
              </div>
            </div>
            <HealthBar
              current={p2.health}
              max={p2.maxHealth}
              color={p2.character.colors.primary}
              flipped={true}
            />
            <div style={{ transform: 'scaleX(-1)' }}>
              <CursedBar current={p2.cursedEnergy} max={p2.maxCursedEnergy} color="#A855F7" />
            </div>
            {p2.comboCount > 1 && (
              <div
                className="font-arcade text-xs text-right animate-fade-in"
                style={{ color: '#FFCC00', textShadow: '0 0 8px #FFCC00' }}
              >
                {p2.comboCount}× COMBO
              </div>
            )}
          </div>
        </div>

        {/* Cursed energy label */}
        <div className="flex justify-between mt-1 px-1">
          <div className="font-arcade text-[9px]" style={{ color: '#A855F7', opacity: 0.7 }}>
            ⚡ CURSED ENERGY {p1.specialCooldown > 0 ? `(${Math.ceil(p1.specialCooldown)}s)` : p1.cursedEnergy >= 60 ? '— READY' : ''}
          </div>
          <div className="font-arcade text-[9px] text-right" style={{ color: '#A855F7', opacity: 0.7 }}>
            {p2.specialCooldown > 0 ? `(${Math.ceil(p2.specialCooldown)}s)` : p2.cursedEnergy >= 60 ? 'READY —' : ''} CURSED ENERGY ⚡
          </div>
        </div>
      </div>

      {/* Bottom HUD - Ultimate Bars */}
      <div className="absolute bottom-4 left-0 right-0 px-8 flex justify-between pointer-events-auto">
        <div className="flex flex-col gap-1 items-start">
          <div className="font-arcade text-[8px]" style={{ color: '#FFCC00' }}>[Q] ULTIMATE MOVE</div>
          <UltimateBar 
            current={p1.ultimateCharge} 
            max={p1.maxUltimateCharge} 
            color="#FFCC00" 
            isReady={p1.ultimateCharge >= p1.maxUltimateCharge}
            onClick={onUltimateP1}
          />
          <div className="font-arcade text-[7px]" style={{ color: '#AAA', maxWidth: '180px' }}>
            {p1.character.ultimateName}: {p1.character.ultimateDescription}
          </div>
        </div>

        <div className="flex flex-col gap-1 items-end">
          <div className="font-arcade text-[8px] text-right" style={{ color: '#FFCC00' }}>ULTIMATE MOVE [5]</div>
          <UltimateBar 
            current={p2.ultimateCharge} 
            max={p2.maxUltimateCharge} 
            color="#FFCC00" 
            isReady={p2.ultimateCharge >= p2.maxUltimateCharge}
            onClick={onUltimateP2}
          />
          <div className="font-arcade text-[7px] text-right" style={{ color: '#AAA', maxWidth: '180px' }}>
            {p2.character.ultimateName}: {p2.character.ultimateDescription}
          </div>
        </div>
      </div>
    </div>
  )
}
