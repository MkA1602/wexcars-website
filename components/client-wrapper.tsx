"use client"

import { useState, useEffect, type ReactNode, Suspense } from "react"
import ErrorBoundary from "./error-boundary"

interface ClientWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientWrapper({ children, fallback }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return fallback || <div className="min-h-[100px] flex items-center justify-center">Loading...</div>
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <div className="min-h-[100px] flex items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
