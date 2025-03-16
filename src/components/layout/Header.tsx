'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Gavel, CarFront, DollarSign, Store, HelpCircle, UserPlus, Menu, X, PlusCircle, LogIn, LogOut, Search } from 'lucide-react'

interface HeaderProps {
  isAuthenticated?: boolean
}

const Header = ({ isAuthenticated = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [isScrolled, setIsScrolled] = useState(false)

  const navigation = [
    { 
      name: 'Buy Cars', 
      href: '/explore-cars',
      icon: CarFront
    },
    { 
      name: 'Live Auctions', 
      href: '/auctions',
      icon: Gavel,
      badge: 'Live'
    },
    { 
      name: 'Sell Your Car', 
      href: '/sell-car',
      icon: DollarSign
    },
    { 
      name: 'About Us', 
      href: '/about',
      icon: Store
    }
  ]

  // Add scroll event listener
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const handleCurrencyChange = (newCurrency: 'USD' | 'EUR') => {
    setCurrency(newCurrency)
    // Implement currency change logic throughout the app
  }

  const handleActionClick = (path: string) => {
    if (!isAuthenticated) {
      window.location.href = '/signup'
      return
    }
    window.location.href = path
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <Image
                src="/images/wexaaaaaaaaaaars-01.png"
                alt="Cars Logo"
                width={400}
                height={144}
                className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Search for your dream car..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </form>
          </div>

          {/* Currency Selector */}
          <div className="hidden md:flex items-center mr-4">
            <button
              className={`px-2 py-1 rounded ${currency === 'USD' ? 'bg-primary text-white' : 'text-gray-600'}`}
              onClick={() => handleCurrencyChange('USD')}
            >
              $
            </button>
            <button
              className={`px-2 py-1 rounded ml-1 ${currency === 'EUR' ? 'bg-primary text-white' : 'text-gray-600'}`}
              onClick={() => handleCurrencyChange('EUR')}
            >
              €
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={() => handleActionClick('/dashboard')}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-secondary hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full input pl-10 pr-4 text-gray-900"
                      placeholder="Search cars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </form>
              </div>

              {/* Mobile Currency Selector */}
              <div className="px-3 py-2 flex">
                <button
                  className={`px-2 py-1 rounded ${currency === 'USD' ? 'bg-primary text-white' : 'text-gray-600'}`}
                  onClick={() => handleCurrencyChange('USD')}
                >
                  $
                </button>
                <button
                  className={`px-2 py-1 rounded ml-1 ${currency === 'EUR' ? 'bg-primary text-white' : 'text-gray-600'}`}
                  onClick={() => handleCurrencyChange('EUR')}
                >
                  €
                </button>
              </div>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              <button
                onClick={() => handleActionClick('/add-listing')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-secondary hover:bg-primary"
              >
                <PlusCircle className="h-5 w-5 mr-2 inline" />
                Announce Here
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleActionClick('/logout')
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-secondary"
                >
                  <LogOut className="h-5 w-5 mr-2 inline" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-secondary hover:bg-surface-100 dark:hover:bg-surface-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-2 inline" />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-5 w-5 mr-2 inline" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .logo-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .shadow-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </header>
  )
}

export default Header 