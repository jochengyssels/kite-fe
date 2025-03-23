"use client"

import { useState } from "react"

interface DebugProps {
  name: string
  error?: string
}

export default function Debug({ name, error }: DebugProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="mt-8 p-4 border border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-red-800 dark:text-red-400 font-medium">Debug Information</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {showDetails && (
        <div className="mt-2 text-sm">
          <p>
            <strong>Requested Kitespot:</strong> "{name}"
          </p>
          {error && (
            <p>
              <strong>Error:</strong> {error}
            </p>
          )}
          <p>
            <strong>URL:</strong> {typeof window !== "undefined" ? window.location.href : ""}
          </p>
          <p>
            <strong>Decoded Name:</strong> "{decodeURIComponent(name)}"
          </p>
        </div>
      )}
    </div>
  )
}

