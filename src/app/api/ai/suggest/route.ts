import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'
import type { Task } from '@/types/database'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    return NextResponse.json({ error: 'Clé API Anthropic manquante' }, { status: 503 })
  }

  const { tasks }: { tasks: Task[] } = await req.json()

  const done    = tasks.filter(t => t.status === 'done').map(t => t.title)
  const pending = tasks.filter(t => t.status !== 'done').map(t => t.title)
  const now     = new Date().toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })

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

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const json = JSON.parse(text)
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })
  }
}
