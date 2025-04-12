"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { v4 as uuidv4 } from "uuid"
import type { CuneiformSign } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  sign: z.string().min(1, "Sign is required"),
  name: z.string().min(1, "Name is required"),
})

export function AddSignForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sign: "",
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSign: CuneiformSign = {
      id: uuidv4(),
      sign: values.sign,
      name: values.name,
    }

    // Access the global store to add the sign
    if (window.cuneiformStore) {
      window.cuneiformStore.addSign(newSign)
      form.reset()
      toast({
        title: "Sign added",
        description: "The cuneiform sign has been added successfully.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Cuneiform Sign</CardTitle>
        <CardDescription>Please enter both the cuneiform sign and its corresponding name.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Button type="submit">Add Sign</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
