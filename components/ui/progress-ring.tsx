import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps extends React.SVGProps<SVGSVGElement> {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  valueClassName?: string
  children?: React.ReactNode
}

export function ProgressRing({
  value,
  size = 160,
  strokeWidth = 8,
  className,
  valueClassName,
  children,
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = value / 100
  const offset = circumference - progress * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={cn("rotate-[-90deg]", className)}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        strokeWidth={strokeWidth}
        {...props}
      >
        <circle
          className="text-muted-foreground/20"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
        />
        <circle
          className={cn("transition-all duration-300 ease-in-out", valueClassName)}
          stroke="currentColor"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
} 