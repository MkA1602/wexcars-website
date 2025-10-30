"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X, Mail, AlertCircle } from "lucide-react"

interface Notification {
  show: boolean
  type: 'success' | 'error' | 'info'
  message: string
  title: string
}

export default function NewsletterNotificationDemo() {
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: '',
    title: ''
  })

  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({
      show: true,
      type,
      title,
      message
    })
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 5000)
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Notification Demo</h1>
        <p className="text-gray-600">Test the beautiful notification system for newsletter subscriptions</p>
      </div>

      {/* Demo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Success Notification
            </CardTitle>
            <CardDescription>
              Shows when subscription is successful
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => showNotification('success', 'Subscription Successful!', 'Thank you for subscribing! You\'ll receive our latest updates.')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Test Success Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Info Notification
            </CardTitle>
            <CardDescription>
              Shows when email is already subscribed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => showNotification('info', 'Already Subscribed', 'This email is already subscribed to our newsletter')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Test Info Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              Error Notification
            </CardTitle>
            <CardDescription>
              Shows when subscription fails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => showNotification('error', 'Subscription Failed', 'Failed to subscribe. Please try again or contact support.')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Test Error Notification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Features</CardTitle>
          <CardDescription>
            What makes our notification system special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Visual Design</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Beautiful slide-in animation from right
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Color-coded by notification type
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Clean, modern design with shadows
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Responsive layout for all devices
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">User Experience</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Auto-dismisses after 5 seconds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Manual close button
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Non-intrusive positioning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Clear title and message
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Component */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success' ? 'border-green-500' :
            notification.type === 'error' ? 'border-red-500' :
            'border-blue-500'
          }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${
                  notification.type === 'success' ? 'text-green-500' :
                  notification.type === 'error' ? 'text-red-500' :
                  'text-blue-500'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : notification.type === 'error' ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Mail className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    notification.type === 'success' ? 'text-green-700' :
                    notification.type === 'error' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={closeNotification}
                    className={`inline-flex rounded-md p-1.5 ${
                      notification.type === 'success' ? 'text-green-500 hover:text-green-700' :
                      notification.type === 'error' ? 'text-red-500 hover:text-red-700' :
                      'text-blue-500 hover:text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      notification.type === 'success' ? 'focus:ring-green-500' :
                      notification.type === 'error' ? 'focus:ring-red-500' :
                      'focus:ring-blue-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
