"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Settings2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useProgress } from "@/lib/progress-context"

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
  const { totalSigns, isVisible, setTotalSigns, toggleVisibility } = useProgress()

  const handleTotalSignsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setTotalSigns(value)
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-4xl">𒀭</span>
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
      </div>
    </header>
  )
}
