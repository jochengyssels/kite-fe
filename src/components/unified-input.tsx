"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search, Send, X } from "lucide-react"

interface UnifiedInputProps {
  onSearch: (query: string, selectedLocation?: string) => void
  onAutocomplete?: (query: string) => Promise<string[]>
  placeholder?: string
  className?: string
}

export default function UnifiedInput({
  onSearch,
  onAutocomplete,
  placeholder = "Enter a kitespot or ask me anything...",
  className,
}: UnifiedInputProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAutocomplete = async (value: string) => {
    setQuery(value)

    if (value.trim() && onAutocomplete) {
      try {
        const results = await onAutocomplete(value)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error)
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    setSelectedSuggestionIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
        // If a suggestion is selected, use that
        const selectedSuggestion = suggestions[selectedSuggestionIndex]
        setQuery(selectedSuggestion)
        setSuggestions([])
        setShowSuggestions(false)
        onSearch(query, selectedSuggestion)
      } else {
        // Otherwise use the current query
        onSearch(query)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Escape") {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const clearInput = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className={cn("w-full relative", className)}>
      <div
        className={cn(
          "relative flex items-center w-full bg-white dark:bg-slate-800 rounded-full shadow-md transition-all duration-200",
          isFocused ? "ring-2 ring-sky-500 shadow-lg" : "hover:shadow-lg",
        )}
      >
        <div className="flex-1 flex items-center">
          <Search className="h-5 w-5 ml-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="flex-1 py-4 px-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400"
            value={query}
            onChange={(e) => handleAutocomplete(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false)
                setShowSuggestions(false)
              }, 200)
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              onClick={clearInput}
              className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          onClick={() => onSearch(query)}
          disabled={!query}
          className={cn(
            "rounded-full h-10 w-10 mr-1 flex items-center justify-center",
            query ? "bg-sky-600 hover:bg-sky-700" : "bg-slate-200 dark:bg-slate-700",
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700",
                selectedSuggestionIndex === index && "bg-slate-100 dark:bg-slate-700",
              )}
              onClick={() => {
                setQuery(suggestion)
                setSuggestions([])
                setShowSuggestions(false)
                onSearch(query, suggestion)
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

