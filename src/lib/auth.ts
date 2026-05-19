import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn:  '/login',
    error:   '/login',
  },
  providers: [
    CredentialsProvider({
      id:   'credentials',
      name: 'Email',
      credentials: {
        email:    { label: 'Email',        type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const { data, error } = await supabaseAdmin()
          .from('users')
          .select('id, name, email, password')
          .eq('email', credentials.email.toLowerCase())
          .single()

        if (error || !data) return null

        const valid = await bcrypt.compare(credentials.password, data.password)
        if (!valid) return null

        return { id: data.id, email: data.email, name: data.name ?? data.email }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
}
