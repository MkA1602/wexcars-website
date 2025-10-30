"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Mail, Bell, BellOff, Settings } from "lucide-react"

interface Notification {
  show: boolean
  type: 'success' | 'error' | 'info'
  message: string
  title: string
}

export default function NotificationSettings() {
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: '',
    title: ''
  })
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>('default')
  const [isBrowserNotificationEnabled, setIsBrowserNotificationEnabled] = useState(false)

  useEffect(() => {
    // Check browser notification permission
    if ('Notification' in window) {
      setBrowserNotificationPermission(Notification.permission)
    }
  }, [])

  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({
      show: true,
      type,
      title,
      message
    })
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 6000)

    // Show browser notification if enabled
    if (isBrowserNotificationEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'newsletter-subscription',
        requireInteraction: false
      })
    }
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setBrowserNotificationPermission(permission)
      
      if (permission === 'granted') {
        setIsBrowserNotificationEnabled(true)
        showNotification('success', '🔔 Notifications Enabled', 'You\'ll now receive browser notifications for newsletter updates!')
      } else {
        showNotification('info', 'Notifications Disabled', 'Browser notifications are disabled. You\'ll still see in-app notifications.')
      }
    }
  }

  const toggleBrowserNotifications = () => {
    if (browserNotificationPermission === 'granted') {
      setIsBrowserNotificationEnabled(!isBrowserNotificationEnabled)
      showNotification(
        'success', 
        isBrowserNotificationEnabled ? '🔕 Notifications Disabled' : '🔔 Notifications Enabled',
        isBrowserNotificationEnabled ? 'Browser notifications turned off' : 'Browser notifications turned on'
      )
    } else {
      requestNotificationPermission()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Manage how you receive newsletter subscription notifications</p>
      </div>

      {/* Notification Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Toast Notifications
            </CardTitle>
            <CardDescription>
              Beautiful in-app notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">Always Active</Badge>
              <p className="text-sm text-gray-600">
                Slide-in notifications in the top-right corner
              </p>
              <Button 
                onClick={() => showNotification('success', '🚗 Subscription Successful!', 'Welcome to WexCars! You\'ll receive exclusive updates on luxury cars.')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Test Toast Notification
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Browser Notifications
            </CardTitle>
            <CardDescription>
              System-level notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={
                browserNotificationPermission === 'granted' 
                  ? 'bg-green-100 text-green-800' 
                  : browserNotificationPermission === 'denied'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }>
                {browserNotificationPermission === 'granted' ? 'Enabled' : 
                 browserNotificationPermission === 'denied' ? 'Blocked' : 'Not Set'}
              </Badge>
              <p className="text-sm text-gray-600">
                Native browser notifications
              </p>
              <Button 
                onClick={toggleBrowserNotifications}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={browserNotificationPermission === 'denied'}
              >
                {browserNotificationPermission === 'granted' 
                  ? (isBrowserNotificationEnabled ? 'Disable' : 'Enable')
                  : 'Request Permission'
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Welcome emails and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">Automatic</Badge>
              <p className="text-sm text-gray-600">
                Welcome emails sent automatically
              </p>
              <Button 
                onClick={() => showNotification('info', '📧 Email Sent', 'Welcome email has been sent to your inbox!')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Test Email Notification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Notification Features</CardTitle>
          <CardDescription>
            What users experience when they subscribe to the newsletter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Immediate Feedback</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Beautiful toast notification appears instantly
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Newsletter section updates with success state
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Form disappears and shows confirmation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Smooth animations and transitions
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Follow-up Actions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Welcome email sent automatically
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Admin notification sent to website owner
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Subscription stored in database
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Analytics tracked for reporting
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Notification Status */}
      {browserNotificationPermission === 'denied' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellOff className="w-5 h-5 text-red-600" />
              Browser Notifications Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Browser notifications are currently blocked. To enable them:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Click the notification icon in your browser's address bar</li>
                <li>Select "Allow" for notifications from this site</li>
                <li>Refresh the page and try again</li>
              </ol>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You'll still receive beautiful toast notifications even if browser notifications are disabled.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toast Notification Component */}
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
