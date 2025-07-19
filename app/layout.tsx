import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Toaster } from "@/components/ui/toaster" // <--- TAMBAHKAN INI

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ArtistHub - Artist Discovery Platform",
  description: "Discover and learn about your favorite music artists",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-white overflow-hidden`} suppressHydrationWarning>
        <SidebarLayout>{children}</SidebarLayout>
        <Toaster /> {/* <--- TAMBAHKAN INI DI SINI */}
      </body>
    </html>
  )
}