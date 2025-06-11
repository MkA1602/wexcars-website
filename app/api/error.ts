import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

export function handleApiError(error: Error, request: Request) {
  // Log the error to Sentry with request details
  Sentry.withScope((scope) => {
    scope.setExtra("url", request.url)
    scope.setExtra("method", request.method)
    Sentry.captureException(error)
  })

  // Return a standardized error response
  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : error.message,
    },
    { status: 500 },
  )
}

export default handleApiError
