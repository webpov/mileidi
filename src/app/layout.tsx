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
      <body className={"pos-abs top-0 pa-0 ma-0 left-50p translate-x--50 "}
        style={{height: "88vh", width: "96vw"}}
      >{children}</body>
    </html>
  )
}
