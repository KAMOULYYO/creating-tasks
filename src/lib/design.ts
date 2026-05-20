import type { Category, Priority, Status } from '@/types/database'

export const CAT_META: Record<Category, { label: string; emoji: string; color: string }> = {
  work:   { label: 'Travail', emoji: '💼', color: 'bg-blue-500/15 text-blue-400 border border-blue-500/20'     },
  perso:  { label: 'Perso',   emoji: '🌸', color: 'bg-pink-500/15 text-pink-400 border border-pink-500/20'     },
  sante:  { label: 'Santé',   emoji: '💪', color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' },
  projet: { label: 'Projet',  emoji: '🚀', color: 'bg-violet-500/15 text-violet-400 border border-violet-500/20'   },
  autre:  { label: 'Autre',   emoji: '⭐', color: 'bg-amber-500/15 text-amber-400 border border-amber-500/20'   },
}

export const PRIO_META: Record<Priority, { label: string; dot: string }> = {
  high:   { label: 'Haute',   dot: 'bg-red-500'     },
  medium: { label: 'Moyenne', dot: 'bg-orange-400'  },
  low:    { label: 'Basse',   dot: 'bg-emerald-400' },
}

export const STATUS_META: Record<Status, { label: string; emoji: string }> = {
  pending:     { label: 'À faire',  emoji: '📝' },
  in_progress: { label: 'En cours', emoji: '⚡' },
  done:        { label: 'Terminée', emoji: '✅' },
}
