'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

/* ──────────────────────────────────────────────────
   Splash Screen — internal animations are pure CSS,
   only the exit curtain uses framer-motion.
────────────────────────────────────────────────── */
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const t = setTimeout(onDone, isMobile ? 2000 : 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#020817]"
    >
      {/* Grid de fond */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Rings radar — CSS pure */}
      <div className="splash-radar" style={{ animationDelay: '0s' }} />
      <div className="splash-radar" style={{ animationDelay: '0.7s' }} />
      <div className="splash-radar" style={{ animationDelay: '1.4s' }} />
      <div className="splash-radar" style={{ animationDelay: '2.1s' }} />

      {/* Glow central */}
      <div className="absolute w-64 h-64 rounded-full blur-[100px] splash-logo pointer-events-none"
           style={{ background: 'radial-gradient(circle,rgba(59,130,246,.3) 0%,transparent 70%)' }} />

      {/* Logo T */}
      <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-7 z-10 splash-logo"
           style={{ boxShadow: '0 0 70px rgba(59,130,246,.65),0 0 140px rgba(59,130,246,.25)' }}>
        <span className="text-white font-black text-5xl">T</span>
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-3xl" />
        </div>
      </div>

      {/* "TaskFlow" — CSS text animation */}
      <div className="text-[42px] font-black text-white tracking-tight leading-none mb-3 z-10 splash-text">
        TaskFlow
      </div>

      {/* Tagline */}
      <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[.3em] mb-14 z-10 splash-tagline">
        Organisé · Rapide · Intelligent
      </p>

      {/* Barre de chargement */}
      <div className="w-52 h-[2px] bg-white/5 rounded-full overflow-hidden z-10 splash-bar-wrap">
        <div className="splash-bar-fill" />
      </div>
      <p className="text-gray-700 text-[10px] font-semibold uppercase tracking-widest mt-3 z-10 splash-tagline"
         style={{ animationDelay: '1.6s' }}>
        Chargement…
      </p>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────
   Custom Cursor — desktop only, lazy loaded
────────────────────────────────────────────────── */
function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const scale = useMotionValue(1)
  const [visible, setVisible] = useState(false)

  const dotX  = useSpring(x, { stiffness: 900, damping: 45 })
  const dotY  = useSpring(y, { stiffness: 900, damping: 45 })
  const ringX = useSpring(x, { stiffness: 160, damping: 22 })
  const ringY = useSpring(y, { stiffness: 160, damping: 22 })

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    setVisible(true)
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const onDown = () => scale.set(0.65)
    const onUp   = () => scale.set(1)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [x, y, scale])

  if (!visible) return null

  return (
    <>
      <motion.div
        style={{ x: dotX, y: dotY, scale, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none z-[9999] mix-blend-difference"
      />
      <motion.div
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-blue-400/50 pointer-events-none z-[9998]"
      />
    </>
  )
}

/* ── Export combiné ── */
export default function ClientEffects() {
  const [splash, setSplash] = useState(true)
  return (
    <>
      <AnimatePresence>
        {splash && <SplashScreen onDone={() => setSplash(false)} />}
      </AnimatePresence>
      <CustomCursor />
    </>
  )
}
