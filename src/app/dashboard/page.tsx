'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Plus, LogOut, BarChart2, Trash2, ClipboardList, Bell, Search, X, Flame, Timer, Download, Sparkles, FileDown } from 'lucide-react'
import { TaskCard } from '@/components/TaskCard'
import { AddTaskModal } from '@/components/AddTaskModal'
import { EditTaskModal } from '@/components/EditTaskModal'
import { AISuggest } from '@/components/AISuggest'
import { StatsChart } from '@/components/StatsChart'
import { Confetti } from '@/components/Confetti'
import { Toast } from '@/components/Toast'
import { PomodoroTimer } from '@/components/PomodoroTimer'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useNotifications } from '@/hooks/useNotifications'
import { usePWA } from '@/hooks/usePWA'
import { useExportPDF } from '@/hooks/useExportPDF'
import type { Task, Category } from '@/types/database'
import clsx from 'clsx'

type Filter = 'all' | 'pending' | 'done' | Category
type Tab    = 'tasks' | 'stats'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',     label: 'Toutes'      },
  { value: 'pending', label: '📝 À faire'  },
  { value: 'done',    label: '✅ Faites'   },
  { value: 'work',    label: '💼 Travail'  },
  { value: 'perso',   label: '🌸 Perso'   },
  { value: 'sante',   label: '💪 Santé'   },
  { value: 'projet',  label: '🚀 Projet'  },
]

const MOTIVATIONS = [
  '🔥 Tu assures aujourd\'hui !',
  '⚡ Rien ne peut t\'arrêter !',
  '🚀 En route vers la réussite !',
  '💪 Chaque tâche compte !',
  '🎯 Focus et déterminé !',
]

interface ToastState { message: string; type: 'success' | 'error' | 'info'; key: number }

function getStreak(): number {
  if (typeof window === 'undefined') return 0
  try {
    const data = JSON.parse(localStorage.getItem('streak_data') || '{}')
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (data.lastDate === today) return data.count ?? 1
    if (data.lastDate === yesterday) return data.count ?? 1
    return 0
  } catch { return 0 }
}

