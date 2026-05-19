'use client'

import { useEffect, useCallback } from 'react'
import type { Task } from '@/types/database'

export function useNotifications(tasks: Task[]) {
  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied'
    if (Notification.permission === 'default') {
      return await Notification.requestPermission()
    }
    return Notification.permission
  }, [])

  // Schedule browser notifications for tasks with scheduled_at
  useEffect(() => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return

    const timers: ReturnType<typeof setTimeout>[] = []

    tasks
      .filter(t => t.status !== 'done' && t.scheduled_at)
      .forEach(task => {
        const scheduledTime = new Date(task.scheduled_at!).getTime()
        const now = Date.now()
        const delay = scheduledTime - now

        // Notify 5 minutes before
        const earlyDelay = delay - 5 * 60 * 1000
        if (earlyDelay > 0) {
          timers.push(setTimeout(() => {
            new Notification('⏰ Rappel TaskFlow', {
              body: `Dans 5 min : ${task.title}`,
              icon: '/favicon.ico',
              tag: `task-early-${task.id}`,
            })
          }, earlyDelay))
        }

        // Notify at exact time
        if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
          timers.push(setTimeout(() => {
            new Notification('🎯 C\'est l\'heure !', {
              body: task.title,
              icon: '/favicon.ico',
              tag: `task-${task.id}`,
            })
          }, delay))
        }
      })

    return () => timers.forEach(clearTimeout)
  }, [tasks])

  return { requestPermission }
}
