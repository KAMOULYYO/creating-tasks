'use client'

import type { Task } from '@/types/database'
import { CAT_META, PRIO_META, STATUS_META } from '@/lib/design'

export function useExportPDF() {
  async function exportPDF(tasks: Task[], userName: string) {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const now   = new Date()
    const date  = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const done  = tasks.filter(t => t.status === 'done').length
    const total = tasks.length
    const pct   = total ? Math.round(done / total * 100) : 0

    const W = 210, M = 18

    // ── Orange header band ──
    doc.setFillColor(249, 115, 22)
    doc.roundedRect(0, 0, W, 42, 0, 0, 'F')

    // Logo emoji zone
    doc.setFillColor(255, 255, 255, 0.15)
    doc.circle(M + 8, 21, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.text('📋', M + 4, 25)

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text('TaskFlow', M + 22, 18)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Rapport du jour — ${date}`, M + 22, 26)
    doc.setFontSize(10)
    doc.text(`Généré pour : ${userName}`, M + 22, 33)

    // Score badge (top right)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(W - M - 28, 8, 28, 26, 4, 4, 'F')
    doc.setTextColor(249, 115, 22)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text(`${pct}%`, W - M - 24, 23)
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('du jour', W - M - 22, 29)

    let y = 55

    // ── Stats row ──
    const stats = [
      { label: 'Total',     value: total,        color: [249, 115, 22] as [number,number,number] },
      { label: 'Terminées', value: done,          color: [34, 197, 94]  as [number,number,number] },
      { label: 'Restantes', value: total - done,  color: [251, 146, 60] as [number,number,number] },
    ]
    const boxW = (W - M * 2 - 8) / 3
    stats.forEach((s, i) => {
      const bx = M + i * (boxW + 4)
      doc.setFillColor(255, 247, 237)
      doc.roundedRect(bx, y, boxW, 18, 3, 3, 'F')
      doc.setFillColor(...s.color)
      doc.roundedRect(bx, y, 2, 18, 1, 1, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...s.color)
      doc.text(String(s.value), bx + 8, y + 11)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text(s.label, bx + 8, y + 16)
    })

    y += 26

    // ── Progress bar ──
    doc.setFillColor(254, 215, 170)
    doc.roundedRect(M, y, W - M * 2, 5, 2.5, 2.5, 'F')
    if (pct > 0) {
      doc.setFillColor(249, 115, 22)
      doc.roundedRect(M, y, (W - M * 2) * pct / 100, 5, 2.5, 2.5, 'F')
    }
    y += 12

    // ── Section title ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(154, 52, 18)
    doc.text('Liste des tâches', M, y)
    y += 8

    // ── Tasks ──
    const PRIO_COLORS: Record<string, [number,number,number]> = {
      high:   [239, 68, 68],
      medium: [249, 115, 22],
      low:    [34, 197, 94],
    }

    tasks.forEach(task => {
      if (y > 265) { doc.addPage(); y = 20 }

      const isDone = task.status === 'done'
      const cat    = CAT_META[task.category]
      const prio   = PRIO_META[task.priority]
      const status = STATUS_META[task.status]

      // Card background
      doc.setFillColor(isDone ? 240 : 255, isDone ? 253 : 255, isDone ? 244 : 255)
      doc.roundedRect(M, y, W - M * 2, 18, 3, 3, 'F')

      // Priority left bar
      doc.setFillColor(...PRIO_COLORS[task.priority])
      doc.roundedRect(M, y, 2, 18, 1, 1, 'F')

      // Status icon
      doc.setFontSize(10)
      doc.text(status.emoji, M + 5, y + 11)

      // Title
      doc.setFont('helvetica', isDone ? 'normal' : 'bold')
      doc.setFontSize(10)
      doc.setTextColor(isDone ? 148 : 154, isDone ? 163 : 52, isDone ? 175 : 18)
      const title = task.title.length > 55 ? task.title.slice(0, 52) + '…' : task.title
      doc.text(title, M + 14, y + 8)

      // Meta row
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      let metaX = M + 14
      doc.text(`${cat.emoji} ${cat.label}`, metaX, y + 14)
      metaX += 22
      doc.text(`• ${prio.label}`, metaX, y + 14)
      if (task.scheduled_at) {
        const t = new Date(task.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        doc.text(`• ⏰ ${t}`, metaX + 20, y + 14)
      }

      y += 21
    })

    // ── Footer ──
    y = Math.max(y + 10, 270)
    doc.setDrawColor(254, 215, 170)
    doc.setLineWidth(0.3)
    doc.line(M, y, W - M, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 175)
    doc.text(`TaskFlow • Exporté le ${now.toLocaleString('fr-FR')}`, M, y + 6)
    doc.text(`${done}/${total} tâches terminées`, W - M, y + 6, { align: 'right' })

    doc.save(`taskflow-${now.toISOString().split('T')[0]}.pdf`)
  }

  return { exportPDF }
}
