import { useState, useEffect } from 'react'
import { CHARACTERS } from '../../game/characters'
import type { CharacterData } from '../../game/types'
import type { GameMode } from '../../game/types'

interface Props {
  mode: GameMode
  onConfirm: (p1: CharacterData, p2: CharacterData) => void
  onBack: () => void
}

function CharacterCard({ char, selected, side }: { char: CharacterData; selected: boolean; side: 'p1' | 'p2' }) {
  const borderColor = side === 'p1' ? char.colors.primary : char.colors.aura.replace('0.5)', '0.8)').replace('0.7)', '0.8)').replace('0.6)', '0.8)')
  return (
    <div
      className="relative flex flex-col items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border-2"
      style={{
        borderColor: selected ? char.colors.primary : '#222',
        background: selected ? `${char.colors.primary}15` : 'rgba(255,255,255,0.03)',
        boxShadow: selected ? `0 0 25px ${char.colors.primary}50, inset 0 0 15px ${char.colors.primary}10` : 'none',
        transform: selected ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
      }}
    >
      {selected && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 font-arcade text-xs px-3 py-1 rounded"
          style={{
            background: char.colors.primary,
            color: '#000',
            textShadow: 'none',
          }}
        >
          {side === 'p1' ? '1P' : '2P'}
        </div>
      )}

      {/* Character art — canvas-style portrait */}
      <div
        className="relative w-24 h-28 rounded flex items-end justify-center"
        style={{ background: `linear-gradient(180deg, ${char.colors.aura} 0%, rgba(0,0,0,0) 100%)` }}
      >
        <CharacterPortrait char={char} />
      </div>

      <div className="text-center">
        <div
          className="font-arcade text-sm font-bold leading-tight"
          style={{ color: char.colors.primary, textShadow: `0 0 8px ${char.colors.primary}` }}
        >
          {char.name.split(' ')[0]}
        </div>
        <div className="font-arcade text-xs mt-1" style={{ color: '#666' }}>
          {char.name.split(' ').slice(1).join(' ')}
        </div>
        <div className="text-xs mt-1" style={{ color: char.colors.secondary, fontFamily: 'IBM Plex Mono' }}>
          {char.title}
        </div>
      </div>

      {/* Stats mini bars */}
      <div className="w-full space-y-1">
        {[
          { label: 'PWR', value: char.stats.attackPower / 30 },
          { label: 'SPD', value: char.stats.speed / 8 },
          { label: 'HP', value: char.stats.maxHealth / 140 },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="font-arcade text-[9px] w-6" style={{ color: '#666' }}>{stat.label}</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#222' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(stat.value * 100)}%`,
                  background: char.colors.primary,
                  boxShadow: `0 0 4px ${char.colors.primary}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CharacterPortrait({ char }: { char: CharacterData }) {
  const id = char.id
  const col = char.colors.primary
  const sec = char.colors.secondary

  // Detailed colors matching renderer
  let skinCol = '#FEE2E2'
  let pantsCol = '#0F172A'
  let bodyCol = '#1E293B'
  if (id === 'sukuna') {
    pantsCol = '#E2E8F0'
    bodyCol = '#F8FAFC'
  }

  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
      {/* Aura */}
      <ellipse cx="40" cy="85" rx="30" ry="8" fill={col} fillOpacity="0.2" />

      {/* Legs (Pants) */}
      <rect x="22" y="72" width="14" height="28" rx="5" fill={pantsCol} />
      <rect x="44" y="72" width="14" height="28" rx="5" fill={pantsCol} />

      {/* Body (Uniform/Kimono) */}
      <rect x="22" y="42" width="36" height="40" rx="6" fill={bodyCol} />
      
      {/* Character-specific clothing details */}
      {id === 'yuji' && (
        <rect x="25" y="42" width="30" height="10" rx="3" fill="#FF3131" />
      )}
      {id === 'megumi' && (
        <>
          <rect x="18" y="40" width="44" height="10" rx="3" fill="#0F172A" /> {/* High collar */}
          <circle cx="28" cy="55" r="2" fill="#FBBF24" /> {/* Golden button 1 */}
          <circle cx="28" cy="65" r="2" fill="#FBBF24" /> {/* Golden button 2 */}
        </>
      )}
      {id === 'sukuna' && (
        <>
          <rect x="22" y="68" width="36" height="8" fill="#0F172A" /> {/* Kimono sash */}
          <line x1="28" y1="50" x2="38" y2="60" stroke="rgba(0,0,0,0.8)" strokeWidth="1.5" />
          <line x1="52" y1="50" x2="42" y2="60" stroke="rgba(0,0,0,0.8)" strokeWidth="1.5" />
        </>
      )}

      {/* Arms */}
      <rect x="5" y="44" width="14" height="30" rx="5" fill={bodyCol} />
      <rect x="61" y="44" width="14" height="30" rx="5" fill={bodyCol} />

      {/* Head */}
      <circle cx="40" cy="30" r="18" fill={skinCol} />

      {/* Hair */}
      {id === 'yuji' && (
        <>
          <path d="M22 35 Q40 45 58 35 L58 30 Q40 20 22 30 Z" fill="#000000" /> {/* Undercut */}
          <path d="M22 25 Q20 10 30 8 Q40 5 50 8 Q60 10 58 25" fill="#FF7777" />
          <path d="M22 25 L18 15 L26 20 Z" fill="#FF7777" />
          <path d="M58 25 L62 15 L54 20 Z" fill="#FF7777" />
          <path d="M40 10 L40 0 L45 8 Z" fill="#FF7777" />
        </>
      )}
      {id === 'megumi' && (
        <>
          <path d="M22 25 Q22 8 40 6 Q58 8 58 25" fill="#0F172A" />
          {/* Detailed urchin spikes */}
          <path d="M20 20 L12 5 L28 15 Z" fill="#0F172A" />
          <path d="M60 20 L68 5 L52 15 Z" fill="#0F172A" />
          <path d="M40 8 L40 -4 L48 4 Z" fill="#0F172A" />
          <path d="M25 15 L18 -2 L32 10 Z" fill="#0F172A" />
          <path d="M55 15 L62 -2 L48 10 Z" fill="#0F172A" />
          {/* Highlights */}
          <path d="M22 20 L16 8 L24 16 Z" fill="#1E3A8A" fillOpacity="0.5" />
          <path d="M58 20 L64 8 L56 16 Z" fill="#1E3A8A" fillOpacity="0.5" />
        </>
      )}
      {id === 'gojo' && (
        <>
          <path d="M22 24 Q22 6 40 4 Q58 6 58 24" fill="#FFFFFF" />
          <path d="M20 18 L12 2 L28 14 Z" fill="#FFFFFF" />
          <path d="M60 18 L68 2 L52 14 Z" fill="#FFFFFF" />
          <path d="M40 6 L40 -4 L48 4 Z" fill="#FFFFFF" />
        </>
      )}
      {id === 'sukuna' && (
        <>
          <path d="M22 25 Q22 10 40 8 Q58 10 58 25" fill="#FF7777" />
          <path d="M25 15 L30 5 L35 12 Z" fill="#FF7777" />
          <path d="M55 15 L50 5 L45 12 Z" fill="#FF7777" />
          <circle cx="30" cy="55" r="2.5" fill="#000000" /> {/* Tattoo marks */}
          <circle cx="50" cy="55" r="2.5" fill="#000000" />
        </>
      )}

      {/* Eyes */}
      {id === 'gojo' ? (
        <>
          <rect x="22" y="26" width="36" height="8" rx="3" fill="rgba(255,255,255,0.15)" />
          <circle cx="34" cy="30" r="3" fill="#A5F3FC" />
          <circle cx="46" cy="30" r="3" fill="#A5F3FC" />
        </>
      ) : id === 'sukuna' ? (
        <>
          <circle cx="34" cy="33" r="3.5" fill="#FF3131" />
          <circle cx="46" cy="33" r="3.5" fill="#FF3131" />
          <circle cx="31" cy="39" r="2" fill="#000000" />
          <circle cx="49" cy="39" r="2" fill="#000000" />
        </>
      ) : id === 'yuji' ? (
        <>
          <circle cx="34" cy="33" r="3.5" fill="#78350F" />
          <circle cx="46" cy="33" r="3.5" fill="#78350F" />
        </>
      ) : (
        <>
          <circle cx="34" cy="33" r="3.5" fill="#065F46" />
          <circle cx="46" cy="33" r="3.5" fill="#065F46" />
        </>
      )}

      {/* Glow at bottom */}
      <ellipse cx="40" cy="80" rx="20" ry="4" fill={col} fillOpacity="0.3" />
    </svg>
  )
}

export default function CharacterSelect({ mode, onConfirm, onBack }: Props) {
  const [p1Idx, setP1Idx] = useState(0)
  const [p2Idx, setP2Idx] = useState(2)
  const [stage, setStage] = useState<'p1' | 'p2' | 'confirm'>('p1')

  const currentChar = stage === 'p1' ? CHARACTERS[p1Idx] : stage === 'p2' ? CHARACTERS[p2Idx] : CHARACTERS[p1Idx]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onBack(); return }
      if (stage === 'p1') {
        if (e.key === 'ArrowLeft') setP1Idx(i => (i - 1 + CHARACTERS.length) % CHARACTERS.length)
        if (e.key === 'ArrowRight') setP1Idx(i => (i + 1) % CHARACTERS.length)
        if (e.key === 'Enter') {
          if (mode === '1p') { setStage('confirm') }
          else setStage('p2')
        }
      } else if (stage === 'p2') {
        if (e.key === 'ArrowLeft') setP2Idx(i => (i - 1 + CHARACTERS.length) % CHARACTERS.length)
        if (e.key === 'ArrowRight') setP2Idx(i => (i + 1) % CHARACTERS.length)
        if (e.key === 'Enter') setStage('confirm')
      } else if (stage === 'confirm') {
        if (e.key === 'Enter') onConfirm(CHARACTERS[p1Idx], CHARACTERS[p2Idx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stage, p1Idx, p2Idx, mode, onConfirm, onBack])

  // AI auto-select when mode is 1p
  useEffect(() => {
    if (stage === 'confirm' && mode === '1p') {
      const randomIdx = Math.floor(Math.random() * CHARACTERS.length)
      setP2Idx(randomIdx === p1Idx ? (randomIdx + 1) % CHARACTERS.length : randomIdx)
    }
  }, [stage, mode, p1Idx])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#05050F] overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3131] to-transparent" />

      <div className="relative z-10 w-full max-w-5xl px-4 py-8 flex flex-col items-center gap-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="font-arcade text-xs tracking-widest" style={{ color: '#666' }}>
            ─── SELECT YOUR FIGHTER ───
          </div>
          <h2
            className="font-arcade text-3xl font-bold"
            style={{
              color: stage === 'p1' ? '#FF3131' : stage === 'p2' ? '#A855F7' : '#FFCC00',
              textShadow: `0 0 15px ${stage === 'p1' ? '#FF3131' : stage === 'p2' ? '#A855F7' : '#FFCC00'}`,
            }}
          >
            {stage === 'p1' ? 'PLAYER 1' : stage === 'p2' ? 'PLAYER 2' : 'READY?'}
          </h2>
          {mode === '1p' && stage === 'p1' && (
            <div className="font-arcade text-xs" style={{ color: '#666' }}>CPU will choose opponent</div>
          )}
        </div>

        {/* Characters grid */}
        <div className="grid grid-cols-4 gap-4 w-full">
          {CHARACTERS.map((char, idx) => {
            const isP1Selected = idx === p1Idx
            const isP2Selected = idx === p2Idx
            const isCurrentlySelecting = (stage === 'p1' && isP1Selected) || (stage === 'p2' && isP2Selected)
            const isFocused = (stage === 'p1' && idx === p1Idx) || (stage === 'p2' && idx === p2Idx)

            return (
              <div
                key={char.id}
                onClick={() => {
                  if (stage === 'p1') { setP1Idx(idx) }
                  else if (stage === 'p2') { setP2Idx(idx) }
                }}
                onDoubleClick={() => {
                  if (stage === 'p1') {
                    setP1Idx(idx)
                    if (mode === '1p') setStage('confirm')
                    else setStage('p2')
                  } else if (stage === 'p2') {
                    setP2Idx(idx)
                    setStage('confirm')
                  }
                }}
              >
                <CharacterCard
                  char={char}
                  selected={isFocused}
                  side={stage === 'p2' ? 'p2' : 'p1'}
                />
              </div>
            )
          })}
        </div>

        {/* Selected character info */}
        {stage !== 'confirm' && (
          <div
            className="w-full max-w-lg p-4 rounded-lg border text-center"
            style={{
              borderColor: currentChar.colors.primary + '40',
              background: `${currentChar.colors.primary}08`,
            }}
          >
            <div
              className="font-arcade text-xl font-bold mb-1"
              style={{ color: currentChar.colors.primary, textShadow: `0 0 10px ${currentChar.colors.primary}` }}
            >
              {currentChar.name}
            </div>
            <div className="text-sm mb-2" style={{ color: '#AAA', fontFamily: 'IBM Plex Mono' }}>
              {currentChar.description}
            </div>
            <div
              className="font-arcade text-sm"
              style={{ color: currentChar.colors.secondary }}
            >
              ✦ SPECIAL: {currentChar.specialName}
            </div>
          </div>
        )}

        {/* VS display in confirm */}
        {stage === 'confirm' && (
          <div className="flex items-center gap-8">
            <div className="text-center">
              <CharacterPortrait char={CHARACTERS[p1Idx]} />
              <div className="font-arcade text-sm mt-2" style={{ color: CHARACTERS[p1Idx].colors.primary }}>
                {CHARACTERS[p1Idx].name.split(' ')[0]}
              </div>
              <div className="font-arcade text-xs" style={{ color: '#888' }}>P1</div>
            </div>

            <div
              className="font-arcade text-4xl font-black"
              style={{ color: '#FFCC00', textShadow: '0 0 20px #FFCC00' }}
            >
              VS
            </div>

            <div className="text-center">
              <CharacterPortrait char={CHARACTERS[p2Idx]} />
              <div className="font-arcade text-sm mt-2" style={{ color: CHARACTERS[p2Idx].colors.primary }}>
                {CHARACTERS[p2Idx].name.split(' ')[0]}
              </div>
              <div className="font-arcade text-xs" style={{ color: '#888' }}>{mode === '1p' ? 'CPU' : 'P2'}</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 items-center">
          <button
            onClick={onBack}
            className="font-arcade text-sm px-6 py-3 rounded border transition-all duration-200 hover:scale-105"
            style={{ borderColor: '#444', color: '#888' }}
          >
            ← BACK
          </button>

          {stage === 'p1' && (
            <button
              onClick={() => {
                if (mode === '1p') setStage('confirm')
                else setStage('p2')
              }}
              className="font-arcade text-sm px-8 py-3 rounded border-2 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: CHARACTERS[p1Idx].colors.primary,
                color: CHARACTERS[p1Idx].colors.primary,
                textShadow: `0 0 8px ${CHARACTERS[p1Idx].colors.primary}`,
                boxShadow: `0 0 15px ${CHARACTERS[p1Idx].colors.primary}30`,
              }}
            >
              {mode === '1p' ? 'CONFIRM →' : 'NEXT: P2 →'}
            </button>
          )}

          {stage === 'p2' && (
            <button
              onClick={() => setStage('confirm')}
              className="font-arcade text-sm px-8 py-3 rounded border-2 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: CHARACTERS[p2Idx].colors.primary,
                color: CHARACTERS[p2Idx].colors.primary,
                boxShadow: `0 0 15px ${CHARACTERS[p2Idx].colors.primary}30`,
              }}
            >
              CONFIRM →
            </button>
          )}

          {stage === 'confirm' && (
            <button
              onClick={() => onConfirm(CHARACTERS[p1Idx], CHARACTERS[p2Idx])}
              className="font-arcade text-base px-10 py-4 rounded border-2 transition-all duration-200 hover:scale-105 pulse-neon"
              style={{
                borderColor: '#FFCC00',
                color: '#FFCC00',
                textShadow: '0 0 10px #FFCC00',
                boxShadow: '0 0 20px rgba(255,204,0,0.4)',
                background: 'rgba(255,204,0,0.08)',
              }}
            >
              ⚡ FIGHT! ⚡
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
