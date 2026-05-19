import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { TaskInsert } from '@/types/database'

// GET /api/tasks — list today's tasks
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const from = `${date}T00:00:00.000Z`
  const to   = `${date}T23:59:59.999Z`

  const { data, error } = await supabaseAdmin()
    .from('tasks')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/tasks — create a task
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body: TaskInsert = await req.json()
  if (!body.title?.trim()) return NextResponse.json({ error: 'Titre requis' }, { status: 400 })

  const { data, error } = await supabaseAdmin()
    .from('tasks')
    .insert({ ...body, user_id: session.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
