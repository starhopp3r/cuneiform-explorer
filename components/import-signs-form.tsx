"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { CuneiformSign } from "@/lib/data"

export function ImportSignsForm() {
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [isImporting, setIsImporting] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      setText(content)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter or paste some signs to import",
        variant: "destructive",
      })
      return
    }

    const lines = text.trim().split("\n")
    const newSigns: CuneiformSign[] = []

    for (const line of lines) {
      const [sign, name] = line.split("\t")
      if (sign && name) {
        newSigns.push({
          id: uuidv4(),
          sign: sign.trim(),
          name: name.trim(),
        })
      }
    }

    if (newSigns.length === 0) {
      toast({
        title: "Error",
        description: "No valid signs found in the input",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    try {
      // Add all signs in a single batch
      const response = await fetch('/api/signs/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSigns),
      })

      if (!response.ok) {
        throw new Error('Failed to import signs')
      }

      const result = await response.json()
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${result.imported} signs${result.skipped > 0 ? ` (${result.skipped} duplicates skipped)` : ''}`,
      })
      setText("")
    } catch (error) {
      console.error('Error importing signs:', error)
      toast({
        title: "Error",
        description: "Failed to import signs",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Cuneiform Signs</CardTitle>
        <CardDescription>
          Import multiple signs from a tab-separated text file or paste them here.
          Each line should contain a sign and its name, separated by a tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
        </div>
        <Textarea
          placeholder="Paste signs here (one per line, tab-separated)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? "Importing..." : "Import Signs"}
        </Button>
      </CardContent>
    </Card>
  )
} 