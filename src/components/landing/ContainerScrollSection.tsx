'use client'

import { motion } from 'framer-motion'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

const TASK_PREVIEW = [
  { title: 'Finaliser la présentation Q3', cat: '💼', done: true,  color: '#EF4444' },
  { title: 'Réunion équipe produit 14h',   cat: '🚀', done: true,  color: '#F97316' },
  { title: 'Revoir le design system',      cat: '🌸', done: false, color: '#F97316' },
  { title: 'Envoyer le rapport mensuel',   cat: '💼', done: false, color: '#22C55E' },
]

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
          <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium">
            🔥 7 jours de suite
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total',    value: '12', gradient: 'from-blue-500 to-cyan-400' },
            { label: 'Faites',   value: '8',  gradient: 'from-emerald-500 to-teal-400' },
            { label: 'En cours', value: '4',  gradient: 'from-orange-500 to-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3">
              <p className="text-gray-600 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progression</span>
            <span className="text-blue-400 font-semibold">75%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {TASK_PREVIEW.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                t.done ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                t.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
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

export default function ContainerScrollSection() {
  return (
    <ContainerScroll
      titleComponent={
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-500 text-sm px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-blue-400 rounded-full pulse-dot" />
            Interface intuitive
          </span>
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
  )
}
