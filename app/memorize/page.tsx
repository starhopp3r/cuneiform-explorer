"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { shuffle } from "@/lib/utils"
import { ArrowLeft, RotateCw, Home } from "lucide-react"
import Link from "next/link"
import type { CuneiformSign } from "@/lib/data"
import { ProgressRing } from "@/components/ui/progress-ring"

export default function MemorizePage() {
  const [signs, setSigns] = useState<CuneiformSign[]>([])
  const [allSigns, setAllSigns] = useState<CuneiformSign[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const initializeSession = () => {
    const storedSigns = window.cuneiformStore?.getSigns() || []
    setAllSigns(storedSigns)
    const memorizeCount = parseInt(localStorage.getItem('memorizeCount') || '0', 10)
    const signsToUse = shuffle([...storedSigns]).slice(0, memorizeCount || storedSigns.length)
    setSigns(signsToUse)
    setCurrentIndex(0)
    setScore(0)
    setIsComplete(false)
    setIsCorrect(null)
  }

  useEffect(() => {
    initializeSession()
  }, [])

  useEffect(() => {
    if (signs.length > 0) {
      generateOptions()
    }
  }, [currentIndex, signs])

  const generateOptions = () => {
    const currentSign = signs[currentIndex]
    // Get wrong options from ALL signs, not just the ones we're practicing
    const otherSigns = allSigns.filter((s) => s.id !== currentSign.id)
    const wrongOptions = shuffle(otherSigns).slice(0, 3).map((s) => s.name)
    const allOptions = shuffle([currentSign.name, ...wrongOptions])
    setOptions(allOptions)
  }

  const handleAnswer = (answer: string) => {
    const correct = answer === signs[currentIndex].name
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 1)
    }

    // Move to next question after a short delay
    setTimeout(() => {
      setIsCorrect(null)
      if (currentIndex < signs.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setIsComplete(true)
      }
    }, 1000)
  }

  if (signs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No signs available to memorize.</p>
          <Link href="/" className="text-primary hover:underline">
            Add some signs first
          </Link>
        </div>
      </div>
    )
  }

  if (isComplete) {
    const percentage = (score / signs.length) * 100
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="p-12 text-center">
            <div className="space-y-8">
              <h2 className="text-xl font-medium text-muted-foreground">Session Complete!</h2>
              
              <div className="flex justify-center">
                <ProgressRing 
                  value={percentage}
                  size={200}
                  strokeWidth={12}
                  valueClassName="text-primary"
                >
                  <div className="text-center">
                    <div className="text-5xl font-bold">
                      {score}
                      <span className="text-2xl text-muted-foreground font-normal">&nbsp;/&nbsp;{signs.length}</span>
                    </div>
                  </div>
                </ProgressRing>
              </div>

              <p className="text-lg text-muted-foreground">
                {score === signs.length 
                  ? "Perfect score! Amazing work! 🎉" 
                  : score > signs.length / 2 
                    ? "Well done! Keep practicing! 👏"
                    : "Keep practicing, you'll get better! 💪"}
              </p>

              <div className="flex flex-col gap-3">
                <Button onClick={initializeSession} size="lg" className="w-full">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
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
        <div className="flex items-center gap-1.5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full border px-4 py-1.5">
          <span className="text-xl font-semibold">{score}</span>
          <span className="text-muted-foreground font-medium">/</span>
          <span className="text-muted-foreground font-medium">{signs.length}</span>
          <span className="text-muted-foreground text-sm ml-1.5">correct</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{signs[currentIndex].sign}</div>
            <p className="text-sm text-muted-foreground">What is this sign called?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                variant={
                  isCorrect !== null
                    ? option === signs[currentIndex].name
                      ? "success"
                      : "destructive"
                    : "outline"
                }
                className="h-16 text-lg font-medium"
                disabled={isCorrect !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Question {currentIndex + 1} of {signs.length}
        </div>
      </div>
    </div>
  )
} 