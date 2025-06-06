"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { shuffle } from "@/lib/utils"
import { ArrowLeft, RotateCw, Home, BookOpen, Plus } from "lucide-react"
import Link from "next/link"
import type { CuneiformSign } from "@/lib/data"
import { ProgressRing } from "@/components/ui/progress-ring"
import { getSigns } from "@/lib/storage"
import { motion, AnimatePresence } from "framer-motion"
import { QuizButton } from "@/components/quiz-button"
import { useProgress } from "@/lib/progress-context"
import { CustomConfetti } from "@/components/ui/custom-confetti"
import { playTrumpetSound, playCompletionSound } from "@/lib/sounds"
import { useTimer } from "@/hooks/useTimer"

export default function QuizPage() {
  const [signs, setSigns] = useState<CuneiformSign[]>([])
  const [allSigns, setAllSigns] = useState<CuneiformSign[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  const { selectedFont, useEaNasirConfetti } = useProgress()
  const { formattedTime, start, stop, reset, time } = useTimer()

  // Play appropriate sound when quiz is completed
  useEffect(() => {
    if (isComplete && !hasPlayedSound) {
      if (score === signs.length) {
        playTrumpetSound();
      } else {
        playCompletionSound();
      }
      setHasPlayedSound(true);
      stop();
    }
  }, [isComplete, score, signs.length, hasPlayedSound, stop]);

  const initializeSession = () => {
    const storedSigns = getSigns()
    setAllSigns(storedSigns)
    const quizCount = parseInt(localStorage.getItem('quizCount') || '0', 10)
    const signsToUse = shuffle([...storedSigns]).slice(0, quizCount || storedSigns.length)
    setSigns(signsToUse)
    setCurrentIndex(0)
    setScore(0)
    setIsComplete(false)
    setIsCorrect(null)
    setHasPlayedSound(false)
    reset()
    start()
  }

  // Save session data when completed
  useEffect(() => {
    if (isComplete) {
      const sessionData = {
        id: Date.now(),
        date: new Date().toISOString(),
        score,
        total: signs.length,
        time,
        speed: Math.round(signs.length / (time / 60) * 10) / 10
      }
      const existingSessions = JSON.parse(localStorage.getItem('sessionMetrics') || '[]')
      localStorage.setItem('sessionMetrics', JSON.stringify([...existingSessions, sessionData]))
    }
  }, [isComplete, score, signs.length, time])

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
      <div className="container mx-auto px-4 min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-12 w-full max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            <BookOpen className="w-24 h-24 text-foreground mx-auto" strokeWidth={1.5} />
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-semibold"
            >
              No signs available to quiz
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground"
            >
              Start by adding some cuneiform signs to your collection to begin practicing
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              asChild
              size="lg"
              variant="default"
              className="h-12 px-8 text-lg"
            >
              <Link href="/">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Sign
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (isComplete) {
    const percentage = (score / signs.length) * 100
    const isPerfectScore = score === signs.length

    return (
      <div className="container mx-auto px-4 py-8">
        {isPerfectScore && (
          <CustomConfetti useEaNasir={useEaNasirConfetti} />
        )}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-12 text-center backdrop-blur-sm bg-card/95">
            <div className="space-y-8">
              <motion.h2 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                Session Complete!
              </motion.h2>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  className="col-span-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <ProgressRing 
                    value={percentage}
                    size={220}
                    strokeWidth={12}
                    valueClassName="text-primary"
                  >
                    <div className="text-center">
                      <div className="text-6xl font-bold">
                        {score}
                        <span className="text-2xl text-muted-foreground font-normal">&nbsp;/&nbsp;{signs.length}</span>
                      </div>
                    </div>
                  </ProgressRing>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30"
                >
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Speed</div>
                  <div className="text-3xl font-bold text-primary tabular-nums">
                    {Math.round(signs.length / (time / 60) * 10) / 10}
                  </div>
                  <div className="text-xs text-muted-foreground">signs/min</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30"
                >
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Time</div>
                  <div className="text-3xl font-bold text-primary tabular-nums">{formattedTime}</div>
                  <div className="text-xs text-muted-foreground">total time</div>
                </motion.div>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                {isPerfectScore 
                  ? "Perfect score! Amazing work! 🎉" 
                  : score > signs.length / 2 
                    ? "Well done! Keep practicing! 👏"
                    : "Keep practicing, you'll get better! 💪"}
              </motion.p>

              <motion.div 
                className="flex gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={initializeSession} 
                  size="lg" 
                  className="flex-1 bg-primary hover:bg-primary/90 transition-colors duration-200"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button size="lg" asChild className="flex-1 bg-primary hover:bg-primary/90 transition-colors duration-200">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </motion.div>
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
          <Button variant="ghost" className="hover:bg-background/80 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full border px-5 py-2 shadow-sm"
        >
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-primary tabular-nums">{score}</span>
            <span className="text-muted-foreground font-medium mx-1">/</span>
            <span className="text-muted-foreground font-medium">{signs.length}</span>
            <span className="text-muted-foreground text-sm ml-1">correct</span>
          </div>
          <div className="w-px h-6 bg-border mx-3" />
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-primary tabular-nums">{formattedTime}</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-12 mb-8 backdrop-blur-sm bg-card/95 shadow-lg">
              <div className="text-center mb-12">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-9xl mb-6"
                  style={{ fontFamily: selectedFont }}
                >
                  {signs[currentIndex].sign}
                </motion.div>
                <p className="text-base text-muted-foreground">What is this sign called?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <QuizButton
                      option={option}
                      isCorrect={isCorrect}
                      isSelected={option === signs[currentIndex].name}
                      onClick={() => handleAnswer(option)}
                      disabled={isCorrect !== null}
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border text-sm text-muted-foreground">
            <span className="font-medium">Question {currentIndex + 1}</span>
            <span className="opacity-50">of</span>
            <span className="font-medium">{signs.length}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 