import type { Fighter } from '../types'
import { hexToRgb } from '../renderer'

export function drawFighter(ctx: CanvasRenderingContext2D, f: Fighter, time: number): void {
  const { x, y, width, height, facing, animState, animFrame, character, isBlocking, hurtTimer, stunTimer } = f
  const cx = x + width / 2
  const bounce = animState === 'idle' ? Math.sin(time * 3 + (f.playerNum === 2 ? Math.PI : 0)) * 2 : 0
  const dy = animState === 'jump' ? 0 : bounce
  const headY = y - height + dy
  const bodyY = y - height * 0.55 + dy

  const col = character.colors

  // Aura glow when attacking or special or ultimate
  if (animState === 'attack' || animState === 'special' || animState === 'ultimate') {
    ctx.shadowColor = animState === 'ultimate' ? '#FFCC00' : col.primary
    ctx.shadowBlur = animState === 'ultimate' ? 40 : 25
  } else if (hurtTimer > 0 || stunTimer > 0) {
    ctx.shadowColor = stunTimer > 0 ? '#FBBF24' : '#FFFFFF'
    ctx.shadowBlur = 15
  } else {
    ctx.shadowBlur = 0
  }

  // Character-specific ultimate pre-effects
  if (animState === 'ultimate') {
    if (character.id === 'yuji') {
      // Black Flash sparks
      for (let i = 0; i < 5; i++) {
        const sx = cx + (Math.random() - 0.5) * 100
        const sy = y - height / 2 + (Math.random() - 0.5) * 100
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(sx + (Math.random() - 0.5) * 30, sy + (Math.random() - 0.5) * 30)
        ctx.stroke()
        ctx.strokeStyle = '#FF3131'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    } else if (character.id === 'megumi') {
      // Mahoraga Transformation Visuals (Draw General Mahoraga instead)
      drawMahoraga(ctx, f, time)
      return // Skip standard Megumi drawing
    } else if (character.id === 'sukuna') {
      // Fire particles for Fuuga
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = 40 + Math.random() * 40
        const px = cx + Math.cos(angle) * dist
        const py = y - height / 2 + Math.sin(angle) * dist
        ctx.fillStyle = Math.random() > 0.5 ? '#FFCC00' : '#FF3131'
        ctx.shadowColor = '#FF3131'
        ctx.shadowBlur = 10
        ctx.fillRect(px, py, 4, 4)
      }
    }
  }

  // Aura
  const auraAlpha = (animState === 'attack' || animState === 'special') ? 0.3 : animState === 'ultimate' ? 0.6 : 0.1
  const auraGrad = ctx.createRadialGradient(cx, y - height / 2 + dy, 0, cx, y - height / 2 + dy, 60 + (animState === 'ultimate' ? 40 : 0))
  auraGrad.addColorStop(0, col.aura.replace('0.5)', `${auraAlpha})`).replace('0.7)', `${auraAlpha})`).replace('0.6)', `${auraAlpha})`))
  auraGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = auraGrad
  ctx.fillRect(cx - 100, y - height - 40 + dy, 200, height + 80)

  // Block shield
  if (isBlocking) {
    ctx.strokeStyle = col.secondary
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    const shieldX = facing === 'right' ? cx + 15 : cx - 35
    ctx.arc(shieldX, y - height / 2 + dy, 35, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
    return
  }

  // ─── Draw character body ───────────────────────────────────────
  const flip = facing === 'left'
  ctx.save()
  if (flip) {
    ctx.translate(cx * 2, 0)
    ctx.scale(-1, 1)
  }

  // Hurt flash
  if (hurtTimer > 0) {
    ctx.globalAlpha = 0.5 + Math.sin(hurtTimer * 20) * 0.5
  }

  // Legs
  let pantsCol = col.secondary
  if (character.id === 'yuji' || character.id === 'megumi') pantsCol = '#0F172A'
  if (character.id === 'gojo') pantsCol = '#0D0818'
  if (character.id === 'sukuna') pantsCol = '#E2E8F0'
  
  ctx.fillStyle = pantsCol
  // Left leg
  ctx.beginPath()
  ctx.roundRect(cx - 18, y - 45 + dy, 16, 46, 6)
  ctx.fill()
  // Right leg
  ctx.beginPath()
  ctx.roundRect(cx + 2, y - 45 + dy, 16, 46, 6)
  ctx.fill()

  // Body / torso
  let bodyCol = col.primary
  if (character.id === 'yuji' || character.id === 'megumi') bodyCol = '#1E293B'
  if (character.id === 'gojo') bodyCol = '#110B1E'
  if (character.id === 'sukuna') bodyCol = '#F8FAFC'
  
  ctx.fillStyle = bodyCol
  if (stunTimer > 0) {
    ctx.save()
    ctx.translate(Math.sin(time * 20) * 2, 0)
  }
  ctx.beginPath()
  ctx.roundRect(cx - 22, bodyY - 40, 44, 60, 8)
  ctx.fill()
  if (stunTimer > 0) {
    ctx.restore()
  }

  // Character-specific clothing details
  if (character.id === 'yuji') {
    ctx.fillStyle = '#FF3131'
    ctx.beginPath()
    ctx.roundRect(cx - 15, bodyY - 42, 30, 12, 4)
    ctx.fill()
  } else if (character.id === 'megumi') {
    ctx.fillStyle = '#0F172A'
    ctx.beginPath()
    ctx.roundRect(cx - 23, bodyY - 45, 46, 12, 4)
    ctx.fill()
    ctx.fillStyle = '#FBBF24'
    ctx.beginPath()
    ctx.arc(cx - 12, bodyY - 30, 2.5, 0, Math.PI * 2)
    ctx.arc(cx - 12, bodyY - 18, 2.5, 0, Math.PI * 2)
    ctx.fill()
  } else if (character.id === 'sukuna') {
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(cx - 22, bodyY - 5, 44, 10)
    ctx.strokeStyle = 'rgba(0,0,0,0.8)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - 15, bodyY - 30)
    ctx.lineTo(cx - 5, bodyY - 20)
    ctx.moveTo(cx + 5, bodyY - 30)
    ctx.lineTo(cx + 15, bodyY - 20)
    ctx.stroke()
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(cx - 12, bodyY - 10, 3, 0, Math.PI * 2)
    ctx.arc(cx + 12, bodyY - 10, 3, 0, Math.PI * 2)
    ctx.fill()
  } else if (character.id === 'gojo') {
    // High folded collar and violet piping from the reference design
    ctx.fillStyle = '#241631'
    ctx.beginPath()
    ctx.roundRect(cx - 27, bodyY - 50, 54, 22, 7)
    ctx.fill()
    ctx.strokeStyle = '#7650A8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - 24, bodyY - 43)
    ctx.lineTo(cx, bodyY - 35)
    ctx.lineTo(cx + 24, bodyY - 43)
    ctx.moveTo(cx, bodyY - 49)
    ctx.lineTo(cx, bodyY - 30)
    ctx.stroke()
    // Jacket seam and purple shoulder accents
    ctx.strokeStyle = '#7650A8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - 21, bodyY - 27)
    ctx.lineTo(cx - 7, bodyY - 15)
    ctx.moveTo(cx + 21, bodyY - 27)
    ctx.lineTo(cx + 7, bodyY - 15)
    ctx.moveTo(cx, bodyY - 30)
    ctx.lineTo(cx, bodyY + 18)
    ctx.stroke()
  }

  // Arms
  const armSwing = animState === 'walk' ? Math.sin(animFrame * 1.5) * 8 : 0
  const attackArm = animState === 'attack' ? 25 : animState === 'special' ? 35 : animState === 'ultimate' ? 40 : 0

  ctx.fillStyle = bodyCol
  // Left arm
  ctx.beginPath()
  ctx.roundRect(cx - 34, bodyY - 35 - armSwing, 14, 40, 5)
  ctx.fill()
  // Right arm (attack arm)
  ctx.beginPath()
  ctx.roundRect(cx + 20 + attackArm, bodyY - 38, 14, 42, 5)
  ctx.fill()

  if (character.id === 'gojo') {
    // Violet sleeve piping from the reference outfit
    ctx.strokeStyle = '#7650A8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - 34, bodyY - 18 - armSwing)
    ctx.lineTo(cx - 20, bodyY - 12 - armSwing)
    ctx.moveTo(cx + 20 + attackArm, bodyY - 18)
    ctx.lineTo(cx + 34 + attackArm, bodyY - 12)
    ctx.stroke()
  }

  // Fist during attack/ultimate
  if (animState === 'attack' || animState === 'special' || animState === 'ultimate') {
    ctx.fillStyle = animState === 'ultimate' ? '#FFCC00' : animState === 'special' ? col.special : col.secondary
    ctx.shadowColor = animState === 'ultimate' ? '#FFCC00' : animState === 'special' ? col.special : col.primary
    ctx.shadowBlur = animState === 'ultimate' ? 30 : animState === 'special' ? 20 : 8
    ctx.beginPath()
    ctx.arc(cx + 36 + attackArm, bodyY - 20, 10 + (animState === 'ultimate' ? 5 : 0), 0, Math.PI * 2)
    ctx.fill()
    
    ctx.shadowBlur = 0
  }

  // Head
  ctx.fillStyle = '#FEE2E2'
  ctx.beginPath()
  ctx.arc(cx, headY + 15, 18, 0, Math.PI * 2)
  ctx.fill()

  // Hair & Eyes (Keeping character specific parts)
  if (character.id === 'yuji') {
    ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(cx, headY + 18, 18, 0, Math.PI); ctx.fill()
    ctx.fillStyle = '#FF7777'; ctx.beginPath(); ctx.arc(cx, headY + 10, 18, Math.PI, Math.PI * 2)
    for (let i = 0; i < 7; i++) {
      const angle = Math.PI + (i / 6) * Math.PI
      ctx.moveTo(cx + Math.cos(angle) * 18, headY + 10 + Math.sin(angle) * 18)
      ctx.lineTo(cx + Math.cos(angle) * 28, headY + 10 + Math.sin(angle) * 28)
    }
    ctx.fill()
    ctx.fillStyle = '#78350F'; ctx.beginPath(); ctx.arc(cx - 7, headY + 18, 3.5, 0, Math.PI * 2); ctx.arc(cx + 7, headY + 18, 3.5, 0, Math.PI * 2); ctx.fill()
  } else if (character.id === 'gojo') {
    // Large swept white spikes, matching the reference silhouette
    ctx.fillStyle = '#F8FAFC'
    ctx.beginPath()
    ctx.moveTo(cx - 21, headY + 13)
    ctx.bezierCurveTo(cx - 37, headY - 1, cx - 32, headY - 16, cx - 18, headY - 8)
    ctx.lineTo(cx - 22, headY - 28)
    ctx.lineTo(cx - 8, headY - 13)
    ctx.lineTo(cx + 1, headY - 38)
    ctx.lineTo(cx + 7, headY - 14)
    ctx.lineTo(cx + 23, headY - 31)
    ctx.lineTo(cx + 20, headY - 9)
    ctx.lineTo(cx + 34, headY - 17)
    ctx.bezierCurveTo(cx + 34, headY + 1, cx + 24, headY + 13, cx + 19, headY + 15)
    ctx.closePath()
    ctx.fill()
    // Hair strand lines
    ctx.strokeStyle = '#C4B5FD'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - 15, headY - 8); ctx.lineTo(cx - 8, headY - 25)
    ctx.moveTo(cx - 2, headY - 10); ctx.lineTo(cx + 2, headY - 29)
    ctx.moveTo(cx + 10, headY - 9); ctx.lineTo(cx + 20, headY - 22)
    ctx.stroke()
    // Signature black blindfold
    ctx.fillStyle = '#17131D'
    ctx.beginPath()
    ctx.roundRect(cx - 20, headY + 8, 40, 13, 6)
    ctx.fill()
    ctx.strokeStyle = '#4B4654'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - 18, headY + 12)
    ctx.quadraticCurveTo(cx, headY + 19, cx + 18, headY + 12)
    ctx.stroke()
  } else if (character.id === 'megumi') {
    ctx.fillStyle = '#0F172A'; ctx.beginPath(); ctx.arc(cx, headY + 10, 18, Math.PI + 0.2, Math.PI * 2 - 0.2); ctx.fill()
    const spikes = [{ a: -0.5, l: 32 }, { a: -0.8, l: 36 }, { a: -1.2, l: 34 }, { a: -1.57, l: 38 }, { a: -1.9, l: 35 }, { a: -2.3, l: 37 }, { a: -2.6, l: 31 }]
    ctx.strokeStyle = '#0F172A'; ctx.lineWidth = 3; ctx.beginPath()
    spikes.forEach(s => {
      ctx.moveTo(cx + Math.cos(s.a) * 18, headY + 10 + Math.sin(s.a) * 18); ctx.lineTo(cx + Math.cos(s.a) * s.l, headY + 10 + Math.sin(s.a) * s.l)
    }); ctx.stroke()
    ctx.fillStyle = '#065F46'; ctx.beginPath(); ctx.arc(cx - 7, headY + 18, 3.5, 0, Math.PI * 2); ctx.arc(cx + 7, headY + 18, 3.5, 0, Math.PI * 2); ctx.fill()
  } else if (character.id === 'sukuna') {
    ctx.fillStyle = '#FF7777'; ctx.beginPath(); ctx.arc(cx, headY + 12, 19, Math.PI + 0.1, Math.PI * 2 - 0.1)
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI + 0.1 + (i / 4) * (Math.PI - 0.2)
      ctx.moveTo(cx + Math.cos(angle) * 19, headY + 12 + Math.sin(angle) * 19); ctx.lineTo(cx + Math.cos(angle) * 28, headY + 12 + Math.sin(angle) * 28)
    }
    ctx.fill()
    ctx.fillStyle = '#FF3131'; ctx.beginPath(); ctx.arc(cx - 7, headY + 18, 3.5, 0, Math.PI * 2); ctx.arc(cx + 7, headY + 18, 3.5, 0, Math.PI * 2); ctx.fill()
  }

  if (stunTimer > 0) {
    ctx.fillStyle = '#FBBF24'
    for (let i = 0; i < 3; i++) {
      const angle = time * 5 + (i * Math.PI * 2) / 3
      const sx = cx + Math.cos(angle) * 25
      const sy = headY - 10 + Math.sin(angle) * 5
      ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill()
    }
  }

  ctx.globalAlpha = 1
  ctx.restore()
  ctx.shadowBlur = 0
}

