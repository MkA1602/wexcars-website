"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Users, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Plus,
  Calendar
} from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface NewsletterSubscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  unsubscribed_at?: string
  source: string
  tags?: string[]
}

interface NewsletterCampaign {
  id: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  scheduled_at?: string
  sent_at?: string
  recipient_count: number
  open_count: number
  click_count: number
  created_at: string
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("subscribers")
  const [error, setError] = useState<string | null>(null)

  // Newsletter subscription form
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Campaign form
  const [campaignForm, setCampaignForm] = useState({
    subject: "",
    content: "",
    scheduled_at: ""
  })

  useEffect(() => {
    fetchSubscribers()
    fetchCampaigns()
  }, [])

  const fetchSubscribers = async () => {
    try {
      console.log('Fetching subscribers...')
      setError(null)
      const { data, error: fetchError } = await supabaseClient
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })

      console.log('Supabase response:', { data, error: fetchError })

      if (fetchError) {
        console.error('Supabase error:', fetchError)
        
        // Check for specific error types
        if (fetchError.code === '42P01') {
          // Table doesn't exist
          setError('Database table not found. Please run the newsletter setup SQL script.')
          toast.error('Database not configured. Please set up the newsletter_subscribers table.')
        } else if (fetchError.code === '42501' || fetchError.message?.includes('permission')) {
          // RLS policy issue
          setError('Permission denied. Please check Row Level Security (RLS) policies.')
          toast.error('Access denied. Please check database permissions.')
        } else if (fetchError.message?.includes('Failed to fetch')) {
          // Connection issue
          setError('Connection failed. Please check your Supabase connection settings.')
          toast.error('Connection error. Please check your Supabase configuration.')
        } else {
          setError(fetchError.message || 'Failed to fetch subscribers')
          toast.error(`Error: ${fetchError.message || 'Failed to fetch subscribers'}`)
        }
        setSubscribers([])
        return
      }
      
