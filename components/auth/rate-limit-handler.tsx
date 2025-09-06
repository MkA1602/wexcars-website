"use client"

import { AlertCircle, Clock, Mail, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface RateLimitHandlerProps {
  error: string
  onRetry?: () => void
  onContactSupport?: () => void
}

export default function RateLimitHandler({ error, onRetry, onContactSupport }: RateLimitHandlerProps) {
  const [countdown, setCountdown] = useState(900) // 15 minutes in seconds
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleRetry = async () => {
    if (countdown > 0) return
    
    setIsRetrying(true)
    try {
      if (onRetry) {
        await onRetry()
      }
    } finally {
      setIsRetrying(false)
    }
  }

  const isRateLimited = error.toLowerCase().includes('rate limit') || 
                       error.toLowerCase().includes('temporarily limited') ||
                       error.toLowerCase().includes('too many attempts')

  if (!isRateLimited) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-amber-800 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Email Sending Temporarily Limited
        </CardTitle>
        <CardDescription className="text-amber-700">
          Our email service is experiencing high demand. Please wait before trying again.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rate Limit Explanation */}
        <div className="bg-white/50 rounded-lg p-4 border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Why This Happens
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Email service providers limit sending rates to prevent spam</li>
            <li>• This is a temporary restriction that resets automatically</li>
            <li>• Your registration will work once the limit resets</li>
          </ul>
        </div>

        {/* Countdown Timer */}
        {countdown > 0 && (
          <div className="bg-white/50 rounded-lg p-4 border border-amber-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="font-semibold text-amber-800">Please Wait</span>
            </div>
            <div className="text-2xl font-mono font-bold text-amber-700 mb-2">
              {formatTime(countdown)}
            </div>
            <p className="text-sm text-amber-600">
              You can try again when the timer reaches 00:00
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            disabled={countdown > 0 || isRetrying}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : countdown > 0 ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Wait {formatTime(countdown)}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/contact'}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Contact Support
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/help'}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Help Center
            </Button>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Alternative Options:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try again in a few minutes</li>
            <li>• Contact our support team for immediate assistance</li>
            <li>• Check your spam folder if you already registered</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
