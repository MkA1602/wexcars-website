"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Users</h2>
        <p className="text-red-600 mb-4">{error.message || "An unexpected error occurred while loading the users."}</p>
        <div className="flex gap-4">
          <Button onClick={reset} variant="destructive">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
