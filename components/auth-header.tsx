"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAuthRole } from "@/hooks/use-auth-role"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export default function AuthHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { profile, isAdmin, isLoading } = useAuthRole()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogoError = () => {
    console.error("Logo failed to load, trying fallback")
    setLogoError(true)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleDashboard = () => {
    if (isAdmin) {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <header className="bg-white py-3 px-4 md:px-12 flex items-center justify-between shadow-sm border-b border-gray-100">
      <div className="flex items-center min-w-0">
        <Link href="/" className="flex items-center min-w-0">
          <div className="relative h-10 w-40 md:h-12 md:w-52 flex-shrink-0">
            {!logoError ? (
              <Image
                src={`${GITHUB_RAW_BASE}/wexcars-logo-new.png`}
                alt="WexCars Logo"
                width={180}
                height={44}
                className="h-full w-auto object-contain"
                priority
                onError={handleLogoError}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                WexCars Logo
              </div>
            )}
          </div>
        </Link>
        <nav className="hidden md:flex ml-8 lg:ml-12">
          <ul className="flex space-x-6 lg:space-x-8">
            <li>
              <Link
                href="/collections"
                className="text-black hover:text-primary-light font-medium transition-colors duration-200"
              >
                Our Collections
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="text-black hover:text-primary-light font-medium transition-colors duration-200"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-black hover:text-primary-light font-medium transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-black hover:text-primary-light font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full border border-gray-300 py-2 px-4 w-44 lg:w-64 focus:outline-none focus:ring-1 focus:ring-primary-light"
          />
          <Button
            type="submit"
            className="absolute right-0 top-0 h-full rounded-full bg-primary-light hover:bg-primary-dark text-white px-4"
          >
            Search
          </Button>
        </form>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-primary-light text-primary-light hover:bg-primary-light/10">
                <User size={16} />
                <span className="hidden lg:inline">{profile?.full_name || user.email}</span>
                {isAdmin && (
                  <Badge variant="default" className="ml-1 bg-primary-light text-white">
                    <Shield size={10} className="mr-1" />
                    Admin
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {isAdmin && (
                    <Badge variant="outline" className="self-start">
                      <Shield size={10} className="mr-1" />
                      Administrator
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDashboard}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{isAdmin ? 'Admin Dashboard' : 'Dashboard'}</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>User Dashboard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary-light hover:bg-primary-dark text-white">Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col">
          <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mb-2">
              {!logoError ? (
                <Image
                  src={`${GITHUB_RAW_BASE}/wexcars-logo-new.png`}
                  alt="WexCars Logo"
                  width={150}
                  height={36}
                  className="h-9 w-auto object-contain"
                  onError={handleLogoError}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <div className="h-9 w-36 bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  WexCars Logo
                </div>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute right-4 top-4 p-2">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center">
            <ul className="space-y-6 text-center">
              <li>
                <Link
                  href="/collections"
                  className="text-xl font-medium text-black hover:text-primary-light block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-xl font-medium text-black hover:text-primary-light block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xl font-medium text-black hover:text-primary-light block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xl font-medium text-black hover:text-primary-light block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="px-6 pb-8 flex flex-col space-y-4">
            {user ? (
              <>
                <div className="text-center mb-4">
                  <p className="font-medium">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {isAdmin && (
                    <Badge variant="outline" className="mt-2">
                      <Shield size={10} className="mr-1" />
                      Administrator
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleDashboard()
                  }}
                  className="w-full bg-primary-light hover:bg-primary-dark text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleSignOut()
                  }}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-primary-light text-primary-light hover:bg-primary-light/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary-light hover:bg-primary-dark text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
} 