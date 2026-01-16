import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Car as CarIcon, Edit, Trash2, User, Shield, MessageCircle, Heart, Sofa, Car as CarIcon2, ShieldCheck, Monitor, Star, Settings, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import CarGallery from "./car-gallery"
import CarSpecifications from "./car-specifications"
import CarInquiryForm from "./car-inquiry-form"
import type { Car } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import RelatedCars from "./related-cars"
import PriceDisplay from "@/components/ui/price-display"

interface CarDetailPageProps {
  car: Car
}

export default function CarDetailPage({ car }: CarDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("specification")
  
  // Debug logging to see what's in the car object
  console.log('Car object:', car)
  console.log('Car mileage:', car.mileage)
  console.log('Car mileage type:', typeof car.mileage)
  console.log('Car fuel_type:', car.fuel_type)
  console.log('Car horsepower:', car.horsepower)

  // Show sold message if car is sold
  if (car.is_sold) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CarIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">This Car Has Been Sold</h1>
            <p className="text-gray-600 mb-6">
              The {car.brand} {car.name} you're looking for has already been sold. 
              Don't worry, we have many other amazing vehicles for you to explore!
            </p>
            {car.sold_at && (
              <p className="text-sm text-gray-500 mb-6">
                Sold on {new Date(car.sold_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/collections">
                <Button className="bg-primary-light hover:bg-primary-dark text-white">
                  Browse Available Cars
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  console.log('Car location:', car.location)
  console.log('Car location type:', typeof car.location)
  
  // Check all possible field names for mileage
  console.log('All car object keys:', Object.keys(car))
  console.log('All car object values:', Object.values(car))
  
  // Check if mileage might be in specifications
  console.log('Car specifications:', car.specifications)
  
  // Check if mileage might be in a different field
  const possibleMileageFields = ['mileage', 'odometer', 'distance', 'km', 'kilometers', 'miles']
  possibleMileageFields.forEach(field => {
    console.log(`Checking field "${field}":`, (car as any)[field])
  })

  const getMileageDisplay = (car: Car) => {
    // For new cars, don't show mileage at all
    if (car.is_new_car) {
      return null
    }
    
    const mileage = car.mileage
    console.log('getMileageDisplay called with:', mileage)
    console.log('Mileage type:', typeof mileage)
    console.log('Mileage value:', mileage)
    
    // Handle the mileage field (now properly typed as number | null)
    if (mileage !== null && mileage !== undefined) {
      if (typeof mileage === 'number') {
        // Check if it's a valid positive number
        if (mileage > 0) {
          return `${mileage.toLocaleString()} km`
        } else if (mileage === 0) {
          return '0 km'
        }
      }
    }
    return 'Mileage not specified'
  }

  // Check if current user owns this car
  const isCarOwner = user?.id === car.user_id
  const isAdmin = user?.role === 'admin'

  // Load favorites from localStorage
  useEffect(() => {
    setIsMounted(true)
    
    try {
      const savedFavorites = localStorage.getItem("carFavorites")
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites)
        setIsFavorite(favorites[car.id] || false)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }, [car.id])

  // Handle navigation click with proper scroll offset
  const handleNavClick = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setActiveSection(sectionId)
    
    const section = document.getElementById(sectionId)
    if (section) {
      const headerOffset = 100 // Offset for sticky header
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  // Scroll detection for active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["specification", "features", "description", "contact"]
      const scrollPosition = window.scrollY + 200 // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parse features from JSON string if available
  const parseCarFeatures = (): string[] => {
    if (car.features) {
      try {
        return JSON.parse(car.features)
      } catch (e) {
        console.error('Error parsing features:', e)
        return []
      }
    }
    return []
  }

  const parsedFeatures = parseCarFeatures()

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!isMounted) return
    
    // Check if user is authenticated
    if (!user) {
      // Store the car ID to add to favorites after sign-in
      localStorage.setItem("pendingFavorite", car.id)
      // Redirect to sign-in page
      router.push("/auth/login")
      return
    }
    
    // User is authenticated, proceed with favorite toggle
    try {
      const savedFavorites = localStorage.getItem("carFavorites")
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : {}
      
      const newFavorites = { ...favorites, [car.id]: !isFavorite }
      localStorage.setItem("carFavorites", JSON.stringify(newFavorites))
      
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar with Dashboard Integration */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Left Side - Breadcrumbs */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-hidden">
              <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/collections" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <CarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Collections</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">
                {car.brand} {car.name}
              </span>
            </div>

            {/* Right Side - Dashboard Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {isCarOwner && (
                <>
                  <Link href={`/dashboard/edit-car/${car.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2">
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Edit Car</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1 sm:gap-2">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </Button>
                </>
              )}
              
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Menu</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Car Gallery Section */}
          <div className="mb-8">
            <CarGallery car={car} />
          </div>

          {/* Car Information and Pricing Section - Modern Professional Design */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
                {/* Left Side - Car Name and Specifications */}
                <div className="flex-1">
                  {/* Car Name - Refined Size */}
                  <div className="mb-5">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                      {car.brand} {car.name}
                    </h1>
                    
                    {/* Year and Specification Tags */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base text-gray-600 font-medium">
                        {car.year}
                      </span>
                      
                      {/* Specification Tags - Modern Pill Design */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {car.fuel_type && (
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium text-xs">
                            {car.fuel_type}
                          </span>
                        )}
                        {car.specifications?.drivetrain && (
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full font-medium text-xs">
                            {car.specifications.drivetrain}
                          </span>
                        )}
                        {car.transmission && (
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium text-xs">
                            {car.transmission}
                          </span>
                        )}
                        {car.location && (
                          <span className="bg-pink-100 text-red-600 border border-red-200 px-3 py-1 rounded-full font-medium text-xs flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {car.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
              {/* Right Side - Pricing and Buy Button */}
              <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
                {/* Pricing Information - Using PriceDisplay Component */}
                <div className="w-full text-center">
                  <PriceDisplay
                    price={car.price}
                    priceExclVat={car.price_excl_vat}
                    vatRate={car.vat_rate}
                    vatAmount={car.vat_amount}
                    currency={car.currency || 'EUR'}
                    enableToggle={true}
                    carId={car.id}
                    size="lg"
                    isNettoPrice={car.is_netto_price}
                    className="text-center"
                  />
                </div>
                  
                {/* Buy Button - Modern and Refined */}
                <Button 
                  className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-5 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                  onClick={() => setIsInquiryModalOpen(true)}
                >
                  Buy the car
                </Button>
              </div>
              </div>
            </div>
          </div>

          {/* Navigation Sidebar and Content Area */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* Left Sidebar Navigation - Ultra Modern Design */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                {/* Modern Header with Accent */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-red-600 to-red-500 rounded-full"></div>
                    <h3 className="font-bold text-lg text-gray-900 tracking-tight">Navigation</h3>
                  </div>
                  <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"></div>
                </div>
                
                {/* Premium Navigation Menu */}
                <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                  <a 
                    href="#specification" 
                    onClick={(e) => handleNavClick("specification", e)}
                    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal overflow-hidden ${
                      activeSection === "specification"
                        ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 font-semibold shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {activeSection === "specification" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-500 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      {/* Icon Circle */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeSection === "specification"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Specification</span>
                    </div>
                    
                    {/* Arrow Icon */}
                    <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 relative z-10 ${
                      activeSection === "specification" ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  
                  <a 
                    href="#features" 
                    onClick={(e) => handleNavClick("features", e)}
                    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal overflow-hidden ${
                      activeSection === "features"
                        ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 font-semibold shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                    }`}
                  >
                    {activeSection === "features" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-500 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeSection === "features"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Features</span>
                    </div>
                    
                    <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 relative z-10 ${
                      activeSection === "features" ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  
                  <a 
                    href="#description" 
                    onClick={(e) => handleNavClick("description", e)}
                    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal overflow-hidden ${
                      activeSection === "description"
                        ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 font-semibold shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                    }`}
                  >
                    {activeSection === "description" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-500 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeSection === "description"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Description</span>
                    </div>
                    
                    <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 relative z-10 ${
                      activeSection === "description" ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  
                  <a 
                    href="#contact" 
                    onClick={(e) => handleNavClick("contact", e)}
                    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal overflow-hidden ${
                      activeSection === "contact"
                        ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 font-semibold shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                    }`}
                  >
                    {activeSection === "contact" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-500 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeSection === "contact"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Contact us</span>
                    </div>
                    
                    <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 relative z-10 ${
                      activeSection === "contact" ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Specification Section - Modern Design */}
              <div id="specification" className="mb-16">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">SPECIFICATIONS</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary-light/30 to-transparent"></div>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Technical Details</h2>
                  <p className="text-gray-600 max-w-2xl">Comprehensive technical specifications and vehicle information</p>
                </div>

                {/* Specification Cards - Modern Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">First Registration</span>
                        <span className="text-lg font-bold text-gray-900">{car.created_at ? new Date(car.created_at).toLocaleDateString() : 'Not specified'}</span>
                      </div>
                    </div>
                    
                    {[car.engine_size, car.specifications?.power, car.specifications?.drivetrain].filter(Boolean).length > 0 && (
                      <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Engine</span>
                          <span className="text-lg font-bold text-gray-900">
                            {[car.engine_size, car.specifications?.power, car.specifications?.drivetrain]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {!car.is_new_car && (
                      <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Odometer</span>
                          <span className="text-lg font-bold text-gray-900">{getMileageDisplay(car)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Transmission</span>
                        <span className="text-lg font-bold text-gray-900">{car.transmission || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Body Type</span>
                        <span className="text-lg font-bold text-gray-900">{car.category || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Fuel Type</span>
                        <span className="text-lg font-bold text-gray-900">{car.fuel_type || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Chassis Number</span>
                        <span className="text-lg font-bold text-gray-900 break-all">{car.chassis_number || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Color</span>
                        <span className="text-lg font-bold text-gray-900">{car.color || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Seats</span>
                        <span className="text-lg font-bold text-gray-900">{car.seats || 'Not specified'}</span>
                      </div>
                    </div>

                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Emission Class</span>
                        <span className="text-lg font-bold text-gray-900">Euro6d</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Reference No</span>
                        <span className="text-lg font-bold text-gray-900 break-all">{car.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Certificate of Conformity</span>
                        <span className="text-lg font-bold text-green-600">✓ Yes</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Service Book</span>
                        <span className="text-lg font-bold text-green-600">✓ Yes</span>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">History</span>
                        <span className="text-lg font-bold text-gray-900 text-right max-w-[60%]">After the first owner, Service book</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section - Modern Professional Design */}
              <div id="features" className="mb-16">
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">FEATURES</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary-light/30 to-transparent"></div>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">Premium Features</h2>
                  <p className="text-gray-600 mt-2 max-w-2xl">Discover the advanced features and technologies that make this vehicle exceptional</p>
                </div>
                
                {parsedFeatures.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {parsedFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary-light flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium text-sm leading-relaxed">{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Interior Features */}
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-dark/10 flex items-center justify-center group-hover:from-primary-light/20 group-hover:to-primary-dark/20 transition-all duration-300">
                        <Sofa className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">Interior</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Automatic air-conditioning</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Leather seats</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Panoramic roof window</span>
                      </li>
                    </ul>
                  </div>

                  {/* Exterior Features */}
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-dark/10 flex items-center justify-center group-hover:from-primary-light/20 group-hover:to-primary-dark/20 transition-all duration-300">
                        <CarIcon2 className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">Exterior</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Automatic daytime-running lights</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Aluminum alloy wheels</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">LED headlights</span>
                      </li>
                    </ul>
                  </div>

                  {/* Safety Features */}
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-dark/10 flex items-center justify-center group-hover:from-primary-light/20 group-hover:to-primary-dark/20 transition-all duration-300">
                        <ShieldCheck className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">Safety</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Airbags</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">ABS</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Blind spot monitoring system</span>
                      </li>
                    </ul>
                  </div>

                  {/* Infotainment Features */}
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-dark/10 flex items-center justify-center group-hover:from-primary-light/20 group-hover:to-primary-dark/20 transition-all duration-300">
                        <Monitor className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">Infotainment</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Android Auto</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Apple CarPlay</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Wireless Charging</span>
                      </li>
                    </ul>
                  </div>

                  {/* Extra Features */}
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-dark/10 flex items-center justify-center group-hover:from-primary-light/20 group-hover:to-primary-dark/20 transition-all duration-300">
                        <Settings className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">Extra</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Adaptive headlights</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Automatic parking system</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Tow bar</span>
                      </li>
                    </ul>
                  </div>

                  {/* Other Features */}
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-light/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-dark/10 flex items-center justify-center group-hover:from-primary-light/20 group-hover:to-primary-dark/20 transition-all duration-300">
                        <Star className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900">Other</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">360° parking camera</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">USB connection</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700 group/item">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-light group-hover/item:scale-125 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm leading-relaxed">Premium sound system</span>
                      </li>
                    </ul>
                  </div>
                  </div>
                )}
              </div>

              {/* Description Section - Modern Design */}
              {car.description && (
                <div id="description" className="mb-16">
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">DESCRIPTION</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary-light/30 to-transparent"></div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Vehicle Overview</h2>
                    <p className="text-gray-600 max-w-2xl">Learn more about this exceptional vehicle and its unique characteristics</p>
                  </div>
                  
                  <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-dark/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative prose prose-lg max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                        {car.description.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-4 last:mb-0">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section - Modern Enhanced Design */}
              <div id="contact" className="mb-16">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">CONTACT</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary-light/30 to-transparent"></div>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Get In Touch</h2>
                  <p className="text-gray-600 max-w-2xl">Interested in this vehicle? Contact us for more information, schedule a viewing, or make an inquiry.</p>
                </div>
                
                <div className="relative bg-gradient-to-br from-primary-light/10 via-white to-primary-dark/10 rounded-3xl p-8 md:p-12 border border-primary-light/30 shadow-2xl overflow-hidden">
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] bg-[length:40px_40px]"></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Main CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <Button 
                        onClick={() => setIsInquiryModalOpen(true)}
                        className="group relative bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                        <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                        <span className="relative z-10">Send Inquiry</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={toggleFavorite}
                        className={`group relative px-8 py-6 rounded-xl border-2 transition-all duration-300 flex items-center justify-center text-lg font-semibold overflow-hidden ${
                          isFavorite 
                            ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 shadow-lg' 
                            : 'border-primary-light/40 hover:border-primary-light bg-white/50 hover:bg-primary-light/10 text-primary-dark hover:text-primary-dark shadow-md hover:shadow-lg'
                        }`}
                      >
                        <Heart className={`w-6 h-6 mr-3 group-hover:scale-110 transition-transform ${
                          isFavorite ? 'fill-red-500 text-red-600' : ''
                        }`} />
                        <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                      </Button>
                    </div>
                    
                    {/* Contact Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-primary-light/30">
                      <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:bg-white transition-all duration-300 border border-gray-200/50 hover:border-primary-light/50 hover:shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/20 to-primary-dark/20 flex items-center justify-center group-hover:from-primary-light/30 group-hover:to-primary-dark/30 transition-all duration-300">
                            <Phone className="w-6 h-6 text-primary-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Phone Support</p>
                            <a href="tel:+46737200581" className="text-lg font-bold text-gray-900 hover:text-primary-light transition-colors">
                              +46 737 200 581
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:bg-white transition-all duration-300 border border-gray-200/50 hover:border-primary-light/50 hover:shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/20 to-primary-dark/20 flex items-center justify-center group-hover:from-primary-light/30 group-hover:to-primary-dark/30 transition-all duration-300">
                            <MessageCircle className="w-6 h-6 text-primary-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Email Support</p>
                            <a href="mailto:support@wexcars.com" className="text-lg font-bold text-gray-900 hover:text-primary-light transition-colors break-all">
                              support@wexcars.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="mt-8 pt-8 border-t border-primary-light/20">
                      <p className="text-sm text-gray-600 text-center">
                        <span className="font-semibold">Available 24/7</span> - Our team is ready to assist you with any questions about this vehicle
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Cars Section */}
          <div id="related" className="mt-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Related Vehicles</h2>
              <p className="text-gray-600">Explore similar luxury vehicles you might be interested in</p>
            </div>
            <RelatedCars currentCarId={car.id} />
          </div>
        </div>
      </main>

      {/* Car Inquiry Modal */}
      <CarInquiryForm
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        carName={car.name}
        carBrand={car.brand}
      />
    </div>
  )
}
