import type { GameState, CharacterData, Fighter } from './types'
import { createFighter, updateFighter } from './fighter'
import { performAttack, applyDamage, getAttackHitbox, rectsOverlap } from './combat'
import { updateProjectiles } from './projectiles'
import { ROUND_TIME, ROUND_WINS_NEEDED } from './constants'

export { STAGE } from './constants'

export function createInitialGameState(p1Char: CharacterData, p2Char: CharacterData): GameState {
  return {
    p1: createFighter(p1Char, 150, true, 1),
    p2: createFighter(p2Char, 600, false, 2),
    timer: ROUND_TIME,
    round: 1,
    p1Wins: 0,
    p2Wins: 0,
    hitEffects: [],
    damageNumbers: [],
    projectiles: [],
    screenShake: 0,
    roundPhase: 'start',
    roundEndTimer: 2.5,
    winner: null,
  }
}

export function resetRound(state: GameState, p1Char: CharacterData, p2Char: CharacterData): GameState {
  return {
    ...state,
    p1: createFighter(p1Char, 150, true, 1),
    p2: createFighter(p2Char, 600, false, 2),
    timer: ROUND_TIME,
    hitEffects: [],
    damageNumbers: [],
    projectiles: [],
    screenShake: 0,
    roundPhase: 'start',
    roundEndTimer: 2.5,
    winner: null,
  }
}

export type InputMap = { [key: string]: boolean }

export function handleInput(fighter: Fighter, keys: InputMap, state: GameState, opponent: Fighter): void {
  if (fighter.health <= 0 || fighter.hurtTimer > 0 || fighter.stunTimer > 0) return
  // Gojo can continue throwing punches while Unlimited Void is active.
  if (fighter.isAttacking && fighter.character.id !== 'yuji' && !(fighter.character.id === 'gojo' && fighter.isUltimating)) return

  const isP1 = fighter.playerNum === 1
  const left = isP1 ? keys['ArrowLeft'] || keys['a'] || keys['A'] : keys['ArrowLeft']
  const right = isP1 ? keys['ArrowRight'] || keys['d'] || keys['D'] : keys['ArrowRight']
  const jump = isP1 ? keys['ArrowUp'] || keys['w'] || keys['W'] : keys['ArrowUp']
  const lightAtk = isP1 ? keys['u'] || keys['U'] : keys['1']
  const heavyAtk = isP1 ? keys['i'] || keys['I'] : keys['2']
  const kick = isP1 ? keys['o'] || keys['O'] : keys['3']
  const special = isP1 ? keys['p'] || keys['P'] : keys['4']
  const ultimate = isP1 ? keys['q'] || keys['Q'] : keys['5']
  const block = isP1 ? keys['k'] || keys['K'] : keys['0']

  if (left) {
    fighter.vx = -fighter.character.stats.speed
    fighter.facing = 'left'
    if (fighter.onGround && fighter.animState === 'idle') fighter.animState = 'walk'
  } else if (right) {
    fighter.vx = fighter.character.stats.speed
    fighter.facing = 'right'
    if (fighter.onGround && fighter.animState === 'idle') fighter.animState = 'walk'
  } else {
    if (fighter.onGround && fighter.animState === 'walk') fighter.animState = 'idle'
    if (fighter.onGround) fighter.vx = 0
  }

  if (jump && fighter.onGround) {
    fighter.vy = -fighter.character.stats.jumpPower
    fighter.onGround = false
    fighter.animState = 'jump'
  }

  if (block && fighter.onGround) {
    fighter.isBlocking = true
    fighter.animState = 'block'
    fighter.blockTimer = 0.1
  }

  if (lightAtk) performAttack(fighter, opponent, state, 'light')
  else if (heavyAtk) performAttack(fighter, opponent, state, 'heavy')
  else if (kick) performAttack(fighter, opponent, state, 'kick')
  else if (special && fighter.cursedEnergy >= 60 && fighter.specialCooldown <= 0) {
    performAttack(fighter, opponent, state, 'special')
  } else if (ultimate && fighter.ultimateCharge >= fighter.maxUltimateCharge) {
    performAttack(fighter, opponent, state, 'ultimate')
  }
}

export function runAI(ai: Fighter, player: Fighter, state: GameState, keys: InputMap): void {
  if (ai.health <= 0 || ai.hurtTimer > 0 || ai.isAttacking) return

  const dx = player.x - ai.x
  const dist = Math.abs(dx)
  const facing = dx > 0 ? 'right' : 'left'

  ai.facing = facing

  if (dist > 120) {
    ai.vx = dx > 0 ? ai.character.stats.speed * 0.8 : -ai.character.stats.speed * 0.8
    ai.animState = 'walk'
  } else if (dist < 60) {
    ai.vx = dx > 0 ? -ai.character.stats.speed * 0.4 : ai.character.stats.speed * 0.4
    ai.animState = 'walk'
  } else {
    ai.vx = 0
    ai.animState = 'idle'
  }

  if (dist < 130 && Math.random() < 0.03) {
    const roll = Math.random()
    if (roll < 0.4) performAttack(ai, player, state, 'light')
    else if (roll < 0.7) performAttack(ai, player, state, 'heavy')
    else if (roll < 0.85) performAttack(ai, player, state, 'kick')
    else if (ai.cursedEnergy >= 60 && ai.specialCooldown <= 0 && Math.random() < 0.3) {
      performAttack(ai, player, state, 'special')
    } else if (ai.ultimateCharge >= ai.maxUltimateCharge && Math.random() < 0.1) {
      performAttack(ai, player, state, 'ultimate')
    }
  }

  if (Math.random() < 0.005 && ai.onGround) {
    ai.vy = -ai.character.stats.jumpPower
    ai.onGround = false
    ai.animState = 'jump'
  }

  if (player.isAttacking && dist < 100 && Math.random() < 0.3 && ai.onGround) {
    ai.isBlocking = true
    ai.animState = 'block'
    ai.blockTimer = 0.2
  }
}

