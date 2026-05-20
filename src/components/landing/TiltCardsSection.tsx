'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sophie M.', role: 'Cheffe de projet',
    text: 'Je gère mes 20 tâches quotidiennes 3× plus vite. L\'IA m\'impressionne chaque jour.',
    initials: 'SM', color: 'from-blue-500 to-violet-500',
  },
  {
    name: 'Karim B.', role: 'Développeur',
    text: 'Le drag & drop et les graphiques changent vraiment tout. Interface parfaite.',
    initials: 'KB', color: 'from-emerald-500 to-cyan-500',
  },
  {
    name: 'Léa D.', role: 'Designer',
    text: 'Enfin une app de tâches aussi belle que fonctionnelle. Le design est dingue.',
    initials: 'LD', color: 'from-pink-500 to-rose-500',
  },
]

function TiltCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width  - 0.5)
    y.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 cursor-default overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

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

export default function TiltCardsSection() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-16 z-10">
      <h2 className="text-[40px] font-black text-white text-center mb-12 tracking-tight anim-fade-up">
        Ils adorent{' '}
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">TaskFlow</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ perspective: '1000px' }}>
        {TESTIMONIALS.map((t, i) => <TiltCard key={i} t={t} index={i} />)}
      </div>
    </section>
  )
}
