import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { RootLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "Cuneiform Signs",
  description: "Interactive collection of cuneiform signs and their names",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}


import './globals.css'