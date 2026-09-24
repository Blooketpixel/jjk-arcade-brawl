import { STAGE } from '../engine'
import type { GameState } from '../types'
import { CANVAS } from '../renderer'

export function drawBackground(ctx: CanvasRenderingContext2D, state: GameState, time: number): void {
  // Check for Gojo's Unlimited Void
  const gojoUltP1 = state.p1.character.id === 'gojo' && state.p1.isUltimating
  const gojoUltP2 = state.p2.character.id === 'gojo' && state.p2.isUltimating
  
  if (gojoUltP1 || gojoUltP2) {
    // Unlimited Void Background
    const grad = ctx.createRadialGradient(CANVAS.W / 2, CANVAS.H / 2, 0, CANVAS.W / 2, CANVAS.H / 2, CANVAS.W)
    grad.addColorStop(0, '#000000')
    grad.addColorStop(0.4, '#050510')
    grad.addColorStop(0.7, '#1E1B4B') // Deep indigo
    grad.addColorStop(1, '#000000')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CANVAS.W, CANVAS.H)

    // Floating particles / stars
    for (let i = 0; i < 50; i++) {
      const x = (Math.sin(i * 123 + time) * 0.5 + 0.5) * CANVAS.W
      const y = (Math.cos(i * 456 + time * 0.5) * 0.5 + 0.5) * CANVAS.H
      const size = Math.random() * 2 + 1
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.shadowBlur = 0
    
    // Void distortions
    ctx.strokeStyle = 'rgba(165, 243, 252, 0.2)'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const r = 50 + i * 80 + Math.sin(time * 2 + i) * 20
      ctx.beginPath()
      ctx.arc(CANVAS.W / 2, CANVAS.H / 2, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    return
  }

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, STAGE.GROUND_Y)
  sky.addColorStop(0, '#05050F')
  sky.addColorStop(0.5, '#0A0A20')
  sky.addColorStop(1, '#130A1E')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CANVAS.W, STAGE.GROUND_Y)

  // Distant city silhouette
  ctx.fillStyle = 'rgba(20,10,40,0.8)'
  const buildings = [
    [60, 200, 40, 150],
    [110, 220, 50, 130],
    [170, 190, 35, 160],
    [215, 240, 45, 110],
    [270, 180, 55, 170],
    [335, 210, 40, 140],
    [385, 230, 60, 120],
    [455, 200, 45, 150],
    [510, 185, 50, 165],
    [570, 215, 40, 135],
    [620, 195, 55, 155],
    [685, 225, 45, 125],
    [740, 205, 50, 145],
  ]
  buildings.forEach(([x, y, w, h]) => {
    ctx.fillRect(x, y, w, h)
    // Windows
    ctx.fillStyle = 'rgba(100,80,200,0.4)'
    for (let wy = y + 10; wy < y + h - 5; wy += 15) {
      for (let wx = x + 5; wx < x + w - 5; wx += 10) {
        if (Math.random() > 0.4) {
          ctx.fillRect(wx, wy, 5, 7)
        }
      }
    }
    ctx.fillStyle = 'rgba(20,10,40,0.8)'
  })

  // Neon glow on horizon
  const horizonGlow = ctx.createLinearGradient(0, STAGE.GROUND_Y - 60, 0, STAGE.GROUND_Y)
  horizonGlow.addColorStop(0, 'transparent')
  horizonGlow.addColorStop(0.5, 'rgba(168,85,247,0.08)')
  horizonGlow.addColorStop(1, 'rgba(255,49,49,0.12)')
  ctx.fillStyle = horizonGlow
  ctx.fillRect(0, STAGE.GROUND_Y - 60, CANVAS.W, 60)

  // Ground
  const groundGrad = ctx.createLinearGradient(0, STAGE.GROUND_Y, 0, CANVAS.H)
  groundGrad.addColorStop(0, '#1A0A2E')
  groundGrad.addColorStop(0.3, '#12082A')
  groundGrad.addColorStop(1, '#0A0516')
  ctx.fillStyle = groundGrad
  ctx.fillRect(0, STAGE.GROUND_Y, CANVAS.W, CANVAS.H - STAGE.GROUND_Y)

  // Ground line with glow
  ctx.shadowColor = '#7B2FFF'
  ctx.shadowBlur = 15
  ctx.strokeStyle = '#7B2FFF'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(STAGE.LEFT, STAGE.GROUND_Y)
  ctx.lineTo(STAGE.RIGHT, STAGE.GROUND_Y)
  ctx.stroke()
  ctx.shadowBlur = 0

  // Grid lines on ground
  ctx.strokeStyle = 'rgba(123,47,255,0.15)'
  ctx.lineWidth = 1
  for (let i = 0; i < 20; i++) {
    const x = STAGE.LEFT + (i / 20) * (STAGE.RIGHT - STAGE.LEFT)
    ctx.beginPath()
    ctx.moveTo(x, STAGE.GROUND_Y)
    ctx.lineTo(CANVAS.W / 2, CANVAS.H + 100)
    ctx.stroke()
  }

  // Scanlines overlay
  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  for (let y = 0; y < CANVAS.H; y += 4) {
    ctx.fillRect(0, y, CANVAS.W, 2)
  }
}
