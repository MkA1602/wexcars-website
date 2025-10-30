"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Wifi, Key } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: string
}

export default function SupabaseConnectionTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [overallStatus, setOverallStatus] = useState<'unknown' | 'success' | 'error' | 'warning'>('unknown')

  const runTests = async () => {
    setIsRunning(true)
    setResults([])
    setOverallStatus('unknown')

    const testResults: TestResult[] = []

    // Test 1: Environment Variables
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        testResults.push({
          name: 'Environment Variables',
          status: 'error',
          message: 'Missing Supabase environment variables',
          details: `URL: ${supabaseUrl ? '✅' : '❌'}, Key: ${supabaseAnonKey ? '✅' : '❌'}`
        })
      } else {
        testResults.push({
          name: 'Environment Variables',
          status: 'success',
          message: 'Environment variables are configured',
          details: `URL: ${supabaseUrl.substring(0, 30)}..., Key: ${supabaseAnonKey.substring(0, 20)}...`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'Environment Variables',
        status: 'error',
        message: 'Failed to check environment variables',
        details: String(error)
      })
    }

    // Test 2: Network Connectivity
    try {
      const response = await fetch('https://api.github.com', { 
        method: 'HEAD',
        mode: 'no-cors'
      })
      testResults.push({
        name: 'Network Connectivity',
        status: 'success',
        message: 'Network connection is working'
      })
    } catch (error) {
      testResults.push({
        name: 'Network Connectivity',
        status: 'error',
        message: 'Network connection failed',
        details: String(error)
      })
    }

    // Test 3: Supabase Client Initialization
    try {
      if (!supabaseClient) {
        throw new Error('Supabase client is not initialized')
      }
      testResults.push({
        name: 'Supabase Client',
        status: 'success',
        message: 'Supabase client is initialized'
      })
    } catch (error) {
      testResults.push({
        name: 'Supabase Client',
        status: 'error',
        message: 'Supabase client initialization failed',
        details: String(error)
      })
    }

    // Test 4: Supabase Connection
    try {
      const { data, error } = await supabaseClient
        .from('newsletter_subscribers')
        .select('count')
        .limit(1)

      if (error) {
        if (error.message.includes('relation "newsletter_subscribers" does not exist')) {
          testResults.push({
            name: 'Database Tables',
            status: 'warning',
            message: 'Newsletter tables not created yet',
            details: 'Run the newsletter setup SQL script to create tables'
          })
        } else {
          testResults.push({
            name: 'Supabase Connection',
            status: 'error',
            message: 'Supabase connection failed',
            details: error.message
          })
        }
      } else {
        testResults.push({
          name: 'Supabase Connection',
          status: 'success',
          message: 'Successfully connected to Supabase'
        })
      }
    } catch (error: any) {
      testResults.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Supabase connection test failed',
        details: error.message
      })
    }

    // Test 5: Authentication
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser()
      if (error) {
        testResults.push({
          name: 'Authentication',
          status: 'warning',
          message: 'Authentication not configured',
          details: 'This is normal for public newsletter subscriptions'
        })
      } else {
        testResults.push({
          name: 'Authentication',
          status: 'success',
          message: 'Authentication is working',
          details: user ? `Logged in as: ${user.email}` : 'No user logged in'
        })
      }
    } catch (error: any) {
      testResults.push({
        name: 'Authentication',
        status: 'warning',
        message: 'Authentication test failed',
        details: error.message
      })
    }

    setResults(testResults)

    // Determine overall status
    const hasErrors = testResults.some(r => r.status === 'error')
    const hasWarnings = testResults.some(r => r.status === 'warning')
    
    if (hasErrors) {
      setOverallStatus('error')
    } else if (hasWarnings) {
      setOverallStatus('warning')
    } else {
      setOverallStatus('success')
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'success': { color: 'bg-green-100 text-green-800', text: 'Success' },
      'error': { color: 'bg-red-100 text-red-800', text: 'Error' },
      'warning': { color: 'bg-yellow-100 text-yellow-800', text: 'Warning' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['error']
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getOverallStatusIcon = () => {
    switch (overallStatus) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
        return <XCircle className="w-8 h-8 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />
      default:
        return <Database className="w-8 h-8 text-gray-600" />
    }
  }

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'success':
        return 'All systems are working correctly!'
      case 'error':
        return 'There are critical issues that need to be fixed.'
      case 'warning':
        return 'System is working but needs some configuration.'
      default:
        return 'Run the diagnostic test to check system status.'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Connection Diagnostic</h1>
        <p className="text-gray-600">Test your Supabase connection and diagnose issues</p>
      </div>

      {/* Overall Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {getOverallStatusIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getOverallStatusMessage()}
              </h2>
              <p className="text-gray-600">
                {overallStatus === 'unknown' 
                  ? 'Click "Run Diagnostic" to check your system'
                  : `${results.length} tests completed`
                }
              </p>
            </div>
            <div className="ml-auto">
              <Button 
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Run Diagnostic
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{result.name}</h3>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Troubleshooting Guide */}
      {overallStatus === 'error' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Troubleshooting Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Environment Variables Issue:</strong> Check your `.env.local` file has the correct Supabase URL and API key.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Wifi className="h-4 w-4" />
                <AlertDescription>
                  <strong>Network Issue:</strong> Check your internet connection and try again.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>Database Issue:</strong> Run the newsletter setup SQL script in your Supabase dashboard.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>API Key Issue:</strong> Verify your Supabase API key is correct and has the right permissions.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common fixes for connection issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <a href="/admin/newsletter-migration" target="_blank">
                <Database className="w-4 h-4 mr-2" />
                Migration Tool
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/newsletter-management" target="_blank">
                <CheckCircle className="w-4 h-4 mr-2" />
                Newsletter Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
