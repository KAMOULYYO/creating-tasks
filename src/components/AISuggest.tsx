'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Plus, Loader2, RefreshCw } from 'lucide-react'
import type { Task, Category, Priority } from '@/types/database'
import { CAT_META, PRIO_META } from '@/lib/design'
import clsx from 'clsx'

interface Suggestion {
  title:    string
  category: Category
  priority: Priority
  reason:   string
}

interface Props {
  tasks:  Task[]
  onAdd:  (s: Omit<Suggestion, 'reason'>) => Promise<void>
  onClose: () => void
}

export function AISuggest({ tasks, onAdd, onClose }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [motivation,  setMotivation]  = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [added,       setAdded]       = useState<Set<number>>(new Set())

  async function fetch_suggestions() {
    setLoading(true); setError(''); setSuggestions([]); setAdded(new Set())
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuggestions(data.suggestions ?? [])
      setMotivation(data.motivation ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur IA')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(i: number) {
    const s = suggestions[i]
    await onAdd({ title: s.title, category: s.category, priority: s.priority })
    setAdded(prev => new Set(prev).add(i))
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-orange-950/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px]
          bg-white dark:bg-zinc-900 rounded-t-[28px] px-5 pb-10 pt-6"
      >
        <div className="w-10 h-1 bg-orange-200 dark:bg-zinc-700 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-orange-400 rounded-xl flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <h2 className="font-fredoka text-[20px] font-bold text-orange-900 dark:text-orange-100">
              Suggestions IA
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-[13px] text-slate-400 mb-5">
          Claude analyse tes tâches et te suggère quoi faire ensuite.
        </p>

        {/* Generate button */}
        {suggestions.length === 0 && !loading && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={fetch_suggestions}
            className="w-full py-4 rounded-2xl font-fredoka text-[17px] font-semibold text-white
              bg-gradient-to-r from-violet-500 to-orange-400
              shadow-[0_4px_20px_rgba(139,92,246,.30)] hover:shadow-[0_6px_28px_rgba(139,92,246,.40)]
              transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> Générer des suggestions
          </motion.button>
        )}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8 gap-3">
              <div className="relative w-12 h-12">
                <Loader2 size={48} className="animate-spin text-violet-400" />
                <Sparkles size={18} className="absolute inset-0 m-auto text-orange-400" />
              </div>
              <p className="text-[14px] text-slate-400 font-semibold">Claude réfléchit pour toi…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 rounded-2xl p-4 text-[13px] text-red-600 mb-4">
            ⚠️ {error}
            {error.includes('API') && (
              <p className="mt-1 text-[12px]">Ajoute ta clé <code className="bg-red-100 px-1 rounded">ANTHROPIC_API_KEY</code> dans <code>.env.local</code></p>
            )}
          </div>
        )}

        {/* Motivation banner */}
        {motivation && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-50 to-orange-50 dark:from-violet-950/30 dark:to-orange-950/30
              border border-violet-200 dark:border-violet-800 rounded-2xl px-4 py-3 mb-4 text-[13px] font-semibold text-violet-700 dark:text-violet-300 text-center">
            ✨ {motivation}
          </motion.div>
        )}

        {/* Suggestions list */}
        <div className="flex flex-col gap-3">
          {suggestions.map((s, i) => {
            const cat  = CAT_META[s.category]
            const prio = PRIO_META[s.priority]
            const done = added.has(i)
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={clsx(
                  'flex items-start gap-3 p-4 rounded-2xl border-2 transition-all',
                  done
                    ? 'border-green-200 bg-green-50 dark:bg-green-950/20 opacity-60'
                    : 'border-orange-200 dark:border-zinc-700 bg-white dark:bg-zinc-800',
                )}>
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-[14px] font-semibold text-orange-900 dark:text-orange-100', done && 'line-through')}>
                    {s.title}
                  </p>
                  <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-snug">{s.reason}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide', cat.color)}>
                      {cat.emoji} {cat.label}
                    </span>
                    <span className={clsx('w-1.5 h-1.5 rounded-full', prio.dot)} />
                    <span className="text-[11px] text-slate-400">{prio.label}</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  disabled={done}
                  onClick={() => handleAdd(i)}
                  className={clsx(
                    'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                    done
                      ? 'bg-green-400 text-white'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_2px_10px_rgba(249,115,22,.30)]',
                  )}>
                  {done ? '✓' : <Plus size={16} />}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Regenerate */}
        {suggestions.length > 0 && !loading && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetch_suggestions}
            className="w-full mt-4 py-3 rounded-2xl border-2 border-orange-200 dark:border-zinc-700
              text-[14px] font-semibold text-orange-500 dark:text-orange-400 flex items-center justify-center gap-2
              hover:border-orange-400 transition-colors"
          >
            <RefreshCw size={15} /> Nouvelles suggestions
          </motion.button>
        )}
      </motion.div>
    </>
  )
}
