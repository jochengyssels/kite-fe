"use client"

import { cn } from "@/lib/utils"

interface WindDirectionArrowProps {
  direction: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function WindDirectionArrow({ direction, size = "md", className }: WindDirectionArrowProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full",
        sizeClasses[size],
        className,
      )}
      aria-label={`Wind direction: ${direction}°`}
    >
      <div
        className="w-2/3 h-2/3"
        style={{
          transform: `rotate(${direction}deg)`,
          transformOrigin: "center",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4L12 20M12 4L6 10M12 4L18 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

