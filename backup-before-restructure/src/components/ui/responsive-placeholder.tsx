"use client"

import { useMemo } from "react"

interface ResponsivePlaceholderProps {
  text?: string
  bgColor?: string
  textColor?: string
  className?: string
  aspectRatio?: string
}

export default function ResponsivePlaceholder({
  text = "Placeholder",
  bgColor = "#3b82f6",
  textColor = "#ffffff",
  className = "",
  aspectRatio = "16/9",
}: ResponsivePlaceholderProps) {
  const svgContent = useMemo(() => {
    // Create a simple SVG with text
    return `
      <svg width="100%" height="100%" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <rect width="800" height="450" fill="${bgColor}" />
        <text 
          x="50%" 
          y="50%" 
          fontFamily="Arial, sans-serif" 
          fontSize="32px" 
          fill="${textColor}" 
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          ${text}
        </text>
      </svg>
    `
  }, [text, bgColor, textColor])

  const dataUrl = useMemo(() => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
  }, [svgContent])

  return (
    <div
      className={`w-full ${className}`}
      style={{
        aspectRatio,
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  )
}

