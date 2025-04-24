"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Brain, BarChart } from "lucide-react"
import { SignForm } from "@/components/sign-form"
import { CuneiformGrid } from "@/components/cuneiform-grid"
import { Suspense } from "react"
import { Progress } from "@/components/ui/progress"
import { useSearchParams } from "next/navigation"
import { useProgress } from "@/lib/progress-context"
import Link from "next/link"

function ProgressWithText({ value, learnedCount, totalSigns }: { value: number, learnedCount: number, totalSigns: number }) {
  return (
    <div className="relative flex-1">
      <Progress value={value} className="h-10" />
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground" suppressHydrationWarning>
        {learnedCount} / {totalSigns} signs ({Math.round(value)}%)
      </div>
    </div>
  )
}

function GridWithSearch() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  return <CuneiformGrid searchQuery={searchQuery} />
}

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { learnedCount, totalSigns, isVisible } = useProgress()

  const progress = (learnedCount / totalSigns) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          {isVisible && (
            <ProgressWithText 
              value={progress} 
              learnedCount={learnedCount} 
              totalSigns={totalSigns} 
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Signs
          </Button>
          <Button asChild>
            <Link href="/memorize">
              <Brain className="h-4 w-4 mr-2" />
              Memorize
            </Link>
          </Button>
          <Button asChild>
            <Link href="/analytics">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      <SignForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      <div className="mt-12">
        <Suspense fallback={
          <div className="text-center text-muted-foreground">
            Loading signs...
          </div>
        }>
          <GridWithSearch />
        </Suspense>
      </div>
    </div>
  )
}
