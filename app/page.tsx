"use client"

import { useState } from "react"
import { Suspense } from "react"
import { CuneiformGrid } from "@/components/cuneiform-grid"
import { SignForm } from "@/components/sign-form"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

function CuneiformGridWithSearch() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  return <CuneiformGrid searchQuery={searchQuery} />
}

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cuneiform Signs</h1>
          <p className="text-muted-foreground">
            An interactive collection of cuneiform signs and their names
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Signs
        </Button>
      </div>

      <SignForm open={isFormOpen} onOpenChange={setIsFormOpen} />

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
