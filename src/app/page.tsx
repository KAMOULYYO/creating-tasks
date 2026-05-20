/**
 * Landing page — Server Component (zero client JS on initial render)
 * Heavy interactive sections are lazy-loaded via next/dynamic.
 */
import Link from 'next/link'
import {
  ArrowRight, Sparkles, Brain, CheckCircle2,
  Bell, BarChart2, GripVertical, Zap,
} from 'lucide-react'
import {
  LazyClientEffects,
  LazyContainerScroll,
  LazyTiltCards,
} from '@/components/landing/DynamicSections'

/* ─────────────── DATA ─────────────── */

const AVATARS = ['SM', 'KB', 'LD', 'AR', 'PG']

const MARQUEE_ITEMS = [
  { text: 'Next.js 16',    emoji: '⚡' },
  { text: 'Supabase',      emoji: '🗄️' },
  { text: 'TypeScript',    emoji: '📘' },
  { text: 'IA Claude',     emoji: '🤖' },
  { text: 'Tailwind CSS',  emoji: '🎨' },
  { text: 'Framer Motion', emoji: '✨' },
  { text: 'NextAuth',      emoji: '🔐' },
  { text: 'Temps réel',    emoji: '🔴' },
  { text: 'Dark Mode',     emoji: '🌑' },
  { text: 'Drag & Drop',   emoji: '🖱️' },
]

const STATS = [
  { value: '2 400+', label: 'Utilisateurs actifs', emoji: '👥' },
  { value: '98%',    label: 'Satisfaction client',  emoji: '⭐' },
  { value: '150K+',  label: 'Tâches complétées',    emoji: '✅' },
  { value: '4.9/5',  label: 'Note moyenne',          emoji: '🏆' },
]

const BENTO_ITEMS = [
  {
    size: 'md:col-span-2 md:row-span-2',
    icon: Brain, title: 'IA Claude intégrée',
    desc: 'Anthropic Claude analyse tes habitudes et te suggère les meilleures tâches à faire maintenant. Plus besoin de réfléchir — l\'IA planifie pour toi.',
    gradient: 'from-violet-500 to-pink-500', glow: 'rgba(139,92,246,0.15)', big: true,
  },
  {
    size: 'md:col-span-1 md:row-span-1',
    icon: CheckCircle2, title: 'Suivi temps réel',
    desc: 'Progression instantanée.',
    gradient: 'from-blue-500 to-cyan-400', glow: 'rgba(59,130,246,0.12)', big: false,
  },
  {
    size: 'md:col-span-1 md:row-span-1',
    icon: Bell, title: 'Rappels intelligents',
    desc: 'Notifications 5 min avant.',
    gradient: 'from-emerald-500 to-teal-400', glow: 'rgba(16,185,129,0.12)', big: false,
  },
  {
    size: 'md:col-span-1 md:row-span-2',
    icon: BarChart2, title: 'Statistiques',
    desc: 'Graphiques de productivité par catégorie, priorité et tendances sur 7 jours.',
    gradient: 'from-orange-500 to-amber-400', glow: 'rgba(249,115,22,0.12)', big: false,
  },
  {
    size: 'md:col-span-2 md:row-span-1',
    icon: GripVertical, title: 'Drag & Drop fluide',
    desc: 'Réorganise toutes tes tâches en un glisser-déposer.',
    gradient: 'from-pink-500 to-rose-400', glow: 'rgba(236,72,153,0.12)', big: false,
  },
  {
    size: 'md:col-span-1 md:row-span-1',
    icon: Zap, title: 'Ultra rapide',
    desc: 'Zéro latence.',
    gradient: 'from-yellow-500 to-orange-400', glow: 'rgba(234,179,8,0.12)', big: false,
  },
]

/* ─────────────── CSS-ONLY COMPONENTS ─────────────── */

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage:
          'linear-gradient(rgba(99,179,237,1) 1px,transparent 1px),' +
          'linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center,transparent 20%,#020817 75%)',
      }} />
    </div>
  )
}

function Aurora() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="aurora-blob aurora-blue" />
      <div className="aurora-blob aurora-violet" />
      <div className="aurora-blob aurora-cyan" />
    </div>
  )
}

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-blue-500/8 shape-spin-slow" />
      <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full border border-cyan-500/6 shape-spin-reverse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border border-blue-500/6" />
      <div className="absolute top-1/3 -right-10 w-40 h-40 border border-violet-500/8 shape-spin-slow"
           style={{ borderRadius: '30%' }} />
    </div>
  )
}

