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
import {
  Plus, LogOut, BarChart2, Trash2, ClipboardList, Bell,
  Search, X, Flame, Timer, Download, Sparkles, FileDown,
} from 'lucide-react'
import { TaskCard }      from '@/components/TaskCard'
import { AddTaskModal }  from '@/components/AddTaskModal'
import { EditTaskModal } from '@/components/EditTaskModal'
import { AISuggest }     from '@/components/AISuggest'
import { StatsChart }    from '@/components/StatsChart'
import { Confetti }      from '@/components/Confetti'
import { Toast }         from '@/components/Toast'
import { PomodoroTimer } from '@/components/PomodoroTimer'
import { ThemeToggle }   from '@/components/ThemeToggle'
import { useNotifications } from '@/hooks/useNotifications'
import { usePWA }           from '@/hooks/usePWA'
import { useExportPDF }     from '@/hooks/useExportPDF'
import type { Task, Category } from '@/types/database'
import clsx from 'clsx'

type Filter = 'all' | 'pending' | 'done' | Category
type Tab    = 'tasks' | 'stats'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',     label: 'Toutes'     },
  { value: 'pending', label: '📝 À faire' },
  { value: 'done',    label: '✅ Faites'  },
  { value: 'work',    label: '💼 Travail' },
  { value: 'perso',   label: '🌸 Perso'  },
  { value: 'sante',   label: '💪 Santé'  },
  { value: 'projet',  label: '🚀 Projet' },
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
    const today     = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (data.lastDate === today)      return data.count ?? 1
    if (data.lastDate === yesterday)  return data.count ?? 1
    return 0
  } catch { return 0 }
}

