import type { Fighter, GameState, AttackType } from './types'

export function spawnHitEffect(state: GameState, x: number, y: number, color: string, size = 30): void {
  state.hitEffects.push({
    x, y, size, color,
    life: 1,
    maxLife: 1,
  })
}

export function spawnDamageNumber(state: GameState, x: number, y: number, value: number, color: string, isSpecial = false): void {
  state.damageNumbers.push({
    x: x + (Math.random() - 0.5) * 30,
    y: y - 20,
    value,
    color,
    life: 1,
    maxLife: 1,
    isSpecial,
  })
}

export function applyDamage(attacker: Fighter, defender: Fighter, state: GameState, type: AttackType): void {
  if (defender.hurtTimer > 0 && type !== 'special') return
  if (defender.stunTimer > 0) return
  // Mahoraga super armor — cannot be staggered during transformation
  if (defender.character.id === 'megumi' && defender.isUltimating) return

  const base = attacker.character.stats.attackPower
  let dmg = 0
  let color = '#FFFF00'
  let isSpecial = false

  switch (type) {
    case 'light': dmg = Math.floor(base * 0.6 + Math.random() * 5); break
    case 'heavy': dmg = Math.floor(base * 1.0 + Math.random() * 8); break
    case 'kick': dmg = Math.floor(base * 0.8 + Math.random() * 6); break
    case 'special':
      dmg = Math.floor(attacker.character.stats.specialPower + Math.random() * 15)
      color = attacker.character.colors.special
      isSpecial = true
      state.screenShake = 0.5
      break
    case 'ultimate':
      dmg = Math.floor(attacker.character.stats.specialPower * 2 + Math.random() * 30)
      color = '#FFCC00'
      isSpecial = true
      state.screenShake = 1.0
      break
  }

  // Unlimited Void empowers Gojo's punches by 25% for its full duration.
  if (attacker.character.id === 'gojo' && attacker.isUltimating && (type === 'light' || type === 'heavy')) {
    dmg = Math.floor(dmg * 1.25)
    color = '#C084FC'
  }

  if (defender.isBlocking && type !== 'special' && type !== 'ultimate') {
    dmg = Math.floor(dmg * 0.2)
    color = '#888888'
  }

  defender.health = Math.max(0, defender.health - dmg)
  defender.hurtTimer = type === 'ultimate' ? 1.5 : type === 'special' ? 0.6 : 0.25
  defender.animState = 'hurt'

  // Charge ultimate on hit
  attacker.ultimateCharge = Math.min(attacker.maxUltimateCharge, attacker.ultimateCharge + (type === 'ultimate' ? 0 : 5))
  defender.ultimateCharge = Math.min(defender.maxUltimateCharge, defender.ultimateCharge + (type === 'ultimate' ? 0 : 8))

  if (!defender.isBlocking) {
    if (attacker.comboCount >= 2 && type !== 'special') {
      defender.vx = attacker.facing === 'right' ? 2 : -2
      defender.vy = -15
      defender.stunTimer = 1.0
      attacker.comboCount = 0
      state.screenShake = 0.4
      spawnDamageNumber(state, defender.x + defender.width / 2, defender.y - 40, 0, '#FFD700', true)
    } else {
      defender.vx = attacker.facing === 'right' ? 4 : -4
      defender.vy = -2
    }
    defender.onGround = false
  }

  if (attacker.comboTimer > 0) {
    attacker.comboCount++
  } else {
    attacker.comboCount = 1
  }
  attacker.comboTimer = 1.5

  spawnHitEffect(state,
    defender.x + defender.width / 2,
    defender.y + 20,
    isSpecial ? attacker.character.colors.special : '#FFAA00',
    isSpecial ? 60 : 30
  )
  spawnDamageNumber(state, defender.x + defender.width / 2, defender.y, dmg, color, isSpecial)
}

export function getAttackHitbox(f: Fighter): { x: number; y: number; w: number; h: number } | null {
  if (!f.isAttacking) return null
  const reach = f.currentAttackType === 'heavy' ? 100 : f.currentAttackType === 'kick' ? 90 : 80
  return {
    x: f.facing === 'right' ? f.x + f.width - 20 : f.x - reach + 20,
    y: f.y - f.height, // Full height coverage
    w: reach,
    h: f.height, // Match character height exactly
  }
}

