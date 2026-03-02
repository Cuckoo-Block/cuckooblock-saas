import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cuckoo Block",
  description: "Operations-grade tools for teams that ship on time.",
  icons: {
    icon: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
