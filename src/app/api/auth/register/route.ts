import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Mot de passe trop court (min 6 caractères)' }, { status: 400 })
  }

  // Check email not already taken
  const { data: existing } = await supabaseAdmin()
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  const { data, error } = await supabaseAdmin()
    .from('users')
    .insert({
      email:    email.toLowerCase(),
      password: hashed,
      name:     name?.trim() || email.split('@')[0],
    })
    .select('id, email')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
