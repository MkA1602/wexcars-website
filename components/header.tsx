"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const router = useRouter()



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

  return (
    <header className="sticky top-0 z-50 bg-white py-3 px-4 md:px-12 flex items-center justify-between shadow-sm border-b border-gray-100">
      <div className="flex items-center min-w-0">
        <Link href="/" className="flex items-center min-w-0">
          <div className="relative h-10 w-40 md:h-12 md:w-52 flex-shrink-0">
            {!logoError ? (
              <Image
                src={`${GITHUB_RAW_BASE}/new-red-logo -wexcars.png`}
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

        <Link href="/sign-in">
          <Button variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light/10">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-primary-light hover:bg-primary-dark text-white">Sign Up</Button>
        </Link>
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
                  src={`${GITHUB_RAW_BASE}/new-red-logo -wexcars.png`}
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
            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-primary-light text-primary-light hover:bg-primary-light/10">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-primary-light hover:bg-primary-dark text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
