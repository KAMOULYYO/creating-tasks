import type { Category, Priority, Status } from '@/types/database'

export const CAT_META: Record<Category, { label: string; emoji: string; color: string }> = {
  work:   { label: 'Travail', emoji: '💼', color: 'bg-blue-100 text-blue-700' },
  perso:  { label: 'Perso',   emoji: '🌸', color: 'bg-pink-100 text-pink-700' },
  sante:  { label: 'Santé',   emoji: '💪', color: 'bg-green-100 text-green-700' },
  projet: { label: 'Projet',  emoji: '🚀', color: 'bg-purple-100 text-purple-700' },
  autre:  { label: 'Autre',   emoji: '⭐', color: 'bg-yellow-100 text-yellow-700' },
}

export const PRIO_META: Record<Priority, { label: string; dot: string }> = {
  high:   { label: 'Haute',   dot: 'bg-red-500' },
  medium: { label: 'Moyenne', dot: 'bg-orange-400' },
  low:    { label: 'Basse',   dot: 'bg-green-400' },
}

export const STATUS_META: Record<Status, { label: string; emoji: string }> = {
  pending:     { label: 'À faire',    emoji: '📝' },
  in_progress: { label: 'En cours',   emoji: '⚡' },
  done:        { label: 'Terminée',   emoji: '✅' },
}
