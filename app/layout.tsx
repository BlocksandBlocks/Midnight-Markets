import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], 
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Night Mode | Privacy-Preserving Smart Contracts',
  description: 'Decentralized marketplace for goods and services on the Midnight blockchain.',
  keywords: ['Night Mode', 'Compact', 'Privacy', 'Smart Contracts', 'Blockchain', 'DApp'],
  authors: [{ name: 'AOS Labs' }],
};
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