export function tickGameState(state: GameState, dt: number, keys: InputMap, isAI: boolean): GameState {
  const next = { ...state }
  next.hitEffects = state.hitEffects.map(e => ({ ...e, life: e.life - dt })).filter(e => e.life > 0)
  next.damageNumbers = state.damageNumbers.map(d => ({ ...d, life: d.life - dt })).filter(d => d.life > 0)
  next.p1 = { ...state.p1 }
  next.p2 = { ...state.p2 }

  if (next.roundPhase === 'fight') {
    if (next.p1.x < next.p2.x) { next.p1.facing = 'right'; next.p2.facing = 'left' }
    else { next.p1.facing = 'left'; next.p2.facing = 'right' }

    // Hit detection for active attacks - RUN BEFORE MOVEMENT
    const checkHit = (attacker: Fighter, defender: Fighter) => {
      if (attacker.isAttacking && !attacker.hitRegistered && attacker.currentAttackType) {
        const hitbox = getAttackHitbox(attacker)
        if (hitbox && rectsOverlap(hitbox.x, hitbox.y, hitbox.w, hitbox.h, defender.x, defender.y - defender.height, defender.width, defender.height)) {
          applyDamage(attacker, defender, next, attacker.currentAttackType)
          attacker.hitRegistered = true
        }
      }
    }
    checkHit(next.p1, next.p2)
    checkHit(next.p2, next.p1)

    handleInput(next.p1, keys, next, next.p2)
    if (isAI) runAI(next.p2, next.p1, next, {})
    else handleInput(next.p2, keys, next, next.p1)

    updateFighter(next.p1, dt)
    updateFighter(next.p2, dt)

    // Yuji delayed hit logic
    const handleYujiDelayedHit = (f: Fighter, opp: Fighter) => {
      if (f.character.id === 'yuji' && f.specialPhase === 1 && f.attackTimer < 0.4) {
        const dx = opp.x - f.x
        const inRange = f.facing === 'right' ? (dx > 0 && dx < 130) : (dx < 0 && dx > -130)
        if (inRange && Math.abs(f.y - opp.y) < 80) {
          applyDamage(f, opp, next, 'special')
        }
        f.specialPhase = 0
      }
      
      // Black Flash (Ultimate) Multi-hits
      if (f.character.id === 'yuji' && f.isUltimating) {
        if (f.ultimateTimer < 1.5 && f.specialPhase === 0) {
          applyDamage(f, opp, next, 'light')
          f.specialPhase = 1
        }
        if (f.ultimateTimer < 1.0 && f.specialPhase === 1) {
          applyDamage(f, opp, next, 'heavy')
          f.specialPhase = 2
        }
        if (f.ultimateTimer < 0.5 && f.specialPhase === 2) {
          applyDamage(f, opp, next, 'ultimate')
          f.specialPhase = 3
        }
      }
    }
    handleYujiDelayedHit(next.p1, next.p2)
    handleYujiDelayedHit(next.p2, next.p1)

    updateProjectiles(next, dt)

    next.timer -= dt
    if (next.timer <= 0) {
      next.timer = 0
      if (next.p1.health > next.p2.health) { next.p1Wins++; next.winner = 'p1' }
      else if (next.p2.health > next.p1.health) { next.p2Wins++; next.winner = 'p2' }
      else next.winner = 'draw'
      next.roundPhase = 'round-end'
      next.roundEndTimer = 3
    }

    if (next.p1.health <= 0 || next.p2.health <= 0) {
      if (next.p1.health <= 0 && next.p2.health <= 0) next.winner = 'draw'
      else if (next.p1.health <= 0) { next.p2Wins++; next.winner = 'p2' }
      else { next.p1Wins++; next.winner = 'p1' }
      next.roundPhase = 'round-end'
      next.roundEndTimer = 3
    }
  } else if (next.roundPhase === 'start') {
    next.roundEndTimer -= dt
    if (next.roundEndTimer <= 0) next.roundPhase = 'fight'
  } else if (next.roundPhase === 'round-end') {
    next.roundEndTimer -= dt
    if (next.roundEndTimer <= 0) {
      if (next.p1Wins >= ROUND_WINS_NEEDED || next.p2Wins >= ROUND_WINS_NEEDED) {
        next.roundPhase = 'game-over'
      } else {
        return resetRound(next, next.p1.character, next.p2.character)
      }
    }
  }

  if (next.screenShake > 0) next.screenShake -= dt * 2
  else next.screenShake = 0

  return next
}