/** Orb 3D — pure CSS animation (no framer-motion) */
function Orb3D() {
  const ring = (i: number, o: number) =>
    `radial-gradient(circle,transparent ${i - 1}%,black ${i}%,black ${o}%,transparent ${o + 1}%)`

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center flex-shrink-0">
      {/* Glow externe */}
      <div className="absolute inset-8 rounded-full blur-[90px] opacity-30 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 40% 45%,#f97316 0%,#3b82f6 55%,transparent 80%)' }} />

      {/* Orb flotant — CSS animation */}
      <div className="relative w-[420px] h-[420px] orb-float">
        {/* Corps bleu métallique */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 33% 28%,#6cb4ff 0%,#2b72d8 18%,#0d3d8f 38%,#051e55 60%,#020c28 80%)',
          WebkitMask: ring(32, 52), mask: ring(32, 52),
        }} />
        {/* Reflet haut-gauche */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 22% 18%,rgba(160,215,255,.95) 0%,rgba(80,160,255,.55) 20%,transparent 48%)',
          WebkitMask: ring(32, 52), mask: ring(32, 52),
        }} />
        {/* Ombre bas-droite */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 80% 82%,rgba(0,0,0,.97) 0%,transparent 42%)',
          WebkitMask: ring(32, 52), mask: ring(32, 52),
        }} />
        {/* Face intérieure orange-rose */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 46% 40%,#ffaa55 0%,#ff5577 28%,#cc1055 55%,#7a0030 82%)',
          WebkitMask: ring(28, 36), mask: ring(28, 36),
        }} />
        {/* Anneau intérieur bleu */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 36% 30%,#4a90e8 0%,#1a52a8 30%,#08246a 62%,#030e30 85%)',
          WebkitMask: ring(19, 30), mask: ring(19, 30),
        }} />
        {/* Reflet anneau interne */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 26% 22%,rgba(130,195,255,.9) 0%,rgba(60,140,240,.4) 25%,transparent 52%)',
          WebkitMask: ring(19, 30), mask: ring(19, 30),
        }} />
        {/* Face intérieure interne */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(ellipse at 48% 44%,#ff9944 0%,#ff4466 35%,#bb1144 62%,transparent 80%)',
          WebkitMask: ring(17, 22), mask: ring(17, 22),
        }} />
        {/* Trou central */}
        <div className="absolute inset-[29%] rounded-full" style={{
          background: 'radial-gradient(ellipse at 35% 30%,#040f22 0%,#010810 100%)',
          boxShadow: 'inset 0 0 28px rgba(0,0,0,1)',
        }} />
        {/* Halo externe */}
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-20 pointer-events-none" style={{
          background: 'radial-gradient(circle,#3b82f6 0%,transparent 65%)',
        }} />
      </div>
    </div>
  )
}

