'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Save } from 'lucide-react'
import type { Task, Category, Priority } from '@/types/database'
import clsx from 'clsx'

interface Props {
  task: Task | null
  onClose: () => void
  onSave: (id: string, updates: Partial<Task>) => Promise<void>
}

const CATS: { value: Category; label: string; emoji: string }[] = [
  { value: 'work',   label: 'Travail', emoji: '💼' },
  { value: 'perso',  label: 'Perso',   emoji: '🌸' },
  { value: 'sante',  label: 'Santé',   emoji: '💪' },
  { value: 'projet', label: 'Projet',  emoji: '🚀' },
  { value: 'autre',  label: 'Autre',   emoji: '⭐' },
]
const PRIOS: { value: Priority; label: string }[] = [
  { value: 'high',   label: '🔴 Haute'   },
  { value: 'medium', label: '🟠 Moyenne' },
  { value: 'low',    label: '🟢 Basse'   },
]

export function EditTaskModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [desc,  setDesc]  = useState('')
  const [cat,   setCat]   = useState<Category>('work')
  const [prio,  setPrio]  = useState<Priority>('medium')
  const [time,  setTime]  = useState('')
  const [busy,  setBusy]  = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDesc(task.description ?? '')
      setCat(task.category)
      setPrio(task.priority)
      setTime(task.scheduled_at
        ? new Date(task.scheduled_at).toTimeString().slice(0, 5)
        : '')
    }
  }, [task])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task) return
    setBusy(true)
    await onSave(task.id, {
      title: title.trim(),
      description: desc.trim() || null,
      category: cat,
      priority: prio,
      scheduled_at: time
        ? new Date(`${new Date().toDateString()} ${time}`).toISOString()
        : null,
    })
    setBusy(false)
    onClose()
  }

  const open = !!task

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-orange-950/20 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] bg-white rounded-t-[28px] px-5 pb-10 pt-6"
      >
        <div className="w-10 h-1 bg-orange-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-fredoka text-[22px] font-bold text-orange-900">✏️ Modifier la tâche</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Titre *</label>
            <input
              autoFocus
              value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[15px] outline-none focus:border-orange-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              value={desc} onChange={e => setDesc(e.target.value)} rows={2}
              className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[14px] outline-none focus:border-orange-400 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Catégorie</label>
            <div className="flex gap-2 flex-wrap">
              {CATS.map(c => (
                <button type="button" key={c.value} onClick={() => setCat(c.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full border-2 text-[13px] font-semibold transition-all',
                    cat === c.value
                      ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                      : 'bg-white border-orange-200 text-slate-500 hover:border-orange-400',
                  )}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Priorité</label>
              <select value={prio} onChange={e => setPrio(e.target.value as Priority)}
                className="w-full px-3 py-2.5 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[14px] outline-none focus:border-orange-400">
                {PRIOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Heure</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[14px] outline-none focus:border-orange-400"
              />
            </div>
          </div>
          <button type="submit" disabled={busy}
            className="mt-1 w-full py-4 rounded-2xl bg-orange-500 text-white font-fredoka text-[18px] font-semibold
              shadow-[0_4px_0_0_rgba(154,52,18,.15),0_8px_24px_-4px_rgba(249,115,22,.25)]
              hover:bg-orange-600 active:scale-[.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {busy ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} /> Enregistrer</>}
          </button>
        </form>
      </motion.div>
    </>
  )
}
