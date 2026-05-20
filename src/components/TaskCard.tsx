'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Clock, CheckCircle2, Circle, Loader2, GripVertical, Pencil } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/types/database'
import { CAT_META, PRIO_META } from '@/lib/design'
import clsx from 'clsx'

/* Couleurs de bordure gauche selon priorité */
const PRIO_GLOW: Record<string, { border: string; glow: string; dot: string }> = {
  high:   { border: 'border-l-red-500',    glow: 'rgba(239,68,68,0.15)',   dot: '#ef4444' },
  medium: { border: 'border-l-orange-400', glow: 'rgba(249,115,22,0.12)',  dot: '#f97316' },
  low:    { border: 'border-l-emerald-500',glow: 'rgba(16,185,129,0.12)',  dot: '#10b981' },
}

interface Props {
  task: Task
  onToggle: (id: string, done: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit:   (task: Task) => void
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: Props) {
  const [busy, setBusy] = useState(false)
  const done = task.status === 'done'
  const cat  = CAT_META[task.category]
  const prio = PRIO_META[task.priority]
  const pg   = PRIO_GLOW[task.priority]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  async function handleToggle() {
    setBusy(true)
    await onToggle(task.id, !done)
    setBusy(false)
  }

  async function handleDelete() {
    setBusy(true)
    await onDelete(task.id)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        boxShadow: isDragging
          ? `0 20px 60px rgba(59,130,246,0.3), 0 0 0 1px rgba(59,130,246,0.2)`
          : `0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px ${pg.glow}`,
      }}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -32, scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileHover={{ y: isDragging ? 0 : -3 }}
      className={clsx(
        'group relative flex items-start gap-3 p-4 rounded-2xl border-l-4 select-none overflow-hidden transition-all duration-200',
        pg.border,
        done
          ? 'bg-white/[0.02] border-t border-r border-b border-white/5 opacity-55'
          : 'bg-white/[0.05] border-t border-r border-b border-white/8',
        isDragging && 'scale-[1.02] bg-white/10',
      )}
    >
      {/* Reflet de lumière en haut */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Drag handle */}
      <button
        {...attributes} {...listeners}
        className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-white/15 hover:text-white/40 touch-none transition-colors"
      >
        <GripVertical size={16} />
      </button>

      {/* Checkbox */}
      <motion.button
        onClick={handleToggle} disabled={busy}
        whileTap={{ scale: 0.8 }}
        className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center"
      >
        {busy ? (
          <Loader2 size={17} className="animate-spin text-blue-400" />
        ) : done ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
            <CheckCircle2 size={19} className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
          </motion.div>
        ) : (
          <Circle size={19} className="text-white/20 group-hover:text-white/40 transition-colors" />
        )}
      </motion.button>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-[14px] font-semibold leading-snug break-words',
          done ? 'line-through text-white/30' : 'text-white/90',
        )}>
          {task.title}
        </p>

        {task.description && (
          <p className="text-[12px] text-white/35 mt-0.5 leading-snug line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {/* Heure */}
          {task.scheduled_at && (
            <span className="flex items-center gap-1 text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              <Clock size={9} />
              {new Date(task.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Catégorie */}
          <span className={clsx(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            cat.color,
          )}>
            {cat.emoji} {cat.label}
          </span>

          {/* Priorité — point lumineux */}
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: pg.dot, boxShadow: `0 0 6px ${pg.dot}` }}
            title={`Priorité ${prio.label}`}
          />
        </div>
      </div>

      {/* Actions — apparaissent au hover */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <motion.button
          onClick={() => onEdit(task)} whileTap={{ scale: 0.85 }}
          className="text-white/25 hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-500/10 transition-all"
          aria-label="Modifier"
        >
          <Pencil size={13} />
        </motion.button>
        <motion.button
          onClick={handleDelete} disabled={busy} whileTap={{ scale: 0.85 }}
          className="text-white/25 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
          aria-label="Supprimer"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  )
}
