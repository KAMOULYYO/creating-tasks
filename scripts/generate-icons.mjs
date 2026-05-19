// Génère les icônes PWA 192x192 et 512x512 en PNG via Canvas API (Node)
import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const r = size * 0.22

  // Background circle
  ctx.fillStyle = '#F97316'
  roundRect(ctx, 0, 0, size, size, r)
  ctx.fill()

  // Inner shadow
  ctx.fillStyle = '#EA580C'
  roundRect(ctx, size * 0.05, size * 0.55, size * 0.9, size * 0.42, r * 0.5)
  ctx.fill()

  // Clipboard icon (white)
  const pad = size * 0.2
  ctx.fillStyle = '#FFFFFF'
  ctx.lineWidth = size * 0.04
  ctx.strokeStyle = '#FFFFFF'

  // Board
  const bx = pad, by = pad * 1.1, bw = size - pad * 2, bh = size - pad * 2.2
  ctx.beginPath()
  roundRect(ctx, bx, by, bw, bh, size * 0.06)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fill()

  // Lines
  ctx.fillStyle = '#F97316'
  const lx = bx + bw * 0.18, lw = bw * 0.64, lh = size * 0.055
  const gaps = [0.25, 0.42, 0.59, 0.74]
  gaps.forEach(g => {
    const ly = by + bh * g
    ctx.beginPath()
    ctx.roundRect(lx, ly, lw * (g < 0.6 ? 1 : 0.7), lh, lh / 2)
    ctx.fill()
  })

  // Clip at top
  ctx.fillStyle = '#F97316'
  ctx.beginPath()
  const cx = size / 2, cy = by - size * 0.01
  ctx.roundRect(cx - size * 0.12, cy - size * 0.06, size * 0.24, size * 0.1, size * 0.03)
  ctx.fill()

  return canvas.toBuffer('image/png')
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const publicDir = join(__dir, '..', 'public')
writeFileSync(join(publicDir, 'icon-192.png'), drawIcon(192))
writeFileSync(join(publicDir, 'icon-512.png'), drawIcon(512))
console.log('✅ Icons generated: icon-192.png & icon-512.png')
