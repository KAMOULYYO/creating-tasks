'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import type { Task } from '@/types/database'
import { CAT_META } from '@/lib/design'

interface Props { tasks: Task[] }

const PIE_COLORS = ['#F97316', '#FB923C', '#FDBA74', '#22C55E', '#818CF8']

export function StatsChart({ tasks }: Props) {
  const done    = tasks.filter(t => t.status === 'done').length
  const pending = tasks.filter(t => t.status !== 'done').length
  const total   = tasks.length
  const pct     = total ? Math.round(done / total * 100) : 0

  // Category breakdown
  const catData = Object.entries(CAT_META).map(([key, meta]) => ({
    name:  meta.label,
    emoji: meta.emoji,
    total: tasks.filter(t => t.category === key).length,
    done:  tasks.filter(t => t.category === key && t.status === 'done').length,
  })).filter(d => d.total > 0)

  // Priority breakdown for pie
  const prioData = [
    { name: '🔴 Haute',   value: tasks.filter(t => t.priority === 'high').length },
    { name: '🟠 Moyenne', value: tasks.filter(t => t.priority === 'medium').length },
    { name: '🟢 Basse',   value: tasks.filter(t => t.priority === 'low').length },
  ].filter(d => d.value > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 px-5 pb-6"
    >
      {/* Score card */}
      <div className="bg-white rounded-[24px] border-2 border-orange-200 p-5
        shadow-[0_4px_0_0_rgba(154,52,18,.08),0_8px_24px_-4px_rgba(249,115,22,.12)]">
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-3">Score du jour</p>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FED7AA" strokeWidth="3.2" />
              <motion.circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#F97316" strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray={`${pct} 100`}
                initial={{ strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${pct} 100` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-fredoka text-[22px] font-bold text-orange-500">
              {pct}%
            </span>
          </div>
          <div className="flex-1">
            <p className="font-fredoka text-[28px] font-bold text-orange-900 leading-none">{done} <span className="text-[16px] text-slate-400 font-nunito font-normal">/ {total}</span></p>
            <p className="text-[13px] text-slate-400 mt-1">tâches terminées</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[12px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✅ {done} faites</span>
              <span className="text-[12px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">⏳ {pending} restantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart by category */}
      {catData.length > 0 && (
        <div className="bg-white rounded-[24px] border-2 border-orange-200 p-5
          shadow-[0_2px_12px_rgba(249,115,22,.08)]">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-4">Par catégorie</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={catData} barGap={4}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '2px solid #FED7AA', fontSize: 13, fontFamily: 'Nunito' }}
                cursor={{ fill: '#FFF7ED' }}
              />
              <Bar dataKey="total" name="Total" fill="#FED7AA" radius={[8,8,0,0]} />
              <Bar dataKey="done"  name="Faites" fill="#F97316" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie chart by priority */}
      {prioData.length > 0 && (
        <div className="bg-white rounded-[24px] border-2 border-orange-200 p-5
          shadow-[0_2px_12px_rgba(249,115,22,.08)]">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-2">Par priorité</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={prioData} cx="50%" cy="50%" outerRadius={65} innerRadius={35}
                dataKey="value" paddingAngle={4}>
                {prioData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #FED7AA', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: '#64748b', fontSize: 13 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {total === 0 && (
        <div className="text-center py-10 text-slate-400">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-fredoka text-[18px] text-orange-900">Pas encore de données</p>
          <p className="text-[13px] mt-1">Ajoute des tâches pour voir tes stats</p>
        </div>
      )}
    </motion.div>
  )
}
