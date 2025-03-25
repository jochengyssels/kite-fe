"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

// Global state for toasts
let toastQueue: ToastProps[] = []
let listeners: Function[] = []

// Function to add a toast
export function toast(props: ToastProps) {
  toastQueue = [...toastQueue, { ...props, duration: props.duration || 5000 }]
  listeners.forEach((listener) => listener(toastQueue))

  // Auto-remove toast after duration
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t !== props)
    listeners.forEach((listener) => listener(toastQueue))
  }, props.duration || 5000)
}

// Toast component
export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    // Subscribe to toast updates
    const handleToastsChange = (newToasts: ToastProps[]) => {
      setToasts([...newToasts])
    }

    listeners.push(handleToastsChange)
    setToasts([...toastQueue])

    return () => {
      listeners = listeners.filter((l) => l !== handleToastsChange)
    }
  }, [])

  const removeToast = (toast: ToastProps) => {
    toastQueue = toastQueue.filter((t) => t !== toast)
    listeners.forEach((listener) => listener(toastQueue))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-full duration-300 ${
            toast.variant === "destructive"
              ? "bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800"
              : toast.variant === "success"
                ? "bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          }`}
        >
          <div className="flex-1">
            <h3
              className={`font-medium ${
                toast.variant === "destructive"
                  ? "text-red-800 dark:text-red-300"
                  : toast.variant === "success"
                    ? "text-green-800 dark:text-green-300"
                    : "text-slate-900 dark:text-slate-100"
              }`}
            >
              {toast.title}
            </h3>
            {toast.description && (
              <p
                className={`text-sm mt-1 ${
                  toast.variant === "destructive"
                    ? "text-red-700 dark:text-red-400"
                    : toast.variant === "success"
                      ? "text-green-700 dark:text-green-400"
                      : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast)}
            className={`p-1 rounded-full ${
              toast.variant === "destructive"
                ? "text-red-700 hover:bg-red-200 dark:text-red-400 dark:hover:bg-red-800"
                : toast.variant === "success"
                  ? "text-green-700 hover:bg-green-200 dark:text-green-400 dark:hover:bg-green-800"
                  : "text-slate-700 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

