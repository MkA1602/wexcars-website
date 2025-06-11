"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ErrorStat {
  name: string
  count: number
  lastSeen: string
}

export default function MonitoringDashboard() {
  const [errorStats, setErrorStats] = useState<ErrorStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch data from your Sentry API
    // This is a mock implementation for demonstration purposes
    const fetchErrorStats = async () => {
      try {
        setIsLoading(true)
        // Mock data - in a real app, you would fetch this from Sentry's API
        const mockData: ErrorStat[] = [
          { name: "TypeError: Cannot read property of undefined", count: 24, lastSeen: "2 minutes ago" },
          { name: "Failed to fetch", count: 18, lastSeen: "15 minutes ago" },
          { name: "Uncaught SyntaxError", count: 7, lastSeen: "1 hour ago" },
          { name: "ChunkLoadError", count: 5, lastSeen: "3 hours ago" },
          { name: "Network Error", count: 3, lastSeen: "1 day ago" },
        ]

        setTimeout(() => {
          setErrorStats(mockData)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching monitoring data:", error)
        setIsLoading(false)
      }
    }

    fetchErrorStats()

    // Set up polling to refresh data every 5 minutes
    const intervalId = setInterval(fetchErrorStats, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Application Monitoring</h2>

      <Tabs defaultValue="errors">
        <TabsList>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">User Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
                </div>
              ) : errorStats.length > 0 ? (
                <div className="space-y-4">
                  {errorStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{stat.name}</p>
                        <p className="text-sm text-gray-500">Last seen: {stat.lastSeen}</p>
                      </div>
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                        {stat.count} occurrences
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-gray-500">No errors detected in the last 24 hours</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {isLoading ? "-" : errorStats.reduce((sum, stat) => sum + stat.count, 0)}
                </p>
                <p className="text-sm text-gray-500">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Affected Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{isLoading ? "-" : "18"}</p>
                <p className="text-sm text-gray-500">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{isLoading ? "-" : "0.8%"}</p>
                <p className="text-sm text-gray-500">Of all sessions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">Performance monitoring data will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">User impact data will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-500 mt-4">
        <p>
          For detailed error reports and analytics, visit the{" "}
          <a
            href="https://sentry.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-light hover:underline"
          >
            Sentry Dashboard
          </a>
          .
        </p>
      </div>
    </div>
  )
}
