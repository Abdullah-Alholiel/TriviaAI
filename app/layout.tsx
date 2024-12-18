import './globals.css'
import { Inter, Orbitron, Exo_2 } from 'next/font/google'

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
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`}>
      <body className={`${inter.className} bg-gradient-to-b from-teal-600 via-blue-800 to-gray-900 min-h-screen text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}

