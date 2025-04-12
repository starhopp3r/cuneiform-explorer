"use client"

import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CuneiformSign } from "@/lib/data"
import { EditSignDialog } from "@/components/edit-sign-dialog"
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

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="text-7xl mb-4">{sign.sign}</div>
            <h3 className="text-xl font-medium">{sign.name}</h3>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
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
        </CardFooter>
      </Card>

      <EditSignDialog sign={sign} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onSave={onEdit} />
    </>
  )
}
