"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface ProgressContextType {
  learnedCount: number
  totalSigns: number
  isVisible: boolean
  setTotalSigns: (value: number) => void
  toggleVisibility: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [learnedCount, setLearnedCount] = useState(0)
  const [totalSigns, setTotalSigns] = useState(110)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load initial values from localStorage
    const storedTotal = localStorage.getItem('totalSigns')
    if (storedTotal) {
      setTotalSigns(parseInt(storedTotal, 10))
    }
    const storedVisibility = localStorage.getItem('progressVisible')
    if (storedVisibility) {
      setIsVisible(storedVisibility === 'true')
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Update the count whenever the store changes
    const updateCount = () => {
      if (window.cuneiformStore) {
        setLearnedCount(window.cuneiformStore.getSigns().length)
      }
    }

    // Initial update
    updateCount()

    // Set up an interval to check for updates
    const interval = setInterval(updateCount, 1000)
    return () => clearInterval(interval)
  }, [isMounted])

  const handleSetTotalSigns = (value: number) => {
    setTotalSigns(value)
    if (isMounted) {
      localStorage.setItem('totalSigns', value.toString())
    }
  }

  const handleToggleVisibility = () => {
    const newValue = !isVisible
    setIsVisible(newValue)
    if (isMounted) {
      localStorage.setItem('progressVisible', newValue.toString())
    }
  }

  return (
    <ProgressContext.Provider value={{
      learnedCount,
      totalSigns,
      isVisible,
      setTotalSigns: handleSetTotalSigns,
      toggleVisibility: handleToggleVisibility
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
} 