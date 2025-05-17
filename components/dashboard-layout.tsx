"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Heart, Clock, Settings, MessageSquare, FileText, LogOut, Home } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { signOut } from "@/lib/supabase-auth"
import Logo from "@/components/logo"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <Logo variant="light" size="small" className="mb-2" />
                  <h2 className="text-lg font-bold">Dashboard</h2>
                </div>
                <nav className="p-2">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Home className="h-5 w-5 mr-3" />
                        Overview
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <User className="h-5 w-5 mr-3" />
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/saved-cars"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Heart className="h-5 w-5 mr-3" />
                        Saved Cars
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/history"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Clock className="h-5 w-5 mr-3" />
                        Browsing History
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/messages"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <MessageSquare className="h-5 w-5 mr-3" />
                        Messages
                        <span className="ml-auto bg-primary-100 text-primary-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          3
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/documents"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <FileText className="h-5 w-5 mr-3" />
                        Documents
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                      </Link>
                    </li>
                    <li className="pt-2 mt-2 border-t">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
