"use client"

import { useState, useEffect } from "react"
import { XIcon } from "lucide-react"
import { useErrorReporting } from "@/hooks/use-error-reporting"

interface ErrorNotificationProps {
  error: Error | string
  onClose: () => void
  showReportButton?: boolean
  autoHideDuration?: number
}

export default function ErrorNotification({
  error,
  onClose,
  showReportButton = true,
  autoHideDuration = 5000,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { showFeedbackDialog } = useErrorReporting()

  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Allow time for animation
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
  }, [autoHideDuration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Allow time for animation
  }

  const handleReport = () => {
    showFeedbackDialog()
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-md transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error Occurred</h3>
          <div className="mt-1 text-sm text-red-700">{typeof error === "string" ? error : error.message}</div>

          {showReportButton && (
            <button onClick={handleReport} className="mt-2 text-xs text-red-800 hover:underline">
              Report this issue
            </button>
          )}
        </div>

        <button onClick={handleClose} className="ml-4 text-red-400 hover:text-red-600" aria-label="Close">
          <XIcon size={16} />
        </button>
      </div>
    </div>
  )
}
