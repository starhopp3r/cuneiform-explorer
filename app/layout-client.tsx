"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 