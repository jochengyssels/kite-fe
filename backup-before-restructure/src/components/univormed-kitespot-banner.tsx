import { AlertTriangle } from "lucide-react"

export default function UnconfirmedKitespotBanner() {
  return (
    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 rounded-md flex items-start">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="text-amber-800 dark:text-amber-400 font-medium mb-1">Unconfirmed Kitespot</h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">
          This location is not in our verified kitespot database. Information shown is based on general location data.
        </p>
      </div>
    </div>
  )
}

