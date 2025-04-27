"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { shuffle } from "@/lib/utils"
import { ArrowLeft, Check, X, RotateCw, Home } from "lucide-react"
import Link from "next/link"
import type { CuneiformSign } from "@/lib/data"
import { getSigns } from "@/lib/storage"
import { motion, AnimatePresence } from "framer-motion"
import { useProgress } from "@/lib/progress-context"
import { playCardFlipSound, playCardFlipAnimationSound, playTrumpetSound, playCompletionSound } from "@/lib/sounds"

export default function MemorizePage() {
  const [signs, setSigns] = useState<CuneiformSign[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewStack, setReviewStack] = useState<CuneiformSign[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [stats, setStats] = useState({ memorized: 0, reviewing: 0 })
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  const { selectedFont } = useProgress()
  const [memorizeMode, setMemorizeMode] = useState<'cuneiform' | 'name'>('cuneiform')

  // Play appropriate sound when session is completed
  useEffect(() => {
    if (isComplete && !hasPlayedSound) {
      if (stats.reviewing === 0) {
        playTrumpetSound()
      } else {
        playCompletionSound()
      }
      setHasPlayedSound(true)
    }
  }, [isComplete, stats.reviewing, hasPlayedSound])

  useEffect(() => {
    initializeSession()
    const storedMode = localStorage.getItem('memorizeMode') as 'cuneiform' | 'name'
    if (storedMode) {
      setMemorizeMode(storedMode)
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped(prev => !prev)
        playCardFlipAnimationSound()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Reset flip state when moving to next card
  useEffect(() => {
    setIsFlipped(false)
  }, [currentIndex])

  // Play sound when currentIndex changes (new card appears)
  useEffect(() => {
    if (signs.length > 0 && !isComplete) {
      playCardFlipSound()
    }
  }, [currentIndex, signs.length, isComplete])

  const initializeSession = () => {
    const storedSigns = getSigns()
    const memorizeCount = parseInt(localStorage.getItem('memorizeCount') || '0', 10)
    const signsToUse = shuffle([...storedSigns]).slice(0, memorizeCount || storedSigns.length)
    setSigns(signsToUse)
    setCurrentIndex(0)
    setReviewStack([])
    setIsComplete(false)
    setStats({ memorized: 0, reviewing: 0 })
    setIsFlipped(false)
    setHasPlayedSound(false)
  }

  const handleResponse = (remembered: boolean) => {
    if (!remembered) {
      setReviewStack(prev => [...prev, signs[currentIndex]])
      setStats(prev => ({ ...prev, reviewing: prev.reviewing + 1 }))
    } else {
      setStats(prev => ({ ...prev, memorized: prev.memorized + 1 }))
    }

    if (currentIndex === signs.length - 1) {
      if (reviewStack.length > 0) {
        // Start review round
        setSigns(shuffle([...reviewStack]))
        setReviewStack([])
        setCurrentIndex(0)
      } else {
        setIsComplete(true)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  if (signs.length === 0) {
    return (
      <div className="container mx-auto px-4 min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-semibold">No signs available</h1>
          <p className="text-xl text-muted-foreground">Add some signs to start memorizing</p>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-semibold mb-6">Session Complete!</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 rounded-xl border bg-background/50">
                <div className="text-sm text-muted-foreground mb-1">Memorized</div>
                <div className="text-3xl font-bold text-primary">{stats.memorized}</div>
              </div>
              <div className="p-4 rounded-xl border bg-background/50">
                <div className="text-sm text-muted-foreground mb-1">Reviewed</div>
                <div className="text-3xl font-bold text-primary">{stats.reviewing}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={initializeSession} size="lg" className="flex-1">
                <RotateCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button asChild size="lg" className="flex-1">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="inline-flex items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full border px-5 py-2">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-primary tabular-nums">{currentIndex + 1}</span>
            <span className="text-muted-foreground font-medium mx-1">/</span>
            <span className="text-muted-foreground font-medium">{signs.length}</span>
            <span className="text-muted-foreground text-sm ml-1">signs</span>
          </div>
          {reviewStack.length > 0 && (
            <>
              <div className="w-px h-6 bg-border mx-3" />
              <span className="text-2xl font-semibold text-primary tabular-nums">{reviewStack.length}</span>
              {reviewStack.length === 1 && (
                <span className="text-sm text-muted-foreground ml-1">sign to review</span>
              )}
              {reviewStack.length > 1 && (
                <span className="text-sm text-muted-foreground ml-1">signs to review</span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative h-[320px] mb-4">
          {/* Background cards for stack effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {[2, 1].map((offset) => (
                <div
                  key={offset}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    transform: `translate(${offset * 4}px, ${offset * 4}px)`,
                    zIndex: -offset
                  }}
                >
                  <Card className="w-[500px] h-[300px] backdrop-blur-sm bg-card/95 border shadow-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Main interactive card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              <div
                className="w-[500px] h-[300px] cursor-pointer transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
                onClick={() => {
                  setIsFlipped(prev => !prev)
                  playCardFlipAnimationSound()
                }}
              >
                {/* Front of card */}
                <Card 
                  className="absolute inset-0 p-8 flex items-center justify-center backdrop-blur-sm bg-card/95 backface-hidden"
                >
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={memorizeMode === 'cuneiform' ? "text-9xl" : "text-4xl font-semibold"}
                    style={memorizeMode === 'cuneiform' ? { fontFamily: selectedFont } : {}}
                  >
                    {memorizeMode === 'cuneiform' ? signs[currentIndex].sign : signs[currentIndex].name}
                  </motion.div>
                </Card>

                {/* Back of card */}
                <Card 
                  className="absolute inset-0 p-8 flex items-center justify-center backdrop-blur-sm bg-card/95"
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                  <motion.div 
                    className={memorizeMode === 'name' ? "text-9xl" : "text-4xl font-semibold"}
                    style={memorizeMode === 'name' ? { fontFamily: selectedFont } : {}}
                  >
                    {memorizeMode === 'name' ? signs[currentIndex].sign : signs[currentIndex].name}
                  </motion.div>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={() => handleResponse(false)}
            size="lg"
            className="w-40"
          >
            <X className="h-4 w-4 mr-2 text-red-500" />
            Review Again
          </Button>
          <Button 
            onClick={() => handleResponse(true)}
            size="lg"
            className="w-40"
          >
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Memorized
          </Button>
        </div>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          Press spacebar or click card to flip
        </div>
      </div>
    </div>
  )
} 