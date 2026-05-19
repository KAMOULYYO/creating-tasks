'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  const dark = theme === 'dark'

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="relative w-9 h-9 flex items-center justify-center rounded-full
        bg-orange-100 dark:bg-zinc-800 text-orange-400 dark:text-yellow-300
        hover:bg-orange-200 dark:hover:bg-zinc-700 transition-colors"
      title={dark ? 'Mode clair' : 'Mode sombre'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
          exit={{   rotate:  30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
