import type { Projectile } from '../types'

export function drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[], time: number): void {
  projectiles.forEach(p => {
    ctx.save()
    ctx.shadowBlur = 15
    ctx.shadowColor = p.color

    if (p.type === 'orb') {
      // Hollow Purple
      const grad = ctx.createRadialGradient(p.x + p.width / 2, p.y + p.height / 2, 0, p.x + p.width / 2, p.y + p.height / 2, p.width / 2)
      const pulse = Math.sin(time * 10) * 0.2 + 0.8
      grad.addColorStop(0, '#FFFFFF')
      grad.addColorStop(0.3, '#A855F7')
      grad.addColorStop(0.6, '#3B82F6')
      grad.addColorStop(0.8, '#EF4444')
      grad.addColorStop(1, 'transparent')
      
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 2) * pulse, 0, Math.PI * 2)
      ctx.fill()

      for (let i = 0; i < 4; i++) {
        const angle = time * 8 + (i * Math.PI) / 2
        const px = p.x + p.width / 2 + Math.cos(angle) * (p.width / 3)
        const py = p.y + p.height / 2 + Math.sin(angle) * (p.height / 3)
        ctx.fillStyle = i % 2 === 0 ? '#EF4444' : '#3B82F6'
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill()
      }
    } else if (p.type === 'wolf') {
      // Divine Dog / Shadow Strike
      ctx.fillStyle = p.color
      ctx.beginPath()
      const px = p.x; const py = p.y
      const w = p.width; const h = p.height
      ctx.moveTo(px, py + h)
      ctx.lineTo(px + w * 0.2, py + h * 0.4)
      ctx.lineTo(px + w * 0.4, py)
      ctx.lineTo(px + w * 0.5, py + h * 0.3)
      ctx.lineTo(px + w, py + h * 0.5)
      ctx.lineTo(px + w * 0.6, py + h * 0.8)
      ctx.lineTo(px + w * 0.8, py + h)
      ctx.closePath()
      ctx.fill()
      
      if (p.color === '#1E3A8A' || p.color === '#000000') {
        ctx.fillStyle = '#FF3131'
        ctx.beginPath(); ctx.arc(px + w * 0.7, py + h * 0.4, 3, 0, Math.PI * 2); ctx.fill()
      }

      // Shadow trail
      ctx.globalAlpha = 0.3
      ctx.fillRect(p.x - 20, p.y + p.height - 5, p.width, 5)
      ctx.globalAlpha = 1
    } else if (p.type === 'slash') {
      if (p.color === '#FFCC00' || p.color === '#FF3131') {
        // Fuuga Fire Arrow
        const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.5, '#FFCC00')
        grad.addColorStop(1, '#FF3131')
        ctx.fillStyle = grad
        ctx.fillRect(p.x, p.y, p.width, p.height)
        
        // Fire particles & trail
        for (let i = 0; i < 5; i++) {
          const fx = p.x + Math.random() * p.width
          const fy = p.y + (Math.random() - 0.5) * 30
          ctx.fillStyle = i % 2 === 0 ? '#FFCC00' : '#FF3131'
          ctx.fillRect(fx - (time * 100 % 20), fy, 4, 4)
        }
      } else {
        ctx.strokeStyle = '#FF3131'
        ctx.lineWidth = 3
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.width, p.y + p.height); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(p.x - 5, p.y + 5); ctx.lineTo(p.x + p.width - 5, p.y + p.height + 5); ctx.stroke()
      }
    }

    ctx.restore()
  })
}
