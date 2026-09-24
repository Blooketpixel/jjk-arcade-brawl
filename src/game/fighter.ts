import type { Fighter, CharacterData } from './types'
import { GROUND_Y, STAGE_LEFT, STAGE_RIGHT, GRAVITY } from './constants'

export function createFighter(character: CharacterData, startX: number, isPlayer: boolean, playerNum: 1 | 2): Fighter {
  return {
    x: startX,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    width: 60,
    height: 90,
    health: character.stats.maxHealth,
    maxHealth: character.stats.maxHealth,
    cursedEnergy: character.stats.cursedEnergy,
    maxCursedEnergy: character.stats.cursedEnergy,
    facing: playerNum === 1 ? 'right' : 'left',
    animState: 'idle',
    animFrame: 0,
    animTimer: 0,
    attackTimer: 0,
    hurtTimer: 0,
    blockTimer: 0,
    stunTimer: 0,
    onGround: true,
    isAttacking: false,
    isBlocking: false,
    comboCount: 0,
    comboTimer: 0,
    character,
    isPlayer,
    playerNum,
    specialCooldown: 0,
    specialPhase: 0,
    hitRegistered: false,
    ultimateCharge: 0,
    maxUltimateCharge: 100,
    isUltimating: false,
    ultimateTimer: 0,
  }
}

export function updateFighter(fighter: Fighter, dt: number): void {
  // Ensure airborne state if above ground
  if (fighter.y < GROUND_Y) {
    fighter.onGround = false
  }

  // Gravity
  if (!fighter.onGround) {
    fighter.vy += GRAVITY
  }

  // Apply velocity
  fighter.x += fighter.vx
  fighter.y += fighter.vy

  // Ground
  if (fighter.y >= GROUND_Y) {
    fighter.y = GROUND_Y
    fighter.vy = 0
    fighter.onGround = true
    if (fighter.vx !== 0) fighter.vx *= 0.7
    if (Math.abs(fighter.vx) < 0.5) fighter.vx = 0
  }

  // Stage bounds
  fighter.x = Math.max(STAGE_LEFT, Math.min(STAGE_RIGHT - fighter.width, fighter.x))

  // Timers
  if (fighter.attackTimer > 0) {
    fighter.attackTimer -= dt
    if (fighter.attackTimer <= 0) {
      fighter.isAttacking = false
      fighter.attackTimer = 0
      fighter.animState = fighter.onGround ? 'idle' : 'jump'
      fighter.specialPhase = 0
    }
  }

  if (fighter.ultimateTimer > 0) {
    fighter.ultimateTimer -= dt
    if (fighter.ultimateTimer <= 0) {
      fighter.isUltimating = false
      fighter.ultimateTimer = 0
      fighter.animState = fighter.onGround ? 'idle' : 'jump'
    }
  }

  if (fighter.hurtTimer > 0) {
    fighter.hurtTimer -= dt
    if (fighter.hurtTimer <= 0) {
      fighter.hurtTimer = 0
      if (fighter.animState === 'hurt') {
        fighter.animState = fighter.onGround ? 'idle' : 'jump'
      }
    }
  }

  if (fighter.stunTimer > 0) {
    fighter.stunTimer -= dt
    if (fighter.stunTimer <= 0) {
      fighter.stunTimer = 0
      fighter.animState = fighter.onGround ? 'idle' : 'jump'
    }
  }

  if (fighter.blockTimer > 0) {
    fighter.blockTimer -= dt
    if (fighter.blockTimer <= 0) {
      fighter.blockTimer = 0
      fighter.isBlocking = false
    }
  }

  if (fighter.comboTimer > 0) {
    fighter.comboTimer -= dt
    if (fighter.comboTimer <= 0) {
      fighter.comboCount = 0
      fighter.comboTimer = 0
    }
  }

  if (fighter.specialCooldown > 0) {
    fighter.specialCooldown -= dt
    fighter.cursedEnergy = Math.min(fighter.maxCursedEnergy, fighter.cursedEnergy + dt * 10)
  } else {
    fighter.cursedEnergy = Math.min(fighter.maxCursedEnergy, fighter.cursedEnergy + dt * 8)
  }

  // Passive ultimate charge
  if (!fighter.isUltimating) {
    fighter.ultimateCharge = Math.min(fighter.maxUltimateCharge, fighter.ultimateCharge + dt * 2.5)
  }

  // Anim timer
  fighter.animTimer += dt
  if (fighter.animTimer > 0.12) {
    fighter.animTimer = 0
    fighter.animFrame = (fighter.animFrame + 1) % 4
  }

  // Death state
  if (fighter.health <= 0) {
    fighter.animState = 'dead'
    fighter.isAttacking = false
  }
}