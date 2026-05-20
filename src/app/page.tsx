'use client'

import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring, animate,
} from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, Zap, Bell, BarChart2, GripVertical,
  ArrowRight, Brain, Sparkles, Star,
} from 'lucide-react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

/* ─────────────── DATA ─────────────── */

const FEATURES = [
  { icon: CheckCircle2, title: 'Suivi en temps réel',    desc: 'Coche tes tâches et vois ta progression instantanément avec des indicateurs visuels.',     gradient: 'from-blue-500 to-cyan-400',     back: 'from-blue-900/80 to-cyan-900/80'     },
  { icon: BarChart2,    title: 'Statistiques visuelles', desc: 'Graphiques de productivité par catégorie, priorité et tendance sur la semaine.',           gradient: 'from-violet-500 to-purple-400', back: 'from-violet-900/80 to-purple-900/80' },
  { icon: Bell,         title: 'Rappels intelligents',   desc: 'Notifications navigateur automatiques 5 min avant chaque tâche planifiée.',                gradient: 'from-emerald-500 to-teal-400',  back: 'from-emerald-900/80 to-teal-900/80'  },
  { icon: GripVertical, title: 'Drag & Drop',            desc: 'Réorganise tes tâches en un glisser-déposer fluide et intuitif.',                          gradient: 'from-orange-500 to-amber-400',  back: 'from-orange-900/80 to-amber-900/80'  },
  { icon: Zap,          title: 'Ultra rapide',           desc: 'Next.js 16 + Supabase — zéro latence, données synchronisées en temps réel.',              gradient: 'from-yellow-500 to-orange-400', back: 'from-yellow-900/80 to-orange-900/80' },
  { icon: Brain,        title: 'IA Claude',              desc: 'Suggestions intelligentes basées sur tes habitudes. L\'IA qui planifie avec toi.',         gradient: 'from-pink-500 to-rose-400',     back: 'from-pink-900/80 to-rose-900/80'     },
]

const TESTIMONIALS = [
  { name: 'Sophie M.', role: 'Cheffe de projet', text: 'Je gère mes 20 tâches quotidiennes 3× plus vite. L\'IA m\'impressionne chaque jour.', initials: 'SM', color: 'from-blue-500 to-violet-500'   },
  { name: 'Karim B.',  role: 'Développeur',       text: 'Le drag & drop et les graphiques changent vraiment tout. Interface parfaite.',         initials: 'KB', color: 'from-emerald-500 to-cyan-500' },
  { name: 'Léa D.',    role: 'Designer',           text: 'Enfin une app de tâches aussi belle que fonctionnelle. Le design est dingue.',        initials: 'LD', color: 'from-pink-500 to-rose-500'    },
]

const TASK_PREVIEW = [
  { title: 'Finaliser la présentation Q3', cat: '💼', done: true,  color: '#EF4444' },
  { title: 'Réunion équipe produit 14h',   cat: '🚀', done: true,  color: '#F97316' },
  { title: 'Revoir le design system',      cat: '🌸', done: false, color: '#F97316' },
  { title: 'Envoyer le rapport mensuel',   cat: '💼', done: false, color: '#22C55E' },
]

const AVATARS = ['SM', 'KB', 'LD', 'AR', 'PG']

/* ─────────────── BACKGROUND ─────────────── */

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage:
          'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, #020817 75%)',
      }} />
    </div>
  )
}

/* Aurora UI — CSS pur (zéro JS, GPU only) */
function Aurora() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none aurora-container" style={{ zIndex: 0 }}>
      <div className="aurora-blob aurora-blue" />
      <div className="aurora-blob aurora-violet" />
      <div className="aurora-blob aurora-cyan" />
    </div>
  )
}

/* Formes décoratives — CSS only pour la perf */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-blue-500/8 shape-spin-slow" />
      <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full border border-cyan-500/6 shape-spin-reverse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border border-blue-500/6" />
      <div className="absolute top-1/3 -right-10 w-40 h-40 border border-violet-500/8 shape-spin-slow" style={{ borderRadius: '30%' }} />
    </div>
  )
}

/* ─────────────── ORB 3D ─────────────── */

