"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { CuneiformSign } from "@/lib/data"
import { Upload, Plus } from "lucide-react"

const formSchema = z.object({
  sign: z.string().min(1, "Sign is required"),
  name: z.string().min(1, "Name is required"),
})

interface SignFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignForm({ open, onOpenChange }: SignFormProps) {
  const { toast } = useToast()
  const [importText, setImportText] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sign: "",
      name: "",
    },
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      setImportText(content)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Please enter signs to import",
        variant: "destructive",
      })
      return
    }

    try {
      setIsImporting(true)
      // Parse the import text into signs
      const lines = importText.trim().split("\n")
      const newSigns = lines.map(line => {
        const [sign, name] = line.split("\t")
        return {
          id: uuidv4(),
          sign: sign?.trim() || "",
          name: name?.trim() || "",
        }
      }).filter(sign => sign.sign && sign.name)

      if (newSigns.length === 0) {
        toast({
          title: "Error",
          description: "No valid signs found in the input",
          variant: "destructive",
        })
        return
      }

      // Get existing signs from localStorage
      const existingSigns = window.cuneiformStore.getSigns()
      const existingSignMap = new Map(existingSigns.map(sign => [sign.sign, true]))
      
      // Filter out duplicates
      const uniqueNewSigns = newSigns.filter(sign => !existingSignMap.has(sign.sign))
      
      if (uniqueNewSigns.length > 0) {
        // Add all new signs at once
        const updatedSigns = [...existingSigns, ...uniqueNewSigns]
        localStorage.setItem('cuneiform_signs', JSON.stringify(updatedSigns))
        window.cuneiformStore.refreshSigns()
      }

      toast({
        title: "Success",
        description: `Successfully imported ${uniqueNewSigns.length} signs${newSigns.length - uniqueNewSigns.length > 0 ? ` (${newSigns.length - uniqueNewSigns.length} duplicates skipped)` : ''}`,
      })
      setImportText("")
      setShowImport(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error importing signs:", error)
      toast({
        title: "Error",
        description: "Failed to import signs",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSign: CuneiformSign = {
      id: uuidv4(),
      sign: values.sign,
      name: values.name,
    }

    try {
      const currentSigns = window.cuneiformStore.getSigns()
      const updatedSigns = [...currentSigns, newSign]
      localStorage.setItem('cuneiform_signs', JSON.stringify(updatedSigns))
      window.cuneiformStore.refreshSigns()
      form.reset()
      toast({
        title: "Sign added",
        description: "The cuneiform sign has been added successfully.",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding sign:", error)
      toast({
        title: "Error",
        description: "Failed to add sign",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Cuneiform Signs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showImport ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sign"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sign</FormLabel>
                        <FormControl>
                          <Input placeholder="𒀀" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="a" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="submit">Add Sign</Button>
                  <Button variant="outline" onClick={() => setShowImport(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Signs
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Import Signs</h3>
                <Button variant="ghost" onClick={() => setShowImport(false)}>
                  Back to Add Sign
                </Button>
              </div>
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
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={10}
              />
              <Button onClick={handleImport} disabled={isImporting} className="w-full">
                {isImporting ? "Importing..." : "Import Signs"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 