import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { ThemeProvider } from '@/components/ThemeProvider'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-fredoka' })
const nunito  = Nunito({  subsets: ['latin'], weight: ['300','400','600','700'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'TaskFlow — Mes tâches du jour',
  description: 'Gérez vos tâches quotidiennes avec style',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'TaskFlow' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-nunito antialiased">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
