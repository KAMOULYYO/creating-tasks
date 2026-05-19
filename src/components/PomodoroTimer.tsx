'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, X, Timer, Coffee } from 'lucide-react'
import clsx from 'clsx'

const MODES = {
  focus: { label: 'Focus',   minutes: 25, color: 'text-orange-500',  ring: '#F97316', bg: 'bg-orange-50  dark:bg-orange-950/30' },
  short: { label: 'Pause',   minutes: 5,  color: 'text-green-500',   ring: '#22C55E', bg: 'bg-green-50   dark:bg-green-950/30'  },
  long:  { label: 'Grande pause', minutes: 15, color: 'text-blue-500', ring: '#3B82F6', bg: 'bg-blue-50  dark:bg-blue-950/30'   },
}
type Mode = keyof typeof MODES

interface Props { onClose: () => void }

export function PomodoroTimer({ onClose }: Props) {
  const [mode,    setMode]    = useState<Mode>('focus')
  const [seconds, setSeconds] = useState(MODES.focus.minutes * 60)
  const [running, setRunning] = useState(false)
  const [session, setSession] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef    = useRef<AudioContext | null>(null)

  const total = MODES[mode].minutes * 60
  const pct   = ((total - seconds) / total) * 100
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext()
      audioRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      osc.start(); osc.stop(ctx.currentTime + 1.2)
    } catch { /* noop */ }
  }, [])

  const switchMode = useCallback((m: Mode) => {
    setMode(m)
    setSeconds(MODES[m].minutes * 60)
    setRunning(false)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            playBeep()
            setRunning(false)
            if (mode === 'focus') {
              setSession(s => s + 1)
              switchMode(session % 4 === 0 ? 'long' : 'short')
            } else {
              switchMode('focus')
            }
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(mode === 'focus' ? '☕ Pause méritée !' : '🎯 C\'est reparti !', {
                body: mode === 'focus' ? 'Ton focus de 25 min est terminé.' : 'La pause est terminée. Focus !',
              })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode, session, playBeep, switchMode])

  const cfg = MODES[mode]
  const circumference = 2 * Math.PI * 54
  const dash = circumference - (pct / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      drag dragConstraints={{ left: -150, right: 150, top: -200, bottom: 200 }}
      className={clsx(
        'fixed bottom-36 right-4 z-50 w-[220px] rounded-[28px] border-2 shadow-2xl p-5 cursor-move',
        'bg-white dark:bg-zinc-900 border-orange-200 dark:border-zinc-700',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
          <Timer size={12} /> Pomodoro
        </span>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 dark:text-zinc-600 dark:hover:text-zinc-400">
          <X size={15} />
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 bg-orange-50 dark:bg-zinc-800 rounded-xl p-1">
        {(Object.keys(MODES) as Mode[]).map(k => (
          <button key={k} onClick={() => switchMode(k)}
            className={clsx(
              'flex-1 text-[10px] font-bold py-1 rounded-lg transition-all',
              mode === k
                ? 'bg-white dark:bg-zinc-700 text-orange-500 shadow-sm'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600',
            )}>
            {k === 'focus' ? '🎯' : k === 'short' ? '☕' : '🛋️'}
          </button>
        ))}
      </div>

      {/* Ring timer */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor"
              className="text-orange-100 dark:text-zinc-800" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="54" fill="none"
              stroke={cfg.ring} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dash }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-fredoka text-[28px] font-bold text-orange-900 dark:text-white leading-none">
              {m}:{s}
            </span>
            <span className={clsx('text-[10px] font-semibold mt-0.5', cfg.color)}>{cfg.label}</span>
          </div>
        </div>

        {/* Session dots */}
        <div className="flex gap-1.5 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={clsx(
              'w-2 h-2 rounded-full transition-colors',
              i < (session - 1) % 4 ? 'bg-orange-500' : 'bg-orange-200 dark:bg-zinc-700',
            )} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => { setSeconds(MODES[mode].minutes * 60); setRunning(false) }}
          className="w-9 h-9 flex items-center justify-center rounded-full
            bg-orange-100 dark:bg-zinc-800 text-orange-400 hover:bg-orange-200 transition-colors"
        >
          <RotateCcw size={15} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setRunning(r => !r)}
          className={clsx(
            'w-14 h-14 flex items-center justify-center rounded-full text-white font-bold transition-all',
            running
              ? 'bg-orange-400 shadow-[0_4px_16px_rgba(249,115,22,.35)]'
              : 'bg-orange-500 shadow-[0_4px_20px_rgba(249,115,22,.40)] hover:bg-orange-600',
          )}
        >
          {running ? <Pause size={22} /> : <Play size={22} />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => switchMode(mode === 'focus' ? 'short' : 'focus')}
          className="w-9 h-9 flex items-center justify-center rounded-full
            bg-orange-100 dark:bg-zinc-800 text-orange-400 hover:bg-orange-200 transition-colors"
        >
          <Coffee size={15} />
        </motion.button>
      </div>

      <p className="text-center text-[10px] text-slate-300 dark:text-zinc-600 mt-3">
        Session #{session} • Glisse pour déplacer
      </p>
    </motion.div>
  )
}
