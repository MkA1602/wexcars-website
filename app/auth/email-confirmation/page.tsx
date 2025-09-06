"use client"

import { CheckCircle, Mail, RefreshCw, Shield, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function EmailConfirmationPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const email = searchParams.get("email")
  const isConfirmed = message === "confirmed"

  const handleResendEmail = async () => {
    setIsResending(true)
    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
      setResendSuccess(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
            isConfirmed 
              ? "bg-gradient-to-r from-green-500 to-emerald-600" 
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}>
            {isConfirmed ? (
              <CheckCircle className="h-10 w-10 text-white" />
            ) : (
              <Mail className="h-10 w-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isConfirmed ? "Email Successfully Confirmed!" : "Email Verification Required"}
          </h1>
          <p className="text-lg text-gray-600">
            {isConfirmed 
              ? "Your WexCars account is now active and ready to use" 
              : "Complete your account setup to access WexCars"
            }
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {isConfirmed ? "Welcome to WexCars!" : "Check Your Email Inbox"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {isConfirmed 
                ? `Your email ${email ? `(${email})` : ''} has been successfully verified`
                : "We've sent a secure verification link to your email address"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Alert */}
            <Alert className={isConfirmed ? "border-green-200 bg-green-50" : "border-green-200 bg-green-50"}>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {isConfirmed ? (
                  <>
                    <strong>Account activated successfully!</strong> You can now access all WexCars features and start exploring our luxury vehicle collection.
                  </>
                ) : (
                  <>
                    <strong>Verification email sent successfully!</strong> Please check your inbox and follow the instructions to activate your account.
                  </>
                )}
              </AlertDescription>
            </Alert>

            {/* Instructions - Only show if not confirmed */}
            {!isConfirmed && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                Next Steps
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Check Your Email</p>
                    <p className="text-gray-600 text-sm">Look for an email from <span className="font-mono bg-gray-100 px-1 rounded">support@wexcars.com</span></p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Click the Verification Link</p>
                    <p className="text-gray-600 text-sm">Click the blue "Confirm your mail" button in the email</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Access Your Account</p>
                    <p className="text-gray-600 text-sm">You'll be redirected to your WexCars dashboard</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Important Notes - Only show if not confirmed */}
            {!isConfirmed && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <h4 className="font-semibold text-amber-800 mb-1">Important Notes:</h4>
                  <ul className="text-amber-700 space-y-1">
                    <li>• The verification link expires in 24 hours</li>
                    <li>• Check your spam/junk folder if you don't see the email</li>
                    <li>• Make sure you're using the same email address you registered with</li>
                  </ul>
                </div>
              </div>
            </div>
            )}

            {/* Timing Information - Only show if not confirmed */}
            {!isConfirmed && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <h4 className="font-semibold text-blue-800 mb-1">Email Delivery</h4>
                  <p className="text-blue-700">
                    Emails are typically delivered within 1-2 minutes. If you haven't received it after 5 minutes, 
                    please check your spam folder or try resending the verification email.
                  </p>
                </div>
              </div>
            </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {isConfirmed ? (
                <>
                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 text-base font-medium">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Explore Vehicles
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleResendEmail}
                    disabled={isResending || resendSuccess}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-medium"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : resendSuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Email Sent Successfully!
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                  
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Support Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Having trouble with email verification? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                      Help Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>WexCars</span>
            <span>•</span>
            <span>Premium Luxury Vehicle Platform</span>
            <span>•</span>
            <span>Secure & Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
} 