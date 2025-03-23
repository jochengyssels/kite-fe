"use client"

import type React from "react"

import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Loader2, MapPin, Database } from "lucide-react"

export interface UnifiedInputProps {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  suggestions: string[]
  handleAutocomplete: (value: string) => Promise<void>
  handleSearch: () => Promise<void>
  loading: boolean
  autocompleteLoading?: boolean
  onSuggestionSelect: (suggestion: string) => void
  isFadingOut: boolean
  setIsFadingOut: Dispatch<SetStateAction<boolean>>
}

export default function UnifiedInput({
  query,
  setQuery,
  suggestions,
  handleAutocomplete,
  handleSearch,
  loading,
  autocompleteLoading = false,
  onSuggestionSelect,
  isFadingOut,
  setIsFadingOut,
}: UnifiedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFadingOut(true)
        setTimeout(() => {
          setIsFadingOut(false)
        }, 200)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsFadingOut])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleAutocomplete(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearInput = () => {
    setQuery("")
    setIsFadingOut(true)
    setTimeout(() => {
      setIsFadingOut(false)
    }, 200)
  }

  // Format suggestion display
  const formatSuggestion = (suggestion: string) => {
    const parts = suggestion.split(",").map((part) => part.trim())
    if (parts.length >= 3) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{parts[0]}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {parts[1]}, {parts[2]}
          </span>
        </div>
      )
    }
    return suggestion
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a location or ask a question..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            className="pl-10 pr-10 py-6 text-lg"
          />
          {query && (
            <button
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <Button onClick={() => handleSearch()} disabled={loading || !query.trim()} className="ml-2 px-6 py-6">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {(suggestions.length > 0 || autocompleteLoading) && !isFadingOut && (
        <div
          ref={suggestionsRef}
          className={`absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md overflow-hidden transition-opacity duration-200 border border-gray-200 dark:border-gray-700 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="py-1 px-2 bg-gray-50 dark:bg-slate-700 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-3 w-3 mr-1" />
              Database Kitespot Suggestions
            </div>
            {autocompleteLoading && <Loader2 className="h-3 w-3 animate-spin ml-2" />}
          </div>

          {autocompleteLoading ? (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Searching database...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => onSuggestionSelect(suggestion)}
                  >
                    {formatSuggestion(suggestion)}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No matching kitespots found</div>
          )}
        </div>
      )}
    </div>
  )
}

