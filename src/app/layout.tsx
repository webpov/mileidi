import type { Metadata } from 'next'
import './globals.css'
import './theme.css'


export const metadata: Metadata = {
  title: 'MileiDiChan',
  description: '3D Economic Freedom Game inspired by the insights of Javier Milei',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"pos-abs top-0 pa-0 ma-0 left-50p translate-x--50 "}
        style={{height: "90vh", width: "96vw", background: "#f7f7f7"}}
      >{children}</body>
    </html>
  )
}
