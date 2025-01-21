import './globals.css'
import { Inter, Orbitron, Exo_2 } from 'next/font/google'
import { LoadingProvider } from '@/components/ui/LoadingContext'
import { ThemeProvider } from '@/components/ui/ThemeContext'
import { Metadata, Viewport } from 'next'
import SessionProvider from '@/components/providers/SessionProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
})

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'TriviaAI',
  description: 'TriviaAI is a trivia game that allows you to test your knowledge and learn new things.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TriviaAI',
  },
  icons: {
    icon: [
      { url: '/images/favicon/favicon.ico' },
      { url: '/images/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/images/favicon/apple-touch-icon.png' },
    ],
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`} suppressHydrationWarning>
      <head>
        <meta name="application-name" content="TriviaAI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TriviaAI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased transition-colors duration-300`}>
        <SessionProvider>
        <ThemeProvider>
          <LoadingProvider>
            {children}
            <Toaster />
          </LoadingProvider>
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

