"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, User, SearchIcon } from "lucide-react"
import SearchBar from "./search-bar"
import Logo from "./logo"
import { useHeader } from "@/contexts/header-context"
import { useOnClickOutside } from "@/hooks/use-click-outside"

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Inventory",
    href: "/inventory",
    children: [
      { name: "All Vehicles", href: "/inventory" },
      { name: "Luxury Sedans", href: "/inventory?type=sedan" },
      { name: "Sports Cars", href: "/inventory?type=sports" },
      { name: "SUVs", href: "/inventory?type=suv" },
      { name: "New Arrivals", href: "/inventory?sort=newest" },
    ],
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Financing", href: "/services#financing" },
      { name: "Trade-In", href: "/services#trade-in" },
      { name: "Maintenance", href: "/services#maintenance" },
      { name: "Export", href: "/services#export" },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
  },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { hasHeroSection } = useHeader()
  const headerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useOnClickOutside(headerRef, () => setActiveDropdown(null))
  useOnClickOutside(searchRef, () => setSearchOpen(false))

  // Track scroll position to apply different styles
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) for the first 100px of scrolling
      const scrollY = window.scrollY
      const threshold = 100
      const progress = Math.min(scrollY / threshold, 1)

      setScrollProgress(progress)
      setScrolled(progress > 0)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Check initial scroll position
    handleScroll()

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Determine header styles based on scroll position and hero section
  const isTransparent = !scrolled && hasHeroSection

  // Calculate background opacity based on scroll progress
  const bgOpacity = Math.min(0.95, 0.6 + scrollProgress * 0.35)

  // Handle dropdown toggle
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm py-2" : isTransparent ? "py-4" : "py-4"
      }`}
      style={{
        backgroundColor: isTransparent ? `rgba(255, 255, 255, ${scrollProgress})` : `rgba(255, 255, 255, ${bgOpacity})`,
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo
              variant={scrollProgress < 0.5 && isTransparent ? "dark" : "light"}
              size={scrolled ? "small" : "medium"}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      scrollProgress < 0.5 && isTransparent
                        ? "text-white hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${activeDropdown === item.name ? (scrollProgress < 0.5 && isTransparent ? "bg-white/20" : "bg-gray-100") : ""}`}
                    style={{
                      color: isTransparent
                        ? `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 1)`
                        : "",
                    }}
                  >
                    {item.name}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrollProgress < 0.5 && isTransparent
                        ? "text-white hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={{
                      color: isTransparent
                        ? `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 1)`
                        : "",
                    }}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Search Toggle (Mobile & Tablet) */}
            <div className="md:hidden" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-colors ${
                  scrollProgress < 0.5 && isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={{
                  color: isTransparent
                    ? `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 1)`
                    : "",
                }}
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Mobile Search Overlay */}
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 p-4 bg-white shadow-md">
                  <SearchBar />
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block w-48 lg:w-64">
              <SearchBar transparent={scrollProgress < 0.5 && isTransparent} />
            </div>

            {/* Sign In Button */}
            <Link
              href="/signin"
              className={`hidden sm:flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                scrollProgress < 0.5 && isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{
                color: isTransparent
                  ? `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 1)`
                  : "",
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Sign in
            </Link>

            {/* Contact Button */}
            <Link
              href="/contact"
              className={`hidden sm:inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                scrollProgress < 0.5 && isTransparent
                  ? "border border-white text-white hover:bg-white/10"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
              style={
                isTransparent
                  ? {
                      borderColor: `rgba(255, 255, 255, ${1 - scrollProgress * 0.5})`,
                      backgroundColor:
                        scrollProgress > 0.5 ? `rgba(2, 132, 199, ${(scrollProgress - 0.5) * 2})` : "transparent",
                    }
                  : {}
              }
            >
              Get in Touch
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`md:hidden p-2 rounded-md transition-colors ${
                scrollProgress < 0.5 && isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{
                color: isTransparent
                  ? `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 1)`
                  : "",
              }}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white shadow-lg">
          <nav className="px-4 pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    <div
                      className={`pl-4 space-y-1 transition-all duration-200 ${
                        activeDropdown === item.name ? "max-h-96" : "max-h-0 overflow-hidden"
                      }`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Sign In */}
            <Link
              href="/signin"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-2" />
              Sign in
            </Link>

            {/* Mobile Contact Button */}
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
