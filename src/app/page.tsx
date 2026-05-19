'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { CheckCircle2, Zap, Bell, BarChart2, GripVertical, Star, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: <CheckCircle2 size={22} />, title: 'Suivi en temps réel',   desc: 'Coche tes tâches et vois ta progression instantanément.' },
  { icon: <BarChart2    size={22} />, title: 'Statistiques visuelles', desc: 'Graphiques de productivité par catégorie et priorité.' },
  { icon: <Bell         size={22} />, title: 'Rappels intelligents',   desc: 'Notifications navigateur 5 min avant chaque tâche.' },
  { icon: <GripVertical size={22} />, title: 'Drag & Drop',            desc: 'Réorganise tes tâches en un glisser-déposer.' },
  { icon: <Zap          size={22} />, title: 'Ultra rapide',           desc: 'Next.js 16 + Supabase — zéro latence, données en direct.' },
  { icon: <Star         size={22} />, title: 'Streak quotidien',       desc: 'Construis une habitude avec ton compteur de jours consécutifs.' },
]

const TESTIMONIALS = [
  { name: 'Sophie M.',  role: 'Cheffe de projet', text: 'Je gère mes 20 tâches quotidiennes 3x plus vite qu\'avant.', avatar: '👩‍💼' },
  { name: 'Karim B.',   role: 'Développeur',       text: 'Le drag & drop et les graphiques changent tout.', avatar: '👨‍💻' },
  { name: 'Léa D.',     role: 'Designer',           text: 'Enfin une app de tâches aussi belle que fonctionnelle !', avatar: '👩‍🎨' },
]

