import type { Metadata } from 'next'
import './globals.css'
import './theme.css'


export const metadata: Metadata = {
  title: 'Mileid',
  description: 'Mileid is a web-based game that helps you learn to make 3d browser games.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"pa-0 ma-0 w-100vw h-100vh"}>{children}</body>
    </html>
  )
}
