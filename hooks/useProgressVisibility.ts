"use client"

import { useState, useEffect } from 'react'

export function useProgressVisibility() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Load initial state from localStorage
    const stored = localStorage.getItem('showProgressBar')
    setIsVisible(stored === null ? true : stored === 'true')
  }, [])

  const toggleVisibility = () => {
    const newValue = !isVisible
    setIsVisible(newValue)
    localStorage.setItem('showProgressBar', String(newValue))
  }

  return { isVisible, toggleVisibility }
} 