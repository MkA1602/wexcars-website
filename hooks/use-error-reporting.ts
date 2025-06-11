"use client"

import { useCallback } from "react"
import * as Sentry from "@sentry/nextjs"

interface ErrorReportingOptions {
  tags?: Record<string, string>
  context?: Record<string, any>
  level?: Sentry.SeverityLevel
}

export function useErrorReporting() {
  const reportError = useCallback((error: Error | string, options?: ErrorReportingOptions) => {
    const errorObject = typeof error === "string" ? new Error(error) : error

    // Set up the scope with additional context
    Sentry.withScope((scope) => {
      // Add tags if provided
      if (options?.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          scope.setTag(key, value)
        })
      }

      // Add context if provided
      if (options?.context) {
        Object.entries(options.context).forEach(([key, value]) => {
          scope.setContext(key, value)
        })
      }

      // Set severity level if provided
      if (options?.level) {
        scope.setLevel(options.level)
      }

      // Capture the exception
      Sentry.captureException(errorObject)
    })

    // Also log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error(errorObject)
    }
  }, [])

  const reportMessage = useCallback((message: string, options?: ErrorReportingOptions) => {
    // Set up the scope with additional context
    Sentry.withScope((scope) => {
      // Add tags if provided
      if (options?.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          scope.setTag(key, value)
        })
      }

      // Add context if provided
      if (options?.context) {
        Object.entries(options.context).forEach(([key, value]) => {
          scope.setContext(key, value)
        })
      }

      // Set severity level if provided
      if (options?.level) {
        scope.setLevel(options.level)
      }

      // Capture the message
      Sentry.captureMessage(message)
    })

    // Also log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.log(message)
    }
  }, [])

  return {
    reportError,
    reportMessage,
    showFeedbackDialog: Sentry.showReportDialog,
  }
}
