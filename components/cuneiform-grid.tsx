"use client"

import { useState, useEffect } from "react"
import { CuneiformCard } from "@/components/cuneiform-card"
import { type CuneiformSign } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

interface CuneiformGridProps {
  searchQuery: string
}

export function CuneiformGrid({ searchQuery }: CuneiformGridProps) {
  const [signs, setSigns] = useState<CuneiformSign[]>([])
  const { toast } = useToast()

  // Fetch signs from the API
  const fetchSigns = async () => {
    try {
      const response = await fetch('/api/signs')
      const data = await response.json()
      setSigns(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch signs",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchSigns()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/signs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      setSigns(signs.filter((sign) => sign.id !== id))
      toast({
        title: "Sign removed",
        description: "The cuneiform sign has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sign",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (updatedSign: CuneiformSign) => {
    try {
      await fetch('/api/signs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSign),
      })
      setSigns(signs.map((sign) => (sign.id === updatedSign.id ? updatedSign : sign)))
      toast({
        title: "Sign updated",
        description: "The cuneiform sign has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sign",
        variant: "destructive",
      })
    }
  }

  // Make the grid available to other components
  useEffect(() => {
    window.cuneiformStore = {
      getSigns: () => signs,
      addSign: async (sign: CuneiformSign) => {
        try {
          await fetch('/api/signs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sign),
          })
          setSigns([...signs, sign])
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to add sign",
            variant: "destructive",
          })
        }
      },
    }
  }, [signs])

  // Filter signs based on search query
  const filteredSigns = signs.filter((sign) => {
    const query = searchQuery.toLowerCase()
    return (
      sign.sign.toLowerCase().includes(query) ||
      sign.name.toLowerCase().includes(query)
    )
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredSigns.map((sign) => (
        <CuneiformCard key={sign.id} sign={sign} onDelete={handleDelete} onEdit={handleEdit} />
      ))}
    </div>
  )
}
