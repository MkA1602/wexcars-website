"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Car, Settings, LogOut, Plus } from "lucide-react"
import UserCars from "@/components/dashboard/user-cars"
import UserProfile from "@/components/dashboard/user-profile"
import UserSettings from "@/components/dashboard/user-settings"

interface DashboardContentProps {
  user: any
  profile: any
  cars: any[]
}

export default function DashboardContent({ user, profile, cars }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("cars")
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  // Check if we're in demo mode (no Supabase)
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <main className="flex-grow py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-blue-800 font-semibold">🎮 Demo Mode Active</h3>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              You're running in demo mode. All features are available including the new <strong>image upload from desktop</strong>! 
              Images are processed locally for testing.
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email || 'Demo User'}</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/dashboard/add-car">
              <Button className="bg-primary-light hover:bg-primary-dark text-white flex items-center gap-2">
                <Plus size={16} />
                Add New Car
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car size={16} />
              <span className="hidden sm:inline">My Cars</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cars">
            {cars.length > 0 ? (
              <UserCars cars={cars} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>My Cars</CardTitle>
                  <CardDescription>You haven't added any cars yet. Start by adding your first car.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Car size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Cars Found</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Start building your collection by adding your first luxury vehicle to showcase.
                  </p>
                  <Link href="/dashboard/add-car">
                    <Button className="bg-primary-light hover:bg-primary-dark text-white">Add Your First Car</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile user={user} profile={profile} />
          </TabsContent>

          <TabsContent value="settings">
            <UserSettings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
