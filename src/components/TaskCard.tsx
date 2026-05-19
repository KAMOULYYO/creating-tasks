'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Clock, CheckCircle2, Circle, Loader2, GripVertical, Pencil } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/types/database'
import { CAT_META, PRIO_META } from '@/lib/design'
import clsx from 'clsx'

const PRIO_BORDER: Record<string, string> = {
  high:   'border-l-red-400',
  medium: 'border-l-orange-400',
  low:    'border-l-green-400',
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
      style={style}
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      whileHover={{ y: isDragging ? 0 : -2 }}
      className={clsx(
        'group flex items-start gap-2.5 p-4 rounded-2xl border-2 border-l-4 bg-white select-none',
        PRIO_BORDER[task.priority],
        isDragging
          ? 'shadow-[0_16px_48px_rgba(249,115,22,.30)] scale-[1.02] border-orange-300'
          : 'shadow-[0_2px_10px_rgba(249,115,22,.09)]',
        done ? 'opacity-60 bg-green-50/60 border-green-200 border-l-green-400' : 'border-orange-200',
        'transition-shadow transition-colors duration-150',
      )}
    >
      {/* Drag */}
      <button {...attributes} {...listeners}
        className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-orange-200 hover:text-orange-400 touch-none">
        <GripVertical size={17} />
      </button>

      {/* Checkbox */}
      <motion.button onClick={handleToggle} disabled={busy} whileTap={{ scale: 0.82 }}
        className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center">
        {busy
          ? <Loader2 size={18} className="animate-spin text-orange-400" />
          : done
            ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                <CheckCircle2 size={20} className="text-green-500" />
              </motion.div>
            : <Circle size={20} className="text-orange-300 group-hover:text-orange-400 transition-colors" />
        }
      </motion.button>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-[14px] font-semibold text-orange-900 leading-snug break-words',
          done && 'line-through text-slate-400',
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-[12px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {task.scheduled_at && (
            <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
              <Clock size={10} />
              {new Date(task.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide', cat.color)}>
            {cat.emoji} {cat.label}
          </span>
          <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', prio.dot)} title={`Priorité ${prio.label}`} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <motion.button onClick={() => onEdit(task)} whileTap={{ scale: 0.85 }}
          className="text-orange-300 hover:text-orange-500 p-1 rounded-lg transition-colors" aria-label="Modifier">
          <Pencil size={14} />
        </motion.button>
        <motion.button onClick={handleDelete} disabled={busy} whileTap={{ scale: 0.85 }}
          className="text-red-200 hover:text-red-500 p-1 rounded-lg transition-colors" aria-label="Supprimer">
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  )
}