const TASK_PREVIEW = [
  { title: 'Finaliser la présentation Q3', cat: '💼', done: true,  prio: 'bg-red-400'    },
  { title: 'Réunion équipe produit 14h',   cat: '🚀', done: true,  prio: 'bg-orange-400' },
  { title: 'Revoir le design system',      cat: '🌸', done: false, prio: 'bg-orange-400' },
  { title: 'Envoyer le rapport mensuel',   cat: '💼', done: false, prio: 'bg-green-400'  },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <div className="min-h-screen bg-[#FFF7ED] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#FFF7ED]/80 backdrop-blur-md border-b border-orange-100 px-5 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="font-fredoka text-[20px] font-bold text-orange-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-[14px] font-semibold text-orange-700 hover:text-orange-500 transition-colors px-3 py-1.5">
              Connexion
            </Link>
            <Link href="/register"
              className="text-[14px] font-bold bg-orange-500 text-white px-4 py-2 rounded-full
                shadow-[0_3px_0_rgba(154,52,18,.20)] hover:bg-orange-600 transition-colors">
              Commencer — Gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative max-w-5xl mx-auto px-5 pt-16 pb-12 text-center overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 left-10 w-40 h-40 bg-amber-300/20 rounded-full blur-2xl -z-10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-[13px] font-bold px-4 py-1.5 rounded-full mb-5 border border-orange-200"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Nouveau — Drag & Drop + Statistiques IA
          </motion.span>

          <h1 className="font-fredoka text-[48px] md:text-[64px] font-bold text-orange-900 leading-[1.05] mb-5">
            Tes tâches,{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange-500">organisées</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute bottom-1 left-0 right-0 h-3 bg-orange-200 rounded -z-10 origin-left"
              />
            </span>
            {' '}avec style
          </h1>

          <p className="text-[18px] text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            L&apos;app de gestion de tâches la plus belle et la plus puissante.
            Conçue pour les personnes qui veulent vraiment <strong className="text-orange-700">accomplir plus</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-orange-500 text-white font-fredoka text-[18px] font-semibold
                  px-8 py-4 rounded-2xl shadow-[0_4px_0_rgba(154,52,18,.25),0_8px_30px_rgba(249,115,22,.30)]
                  hover:bg-orange-600 transition-colors"
              >
                Créer mon espace gratuit <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-[16px] font-semibold text-orange-700 px-6 py-4 rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-colors bg-white"
              >
                J&apos;ai déjà un compte
              </motion.button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-1.5 text-[14px] text-slate-400 mb-14">
            {['👩‍💼','👨‍💻','👩‍🎨','🧑‍🔬','👩‍💻'].map((e, i) => (
              <span key={i} className="text-xl -ml-1 first:ml-0 border-2 border-white rounded-full">{e}</span>
            ))}
            <span className="ml-2 font-semibold">+2 400 utilisateurs actifs</span>
            <span className="flex">{'⭐'.repeat(5)}</span>
          </div>
        </motion.div>

        {/* ── PHONE MOCKUP ── */}
        <motion.div
          style={{ y: phoneY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mx-auto w-[280px]"
        >
          {/* Glow */}
          <div className="absolute -inset-6 bg-orange-300/20 rounded-[50px] blur-2xl" />

          {/* Phone */}
          <div className="relative bg-white rounded-[36px] border-[6px] border-orange-200 p-4
            shadow-[0_20px_60px_rgba(249,115,22,.25),0_4px_0_rgba(154,52,18,.15)]">
            {/* Notch */}
            <div className="w-16 h-1.5 bg-orange-200 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-fredoka text-[16px] font-bold text-orange-900">👋 Salut, Sophie !</p>
                <p className="text-[10px] text-slate-400">Lundi 19 mai</p>
              </div>
              <div className="text-right">
                <p className="font-fredoka text-[18px] font-bold text-orange-500">75%</p>
                <p className="text-[10px] text-slate-400">du jour</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-orange-100 rounded-full mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-300 rounded-full"
              />
            </div>

            {/* Task previews */}
            <div className="flex flex-col gap-2">
              {TASK_PREVIEW.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-l-4 ${
                    t.done ? 'bg-green-50 border-green-400 opacity-60' : 'bg-white border-orange-400'
                  } shadow-sm`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    t.done ? 'bg-green-500 border-green-500' : 'border-orange-300'
                  }`}>
                    {t.done && <span className="text-white text-[8px]">✓</span>}
                  </div>
                  <span className={`text-[11px] font-semibold leading-tight flex-1 ${
                    t.done ? 'line-through text-slate-400' : 'text-orange-900'
                  }`}>{t.title}</span>
                  <span className="text-[12px]">{t.cat}</span>
                </motion.div>
              ))}
            </div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-3 flex items-center justify-center gap-1.5 bg-orange-50 rounded-xl p-2 border border-orange-200"
            >
              <span className="text-[16px]">🔥</span>
              <span className="font-fredoka text-[13px] font-bold text-orange-600">7 jours de suite !</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-fredoka text-[38px] font-bold text-orange-900 mb-3">
            Tout ce qu&apos;il te faut 🚀
          </h2>
          <p className="text-[16px] text-slate-500">Des fonctionnalités pensées pour la vraie productivité.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(249,115,22,.18)' }}
              className="bg-white rounded-[24px] border-2 border-orange-100 p-6
                shadow-[0_2px_12px_rgba(249,115,22,.08)] transition-shadow"
            >
              <div className="w-11 h-11 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-fredoka text-[18px] font-bold text-orange-900 mb-1">{f.title}</h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-orange-500 py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-fredoka text-[34px] font-bold text-white text-center mb-10"
          >
            Ils adorent TaskFlow ❤️
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/15 backdrop-blur-sm rounded-[24px] p-5 border border-white/25"
              >
                <p className="text-white/90 text-[14px] leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="font-bold text-white text-[14px]">{t.name}</p>
                    <p className="text-white/60 text-[12px]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="max-w-5xl mx-auto px-5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-fredoka text-[40px] font-bold text-orange-900 mb-4">
            Prêt à changer ta productivité ? 🎯
          </h2>
          <p className="text-[16px] text-slate-500 mb-8 max-w-md mx-auto">
            Rejoins des milliers d&apos;utilisateurs qui organisent leur journée avec TaskFlow.
          </p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-fredoka text-[20px] font-semibold
                px-10 py-5 rounded-2xl shadow-[0_4px_0_rgba(154,52,18,.25),0_12px_40px_rgba(249,115,22,.35)]
                hover:bg-orange-600 transition-colors"
            >
              Commencer gratuitement <ArrowRight size={22} />
            </motion.button>
          </Link>
          <p className="text-[13px] text-slate-400 mt-4">Aucune carte bancaire • Gratuit pour toujours</p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-orange-100 py-6 px-5 text-center">
        <p className="text-[13px] text-slate-400">
          © 2026 TaskFlow — Fait avec ❤️ et ☕
        </p>
      </footer>
    </div>
  )
}