export function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export function performAttack(fighter: Fighter, opponent: Fighter, state: GameState, type: AttackType): void {
  fighter.isAttacking = true
  fighter.animState = type === 'ultimate' ? 'ultimate' : 'attack'
  fighter.attackTimer = type === 'ultimate' ? 2.0 : type === 'special' ? 0.8 : type === 'heavy' ? 0.45 : 0.3
  fighter.hitRegistered = false
  fighter.currentAttackType = type // Store attack type for later hit check

  if (type === 'ultimate') {
    fighter.ultimateCharge = 0
    fighter.isUltimating = true
    fighter.ultimateTimer = 2.0
    state.screenShake = 1.0

    if (fighter.character.id === 'yuji') {
      // Black Flash: Multi-hit physical combo
      fighter.specialPhase = 0
    } else if (fighter.character.id === 'megumi') {
      // MAHORAGA TRANSFORMATION
      fighter.attackTimer = 5.0 // Extend attackTimer to match ultimateTimer
      fighter.ultimateTimer = 5.0 // Longer duration for transformation
      fighter.isUltimating = true
      state.screenShake = 1.5
      // Initial impact damage
      applyDamage(fighter, opponent, state, 'ultimate')
    } else if (fighter.character.id === 'gojo') {
      // Unlimited Void: extended domain with a 25% punch-damage window
      fighter.attackTimer = 5.0
      fighter.ultimateTimer = 5.0
      opponent.stunTimer = 3.5
      applyDamage(fighter, opponent, state, 'ultimate')
    } else if (fighter.character.id === 'sukuna') {
      // Fuuga: Fire Arrow
      state.projectiles.push({
        id: Math.random().toString(),
        x: fighter.facing === 'right' ? fighter.x + 80 : fighter.x - 100,
        y: fighter.y - 60,
        vx: fighter.facing === 'right' ? 20 : -20,
        vy: 0,
        width: 150,
        height: 20,
        damage: fighter.character.stats.specialPower * 3,
        color: '#FFCC00',
        owner: fighter.playerNum,
        life: 2.0,
        maxLife: 2.0,
        type: 'slash'
      })
    }
    return
  }

  if (type === 'special') {
    fighter.cursedEnergy -= 60
    fighter.specialCooldown = 4
    fighter.specialPhase = 1
    state.screenShake = 0.5
    
    if (fighter.character.id === 'gojo') {
      state.projectiles.push({
        id: Math.random().toString(),
        x: fighter.facing === 'right' ? fighter.x + 80 : fighter.x - 100,
        y: fighter.y - 60,
        vx: fighter.facing === 'right' ? 6 : -6,
        vy: 0,
        width: 100,
        height: 100,
        damage: fighter.character.stats.specialPower,
        color: '#A855F7',
        owner: fighter.playerNum,
        life: 3,
        maxLife: 3,
        type: 'orb'
      })
    } else if (fighter.character.id === 'megumi') {
      state.projectiles.push({
        id: Math.random().toString(),
        x: fighter.facing === 'right' ? fighter.x + 60 : fighter.x - 80,
        y: fighter.y - 40,
        vx: fighter.facing === 'right' ? 12 : -12,
        vy: 0,
        width: 80,
        height: 50,
        damage: fighter.character.stats.specialPower,
        color: '#1E3A8A',
        owner: fighter.playerNum,
        life: 2,
        maxLife: 2,
        type: 'wolf'
      })
    } else if (fighter.character.id === 'sukuna') {
      for (let i = 0; i < 6; i++) {
        state.projectiles.push({
          id: Math.random().toString(),
          x: fighter.x - 100 + Math.random() * 300,
          y: fighter.y - 120 + Math.random() * 100,
          vx: (Math.random() - 0.5) * 4,
          vy: 5 + Math.random() * 5,
          width: 40,
          height: 10,
          damage: fighter.character.stats.specialPower / 4,
          color: '#FF3131',
          owner: fighter.playerNum,
          life: 0.8 + Math.random() * 0.5,
          maxLife: 1.5,
          type: 'slash'
        })
      }
    } else if (fighter.character.id === 'yuji') {
      const dx = opponent.x - fighter.x
      const inRange = fighter.facing === 'right' ? (dx > 0 && dx < 120) : (dx < 0 && dx > -120)
      if (inRange && Math.abs(fighter.y - opponent.y) < 80) {
        applyDamage(fighter, opponent, state, 'light')
      }
    }
    return
  }

  // Hit checking now happens in the main game loop for better accuracy
}