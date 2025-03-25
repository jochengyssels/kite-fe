"use client"

import { useState } from "react"

interface ApiResponse {
  message: string
  status: string
}

export default function ApiConnector() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFromBackend = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/backend-proxy")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Backend Connection Test</h2>
      <button
        onClick={fetchFromBackend}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Connecting..." : "Connect to Backend"}
      </button>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {data && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Message:</strong> {data.message}
          </p>
        </div>
      )}
    </div>
  )
}

