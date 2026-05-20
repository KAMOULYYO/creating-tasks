'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, Zap, Bell, BarChart2, GripVertical,
  ArrowRight, Brain, Sparkles, Star,
} from 'lucide-react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

/* ─────────────────── DATA ─────────────────── */

const FEATURES = [
  { icon: CheckCircle2, title: 'Suivi en temps réel',    desc: 'Coche tes tâches et vois ta progression instantanément.',           gradient: 'from-blue-500 to-cyan-400'     },
  { icon: BarChart2,    title: 'Statistiques visuelles', desc: 'Graphiques de productivité par catégorie et priorité.',              gradient: 'from-violet-500 to-purple-400' },
  { icon: Bell,         title: 'Rappels intelligents',   desc: 'Notifications navigateur 5 min avant chaque tâche.',                 gradient: 'from-emerald-500 to-teal-400'  },
  { icon: GripVertical, title: 'Drag & Drop',            desc: 'Réorganise tes tâches en un glisser-déposer.',                      gradient: 'from-orange-500 to-amber-400'  },
  { icon: Zap,          title: 'Ultra rapide',           desc: 'Next.js 16 + Supabase — zéro latence, données en direct.',          gradient: 'from-yellow-500 to-orange-400' },
  { icon: Brain,        title: 'IA Claude',              desc: 'Suggestions intelligentes basées sur tes habitudes de travail.',    gradient: 'from-pink-500 to-rose-400'     },
]

const TESTIMONIALS = [
  { name: 'Sophie M.', role: 'Cheffe de projet', text: 'Je gère mes 20 tâches quotidiennes 3× plus vite qu\'avant.', initials: 'SM', color: 'from-blue-500 to-violet-500'    },
  { name: 'Karim B.',  role: 'Développeur',       text: 'Le drag & drop et les graphiques changent vraiment tout.',  initials: 'KB', color: 'from-emerald-500 to-cyan-500'  },
  { name: 'Léa D.',    role: 'Designer',           text: 'Enfin une app de tâches aussi belle que fonctionnelle !',  initials: 'LD', color: 'from-pink-500 to-rose-500'     },
]

const TASK_PREVIEW = [
  { title: 'Finaliser la présentation Q3', cat: '💼', done: true,  color: '#EF4444' },
  { title: 'Réunion équipe produit 14h',   cat: '🚀', done: true,  color: '#F97316' },
  { title: 'Revoir le design system',      cat: '🌸', done: false, color: '#F97316' },
  { title: 'Envoyer le rapport mensuel',   cat: '💼', done: false, color: '#22C55E' },
]

const AVATARS = ['SM', 'KB', 'LD', 'AR', 'PG']

/* ─────────────────── COMPONENTS ─────────────────── */

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #020817 75%)' }}
      />
    </div>
  )
}