function Orb3D() {
  const ring = (i: number, o: number) =>
    `radial-gradient(circle, transparent ${i - 1}%, black ${i}%, black ${o}%, transparent ${o + 1}%)`

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center flex-shrink-0"
         style={{ perspective: '1100px' }}>
      <div className="absolute inset-8 rounded-full blur-[90px] opacity-30 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 40% 45%, #f97316 0%, #3b82f6 55%, transparent 80%)' }} />

      <motion.div
        animate={{ rotateY: [-8, 8, -8], rotateX: [5, -3, 5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[420px] h-[420px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Corps bleu métallique */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 33% 28%, #6cb4ff 0%, #2b72d8 18%, #0d3d8f 38%, #051e55 60%, #020c28 80%)',
          WebkitMask: ring(32, 52), mask: ring(32, 52),
        }} />
        {/* Reflet haut-gauche */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 22% 18%, rgba(160,215,255,0.95) 0%, rgba(80,160,255,0.55) 20%, transparent 48%)',
          WebkitMask: ring(32, 52), mask: ring(32, 52),
        }} />
        {/* Ombre bas-droite */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 80% 82%, rgba(0,0,0,0.97) 0%, transparent 42%)',
          WebkitMask: ring(32, 52), mask: ring(32, 52),
        }} />
        {/* Face intérieure orange-rose */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 46% 40%, #ffaa55 0%, #ff5577 28%, #cc1055 55%, #7a0030 82%)',
          WebkitMask: ring(28, 36), mask: ring(28, 36),
        }} />
        {/* Anneau intérieur bleu */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 36% 30%, #4a90e8 0%, #1a52a8 30%, #08246a 62%, #030e30 85%)',
          WebkitMask: ring(19, 30), mask: ring(19, 30),
        }} />
        {/* Reflet anneau interne */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 26% 22%, rgba(130,195,255,0.9) 0%, rgba(60,140,240,0.4) 25%, transparent 52%)',
          WebkitMask: ring(19, 30), mask: ring(19, 30),
        }} />
        {/* Face intérieure interne */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 48% 44%, #ff9944 0%, #ff4466 35%, #bb1144 62%, transparent 80%)',
          WebkitMask: ring(17, 22), mask: ring(17, 22),
        }} />
        {/* Trou central */}
        <div className="absolute inset-[29%] rounded-full" style={{
          background: 'radial-gradient(ellipse at 35% 30%, #040f22 0%, #010810 100%)',
          boxShadow: 'inset 0 0 28px rgba(0,0,0,1)',
        }} />
        {/* Halo externe */}
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-20 pointer-events-none" style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 65%)',
        }} />
      </motion.div>
    </div>
  )
}

/* ─────────────── BENTO GRID (Features) ─────────────── */

const BENTO_ITEMS = [
  {
    size: 'md:col-span-2 md:row-span-2',
    icon: Brain,
    title: 'IA Claude intégrée',
    desc: 'Anthropic Claude analyse tes habitudes et te suggère les meilleures tâches à faire maintenant. Plus besoin de réfléchir — l\'IA planifie pour toi.',
    gradient: 'from-violet-500 to-pink-500',
    glow: 'rgba(139,92,246,0.15)',
    big: true,
  },
  {
    size: 'md:col-span-1 md:row-span-1',
    icon: CheckCircle2,
    title: 'Suivi temps réel',
    desc: 'Progression instantanée.',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'rgba(59,130,246,0.12)',
    big: false,
  },
  {
    size: 'md:col-span-1 md:row-span-1',
    icon: Bell,
    title: 'Rappels',
    desc: 'Notifications 5 min avant.',
    gradient: 'from-emerald-500 to-teal-400',
    glow: 'rgba(16,185,129,0.12)',
    big: false,
  },
  {
    size: 'md:col-span-1 md:row-span-2',
    icon: BarChart2,
    title: 'Statistiques',
    desc: 'Graphiques de productivité par catégorie, priorité et tendances sur 7 jours.',
    gradient: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.12)',
    big: false,
  },
  {
    size: 'md:col-span-2 md:row-span-1',
    icon: GripVertical,
    title: 'Drag & Drop fluide',
    desc: 'Réorganise toutes tes tâches en un glisser-déposer.',
    gradient: 'from-pink-500 to-rose-400',
    glow: 'rgba(236,72,153,0.12)',
    big: false,
  },
  {
    size: 'md:col-span-1 md:row-span-1',
    icon: Zap,
    title: 'Ultra rapide',
    desc: 'Zéro latence.',
    gradient: 'from-yellow-500 to-orange-400',
    glow: 'rgba(234,179,8,0.12)',
    big: false,
  },
]

