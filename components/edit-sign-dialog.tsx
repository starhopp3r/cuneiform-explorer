"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { CuneiformSign } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  sign: z.string().min(1, "Sign is required"),
  name: z.string().min(1, "Name is required"),
})

interface EditSignDialogProps {
  sign: CuneiformSign
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedSign: CuneiformSign) => void
}

export function EditSignDialog({ sign, open, onOpenChange, onSave }: EditSignDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sign: sign.sign,
      name: sign.name,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...sign,
      sign: values.sign,
      name: values.name,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Cuneiform Sign</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sign</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
