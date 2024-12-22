import './globals.css'
import { Inter, Orbitron, Exo_2 } from 'next/font/google'
import { LoadingProvider } from '@/components/ui/LoadingContext'
import { ThemeProvider } from '@/components/ui/ThemeContext'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
})

export const metadata = {
  title: 'AI Trivia',
  description: 'An engaging AI-powered trivia game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased transition-colors duration-300`}>
        <ThemeProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