/** Marquee — pure CSS scroll animation */
function MarqueeSection() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-4 my-2">
      <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(90deg,#020817,transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(-90deg,#020817,transparent)' }} />
      <div className="marquee-track flex gap-10 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-gray-600 text-[12px] font-bold uppercase tracking-[.18em]">
            <span className="text-base">{item.emoji}</span>
            {item.text}
            <span className="inline-block w-1 h-1 rounded-full bg-white/10 ml-4" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** Stats — static numbers (no CountUp JS) */
function StatsSection() {
  return (
    <section aria-label="Chiffres clés" className="relative max-w-6xl mx-auto px-6 py-10 z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i}
            className="relative text-center p-6 rounded-2xl border border-white/[0.06] overflow-hidden hover-lift cursor-default"
            style={{ background: 'radial-gradient(ellipse at top,rgba(59,130,246,.06) 0%,rgba(2,8,23,.9) 70%)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="text-2xl mb-3" aria-hidden="true">{s.emoji}</div>
            <div className="text-[36px] font-black text-white leading-none mb-2">{s.value}</div>
            <p className="text-gray-500 text-[12px] font-semibold uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Bento grid — pure CSS hover */
function BentoGrid() {
  return (
    <section aria-label="Fonctionnalités" className="relative max-w-6xl mx-auto px-6 py-20 z-10">
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-500 text-sm px-4 py-1.5 rounded-full mb-5">
          <Sparkles size={12} className="text-blue-400" />
          Fonctionnalités
        </span>
        <h2 className="text-[42px] font-black text-white mb-4 tracking-tight">
          Tout ce qu&apos;il te faut
        </h2>
        <p className="text-gray-500 text-lg">Conçu pour la vraie productivité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 md:h-[560px]">
        {BENTO_ITEMS.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i}
              className={`bento-card relative rounded-3xl border border-white/[0.08] overflow-hidden p-6 flex flex-col ${item.size}`}
              style={{
                background: `radial-gradient(ellipse at top left,${item.glow} 0%,rgba(2,8,23,.95) 60%)`,
                boxShadow: `0 0 0 1px rgba(255,255,255,.04),0 8px 40px ${item.glow}`,
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
              <div
                className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg flex-shrink-0`}
                style={{ boxShadow: `0 0 20px ${item.glow}` }}
              >
                <Icon size={item.big ? 24 : 20} className="text-white" />
              </div>
              <h3 className={`text-white font-bold leading-tight mb-2 ${item.big ? 'text-[22px]' : 'text-[15px]'}`}>
                {item.title}
              </h3>
              <p className={`text-gray-500 leading-relaxed ${item.big ? 'text-[14px]' : 'text-[12px]'} ${item.big ? '' : 'line-clamp-2'}`}>
                {item.desc}
              </p>
              {item.big && (
                <div className={`absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-10 pointer-events-none`} />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─────────────── PAGE ─────────────── */

export default function LandingPage() {
  return (
    <>
      {/* Effets client (splash + cursor) — chargés après le rendu initial */}
      <LazyClientEffects />

      <div className="min-h-screen bg-[#020817] overflow-x-hidden text-white relative">
        <Aurora />

        {/* ── NAV ── */}
        <nav
          aria-label="Navigation principale"
          className="anim-nav sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
          style={{ background: 'rgba(2,8,23,.88)' }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,.45)]"
                   aria-hidden="true">
                <span className="text-white font-black text-sm">T</span>
              </div>
              <span className="font-bold text-[18px] tracking-tight">TaskFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-500" aria-hidden="true">
              {['Fonctionnalités', 'Témoignages', 'Tarifs'].map(l => (
                <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login"
                className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2">
                Connexion
              </Link>
              <Link href="/register"
                className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,.3)] hover-scale inline-block">
                Commencer — Gratuit
              </Link>
            </div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main>
          {/* ── HERO ── */}
          <section
            aria-label="Hero"
            className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 min-h-[90vh] flex items-center gap-12 overflow-hidden"
          >
            <GridBackground />
            <FloatingShapes />

            {/* Left */}
            <div className="flex-1 z-10 anim-fade-up">
              <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[13px] font-semibold px-4 py-2 rounded-full mb-7 anim-fade-up d2">
                <Sparkles size={13} aria-hidden="true" />
                Nouveau — IA Claude intégrée
                <span className="w-2 h-2 bg-blue-400 rounded-full pulse-dot" aria-hidden="true" />
              </span>

              <h1 className="text-[58px] md:text-[74px] font-black leading-[1.0] mb-6 tracking-tight anim-fade-up d3">
                Tes tâches,
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  organisées
                </span>
                <br />
                avec style.
              </h1>

              <p className="text-[18px] text-gray-400 max-w-lg mb-10 leading-relaxed anim-fade-up d4">
                L&apos;app de gestion de tâches alimentée par l&apos;IA.
                Drag &amp; drop, statistiques, rappels — tout ce qu&apos;il faut pour{' '}
                <span className="text-white font-semibold">accomplir plus</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 anim-fade-up d5">
                <Link href="/register"
                  className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[16px] px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,.35)] hover-lift transition-all">
                  Créer mon espace gratuit <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/login"
                  className="flex items-center gap-2 text-[16px] font-semibold text-gray-400 hover:text-white px-6 py-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all">
                  J&apos;ai déjà un compte
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500 anim-fade-up d6">
                <div className="flex -space-x-2" aria-hidden="true">
                  {AVATARS.map((n, i) => (
                    <div key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 border-2 border-[#020817] flex items-center justify-center text-white text-[10px] font-bold">
                      {n}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-yellow-400" aria-label="5 étoiles">★★★★★</span>
                  <span className="ml-2">+2 400 utilisateurs actifs</span>
                </div>
              </div>
            </div>

            {/* Right — Orb 3D (CSS animation) */}
            <div className="hidden lg:block flex-shrink-0 anim-fade-up d6" aria-hidden="true">
              <Orb3D />
            </div>
          </section>

          {/* ── MARQUEE ── */}
          <div className="relative z-10">
            <MarqueeSection />
          </div>

          {/* ── STATS ── */}
          <StatsSection />

          {/* ── CONTAINER SCROLL (lazy — client only) ── */}
          <LazyContainerScroll />

          {/* ── BENTO GRID ── */}
          <BentoGrid />

          {/* ── TESTIMONIALS — TILT 3D (lazy — client only) ── */}
          <LazyTiltCards />

          {/* ── CTA ── */}
          <section aria-label="Appel à l'action" className="relative max-w-6xl mx-auto px-6 py-20 z-10">
            <div
              className="relative rounded-3xl border border-blue-500/20 p-14 text-center overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at center,rgba(37,99,235,.14) 0%,rgba(2,8,23,.95) 70%)' }}
            >
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(59,130,246,.18) 0%,transparent 60%)' }} />
              <div className="absolute top-4 right-8 w-16 h-16 rounded-full border border-blue-500/10 pointer-events-none shape-spin-slow" aria-hidden="true" />
              <div className="absolute bottom-4 left-8 w-10 h-10 rounded-full border border-cyan-500/10 pointer-events-none shape-spin-reverse" aria-hidden="true" />

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
                <Link href="/register"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[18px] px-11 py-5 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,.4)] hover-lift transition-all">
                  Commencer gratuitement <ArrowRight size={20} aria-hidden="true" />
                </Link>
                <p className="text-gray-700 text-sm mt-5">Aucune carte bancaire • Gratuit pour toujours</p>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="border-t border-white/5 py-8 px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,.4)]"
                   aria-hidden="true">
                <span className="text-white font-black text-xs">T</span>
              </div>
              <span className="font-bold text-white text-sm">TaskFlow</span>
            </div>
            <p className="text-gray-700 text-sm">© 2026 TaskFlow — Fait avec ❤️ et IA</p>
          </footer>
        </main>
      </div>
    </>
  )
}
