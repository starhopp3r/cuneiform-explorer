"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }
    router.replace(`/?${params.toString()}`)
  }

  return (
    <Input
      type="text"
      placeholder="Search by sign or name..."
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-64"
    />
  )
}

export function Header() {
  const [learnedCount, setLearnedCount] = useState(0)
  const totalSigns = 110

  useEffect(() => {
    // Update the count whenever the store changes
    const updateCount = () => {
      if (window.cuneiformStore) {
        setLearnedCount(window.cuneiformStore.getSigns().length)
      }
    }

    // Initial update
    updateCount()

    // Set up an interval to check for updates
    const interval = setInterval(updateCount, 1000)
    return () => clearInterval(interval)
  }, [])

  const progress = (learnedCount / totalSigns) * 100

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xl">Cuneiform Explorer</span>
          </div>
          <div className="flex items-center gap-4">
            <Suspense fallback={
              <Input
                type="text"
                placeholder="Loading..."
                disabled
                className="w-64"
              />
            }>
              <SearchInput />
            </Suspense>
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <span className="text-sm text-muted-foreground">
            {learnedCount} / {totalSigns} signs ({Math.round(progress)}%)
          </span>
        </div>
      </div>
    </header>
  )
}
