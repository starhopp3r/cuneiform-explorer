"use client"

import { useEffect, useState, useRef } from 'react'
import Confetti from 'react-confetti'

interface CustomConfettiProps {
  useEaNasir?: boolean
}

export function CustomConfetti({ useEaNasir = false }: CustomConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (useEaNasir && !imageRef.current) {
      const img = new Image()
      img.src = '/copper.png'
      img.onload = () => {
        imageRef.current = img
        setImageLoaded(true)
      }
    }
  }, [useEaNasir])

  const drawShape = (ctx: CanvasRenderingContext2D) => {
    if (useEaNasir && imageRef.current && imageLoaded) {
      ctx.save()
      ctx.translate(-15, -15)
      ctx.drawImage(imageRef.current, 0, 0, 30, 30)
      ctx.restore()
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    }
  }

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.4}
      drawShape={drawShape}
    />
  )
} 