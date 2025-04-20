"use client"

import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CuneiformSign } from "@/lib/data"
import { EditSignDialog } from "@/components/edit-sign-dialog"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CuneiformCardProps {
  sign: CuneiformSign
  onDelete: (id: string) => void
  onEdit: (updatedSign: CuneiformSign) => void
}

export function CuneiformCard({ sign, onDelete, onEdit }: CuneiformCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleCopy = async (text: string, type: 'sign' | 'name') => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied!", {
        description: `${type === 'sign' ? 'Cuneiform sign' : 'Sign name'} copied to clipboard`
      })
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg group h-full relative">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <button 
              className="text-7xl mb-4 cursor-pointer transition-transform duration-200 bg-transparent border-none p-0 hover:scale-110" 
              onClick={() => handleCopy(sign.sign, 'sign')}
              title="Click to copy sign"
            >
              {sign.sign}
            </button>
            <button 
              className="text-xl font-medium cursor-pointer transition-transform duration-200 bg-transparent border-none p-0 hover:scale-105"
              onClick={() => handleCopy(sign.name, 'name')}
              title="Click to copy name"
            >
              {sign.name}
            </button>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full hover:bg-muted/50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full hover:bg-muted/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the cuneiform sign "{sign.sign}" ({sign.name}).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(sign.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      <EditSignDialog sign={sign} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onSave={onEdit} />
    </>
  )
}
