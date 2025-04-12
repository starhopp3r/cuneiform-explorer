"use client"

import { Suspense } from "react"
import { CuneiformGrid } from "@/components/cuneiform-grid"
import { AddSignForm } from "@/components/add-sign-form"
import { useSearchParams } from "next/navigation"

function CuneiformGridWithSearch() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  return <CuneiformGrid searchQuery={searchQuery} />
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Cuneiform Signs</h1>
      <p className="text-center text-muted-foreground mb-8">
        An interactive collection of cuneiform signs and their names
      </p>

      <AddSignForm />

      <div className="mt-12">
        <Suspense fallback={
          <div className="text-center text-muted-foreground">
            Loading signs...
          </div>
        }>
          <CuneiformGridWithSearch />
        </Suspense>
      </div>
    </div>
  )
}