function saveStreak(allDone: boolean) {
  if (typeof window === 'undefined' || !allDone) return
  try {
    const data = JSON.parse(localStorage.getItem('streak_data') || '{}')
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const count = data.lastDate === yesterday ? (data.count ?? 0) + 1 : 1
    if (data.lastDate !== today) {
      localStorage.setItem('streak_data', JSON.stringify({ lastDate: today, count }))
    }
  } catch { /* noop */ }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [tasks,       setTasks]       = useState<Task[]>([])
  const [filter,      setFilter]      = useState<Filter>('all')
  const [tab,         setTab]         = useState<Tab>('tasks')
  const [search,      setSearch]      = useState('')
  const [showSearch,  setShowSearch]  = useState(false)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTask,    setEditTask]    = useState<Task | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [toast,       setToast]       = useState<ToastState | null>(null)
  const [confetti,    setConfetti]    = useState(false)
  const [streak,      setStreak]      = useState(0)
  const [pomodoro,    setPomodoro]    = useState(false)
  const [aiOpen,      setAiOpen]      = useState(false)
  const [motivation]                  = useState(() => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)])
  const prevDoneCount                 = useRef(0)
  const searchRef                     = useRef<HTMLInputElement>(null)

  const { requestPermission } = useNotifications(tasks)
  const { canInstall, install } = usePWA()
  const { exportPDF } = useExportPDF()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const showToast = (message: string, type: ToastState['type'] = 'success') =>
    setToast({ message, type, key: Date.now() })

  useEffect(() => { if (status === 'unauthenticated') router.push('/login') }, [status, router])
  useEffect(() => { setStreak(getStreak()) }, [])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/tasks')
    if (res.ok) setTasks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { if (status === 'authenticated') loadTasks() }, [status, loadTasks])

  // Confetti + streak when 100%
  useEffect(() => {
    const done = tasks.filter(t => t.status === 'done').length
    if (tasks.length > 0 && done === tasks.length && done > prevDoneCount.current) {
      setConfetti(true)
      saveStreak(true)
      setStreak(getStreak())
      setTimeout(() => setConfetti(false), 4000)
    }
    prevDoneCount.current = done
  }, [tasks])

  // focus search input
  useEffect(() => {
    if (showSearch) setTimeout(() => searchRef.current?.focus(), 100)
  }, [showSearch])

  // ── CRUD ─────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleAdd(task: any) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    if (!res.ok) throw new Error((await res.json()).error)
    const created: Task = await res.json()
    setTasks(prev => [...prev, created])
    showToast('✨ Tâche ajoutée !')
  }

  async function handleToggle(id: string, done: boolean) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: done ? 'done' : 'pending' }),
    })
    if (!res.ok) { showToast('Erreur', 'error'); return }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: done ? 'done' : 'pending' } as Task : t))
    showToast(done ? '✅ Terminée !' : '↩️ Réouverte', done ? 'success' : 'info')
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) { showToast('Erreur', 'error'); return }
    setTasks(prev => prev.filter(t => t.id !== id))
    showToast('🗑️ Supprimée', 'info')
  }

  async function handleSaveEdit(id: string, updates: Partial<Task>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) { showToast('Erreur de sauvegarde', 'error'); return }
    const updated: Task = await res.json()
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
    showToast('💾 Tâche modifiée !')
  }

  async function clearDone() {
    const done = tasks.filter(t => t.status === 'done')
    if (!done.length) { showToast('Aucune tâche terminée', 'info'); return }
    await Promise.all(done.map(t => fetch(`/api/tasks/${t.id}`, { method: 'DELETE' })))
    setTasks(prev => prev.filter(t => t.status !== 'done'))
    showToast(`🧹 ${done.length} supprimée${done.length > 1 ? 's' : ''}`)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setTasks(prev => {
      const o = prev.findIndex(t => t.id === active.id)
      const n = prev.findIndex(t => t.id === over.id)
      return arrayMove(prev, o, n)
    })
  }

  async function handleNotif() {
    const p = await requestPermission()
    showToast(p === 'granted' ? '🔔 Notifications activées !' : 'Notifications refusées', p === 'granted' ? 'success' : 'error')
  }

  // ── FILTERED + SEARCHED LIST ──────────────────────────────
  const displayed = tasks
    .filter(t => {
      if (filter === 'pending') return t.status !== 'done'
      if (filter === 'done')    return t.status === 'done'
      if (['work','perso','sante','projet','autre'].includes(filter)) return t.category === filter
      return true
    })
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase())
      || t.description?.toLowerCase().includes(search.toLowerCase()))

  const total   = tasks.length
  const done    = tasks.filter(t => t.status === 'done').length
  const pending = total - done
  const pct     = total ? Math.round(done / total * 100) : 0

  const now  = new Date()
  const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  const mons = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  const dateStr = `${days[now.getDay()]} ${now.getDate()} ${mons[now.getMonth()]}`

  if (status === 'loading' || status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-[#FFF7ED] dark:bg-zinc-950 flex justify-center transition-colors duration-300">
      <div className="w-full max-w-[430px] min-h-screen pb-28 relative">

        {confetti && <Confetti />}
        {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

        {/* ── HEADER ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-20 bg-gradient-to-b from-[#FFF7ED] dark:from-zinc-950 via-[#FFF7ED]/95 dark:via-zinc-950/95 to-transparent pt-6 pb-3 px-5"
        >
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div key="search"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-2 bg-white border-2 border-orange-300 rounded-2xl px-3 py-2.5
                  shadow-[0_2px_12px_rgba(249,115,22,.12)]">
                  <Search size={16} className="text-orange-400 shrink-0" />
                  <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher une tâche…"
                    className="flex-1 bg-transparent text-[14px] text-orange-900 outline-none placeholder:text-slate-300"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-slate-300 hover:text-slate-500">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button onClick={() => { setShowSearch(false); setSearch('') }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-400">
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="title"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="flex items-start justify-between"
              >
                <div>
                  <h1 className="font-fredoka text-[24px] font-bold text-orange-900 leading-tight">
                    👋 {session?.user?.name ? `Salut, ${session.user.name.split(' ')[0]} !` : 'Bonjour !'}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-slate-400 text-[12px]">{dateStr}</p>
                    {streak > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex items-center gap-0.5 text-[11px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full"
                      >
                        <Flame size={11} /> {streak} jour{streak > 1 ? 's' : ''}
                      </motion.span>
                    )}
                  </div>
                  <p className="text-[12px] font-semibold text-orange-400 mt-0.5">{motivation}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowSearch(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-400 hover:bg-orange-200 transition-colors">
                    <Search size={16} />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={handleNotif}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 dark:bg-zinc-800 text-orange-400 hover:bg-orange-200 transition-colors">
                    <Bell size={16} />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => setPomodoro(p => !p)}
                    className={clsx(
                      'w-9 h-9 flex items-center justify-center rounded-full transition-colors',
                      pomodoro
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 dark:bg-zinc-800 text-orange-400 hover:bg-orange-200',
                    )}>
                    <Timer size={16} />
                  </motion.button>
                  {canInstall && (
                    <motion.button whileTap={{ scale: 0.88 }} onClick={async () => {
                        const ok = await install()
                        if (ok) showToast('📱 App installée !')
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition-colors"
                      title="Installer l'app">
                      <Download size={16} />
                    </motion.button>
                  )}
                  <ThemeToggle />
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 dark:bg-zinc-800 text-orange-400 hover:bg-red-100 hover:text-red-400 transition-colors">
                    <LogOut size={15} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── PROGRESS ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="px-5 mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[12px] font-semibold text-slate-400">Progression du jour</span>
            <motion.span key={pct} initial={{ scale: 1.3, color: '#F97316' }} animate={{ scale: 1 }}
              className="font-fredoka text-[15px] text-orange-500">{pct}%</motion.span>
          </div>
          <div className="h-2.5 bg-orange-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300"
              animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
          <AnimatePresence>
            {pct === 100 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center text-[12px] font-bold text-orange-500 mt-1">
                🎉 Bravo ! Toutes les tâches sont terminées !
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-3 gap-3 px-5 mb-5">
          {[
            { icon: '📋', num: total,   label: 'Total',     color: 'text-orange-500' },
            { icon: '✅', num: done,    label: 'Faites',    color: 'text-green-500'  },
            { icon: '⏳', num: pending, label: 'Restantes', color: 'text-orange-400' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-[20px] border-2 border-orange-100 p-3 text-center
                shadow-[0_2px_10px_rgba(249,115,22,.08)] cursor-default">
              <div className="text-[20px] mb-0.5">{s.icon}</div>
              <motion.div key={s.num} initial={{ scale: 1.25 }} animate={{ scale: 1 }}
                className={clsx('font-fredoka text-[22px] font-bold leading-none', s.color)}>{s.num}</motion.div>
              <div className="text-[10px] text-slate-400 font-bold mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 px-5 mb-4">
          {(['tasks', 'stats'] as Tab[]).map(t => (
            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTab(t)}
              className={clsx(
                'flex-1 py-2.5 rounded-2xl text-[13px] font-bold transition-all border-2',
                tab === t
                  ? 'bg-orange-500 border-orange-500 text-white shadow-[0_3px_12px_rgba(249,115,22,.28)]'
                  : 'bg-white border-orange-200 text-slate-500 hover:border-orange-400',
              )}>
              {t === 'tasks' ? '📋 Tâches' : '📊 Statistiques'}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'tasks' ? (
            <motion.div key="tasks"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}>

              {/* Filters */}
              <div className="flex gap-2 px-5 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {FILTERS.map(f => (
                  <motion.button key={f.value} whileTap={{ scale: 0.9 }} onClick={() => setFilter(f.value)}
                    className={clsx(
                      'shrink-0 px-3 py-1 rounded-full border-2 text-[12px] font-semibold transition-all whitespace-nowrap',
                      filter === f.value
                        ? 'bg-orange-500 border-orange-500 text-white shadow-[0_2px_8px_rgba(249,115,22,.25)]'
                        : 'bg-white border-orange-200 text-slate-500 hover:border-orange-400',
                    )}>
                    {f.label}
                  </motion.button>
                ))}
              </div>

              {/* Count + AI + Export */}
              <div className="flex items-center justify-between px-5 mb-3 gap-2">
                <p className="font-fredoka text-[15px] font-semibold text-orange-900 dark:text-orange-100 flex-1">
                  {displayed.length} tâche{displayed.length !== 1 ? 's' : ''}
                  {search && <span className="text-[13px] text-slate-400 font-normal ml-1">pour &quot;{search}&quot;</span>}
                </p>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setAiOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold
                    bg-gradient-to-r from-violet-100 to-orange-100 dark:from-violet-900/40 dark:to-orange-900/40
                    text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-700
                    hover:shadow-md transition-all">
                  <Sparkles size={13} /> IA
                </motion.button>
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    exportPDF(tasks, session?.user?.name ?? 'Utilisateur')
                    showToast('📄 PDF exporté !')
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold
                    bg-orange-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400
                    border border-orange-200 dark:border-zinc-700 hover:shadow-md transition-all">
                  <FileDown size={13} /> PDF
                </motion.button>
              </div>

              {/* DnD task list */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={displayed.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2.5 px-5">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <motion.div key={i}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                          className="h-[76px] bg-orange-100 rounded-2xl" />
                      ))
                    ) : displayed.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                          className="text-[52px] mb-3">
                          {search ? '🔍' : '🎯'}
                        </motion.div>
                        <p className="font-fredoka text-[19px] text-orange-900 mb-1">
                          {search ? 'Aucun résultat' : 'Aucune tâche ici'}
                        </p>
                        <p className="text-[13px] text-slate-400">
                          {search ? `Rien pour "${search}"` : 'Appuie sur + pour commencer'}
                        </p>
                      </motion.div>
                    ) : (
                      <AnimatePresence>
                        {displayed.map(t => (
                          <TaskCard key={t.id} task={t}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onEdit={setEditTask}
                          />
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </motion.div>
          ) : (
            <motion.div key="stats"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
              <StatsChart tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTTOM NAV ── */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-md border-t-2 border-orange-100 px-5 py-2 flex justify-around z-30">
          {[
            { id: 'tasks', icon: <ClipboardList size={21} />, label: 'Tâches' },
            { id: 'stats', icon: <BarChart2    size={21} />, label: 'Stats'  },
          ].map(n => (
            <motion.button key={n.id} whileTap={{ scale: 0.88 }} onClick={() => setTab(n.id as Tab)}
              className={clsx(
                'flex flex-col items-center gap-0.5 text-[11px] font-bold px-5 py-2 rounded-xl transition-colors',
                tab === n.id ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:bg-orange-50',
              )}>
              {n.icon}{n.label}
            </motion.button>
          ))}
          <motion.button whileTap={{ scale: 0.88 }} onClick={clearDone}
            className="flex flex-col items-center gap-0.5 text-[11px] font-bold px-5 py-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors">
            <Trash2 size={21} />Nettoyer
          </motion.button>
        </nav>

        {/* ── FAB ── */}
        <motion.button onClick={() => setModalOpen(true)}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          animate={{ rotate: modalOpen ? 45 : 0 }}
          className="fixed z-40 bottom-20 right-[max(16px,calc(50%-215px+16px))] w-14 h-14 rounded-full bg-orange-500
            flex items-center justify-center text-white
            shadow-[0_4px_0_rgba(154,52,18,.22),0_8px_28px_rgba(249,115,22,.38)]">
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>

        <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onSave={handleSaveEdit} />

        <AnimatePresence>
          {pomodoro && <PomodoroTimer onClose={() => setPomodoro(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {aiOpen && (
            <AISuggest
              tasks={tasks}
              onClose={() => setAiOpen(false)}
              onAdd={async (s) => {
                await handleAdd({ ...s, status: 'pending', description: null, scheduled_at: null })
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
