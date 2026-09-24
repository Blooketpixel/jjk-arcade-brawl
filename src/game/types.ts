export type GameScreen = 'menu' | 'character-select' | 'game' | 'game-over'
export type GameMode = '1p' | '2p'

export interface CharacterStats {
  maxHealth: number
  speed: number
  jumpPower: number
  attackPower: number
  specialPower: number
  cursedEnergy: number
}

export interface CharacterColors {
  primary: string
  secondary: string
  aura: string
  special: string
}

export interface CharacterData {
  id: string
  name: string
  title: string
  description: string
  colors: CharacterColors
  stats: CharacterStats
  specialName: string
  specialDescription: string
  ultimateName: string
  ultimateDescription: string
  controls?: {
    p1: string
    p2: string
  }
}

export type AttackType = 'light' | 'heavy' | 'kick' | 'special' | 'ultimate'
export type Direction = 'left' | 'right'
export type AnimState = 'idle' | 'walk' | 'jump' | 'attack' | 'special' | 'ultimate' | 'hurt' | 'dead' | 'block'

export interface HitEffect {
  x: number
  y: number
  size: number
  color: string
  life: number
  maxLife: number
}

export interface DamageNumber {
  x: number
  y: number
  value: number
  color: string
  life: number
  maxLife: number
  isSpecial: boolean
}

export interface Fighter {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  health: number
  maxHealth: number
  cursedEnergy: number
  maxCursedEnergy: number
  facing: Direction
  animState: AnimState
  animFrame: number
  animTimer: number
  attackTimer: number
  hurtTimer: number
  blockTimer: number
  stunTimer: number
  onGround: boolean
  isAttacking: boolean
  isBlocking: boolean
  comboCount: number
  comboTimer: number
  character: CharacterData
  isPlayer: boolean
  playerNum: 1 | 2
  specialCooldown: number
  specialPhase: number // Added to track multi-stage specials
  hitRegistered: boolean // Added to prevent double-hitting in one animation
  currentAttackType?: AttackType // Added to track current attack damage type
  ultimateCharge: number
  maxUltimateCharge: number
  isUltimating: boolean
  ultimateTimer: number
}

export interface Projectile {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  damage: number
  color: string
  owner: 1 | 2
  life: number
  maxLife: number
  type: 'orb' | 'wolf' | 'slash'
}

export interface GameState {
  p1: Fighter
  p2: Fighter
  timer: number
  round: number
  p1Wins: number
  p2Wins: number
  hitEffects: HitEffect[]
  damageNumbers: DamageNumber[]
  projectiles: Projectile[] // Added for projectiles
  screenShake: number
  roundPhase: 'start' | 'fight' | 'round-end' | 'game-over'
  roundEndTimer: number
  winner: 'p1' | 'p2' | 'draw' | null
}