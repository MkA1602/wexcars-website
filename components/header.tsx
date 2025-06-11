"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-auto">
            <Image
              src="/wexcars-logo-new.png"
              alt="WexCars Logo"
              width={220}
              height={48}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </Link>
        <nav className="hidden md:flex ml-12">
          <ul className="flex space-x-8">
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
      <div className="hidden md:flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full border border-gray-300 py-2 px-4 w-64 focus:outline-none focus:ring-1 focus:ring-primary-light"
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
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/wexcars-logo-new.png"
                  alt="WexCars Logo"
                  width={180}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mb-8">
              <ul className="space-y-6">
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

            <div className="space-y-4">
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
        </div>
      )}
    </header>
  )
}
