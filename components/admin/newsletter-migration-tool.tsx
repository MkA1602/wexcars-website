"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mail, Download, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function NewsletterMigrationTool() {
  const [localSubscriptions, setLocalSubscriptions] = useState<string[]>([])
  const [dbSubscriptions, setDbSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'completed' | 'error'>('idle')

  useEffect(() => {
    loadLocalSubscriptions()
    loadDbSubscriptions()
  }, [])

  const loadLocalSubscriptions = () => {
    try {
      const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]')
      setLocalSubscriptions(subscriptions)
    } catch (error) {
      console.error('Error loading local subscriptions:', error)
    }
  }

  const loadDbSubscriptions = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('newsletter_subscribers')
        .select('email')
        .order('subscribed_at', { ascending: false })

      if (error) throw error
      setDbSubscriptions(data || [])
    } catch (error) {
      console.error('Error loading DB subscriptions:', error)
    }
  }

  const migrateToDatabase = async () => {
    if (localSubscriptions.length === 0) {
      toast.error("No local subscriptions to migrate")
      return
    }

    setIsLoading(true)
    setMigrationStatus('migrating')

    try {
      const existingEmails = dbSubscriptions.map(sub => sub.email)
      const newSubscriptions = localSubscriptions.filter(email => !existingEmails.includes(email))

      if (newSubscriptions.length === 0) {
        toast.info("All local subscriptions already exist in database")
        setMigrationStatus('completed')
        return
      }

      // Insert new subscriptions
      const subscriptionsToInsert = newSubscriptions.map(email => ({
        email: email,
        status: 'active',
        subscribed_at: new Date().toISOString(),
        source: 'website_footer_migrated'
      }))

      const { error } = await supabaseClient
        .from('newsletter_subscribers')
        .insert(subscriptionsToInsert)

      if (error) throw error

      // Clear localStorage
      localStorage.removeItem('newsletter_subscriptions')
      
      toast.success(`Successfully migrated ${newSubscriptions.length} subscriptions to database`)
      setMigrationStatus('completed')
      
      // Reload data
      loadLocalSubscriptions()
      loadDbSubscriptions()
    } catch (error: any) {
      console.error('Migration error:', error)
      toast.error(`Migration failed: ${error.message}`)
      setMigrationStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const exportLocalSubscriptions = () => {
    if (localSubscriptions.length === 0) {
      toast.error("No local subscriptions to export")
      return
    }

    const csvContent = [
      ['Email', 'Source', 'Status'],
      ...localSubscriptions.map(email => [email, 'website_footer', 'active'])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `local-newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success("Local subscriptions exported successfully")
  }

  const clearLocalSubscriptions = () => {
    if (confirm("Are you sure you want to clear all local subscriptions? This action cannot be undone.")) {
      localStorage.removeItem('newsletter_subscriptions')
      loadLocalSubscriptions()
      toast.success("Local subscriptions cleared")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Migration Tool</h1>
        <p className="text-gray-600">Migrate localStorage subscriptions to the database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Local Storage Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Local Storage Subscriptions
            </CardTitle>
            <CardDescription>
              Subscriptions stored in browser localStorage (temporary)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {localSubscriptions.length} subscribers
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportLocalSubscriptions}
                    disabled={localSubscriptions.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearLocalSubscriptions}
                    disabled={localSubscriptions.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {localSubscriptions.length > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {localSubscriptions.map((email, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      {email}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No local subscriptions found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Database Subscriptions
            </CardTitle>
            <CardDescription>
              Subscriptions stored in Supabase database (permanent)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {dbSubscriptions.length} subscribers
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadDbSubscriptions}
                >
                  Refresh
                </Button>
              </div>

              {dbSubscriptions.length > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {dbSubscriptions.map((subscriber, index) => (
                    <div key={index} className="text-sm p-2 bg-green-50 rounded">
                      {subscriber.email}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No database subscriptions found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Actions</CardTitle>
          <CardDescription>
            Move subscriptions from localStorage to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localSubscriptions.length > 0 && (
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  You have {localSubscriptions.length} subscriptions in localStorage that can be migrated to the database.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={migrateToDatabase}
                disabled={isLoading || localSubscriptions.length === 0}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Migrating...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Migrate to Database
                  </>
                )}
              </Button>
            </div>

            {migrationStatus === 'completed' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Migration completed successfully! All subscriptions have been moved to the database.
                </AlertDescription>
              </Alert>
            )}

            {migrationStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Migration failed. Please check the console for error details and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>1. Setup Database:</strong> Run the newsletter setup SQL script in Supabase</p>
            <p><strong>2. Migrate Subscriptions:</strong> Use the migration tool above to move localStorage subscriptions to the database</p>
            <p><strong>3. Test System:</strong> Try subscribing with a new email to test the full system</p>
            <p><strong>4. Configure Email:</strong> Set up Resend API key for email sending</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