function BentoCard({ item, index }: { item: typeof BENTO_ITEMS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative rounded-3xl border border-white/[0.08] overflow-hidden p-6 flex flex-col ${item.size} cursor-default transition-all`}
      style={{
        background: `radial-gradient(ellipse at top left, ${item.glow} 0%, rgba(2,8,23,0.95) 60%)`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px ${item.glow}`,
      }}
    >
      {/* Reflet haut */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      {/* Icône */}
      <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg flex-shrink-0`}
           style={{ boxShadow: `0 0 20px ${item.glow}` }}>
        <item.icon size={item.big ? 24 : 20} className="text-white" />
      </div>

      {/* Texte */}
      <h3 className={`text-white font-bold leading-tight mb-2 ${item.big ? 'text-[22px]' : 'text-[15px]'}`}>
        {item.title}
      </h3>
      <p className={`text-gray-500 leading-relaxed ${item.big ? 'text-[14px]' : 'text-[12px]'} ${item.big ? '' : 'line-clamp-2'}`}>
        {item.desc}
      </p>

      {/* Gradient décoratif en bas pour les grandes cartes */}
      {item.big && (
        <div className={`absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-10 pointer-events-none`} />
      )}
    </motion.div>
  )
}

/* ─────────────── TILT CARD (Testimonials) ─────────────── */

function TiltCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })
  const glowX   = useTransform(x, [-0.5, 0.5], [0, 100])
  const glowY   = useTransform(y, [-0.5, 0.5], [0, 100])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width  - 0.5)
    y.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0) }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 cursor-default overflow-hidden"
    >
      {/* Reflet dynamique qui suit la souris */}
      <motion.div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, white, transparent)`,
          left: glowX.get() + '%',
          top:  glowY.get() + '%',
          x: '-50%', y: '-50%',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Contenu avec profondeur Z */}
      <div style={{ transform: 'translateZ(20px)' }}>
        <div className="flex mb-3">
          {[...Array(5)].map((_, s) => (
            <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
            {t.initials}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{t.name}</p>
            <p className="text-gray-600 text-xs">{t.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────── DASHBOARD PREVIEW ─────────────── */

function DashboardPreview() {
  return (
    <div className="w-full h-full bg-[#0A0F1E] rounded-2xl overflow-hidden flex text-left">
      {/* Sidebar */}
      <div className="w-48 bg-[#06091A] border-r border-white/5 p-4 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-black shadow-[0_0_12px_rgba(59,130,246,0.5)]">T</div>
          <span className="text-white font-bold text-sm">TaskFlow</span>
        </div>
        {[
          { label: 'Dashboard',    active: false },
          { label: 'Mes Tâches',   active: true  },
          { label: 'Calendrier',   active: false },
          { label: 'Statistiques', active: false },
          { label: 'IA Suggest',   active: false },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            item.active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-blue-400' : 'bg-gray-700'}`} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-base">Bonjour, Sophie 👋</h3>
            <p className="text-gray-600 text-xs">Lundi 19 mai 2026</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium">🔥 7 jours de suite</div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total', value: '12', gradient: 'from-blue-500 to-cyan-400' },
            { label: 'Faites', value: '8', gradient: 'from-emerald-500 to-teal-400' },
            { label: 'En cours', value: '4', gradient: 'from-orange-500 to-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3">
              <p className="text-gray-600 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1"><span>Progression</span><span className="text-blue-400 font-semibold">75%</span></div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {TASK_PREVIEW.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${t.done ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                {t.done && <span className="text-white text-[8px] font-bold">✓</span>}
              </div>
              <span className={`text-xs font-medium flex-1 ${t.done ? 'line-through text-gray-700' : 'text-gray-300'}`}>{t.title}</span>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span className="text-sm">{t.cat}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────── SPLASH SCREEN ─────────────── */

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    // Plus court sur mobile pour réduire le TBT
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const t = setTimeout(onDone, isMobile ? 2000 : 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#020817' }}
    >
      {/* Grille de fond */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Rings radar qui pulsent */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-500/20"
          initial={{ width: 80, height: 80, opacity: 0.8 }}
          animate={{ width: 600, height: 600, opacity: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
        />
      ))}

      {/* Glow central */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute w-64 h-64 rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)' }}
      />

      {/* Logo T */}
      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 220, damping: 18 }}
        className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-7 z-10"
        style={{ boxShadow: '0 0 70px rgba(59,130,246,0.65), 0 0 140px rgba(59,130,246,0.25)' }}
      >
        <span className="text-white font-black text-5xl">T</span>
        {/* Shine */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-3xl" />
        </div>
      </motion.div>

      {/* "TaskFlow" lettre par lettre */}
      <div className="flex items-center gap-0.5 mb-3 z-10">
        {'TaskFlow'.split('').map((l, i) => (
          <motion.span
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 + i * 0.06, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="text-[42px] font-black text-white tracking-tight leading-none"
          >
            {l}
          </motion.span>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.3em] mb-14 z-10"
      >
        Organisé · Rapide · Intelligent
      </motion.p>

      {/* Barre de chargement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="w-52 h-[2px] bg-white/5 rounded-full overflow-hidden z-10"
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 1.6, ease: [0.33, 1, 0.68, 1] }}
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full"
        />
      </motion.div>

      {/* Texte "Chargement" */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-gray-700 text-[10px] font-semibold uppercase tracking-widest mt-3 z-10"
      >
        Chargement…
      </motion.p>
    </motion.div>
  )
}

/* ─────────────── CUSTOM CURSOR (desktop only) ─────────────── */

function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const scale = useMotionValue(1)
  const [visible, setVisible] = useState(false)

  const dotX  = useSpring(x, { stiffness: 900, damping: 45 })
  const dotY  = useSpring(y, { stiffness: 900, damping: 45 })
  const ringX = useSpring(x, { stiffness: 160, damping: 22 })
  const ringY = useSpring(y, { stiffness: 160, damping: 22 })

  useEffect(() => {
    // Désactiver sur mobile/tactile
    if (window.matchMedia('(hover: none)').matches) return
    setVisible(true)
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const onDown = () => scale.set(0.65)
    const onUp   = () => scale.set(1)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [x, y, scale])

  if (!visible) return null

  return (
    <>
      <motion.div
        style={{ x: dotX, y: dotY, scale, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none z-[9999] mix-blend-difference"
      />
      <motion.div
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-blue-400/50 pointer-events-none z-[9998]"
      />
    </>
  )
}

/* ─────────────── MARQUEE ─────────────── */

const MARQUEE_ITEMS = [
  { text: 'Next.js 16', emoji: '⚡' },
  { text: 'Supabase',   emoji: '🗄️' },
  { text: 'TypeScript', emoji: '📘' },
  { text: 'IA Claude',  emoji: '🤖' },
  { text: 'Tailwind CSS', emoji: '🎨' },
  { text: 'Framer Motion', emoji: '✨' },
  { text: 'NextAuth',   emoji: '🔐' },
  { text: 'Temps réel', emoji: '🔴' },
  { text: 'Dark Mode',  emoji: '🌑' },
  { text: 'Drag & Drop', emoji: '🖱️' },
]

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-4 my-2">
      {/* Fades gauche/droite */}
      <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(90deg, #020817, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(-90deg, #020817, transparent)' }} />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex gap-10 whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-gray-600 text-[12px] font-bold uppercase tracking-[0.18em]">
            <span className="text-base">{item.emoji}</span>
            {item.text}
            <span className="inline-block w-1 h-1 rounded-full bg-white/10 ml-4" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─────────────── COMPTEURS ANIMÉS ─────────────── */

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    const ctrl = animate(0, to, {
      duration: 2.2,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = (to < 10 ? v.toFixed(1) : Math.round(v).toLocaleString('fr-FR')) + suffix
      },
    })
    return () => ctrl.stop()
  }, [to, suffix])

  return <span ref={nodeRef}>0{suffix}</span>
}

const STATS = [
  { value: 2400,   suffix: '+',  label: 'Utilisateurs actifs', emoji: '👥' },
  { value: 98,     suffix: '%',  label: 'Satisfaction client',  emoji: '⭐' },
  { value: 150000, suffix: '+',  label: 'Tâches complétées',   emoji: '✅' },
  { value: 4.9,    suffix: '/5', label: 'Note moyenne',         emoji: '🏆' },
]

function StatsSection() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-10 z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, borderColor: 'rgba(59,130,246,0.2)' }}
            className="relative text-center p-6 rounded-2xl border border-white/[0.06] overflow-hidden transition-all cursor-default"
            style={{ background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.06) 0%, rgba(2,8,23,0.9) 70%)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="text-2xl mb-3">{s.emoji}</div>
            <div className="text-[36px] font-black text-white leading-none mb-2">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <p className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────── PAGE ─────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const [splash, setSplash] = useState(true)

  return (
    <>
    <AnimatePresence>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
    </AnimatePresence>

    <div className="min-h-screen bg-[#020817] overflow-x-hidden text-white relative">
      <CustomCursor />
      <Aurora />

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ background: 'rgba(2,8,23,0.88)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.45)]">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="font-bold text-[18px] tracking-tight">TaskFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            {['Fonctionnalités', 'Témoignages', 'Tarifs'].map(l => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2">Connexion</Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(59,130,246,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
              >
                Commencer — Gratuit
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 min-h-[90vh] flex items-center gap-12 overflow-hidden">
        <GridBackground />
        <FloatingShapes />

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[13px] font-semibold px-4 py-2 rounded-full mb-7"
          >
            <Sparkles size={13} />
            Nouveau — IA Claude intégrée
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          </motion.span>

          <h1 className="text-[58px] md:text-[74px] font-black leading-[1.0] mb-6 tracking-tight">
            Tes tâches,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              organisées
            </span>
            <br />
            avec style.
          </h1>

          <p className="text-[18px] text-gray-400 max-w-lg mb-10 leading-relaxed">
            L&apos;app de gestion de tâches alimentée par l&apos;IA.
            Drag &amp; drop, statistiques, rappels — tout ce qu&apos;il faut pour{' '}
            <span className="text-white font-semibold">accomplir plus</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.04, y: -3, boxShadow: '0 0 60px rgba(59,130,246,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[16px] px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.35)] transition-all"
              >
                Créer mon espace gratuit <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.25)' }}
                className="flex items-center gap-2 text-[16px] font-semibold text-gray-400 hover:text-white px-6 py-4 rounded-2xl border border-white/10 transition-all"
              >
                J&apos;ai déjà un compte
              </motion.button>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {AVATARS.map((n, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 border-2 border-[#020817] flex items-center justify-center text-white text-[10px] font-bold">
                  {n}
                </div>
              ))}
            </div>
            <div>
              <span className="text-yellow-400">★★★★★</span>
              <span className="ml-2">+2 400 utilisateurs actifs</span>
            </div>
          </div>
        </motion.div>

        {/* Right — Orb 3D */}
        <motion.div
          style={{ y: orbY }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="hidden lg:block flex-shrink-0"
        >
          <Orb3D />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="relative z-10">
        <Marquee />
      </div>

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── CONTAINER SCROLL ── */}
      <ContainerScroll
        titleComponent={
          <div className="text-center mb-4">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-500 text-sm px-4 py-1.5 rounded-full mb-5"
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Interface intuitive
            </motion.span>
            <h2 className="text-[42px] md:text-[56px] font-black text-white mb-4 tracking-tight leading-tight">
              Un tableau de bord{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">pensé pour toi</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Visualise tes tâches, suis ta progression, laisse l&apos;IA t&apos;aider.</p>
          </div>
        }
      >
        <DashboardPreview />
      </ContainerScroll>

      {/* ── FEATURES — BENTO GRID ── */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-500 text-sm px-4 py-1.5 rounded-full mb-5"
          >
            <Sparkles size={12} className="text-blue-400" />
            Fonctionnalités
          </motion.span>
          <h2 className="text-[42px] font-black text-white mb-4 tracking-tight">
            Tout ce qu&apos;il te faut
          </h2>
          <p className="text-gray-500 text-lg">Conçu pour la vraie productivité.</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 md:h-[560px]">
          {BENTO_ITEMS.map((item, i) => (
            <BentoCard key={i} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS — TILT 3D ── */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 z-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[40px] font-black text-white text-center mb-12 tracking-tight"
        >
          Ils adorent{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">TaskFlow</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ perspective: '1000px' }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <TiltCard t={t} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl border border-blue-500/20 p-14 text-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.14) 0%, rgba(2,8,23,0.95) 70%)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.18) 0%, transparent 60%)' }} />

          {/* Formes décoratives CTA */}
          <motion.div
            animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 right-8 w-16 h-16 rounded-full border border-blue-500/10 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-4 left-8 w-10 h-10 rounded-full border border-cyan-500/10 pointer-events-none"
          />

          <div className="relative z-10">
            <h2 className="text-[46px] font-black text-white mb-4 tracking-tight leading-tight">
              Prêt à changer ta{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">productivité ?</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
              Rejoins des milliers d&apos;utilisateurs qui organisent leur journée avec TaskFlow.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -4, boxShadow: '0 0 80px rgba(59,130,246,0.6)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[18px] px-11 py-5 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all"
              >
                Commencer gratuitement <ArrowRight size={20} />
              </motion.button>
            </Link>
            <p className="text-gray-700 text-sm mt-5">Aucune carte bancaire • Gratuit pour toujours</p>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)]">
            <span className="text-white font-black text-xs">T</span>
          </div>
          <span className="font-bold text-white text-sm">TaskFlow</span>
        </div>
        <p className="text-gray-700 text-sm">© 2026 TaskFlow — Fait avec ❤️ et IA</p>
      </footer>
    </div>
    </>
  )
}
