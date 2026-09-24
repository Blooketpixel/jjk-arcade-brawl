import type { GameState } from './types'
import { drawBackground } from './renderer/background'
import { drawFighter } from './renderer/fighter'
import { drawProjectiles } from './renderer/projectiles'
import { drawHitEffects, drawDamageNumbers, drawRoundPhaseOverlay } from './renderer/effects'

const CANVAS_W = 800
const CANVAS_H = 500

export const CANVAS = { W: CANVAS_W, H: CANVAS_H }

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 255, g: 255, b: 255 }
}

export function renderGame(canvas: HTMLCanvasElement, state: GameState, time: number): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Screen shake
  ctx.save()
  if (state.screenShake > 0) {
    const sx = (Math.random() - 0.5) * state.screenShake * 16
    const sy = (Math.random() - 0.5) * state.screenShake * 8
    ctx.translate(sx, sy)
  }

  drawBackground(ctx, state, time)
  drawProjectiles(ctx, state.projectiles, time)
  drawFighter(ctx, state.p1, time)
  drawFighter(ctx, state.p2, time)
  drawHitEffects(ctx, state.hitEffects)
  drawDamageNumbers(ctx, state.damageNumbers)
  drawRoundPhaseOverlay(ctx, state)

  ctx.restore()
}
