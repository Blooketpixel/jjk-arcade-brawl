import type { GameState, Projectile, Fighter } from './types'
import { applyDamage, rectsOverlap } from './combat'
import { CANVAS_WIDTH } from './constants'

export function updateProjectiles(state: GameState, dt: number): void {
  state.projectiles = state.projectiles.map(p => ({
    ...p,
    x: p.x + p.vx,
    y: p.y + p.vy,
    life: p.life - dt,
  })).filter(p => p.life > 0 && p.x > -100 && p.x < CANVAS_WIDTH + 100)

  state.projectiles.forEach(p => {
    const target = p.owner === 1 ? state.p2 : state.p1
    const attacker = p.owner === 1 ? state.p1 : state.p2

    if (rectsOverlap(p.x, p.y, p.width, p.height, target.x, target.y - target.height, target.width, target.height)) {
      if (target.hurtTimer <= 0) {
        applyDamage(attacker, target, state, 'special')
        p.life = 0 // Remove projectile on hit
      }
    }
  })
}
