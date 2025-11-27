import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: 'LifeSync - Performance Pattern Analyzer',
  description: 'Track daily metrics, discover hidden patterns, and optimize your performance with AI-powered insights.',
  keywords: ['performance tracking', 'habit tracker', 'health metrics', 'pattern analysis', 'lifestyle optimization'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
