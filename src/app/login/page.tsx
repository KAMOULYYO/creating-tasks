'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [busy,     setBusy]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setBusy(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setBusy(false)
    if (res?.error) { setError('Email ou mot de passe incorrect'); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

      {/* Orbiting dots decoration */}
      <div className="absolute top-16 right-16 hidden lg:block pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 rounded-full border border-blue-500/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-cyan-500/10"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-500/40" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.45)]"
          >
            <span className="text-white font-black text-2xl">T</span>
          </motion.div>
          <h1 className="text-white font-black text-2xl tracking-tight">TaskFlow</h1>
          <p className="text-gray-600 text-sm mt-1">Tes tâches, organisées avec style</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 backdrop-blur-sm shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <h2 className="text-white font-bold text-xl mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="toi@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[14px] outline-none
                    focus:border-blue-500/50 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]
                    placeholder:text-gray-700 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[14px] outline-none
                    focus:border-blue-500/50 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]
                    placeholder:text-gray-700 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="text-[13px] text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit" disabled={busy}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59,130,246,0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="mt-1 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[15px]
                shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {busy
                ? <Loader2 size={18} className="animate-spin" />
                : <><span>Se connecter</span><ArrowRight size={16} /></>
              }
            </motion.button>
          </form>
        </div>

        <p className="text-center text-[13px] text-gray-600 mt-5">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
