'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#F97316', '#FB923C', '#FDE68A', '#22C55E', '#818CF8', '#EC4899']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  return null
}
