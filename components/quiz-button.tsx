import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuizButtonProps {
  option: string
  isCorrect: boolean | null
  isSelected: boolean
  onClick: () => void
  disabled: boolean
}

export function QuizButton({
  option,
  isCorrect,
  isSelected,
  onClick,
  disabled,
}: QuizButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-20 text-xl font-medium w-full transition-all duration-200 active:scale-[0.98] rounded-md",
        isCorrect === null && "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // default
        isCorrect !== null && isSelected && "bg-[#4C6B4D] text-white dark:bg-[#436C48] dark:text-white", // correct
        isCorrect !== null && !isSelected && "bg-[#7A3C3C] text-white dark:bg-[#7E3B3B] dark:text-white" // wrong
      )}
    >
      {option}
    </button>
  )
} 