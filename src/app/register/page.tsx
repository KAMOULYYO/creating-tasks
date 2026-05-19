'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Lock, User, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [busy,     setBusy]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setBusy(true)

    const res = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setBusy(false); return }

    const loginRes = await signIn('credentials', { email, password, redirect: false })
    setBusy(false)
    if (loginRes?.error) { setError('Compte créé, mais connexion échouée. Veuillez vous connecter.'); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF7ED]">
      <div className="w-full max-w-[400px]">

        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🚀</div>
          <h1 className="font-fredoka text-3xl font-bold text-orange-900">TaskFlow</h1>
          <p className="text-slate-500 text-[14px] mt-1">Crée ton espace personnel</p>
        </div>

        <div className="bg-white rounded-[28px] border-2 border-orange-200 p-7
          shadow-[0_4px_0_0_rgba(154,52,18,.10),0_8px_32px_-4px_rgba(249,115,22,.15)]">

          <h2 className="font-fredoka text-[22px] font-bold text-orange-900 mb-6">Créer un compte</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Prénom</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ton prénom"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[15px] outline-none focus:border-orange-400 transition-colors placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="toi@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[15px] outline-none focus:border-orange-400 transition-colors placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  placeholder="Min. 6 caractères"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-900 text-[15px] outline-none focus:border-orange-400 transition-colors placeholder:text-slate-300"
                />
              </div>
            </div>

            {error && (
              <div className="text-[13px] text-red-500 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit" disabled={busy}
              className="mt-1 w-full py-4 rounded-2xl bg-orange-500 text-white font-fredoka text-[18px] font-semibold
                shadow-clay hover:bg-orange-600 active:scale-[.98] transition-all disabled:opacity-60
                flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <><UserPlus size={18} /> Créer mon compte</>}
            </button>
          </form>
        </div>

        <p className="text-center text-[14px] text-slate-500 mt-5">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-orange-500 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
