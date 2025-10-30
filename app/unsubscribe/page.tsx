"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabase/client"
import Image from "next/image"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email')
  
  const [email, setEmail] = useState(emailFromUrl || "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    alreadyUnsubscribed?: boolean
  } | null>(null)

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setResult({
        success: false,
        message: "Please enter a valid email address"
      })
      return
    }

    setIsProcessing(true)
    setResult(null)

    try {
      // Check if email exists in subscribers
      const { data: subscriber, error: fetchError } = await supabaseClient
        .from('newsletter_subscribers')
        .select('id, status, email')
        .eq('email', email)
        .single()

      if (fetchError || !subscriber) {
        setResult({
          success: false,
          message: "Email not found in our newsletter subscribers list"
        })
        return
      }

      if (subscriber.status === 'unsubscribed') {
        setResult({
          success: true,
          message: "This email is already unsubscribed from our newsletter",
          alreadyUnsubscribed: true
        })
        return
      }

      // Update subscriber status to unsubscribed
      const { error: updateError } = await supabaseClient
        .from('newsletter_subscribers')
        .update({ 
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('id', subscriber.id)

      if (updateError) throw updateError

      // Log the unsubscription event
      await supabaseClient
        .from('newsletter_analytics')
        .insert({
          event_type: 'unsubscribed',
          event_data: {
            subscriber_email: email,
            unsubscribed_at: new Date().toISOString(),
            source: 'unsubscribe_page'
          }
        })

      setResult({
        success: true,
        message: "You have been successfully unsubscribed from our newsletter"
      })

    } catch (error: any) {
      console.error('Unsubscribe error:', error)
      setResult({
        success: false,
        message: error.message || "Failed to unsubscribe. Please try again."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResubscribe = async () => {
    if (!email) return

    setIsProcessing(true)
    setResult(null)

    try {
      // Reactivate subscription
      const { error } = await supabaseClient
        .from('newsletter_subscribers')
        .update({ 
          status: 'active',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null
        })
        .eq('email', email)

      if (error) throw error

      setResult({
        success: true,
        message: "Welcome back! You have been resubscribed to our newsletter"
      })

    } catch (error: any) {
      console.error('Resubscribe error:', error)
      setResult({
        success: false,
        message: error.message || "Failed to resubscribe. Please try again."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image 
                src={`${GITHUB_RAW_BASE}/new-white-logo-wexcars.png`}
                alt="WexCars Logo" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Newsletter Management</h1>
          <p className="text-gray-600">Manage your newsletter subscription</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Unsubscribe from Newsletter
            </CardTitle>
            <CardDescription>
              Enter your email address to unsubscribe from our newsletter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Unsubscribe"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Result Display */}
                <div className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.success ? 'Success!' : 'Error'}
                      </p>
                      <p className={`text-sm ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {result.success && !result.alreadyUnsubscribed && (
                    <Button 
                      onClick={handleResubscribe}
                      disabled={isProcessing}
                      variant="outline"
                      className="w-full"
                    >
                      {isProcessing ? "Processing..." : "Resubscribe"}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => {
                      setResult(null)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Try Another Email
                  </Button>
                  
                  <Link href="/" className="block">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Homepage
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800 mb-2">
                If you're having trouble unsubscribing or have questions about our newsletter, please contact us:
              </p>
              <div className="text-sm text-blue-800">
                <p>📧 Email: support@wexcars.com</p>
                <p>📞 Phone: +971 XX XXX XXXX</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} WexCars. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