function Orb3D() {
  /* helpers pour créer les masques anneau */
  const ring = (i: number, o: number) =>
    `radial-gradient(circle, transparent ${i - 1}%, black ${i}%, black ${o}%, transparent ${o + 1}%)`

  return (
    <div
      className="relative w-[500px] h-[500px] flex items-center justify-center flex-shrink-0"
      style={{ perspective: '1100px' }}
    >
      {/* Halo ambiant bleu-orange */}
      <div
        className="absolute inset-8 rounded-full blur-[90px] opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 40% 45%, #f97316 0%, #3b82f6 55%, transparent 80%)' }}
      />

      {/* Tilt 3D lent */}
      <motion.div
        animate={{ rotateY: [-8, 8, -8], rotateX: [5, -3, 5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[420px] h-[420px]"
        style={{ transformStyle: 'preserve-3d' }}
      >

        {/* ── ANNEAU EXTÉRIEUR — corps bleu métallique ── */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(circle at 33% 28%,
            #6cb4ff 0%, #2b72d8 18%, #0d3d8f 38%, #051e55 60%, #020c28 80%)`,
          WebkitMask: ring(32, 52),
          mask:        ring(32, 52),
        }} />

        {/* Reflet bleu clair en haut-gauche */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(ellipse at 22% 18%,
            rgba(160,215,255,0.95) 0%, rgba(80,160,255,0.55) 20%, transparent 48%)`,
          WebkitMask: ring(32, 52),
          mask:        ring(32, 52),
        }} />

        {/* Ombre sombre en bas-droite */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(ellipse at 80% 82%,
            rgba(0,0,0,0.97) 0%, transparent 42%)`,
          WebkitMask: ring(32, 52),
          mask:        ring(32, 52),
        }} />

        {/* Reflet secondaire bas-gauche (lumière réfléchie) */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(ellipse at 20% 78%,
            rgba(50,120,220,0.5) 0%, transparent 38%)`,
          WebkitMask: ring(32, 52),
          mask:        ring(32, 52),
        }} />

        {/* ── FACE INTÉRIEURE — chaud orange → rose ── */}
        {/* Visible sur le bord intérieur de l'anneau */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(ellipse at 46% 40%,
            #ffaa55 0%, #ff5577 28%, #cc1055 55%, #7a0030 82%)`,
          WebkitMask: ring(28, 36),
          mask:        ring(28, 36),
        }} />

        {/* ── ANNEAU INTÉRIEUR — second tore plus petit ── */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(circle at 36% 30%,
            #4a90e8 0%, #1a52a8 30%, #08246a 62%, #030e30 85%)`,
          WebkitMask: ring(19, 30),
          mask:        ring(19, 30),
        }} />

        {/* Reflet anneau intérieur */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(ellipse at 26% 22%,
            rgba(130,195,255,0.9) 0%, rgba(60,140,240,0.4) 25%, transparent 52%)`,
          WebkitMask: ring(19, 30),
          mask:        ring(19, 30),
        }} />

        {/* Face intérieure anneau interne (rose-orange) */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `radial-gradient(ellipse at 48% 44%,
            #ff9944 0%, #ff4466 35%, #bb1144 62%, transparent 80%)`,
          WebkitMask: ring(17, 22),
          mask:        ring(17, 22),
        }} />

        {/* ── TROU CENTRAL ── */}
        <div className="absolute inset-[29%] rounded-full" style={{
          background: 'radial-gradient(ellipse at 35% 30%, #040f22 0%, #010810 100%)',
          boxShadow:  'inset 0 0 28px rgba(0,0,0,1), inset 0 6px 16px rgba(59,130,246,0.06)',
        }} />

        {/* Lueur orange visible dans le trou (reflet interne) */}
        <div className="absolute inset-[31%] rounded-full" style={{
          background: 'radial-gradient(ellipse at 52% 55%, rgba(255,100,40,0.12) 0%, transparent 70%)',
        }} />

        {/* ── HALO EXTERNE ── */}
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-18 pointer-events-none" style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 65%)',
        }} />

      </motion.div>

    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="w-full h-full bg-[#0A0F1E] rounded-2xl overflow-hidden flex text-left">
      {/* Sidebar */}
      <div className="w-48 bg-[#06091A] border-r border-white/5 p-4 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-black shadow-[0_0_12px_rgba(59,130,246,0.5)]">
            T
          </div>
          <span className="text-white font-bold text-sm">TaskFlow</span>
        </div>
        {[
          { label: 'Dashboard',    active: false },
          { label: 'Mes Tâches',   active: true  },
          { label: 'Calendrier',   active: false },
          { label: 'Statistiques', active: false },
          { label: 'IA Suggest',   active: false },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              item.active
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-blue-400' : 'bg-gray-700'}`} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-base">Bonjour, Sophie 👋</h3>
            <p className="text-gray-600 text-xs">Lundi 19 mai 2026</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium">
            🔥 7 jours de suite
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total',      value: '12', gradient: 'from-blue-500 to-cyan-400'    },
            { label: 'Complétées', value: '8',  gradient: 'from-emerald-500 to-teal-400' },
            { label: 'En cours',   value: '4',  gradient: 'from-orange-500 to-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3">
              <p className="text-gray-600 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progression du jour</span>
            <span className="text-blue-400 font-semibold">75%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="flex flex-col gap-2">
          {TASK_PREVIEW.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                t.done
                  ? 'bg-white/[0.02] border-white/5 opacity-50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  t.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
                }`}
              >
                {t.done && <span className="text-white text-[8px] font-bold">✓</span>}
              </div>
              <span className={`text-xs font-medium flex-1 ${t.done ? 'line-through text-gray-700' : 'text-gray-300'}`}>
                {t.title}
              </span>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
              <span className="text-sm">{t.cat}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────── PAGE ─────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <div className="min-h-screen bg-[#020817] overflow-x-hidden text-white">

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ background: 'rgba(2,8,23,0.88)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.45)]">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="font-bold text-[18px] tracking-tight">TaskFlow</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            {['Fonctionnalités', 'Témoignages', 'Tarifs'].map(l => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2">
              Connexion
            </Link>
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
      <section
        ref={heroRef}
        className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 min-h-[90vh] flex items-center gap-12 overflow-hidden"
      >
        <GridBackground />

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 z-10"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[13px] font-semibold px-4 py-2 rounded-full mb-7"
          >
            <Sparkles size={13} />
            Nouveau — IA Claude intégrée
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          </motion.span>

          {/* Title */}
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

          {/* Buttons */}
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

          {/* Social proof */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {AVATARS.map((n, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 border-2 border-[#020817] flex items-center justify-center text-white text-[10px] font-bold"
                >
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

        {/* Right — 3D Orb */}
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

      {/* ── CONTAINER SCROLL — Dashboard 3D ── */}
      <ContainerScroll
        titleComponent={
          <div className="text-center mb-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-500 text-sm px-4 py-1.5 rounded-full mb-5"
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Interface intuitive
            </motion.span>
            <h2 className="text-[42px] md:text-[56px] font-black text-white mb-4 tracking-tight leading-tight">
              Un tableau de bord{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                pensé pour toi
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Visualise tes tâches, suis ta progression, laisse l&apos;IA t&apos;aider.
            </p>
          </div>
        }
      >
        <DashboardPreview />
      </ContainerScroll>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-[42px] font-black text-white mb-4 tracking-tight">
            Tout ce qu&apos;il te faut
          </h2>
          <p className="text-gray-500 text-lg">Des fonctionnalités pensées pour la vraie productivité.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, borderColor: 'rgba(99,179,237,0.25)' }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 transition-all cursor-default"
            >
              <div className={`w-11 h-11 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-[17px] mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[40px] font-black text-white text-center mb-12 tracking-tight"
        >
          Ils adorent{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 transition-all"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-blue-500/20 p-14 text-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.14) 0%, rgba(2,8,23,0.95) 70%)' }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.18) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <h2 className="text-[46px] font-black text-white mb-4 tracking-tight leading-tight">
              Prêt à changer ta{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                productivité ?
              </span>
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
  )
}
