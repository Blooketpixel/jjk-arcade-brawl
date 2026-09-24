import type { GameState, HitEffect, DamageNumber } from '../types'
import { hexToRgb, CANVAS } from '../renderer'

export function drawHitEffects(ctx: CanvasRenderingContext2D, effects: HitEffect[]): void {
  effects.forEach(e => {
    const alpha = e.life / e.maxLife
    ctx.globalAlpha = alpha
    ctx.shadowColor = e.color
    ctx.shadowBlur = 20

    // Star burst
    ctx.strokeStyle = e.color
    ctx.lineWidth = 3
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const len = e.size * alpha
      ctx.beginPath()
      ctx.moveTo(e.x, e.y)
      ctx.lineTo(e.x + Math.cos(angle) * len, e.y + Math.sin(angle) * len)
      ctx.stroke()
    }

    ctx.globalAlpha = alpha * 0.5
    ctx.fillStyle = e.color
    ctx.beginPath()
    ctx.arc(e.x, e.y, e.size * 0.4 * alpha, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  })
}

export function drawDamageNumbers(ctx: CanvasRenderingContext2D, numbers: DamageNumber[]): void {
  numbers.forEach(d => {
    const alpha = d.life / d.maxLife
    ctx.globalAlpha = alpha
    ctx.font = d.isSpecial
      ? `bold ${32 + d.value * 0.1}px 'Orbitron', monospace`
      : `bold 22px 'Orbitron', monospace`
    ctx.textAlign = 'center'
    ctx.fillStyle = d.color
    ctx.shadowColor = d.color
    ctx.shadowBlur = d.isSpecial ? 20 : 8

    if (d.isSpecial) {
      ctx.fillText(`-${d.value}!!`, d.x, d.y)
    } else {
      ctx.fillText(`-${d.value}`, d.x, d.y)
    }
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  })
}

export function drawRoundPhaseOverlay(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.roundPhase === 'start') {
    if (state.roundEndTimer > 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(0, 0, CANVAS.W, CANVAS.H)
      ctx.font = "bold 64px 'Orbitron', monospace"
      ctx.textAlign = 'center'
      ctx.fillStyle = '#FFCC00'
      ctx.shadowColor = '#FFCC00'
      ctx.shadowBlur = 30
      ctx.fillText(`ROUND ${state.round}`, CANVAS.W / 2, CANVAS.H / 2 - 20)
      ctx.font = "bold 32px 'Orbitron', monospace"
      ctx.fillStyle = '#FF3131'
      ctx.fillText('FIGHT!', CANVAS.W / 2, CANVAS.H / 2 + 30)
      ctx.shadowBlur = 0
    }
  } else if (state.roundPhase === 'round-end') {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, CANVAS.W, CANVAS.H)
    ctx.font = "bold 56px 'Orbitron', monospace"
    ctx.textAlign = 'center'

    const winnerName = state.winner === 'p1'
      ? state.p1.character.name
      : state.winner === 'p2'
      ? state.p2.character.name
      : 'DRAW'

    if (state.winner === 'draw') {
      ctx.fillStyle = '#AAAAAA'
      ctx.shadowColor = '#AAAAAA'
    } else {
      ctx.fillStyle = '#FFCC00'
      ctx.shadowColor = '#FFCC00'
    }
    ctx.shadowBlur = 30

    if (state.winner !== 'draw') {
      ctx.fillText('K.O.!', CANVAS.W / 2, CANVAS.H / 2 - 20)
      ctx.font = "bold 24px 'Orbitron', monospace"
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(winnerName + ' WINS', CANVAS.W / 2, CANVAS.H / 2 + 30)
    } else {
      ctx.fillText('DRAW!', CANVAS.W / 2, CANVAS.H / 2)
    }
    ctx.shadowBlur = 0
  }
}
