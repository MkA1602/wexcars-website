import * as Sentry from "@sentry/nextjs"

export const initializeMonitoring = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      // Performance monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
      // Session replay for better error context
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors

      // Set user feedback options
      beforeSend(event) {
        // Don't send events in development
        if (process.env.NODE_ENV === "development") {
          return null
        }
        return event
      },
    })
  }
}

// Capture unhandled promise rejections
export const captureUnhandledErrors = () => {
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      Sentry.captureException(event.reason)
    })
  }
}

// Add user context to errors
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(user)
  }
}

// Clear user context on logout
export const clearUserContext = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(null)
  }
}

// Custom error logger
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error(error)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, { extra: context })
  }
}

// Mock transaction for performance monitoring
// This replaces the previous startTransaction function that was causing errors
export const startTransaction = (name: string, op: string) => {
  // Return a mock transaction object that does nothing but provides the expected interface
  return {
    finish: () => {},
    setTag: () => ({}),
    setData: () => ({}),
    startChild: () => ({
      finish: () => {},
      setTag: () => ({}),
      setData: () => ({}),
    }),
  }
}