function drawMahoraga(ctx: CanvasRenderingContext2D, f: Fighter, time: number): void {
  const { x, y, width, height, facing } = f
  const cx = x + width / 2
  const mahoHeight = height * 1.5
  const mahoY = y + 10 // Feet on ground

  ctx.save()

  // Shadow pool on ground
  const poolGrad = ctx.createRadialGradient(cx, mahoY, 0, cx, mahoY, 90)
  poolGrad.addColorStop(0, 'rgba(0,0,0,0.9)')
  poolGrad.addColorStop(0.5, 'rgba(15,23,42,0.6)')
  poolGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = poolGrad
  ctx.beginPath()
  ctx.ellipse(cx, mahoY, 80 + Math.sin(time * 6) * 10, 15, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Aura for Mahoraga
  const auraGrad = ctx.createRadialGradient(cx, y - mahoHeight/2, 0, cx, y - mahoHeight/2, 100)
  auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
  auraGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = auraGrad
  ctx.fillRect(cx - 100, y - mahoHeight - 50, 200, mahoHeight + 100)

  const flip = facing === 'left'
  if (flip) {
    ctx.translate(cx * 2, 0)
    ctx.scale(-1, 1)
  }

  // ─── Adaptation Wheel (Iconic) ───────────────────────────────
  ctx.save()
  ctx.translate(cx, y - mahoHeight - 30)
  ctx.rotate(time * 2) // Spinning wheel
  
  ctx.strokeStyle = '#D1D5DB'
  ctx.lineWidth = 4
  ctx.shadowColor = '#FFFFFF'
  ctx.shadowBlur = 10
  
  // Main ring
  ctx.beginPath()
  ctx.arc(0, 0, 35, 0, Math.PI * 2)
  ctx.stroke()
  
  // Eight handles
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * 35, Math.sin(angle) * 35)
    ctx.lineTo(Math.cos(angle) * 50, Math.sin(angle) * 50)
    ctx.stroke()
    
    // Handle circles
    ctx.beginPath()
    ctx.arc(Math.cos(angle) * 50, Math.sin(angle) * 50, 5, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#9CA3AF'
    ctx.fill()
  }
  ctx.restore()

  // ─── Body (Muscular White Frame) ──────────────────────────────
  ctx.fillStyle = '#F8FAFC' // Pure white/grey muscular look
  ctx.shadowColor = '#CBD5E1'
  ctx.shadowBlur = 5

  // Legs (Large and thick)
  ctx.beginPath()
  ctx.roundRect(cx - 25, mahoY - 60, 22, 60, 10)
  ctx.roundRect(cx + 3, mahoY - 60, 22, 60, 10)
  ctx.fill()

  // Torso (Muscular)
  ctx.beginPath()
  ctx.roundRect(cx - 35, mahoY - 130, 70, 80, 15)
  ctx.fill()
  
  // Pecs/Abs details
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 25, mahoY - 110); ctx.lineTo(cx + 25, mahoY - 110)
  ctx.moveTo(cx - 20, mahoY - 90); ctx.lineTo(cx + 20, mahoY - 90)
  ctx.moveTo(cx, mahoY - 120); ctx.lineTo(cx, mahoY - 70)
  ctx.stroke()

  // Arms (Giant arms)
  const armSwing = Math.sin(time * 8) * 10
  // Left arm
  ctx.beginPath()
  ctx.roundRect(cx - 55, mahoY - 125 + armSwing, 25, 70, 12)
  ctx.fill()
  // Right arm (With sword blade)
  ctx.beginPath()
  ctx.roundRect(cx + 30, mahoY - 125 - armSwing, 25, 70, 12)
  ctx.fill()
  
  // Sword on forearm
  ctx.fillStyle = '#E2E8F0'
  ctx.beginPath()
  ctx.moveTo(cx + 55, mahoY - 90 - armSwing)
  ctx.lineTo(cx + 90, mahoY - 100 - armSwing)
  ctx.lineTo(cx + 55, mahoY - 70 - armSwing)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#94A3B8'
  ctx.stroke()

  // ─── Head (The iconic Mahoraga look) ──────────────────────────
  const headY = mahoY - 150
  ctx.fillStyle = '#F8FAFC'
  ctx.beginPath()
  ctx.ellipse(cx, headY + 20, 25, 30, 0, 0, Math.PI * 2)
  ctx.fill()

  // Mouth/Grin
  ctx.fillStyle = '#1E293B'
  ctx.beginPath()
  ctx.roundRect(cx - 15, headY + 30, 30, 10, 5)
  ctx.fill()
  // Teeth
  ctx.fillStyle = '#FFFFFF'
  for(let i=0; i<5; i++) {
    ctx.fillRect(cx - 12 + i*6, headY + 31, 4, 8)
  }

  // Head Wings/Spikes (Eye features)
  ctx.strokeStyle = '#F8FAFC'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  
  // Four main "wings" coming from eye area
  const wingAngles = [-0.2, -0.8, -2.3, -2.9]
  wingAngles.forEach(angle => {
    ctx.beginPath()
    const startX = cx + (angle > -1.5 ? 10 : -10)
    const startY = headY + 15
    ctx.moveTo(startX, startY)
    // Curvy wings
    ctx.bezierCurveTo(
      startX + Math.cos(angle) * 40, startY + Math.sin(angle) * 40,
      startX + Math.cos(angle) * 60, startY + Math.sin(angle) * 20,
      startX + Math.cos(angle) * 80, startY + Math.sin(angle) * 60
    )
    ctx.stroke()
  })

  ctx.restore()
  ctx.shadowBlur = 0
}
