"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { InfoIcon, Settings2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProgressVisibility } from "@/hooks/useProgressVisibility"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

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
  const [totalSigns, setTotalSigns] = useState(110)
  const { isVisible, toggleVisibility } = useProgressVisibility()

  useEffect(() => {
    // Update the count whenever the store changes
    const updateCount = () => {
      if (window.cuneiformStore) {
        setLearnedCount(window.cuneiformStore.getSigns().length)
      }
    }

    // Load total signs from localStorage
    const storedTotal = localStorage.getItem('totalSigns')
    if (storedTotal) {
      setTotalSigns(parseInt(storedTotal, 10))
    }

    // Initial update
    updateCount()

    // Set up an interval to check for updates
    const interval = setInterval(updateCount, 1000)
    return () => clearInterval(interval)
  }, [])

  const progress = (learnedCount / totalSigns) * 100

  const handleTotalSignsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setTotalSigns(value)
      localStorage.setItem('totalSigns', value.toString())
    }
  }

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2Icon className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="progress-monitoring">Progress Monitoring</Label>
                    <Switch
                      id="progress-monitoring"
                      checked={isVisible}
                      onCheckedChange={toggleVisibility}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total-signs">Total Signs Goal</Label>
                    <Input
                      id="total-signs"
                      type="number"
                      min="1"
                      value={totalSigns}
                      onChange={handleTotalSignsChange}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <ModeToggle />
          </div>
        </div>
        {isVisible && (
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {learnedCount} / {totalSigns} signs ({Math.round(progress)}%)
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>About Cuneiform Explorer</DialogTitle>
                  <DialogDescription className="pt-4">
                    Cuneiform sign list based on{" "}
                    <em>A Workbook of Cuneiform Signs</em> by Daniel C. Snell.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </header>
  )
}
