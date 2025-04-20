import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RootLayoutClient } from "./layout-client"
import { ProgressProvider } from "@/lib/progress-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cuneiform Explorer",
  description: "Explore and learn cuneiform signs",
  generator: 'v0.dev',
  icons: {
    icon: './icon.ico',
    shortcut: './icon.ico',
    apple: './icon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.ico" />
        <link rel="shortcut icon" href="/icon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressProvider>
            <RootLayoutClient>{children}</RootLayoutClient>
          </ProgressProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}