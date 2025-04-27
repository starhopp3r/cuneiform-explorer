import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { playCorrectSound, playWrongSound } from "@/lib/sounds"
import { useEffect } from "react"
import { motion } from "framer-motion"

interface QuizButtonProps {
  option: string
  isCorrect: boolean | null
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}

export function QuizButton({ option, isCorrect, isSelected, onClick, disabled }: QuizButtonProps) {
  useEffect(() => {
    if (isSelected && isCorrect !== null) {
      if (isCorrect) {
        playCorrectSound()
      } else {
        playWrongSound()
      }
    }
  }, [isCorrect, isSelected])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "h-20 text-xl font-medium w-full transition-all duration-200 active:scale-[0.98] rounded-md",
          isCorrect === null && "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // default
          isCorrect !== null && isSelected && "bg-[#648D66] text-white dark:bg-[#436C48] dark:text-white", // correct
          isCorrect !== null && !isSelected && "bg-[#AF5B5B] text-white dark:bg-[#7E3B3B] dark:text-white" // wrong
        )}
      >
        {option}
      </button>
    </motion.div>
  )
} 