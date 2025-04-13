"use client"

import { useState, useEffect } from "react"
import { CuneiformCard } from "@/components/cuneiform-card"
import { type CuneiformSign } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { initialSigns } from "@/lib/data"

interface CuneiformGridProps {
  searchQuery: string
}

export function CuneiformGrid({ searchQuery }: CuneiformGridProps) {
  const [signs, setSigns] = useState<CuneiformSign[]>([])
  const { toast } = useToast()

  // Initialize localStorage and load signs
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('cuneiform_signs')
      if (!storedData) {
        // Initialize with default signs if no data exists
        localStorage.setItem('cuneiform_signs', JSON.stringify(initialSigns))
        setSigns(initialSigns)
      } else {
        const parsedSigns = JSON.parse(storedData)
        if (!Array.isArray(parsedSigns)) {
          throw new Error('Invalid data format in storage')
        }
        setSigns(parsedSigns)
      }
    } catch (error) {
      console.error('Error initializing signs:', error)
      // Reset to initial signs if there's an error
      localStorage.setItem('cuneiform_signs', JSON.stringify(initialSigns))
      setSigns(initialSigns)
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const currentSigns = window.cuneiformStore.getSigns()
      const filteredSigns = currentSigns.filter(sign => sign.id !== id)
      localStorage.setItem('cuneiform_signs', JSON.stringify(filteredSigns))
      setSigns(filteredSigns)
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
      const currentSigns = window.cuneiformStore.getSigns()
      const updatedSigns = currentSigns.map(sign => 
        sign.id === updatedSign.id ? updatedSign : sign
      )
      localStorage.setItem('cuneiform_signs', JSON.stringify(updatedSigns))
      setSigns(updatedSigns)
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
      getSigns: () => {
        try {
          const data = localStorage.getItem('cuneiform_signs')
          if (!data) return initialSigns
          const parsedSigns = JSON.parse(data)
          if (!Array.isArray(parsedSigns)) {
            throw new Error('Invalid data format in storage')
          }
          return parsedSigns
        } catch (error) {
          console.error('Error reading signs:', error)
          return initialSigns
        }
      },
      addSign: (sign: CuneiformSign) => {
        try {
          const currentSigns = window.cuneiformStore.getSigns()
          const newSigns = [...currentSigns, sign]
          localStorage.setItem('cuneiform_signs', JSON.stringify(newSigns))
          setSigns(newSigns)
        } catch (error) {
          console.error('Error adding sign:', error)
          toast({
            title: "Error",
            description: "Failed to add sign",
            variant: "destructive",
          })
        }
      },
      refreshSigns: async () => {
        const currentSigns = window.cuneiformStore.getSigns()
        setSigns(currentSigns)
      },
    }
  }, [])

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
