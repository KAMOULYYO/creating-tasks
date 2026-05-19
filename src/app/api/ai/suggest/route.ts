import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'
import type { Task } from '@/types/database'
import fs from 'fs'
import path from 'path'

function getAnthropicKey(): string {
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith('sk-')) {
    return process.env.ANTHROPIC_API_KEY
  }
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)
    for (const line of lines) {
      const m = line.match(/^ANTHROPIC_API_KEY=(.+)$/)
      if (m) return m[1].trim()
    }
  } catch {}
  return ''
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const apiKey = getAnthropicKey()
  if (!apiKey) {
    return NextResponse.json({ error: 'Clé API Anthropic manquante' }, { status: 503 })
  }

  const client = new Anthropic({ apiKey })

  const { tasks }: { tasks: Task[] } = await req.json()

  const done    = tasks.filter(t => t.status === 'done').map(t => t.title)
  const pending = tasks.filter(t => t.status !== 'done').map(t => t.title)
  const now     = new Date().toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `Tu es un assistant de productivité personnel. Tu aides l'utilisateur à planifier ses tâches de manière intelligente et motivante. Réponds TOUJOURS en JSON valide, sans markdown ni backticks.`,
      messages: [{
        role: 'user',
        content: `Nous sommes ${now}.
Tâches déjà faites aujourd'hui: ${done.length > 0 ? done.join(', ') : 'aucune'}
Tâches en cours: ${pending.length > 0 ? pending.join(', ') : 'aucune'}

Suggère 3 nouvelles tâches concrètes et utiles pour aujourd'hui, adaptées au contexte.
Réponds uniquement avec ce JSON (sans texte autour):
{
  "suggestions": [
    { "title": "...", "category": "work|perso|sante|projet|autre", "priority": "high|medium|low", "reason": "courte explication en 1 phrase" },
    { "title": "...", "category": "...", "priority": "...", "reason": "..." },
    { "title": "...", "category": "...", "priority": "...", "reason": "..." }
  ],
  "motivation": "message motivant personnalisé de 1 phrase"
}`,
      }],
    })

    const raw  = message.content[0].type === 'text' ? message.content[0].text : ''
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
    const json = JSON.parse(text)
    return NextResponse.json(json)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[AI] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
