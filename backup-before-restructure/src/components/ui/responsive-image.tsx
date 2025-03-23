"use client"

import { useMemo } from "react"

interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
  bgColor?: string
  textColor?: string
  className?: string
}

export default function PlaceholderImage({
  width,
  height,
  text = "Placeholder",
  bgColor = "#3b82f6",
  textColor = "#ffffff",
  className = "",
}: PlaceholderImageProps) {
  const svgContent = useMemo(() => {
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}" />
        <text 
          x="50%" 
          y="50%" 
          fontFamily="Arial, sans-serif" 
          fontSize="${Math.min(width, height) / 10}px" 
          fill="${textColor}" 
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          ${text}
        </text>
      </svg>
    `
  }, [width, height, text, bgColor, textColor])

  const dataUrl = useMemo(() => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
  }, [svgContent])

  return (
    <div
      className={className}
      style={{
        width: width,
        height: height,
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  )
}