      console.log('Setting subscribers:', data)
      setSubscribers(data || [])
    } catch (error: any) {
      console.error('Error fetching subscribers:', error)
      const errorMessage = error?.message || 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(`Error: ${errorMessage}`)
      setSubscribers([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCampaigns = async () => {
    try {
      // Note: campaigns table might not exist, so we'll handle it gracefully
      const { data, error: fetchError } = await supabaseClient
        .from('newsletter_campaigns')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        // Campaigns table might not exist yet - that's okay
        if (fetchError.code !== '42P01') {
          console.error('Error fetching campaigns:', fetchError)
        }
        setCampaigns([])
        return
      }
      
      setCampaigns(data || [])
    } catch (error: any) {
      console.error('Error fetching campaigns:', error)
      setCampaigns([])
    }
  }

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubscribing(true)
    try {
      // Check if email already exists
      const { data: existingSubscriber } = await supabaseClient
        .from('newsletter_subscribers')
        .select('id, status')
        .eq('email', email)
        .single()

      if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
          toast.error("This email is already subscribed to our newsletter")
          return
        } else if (existingSubscriber.status === 'unsubscribed') {
          // Reactivate subscription
          await supabaseClient
            .from('newsletter_subscribers')
            .update({ 
              status: 'active',
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null
            })
            .eq('id', existingSubscriber.id)
          
          toast.success("Welcome back! Your subscription has been reactivated.")
        }
      } else {
        // Create new subscription
        const { error } = await supabaseClient
          .from('newsletter_subscribers')
          .insert({
            email: email,
            status: 'active',
            subscribed_at: new Date().toISOString(),
            source: 'website_footer'
          })

        if (error) throw error
        toast.success("Thank you for subscribing! You'll receive our latest updates.")
      }

      // Send welcome email
      await sendWelcomeEmail(email)
      
      // Send admin notification
      await sendAdminNotification(email)

      setEmail("")
      fetchSubscribers()
    } catch (error: any) {
      console.error('Subscription error:', error)
      toast.error(error.message || "Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  const sendWelcomeEmail = async (subscriberEmail: string) => {
    try {
      // This would integrate with your email service (SendGrid, Mailgun, etc.)
      const { error } = await supabaseClient.functions.invoke('send-welcome-email', {
        body: {
          email: subscriberEmail,
          template: 'welcome'
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Welcome email error:', error)
      // Don't fail the subscription if welcome email fails
    }
  }

  const sendAdminNotification = async (subscriberEmail: string) => {
    try {
      // Send notification to admin about new subscriber
      const { error } = await supabaseClient.functions.invoke('send-admin-notification', {
        body: {
          type: 'new_subscriber',
          email: subscriberEmail,
          timestamp: new Date().toISOString()
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Admin notification error:', error)
    }
  }

  const handleUnsubscribe = async (subscriberId: string) => {
    try {
      await supabaseClient
        .from('newsletter_subscribers')
        .update({ 
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('id', subscriberId)

      toast.success("Subscriber unsubscribed successfully")
      fetchSubscribers()
    } catch (error) {
      console.error('Unsubscribe error:', error)
      toast.error("Failed to unsubscribe")
    }
  }

  const handleDeleteSubscriber = async (subscriberId: string) => {
    try {
      await supabaseClient
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberId)

      toast.success("Subscriber deleted successfully")
      fetchSubscribers()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error("Failed to delete subscriber")
    }
  }

  const exportSubscribers = async () => {
    try {
      const csvContent = [
        ['Email', 'Status', 'Subscribed At', 'Source'],
        ...subscribers.map(sub => [
          sub.email,
          sub.status,
          new Date(sub.subscribed_at).toLocaleDateString(),
          sub.source
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Subscribers exported successfully")
    } catch (error) {
      console.error('Export error:', error)
      toast.error("Failed to export subscribers")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', text: 'Active' },
      'unsubscribed': { color: 'bg-red-100 text-red-800', text: 'Unsubscribed' },
      'bounced': { color: 'bg-yellow-100 text-yellow-800', text: 'Bounced' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['active']
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getCampaignStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      'scheduled': { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
      'sent': { color: 'bg-green-100 text-green-800', text: 'Sent' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['draft']
    return <Badge className={config.color}>{config.text}</Badge>
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light mx-auto mb-4"></div>
            <p className="text-gray-600">Loading newsletter management...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Management</h1>
            <p className="text-gray-600">Manage your newsletter subscribers and campaigns</p>
          </div>
          <Button
            onClick={() => {
              setIsLoading(true)
              fetchSubscribers()
            }}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Database Setup Required</h3>
                <p className="text-red-800 mb-4">{error}</p>
                <div className="space-y-2">
                  <p className="text-sm text-red-700 font-medium">To fix this issue:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                    <li>Open your Supabase SQL Editor</li>
                    <li>Run the SQL script: <code className="bg-red-100 px-2 py-1 rounded">scripts/newsletter-quick-setup.sql</code></li>
                    <li>Refresh this page after the script completes</li>
                  </ol>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Button
                      onClick={() => {
                        setIsLoading(true)
                        fetchSubscribers()
                      }}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Button
                      onClick={() => {
                        window.open('/admin/supabase-test', '_blank')
                      }}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>• Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>• Error: {error || 'None'}</p>
            <p>• Subscribers Count: {subscribers.length}</p>
            <p>• Subscribers Data: {JSON.stringify(subscribers.slice(0, 2), null, 2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscribers.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="subscription-form">Subscription Form</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <CardDescription>Manage your newsletter subscribers</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportSubscribers}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-sm text-gray-600">
                          Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Source: {subscriber.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(subscriber.status)}
                      <div className="flex gap-1">
                        {subscriber.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUnsubscribe(subscriber.id)}
                          >
                            Unsubscribe
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {subscribers.length === 0 && (
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscribers yet</h3>
                    <p className="text-gray-600">Subscribers will appear here when they sign up</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>Manage your email campaigns</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Send className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{campaign.subject}</p>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Recipients: {campaign.recipient_count} | Opens: {campaign.open_count} | Clicks: {campaign.click_count}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getCampaignStatusBadge(campaign.status)}
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-600">Create your first email campaign</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription-form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscription Form</CardTitle>
              <CardDescription>Test the newsletter subscription functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsletterSubscription} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="w-full"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe to Newsletter"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