function saveStreak(allDone: boolean) {
  if (typeof window === 'undefined' || !allDone) return
  try {
    const data = JSON.parse(localStorage.getItem('streak_data') || '{}')
    const today     = new Date().toDateString()
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

  const [tasks,      setTasks]      = useState<Task[]>([])
  const [filter,     setFilter]     = useState<Filter>('all')
  const [tab,        setTab]        = useState<Tab>('tasks')
  const [search,     setSearch]     = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editTask,   setEditTask]   = useState<Task | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [toast,      setToast]      = useState<ToastState | null>(null)
  const [confetti,   setConfetti]   = useState(false)
  const [streak,     setStreak]     = useState(0)
  const [pomodoro,   setPomodoro]   = useState(false)
  const [aiOpen,     setAiOpen]     = useState(false)
  const [motivation]                = useState(() => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)])
  const prevDoneCount               = useRef(0)
  const searchRef                   = useRef<HTMLInputElement>(null)

  const { requestPermission }  = useNotifications(tasks)
  const { canInstall, install } = usePWA()
  const { exportPDF }          = useExportPDF()
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

  useEffect(() => {
    if (showSearch) setTimeout(() => searchRef.current?.focus(), 100)
  }, [showSearch])

  // ── CRUD ──────────────────────────────────────────────────────
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
    showToast(
      p === 'granted' ? '🔔 Notifications activées !' : 'Notifications refusées',
      p === 'granted' ? 'success' : 'error',
    )
  }

  // ── COMPUTED ──────────────────────────────────────────────────
  const displayed = tasks
    .filter(t => {
      if (filter === 'pending') return t.status !== 'done'
      if (filter === 'done')    return t.status === 'done'
      if (['work','perso','sante','projet','autre'].includes(filter)) return t.category === filter
      return true
    })
    .filter(t =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    )

  const total   = tasks.length
  const done    = tasks.filter(t => t.status === 'done').length
  const pending = total - done
  const pct     = total ? Math.round(done / total * 100) : 0

  const now    = new Date()
  const days   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  const mons   = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  const dateStr = `${days[now.getDay()]} ${now.getDate()} ${mons[now.getMonth()]}`

  if (status === 'loading' || status === 'unauthenticated') return null

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020817] flex justify-center">

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent 70%)' }} />

      {confetti && <Confetti />}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="w-full max-w-[430px] min-h-screen pb-28 relative z-10">

        {/* ── HEADER ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 pt-5 pb-3 px-5"
          style={{ background: 'rgba(2,8,23,0.88)' }}
        >
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div key="search"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5
                  focus-within:border-blue-500/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all">
                  <Search size={15} className="text-gray-600 shrink-0" />
                  <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher une tâche…"
                    className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-gray-700"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-gray-600 hover:text-gray-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button onClick={() => { setShowSearch(false); setSearch('') }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="title"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                      <span className="text-white font-black text-[10px]">T</span>
                    </div>
                    <h1 className="text-white font-bold text-[17px] leading-tight">
                      {session?.user?.name ? `Salut, ${session.user.name.split(' ')[0]} 👋` : 'Bonjour 👋'}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <p className="text-gray-600 text-[12px]">{dateStr}</p>
                    {streak > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-[11px] font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full"
                      >
                        <Flame size={10} /> {streak} jour{streak > 1 ? 's' : ''}
                      </motion.span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-blue-400/70 mt-0.5 pl-8">{motivation}</p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 mt-0.5">
                  {[
                    { icon: <Search size={15} />,  action: () => setShowSearch(true),                    tip: 'Rechercher' },
                    { icon: <Bell size={15} />,    action: handleNotif,                                  tip: 'Notifications' },
                    { icon: <Timer size={15} />,   action: () => setPomodoro(p => !p),                  tip: 'Pomodoro',  active: pomodoro },
                  ].map((btn, i) => (
                    <motion.button key={i} whileTap={{ scale: 0.88 }} onClick={btn.action} title={btn.tip}
                      className={clsx(
                        'w-8 h-8 flex items-center justify-center rounded-full border transition-all',
                        btn.active
                          ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                          : 'bg-white/[0.04] border-white/8 text-gray-600 hover:text-white hover:border-white/15',
                      )}>
                      {btn.icon}
                    </motion.button>
                  ))}
                  {canInstall && (
                    <motion.button whileTap={{ scale: 0.88 }} title="Installer l'app"
                      onClick={async () => { const ok = await install(); if (ok) showToast('📱 App installée !') }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                      <Download size={15} />
                    </motion.button>
                  )}
                  <ThemeToggle />
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => signOut({ callbackUrl: '/login' })} title="Déconnexion"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/8 text-gray-600 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-all">
                    <LogOut size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── PROGRESS ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="px-5 pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-semibold text-gray-600">Progression du jour</span>
            <motion.span key={pct} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
              className="text-[14px] font-bold text-blue-400">{pct}%</motion.span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <AnimatePresence>
            {pct === 100 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center text-[12px] font-bold text-blue-400 mt-1.5">
                🎉 Bravo ! Toutes les tâches sont terminées !
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-3 gap-3 px-5 mb-5">
          {[
            { icon: '📋', num: total,   label: 'Total',     gradient: 'from-blue-500 to-cyan-400'    },
            { icon: '✅', num: done,    label: 'Faites',    gradient: 'from-emerald-500 to-teal-400' },
            { icon: '⏳', num: pending, label: 'Restantes', gradient: 'from-orange-500 to-amber-400' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06 }}
              whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.12)' }}
              className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-3 text-center cursor-default transition-all">
              <div className="text-[18px] mb-1">{s.icon}</div>
              <motion.div key={s.num} initial={{ scale: 1.25 }} animate={{ scale: 1 }}
                className={`font-black text-[22px] leading-none bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                {s.num}
              </motion.div>
              <div className="text-[10px] text-gray-600 font-semibold mt-0.5 uppercase tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 px-5 mb-4">
          {(['tasks', 'stats'] as Tab[]).map(t => (
            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTab(t)}
              className={clsx(
                'flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all border',
                tab === t
                  ? 'bg-blue-600/20 border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'bg-white/[0.04] border-white/[0.07] text-gray-600 hover:text-gray-400 hover:border-white/12',
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
                      'shrink-0 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all whitespace-nowrap',
                      filter === f.value
                        ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                        : 'bg-white/[0.04] border-white/[0.07] text-gray-600 hover:text-gray-400',
                    )}>
                    {f.label}
                  </motion.button>
                ))}
              </div>

              {/* Count + AI + PDF */}
              <div className="flex items-center justify-between px-5 mb-3 gap-2">
                <p className="text-[14px] font-semibold text-gray-400 flex-1">
                  {displayed.length} tâche{displayed.length !== 1 ? 's' : ''}
                  {search && <span className="text-[13px] text-gray-600 font-normal ml-1">pour &ldquo;{search}&rdquo;</span>}
                </p>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setAiOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold
                    bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-all">
                  <Sparkles size={12} /> IA
                </motion.button>
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={() => { exportPDF(tasks, session?.user?.name ?? 'Utilisateur'); showToast('📄 PDF exporté !') }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold
                    bg-white/[0.04] border border-white/[0.07] text-gray-500 hover:text-gray-300 transition-all">
                  <FileDown size={12} /> PDF
                </motion.button>
              </div>

              {/* Task list */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={displayed.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2.5 px-5">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <motion.div key={i}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                          className="h-[76px] bg-white/5 rounded-2xl border border-white/5" />
                      ))
                    ) : displayed.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-14">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                          className="text-[52px] mb-3">
                          {search ? '🔍' : '🎯'}
                        </motion.div>
                        <p className="text-white font-bold text-[18px] mb-1">
                          {search ? 'Aucun résultat' : 'Aucune tâche ici'}
                        </p>
                        <p className="text-gray-600 text-[13px]">
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
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] border-t border-white/5 px-5 py-2 flex justify-around z-30 backdrop-blur-xl"
          style={{ background: 'rgba(2,8,23,0.92)' }}>
          {[
            { id: 'tasks', icon: <ClipboardList size={20} />, label: 'Tâches' },
            { id: 'stats', icon: <BarChart2     size={20} />, label: 'Stats'  },
          ].map(n => (
            <motion.button key={n.id} whileTap={{ scale: 0.88 }} onClick={() => setTab(n.id as Tab)}
              className={clsx(
                'flex flex-col items-center gap-0.5 text-[11px] font-bold px-5 py-2 rounded-xl transition-all',
                tab === n.id
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-600 hover:text-gray-400',
              )}>
              {n.icon}{n.label}
            </motion.button>
          ))}
          <motion.button whileTap={{ scale: 0.88 }} onClick={clearDone}
            className="flex flex-col items-center gap-0.5 text-[11px] font-bold px-5 py-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 size={20} />Nettoyer
          </motion.button>
        </nav>

        {/* ── FAB ── */}
        <motion.button onClick={() => setModalOpen(true)}
          whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: modalOpen ? 45 : 0 }}
          className="fixed z-40 bottom-20 right-[max(16px,calc(50%-215px+16px))] w-14 h-14 rounded-full
            bg-gradient-to-br from-blue-600 to-cyan-500
            flex items-center justify-center text-white
            shadow-[0_0_30px_rgba(59,130,246,0.45)] transition-shadow">
          <Plus size={26} strokeWidth={2.5} />
        </motion.button>

        <AddTaskModal  open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
        <EditTaskModal task={editTask}  onClose={() => setEditTask(null)}   onSave={handleSaveEdit} />

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
