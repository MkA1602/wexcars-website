"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import * as Sentry from "@sentry/nextjs"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  showReportDialog?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Capture the error in Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo)
      Sentry.captureException(error)
    })

    // Update state with error info for potential rendering
    this.setState({ errorInfo })

    // Show Sentry user feedback dialog if enabled
    if (this.props.showReportDialog) {
      Sentry.showReportDialog()
    }

    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Our team has been notified of this issue.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => Sentry.showReportDialog()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Report Feedback
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
