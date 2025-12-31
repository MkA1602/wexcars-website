import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Car as CarIcon, Edit, Trash2, User, Shield, MessageCircle, Heart, Sofa, Car as CarIcon2, ShieldCheck, Monitor, Star, Settings, MapPin } from "lucide-react"
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

          {/* Car Information and Pricing Section - Clean Design */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left Side - Car Name and Specifications */}
              <div className="flex-1">
                {/* Car Name and Year */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {car.brand} {car.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <p className="text-lg text-gray-600">
                      {car.year}
                    </p>
                    
                    {/* Specification Tags - Smaller and beside mileage */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {car.fuel_type && (
                        <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md font-medium text-xs">
                          {car.fuel_type}
                        </span>
                      )}
                      {car.specifications?.power && (
                        <span className="bg-primary-light text-white px-2 py-1 rounded-md font-medium text-xs">
                          {car.specifications.power}
                        </span>
                      )}
                      {car.specifications?.drivetrain && (
                        <span className="bg-primary-light text-white px-2 py-1 rounded-md font-medium text-xs">
                          {car.specifications.drivetrain}
                        </span>
                      )}
                      {car.transmission && (
                        <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md font-medium text-xs">
                          {car.transmission}
                        </span>
                      )}
                      {car.location && (
                        <span className="bg-primary-light/10 text-primary-light border border-primary-light/20 px-3 py-1 rounded-lg font-medium text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {car.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Remove the old Specification Tags section */}
              </div>
              
              {/* Right Side - Pricing and Buy Button */}
              <div className="flex flex-col items-end gap-4">
                {/* Pricing Information */}
                <div className="text-right">
                  <PriceDisplay
                    price={car.price}
                    priceExclVat={car.price_excl_vat}
                    vatRate={car.vat_rate}
                    vatAmount={car.vat_amount}
                    currency={car.currency}
                    enableToggle={true}
                    carId={car.id}
                    size="lg"
                    isNettoPrice={car.is_netto_price}
                    className="text-right"
                  />
                </div>
                
                {/* Buy Button */}
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg" onClick={() => setIsInquiryModalOpen(true)}>
                  Buy the car
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Sidebar and Content Area */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* Left Sidebar Navigation - Mobile Optimized */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="font-semibold text-lg lg:text-xl mb-4 lg:mb-6 text-gray-900">Navigation</h3>
                {/* Mobile horizontal scroll, Desktop vertical */}
                <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                  <a 
                    href="#specification" 
                    onClick={(e) => handleNavClick("specification", e)}
                    className={`flex items-center justify-between p-3 lg:p-4 rounded-lg transition-colors border-l-4 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal ${
                      activeSection === "specification"
                        ? "bg-primary-light/10 text-primary-dark font-medium border-primary-light"
                        : "hover:bg-primary-light/5 text-gray-700 border-transparent hover:border-primary-light/30"
                    }`}
                  >
                    <span className="text-sm lg:text-base">Specification</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>
                  <a 
                    href="#features" 
                    onClick={(e) => handleNavClick("features", e)}
                    className={`flex items-center justify-between p-3 lg:p-4 rounded-lg transition-colors border-l-4 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal ${
                      activeSection === "features"
                        ? "bg-primary-light/10 text-primary-dark font-medium border-primary-light"
                        : "hover:bg-primary-light/5 text-gray-700 border-transparent hover:border-primary-light/30"
                    }`}
                  >
                    <span className="text-sm lg:text-base">Features</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>
                  <a 
                    href="#description" 
                    onClick={(e) => handleNavClick("description", e)}
                    className={`flex items-center justify-between p-3 lg:p-4 rounded-lg transition-colors border-l-4 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal ${
                      activeSection === "description"
                        ? "bg-primary-light/10 text-primary-dark font-medium border-primary-light"
                        : "hover:bg-primary-light/5 text-gray-700 border-transparent hover:border-primary-light/30"
                    }`}
                  >
                    <span className="text-sm lg:text-base">Description</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>
                  <a 
                    href="#contact" 
                    onClick={(e) => handleNavClick("contact", e)}
                    className={`flex items-center justify-between p-3 lg:p-4 rounded-lg transition-colors border-l-4 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal ${
                      activeSection === "contact"
                        ? "bg-primary-light/10 text-primary-dark font-medium border-primary-light"
                        : "hover:bg-primary-light/5 text-gray-700 border-transparent hover:border-primary-light/30"
                    }`}
                  >
                    <span className="text-sm lg:text-base">Contact us</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>

                </nav>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Specification Section - Clean Design */}
              <div id="specification" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Specification</h2>
                


                {/* Specification Details Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">First registration</span>
                      <span className="text-gray-900 font-semibold">{car.created_at ? new Date(car.created_at).toLocaleDateString() : 'Not specified'}</span>
                    </div>
                    {[car.engine_size, car.specifications?.power, car.specifications?.drivetrain].filter(Boolean).length > 0 && (
                      <div className="flex justify-between py-4 border-b border-primary-light/20">
                        <span className="font-medium text-gray-400">Engine</span>
                        <span className="text-gray-900 font-semibold">
                          {[car.engine_size, car.specifications?.power, car.specifications?.drivetrain]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                    {!car.is_new_car && (
                      <div className="flex justify-between py-4 border-b border-primary-light/20">
                        <span className="font-medium text-gray-400">Odometer</span>
                        <span className="text-gray-900 font-semibold">{getMileageDisplay(car)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Transmission</span>
                      <span className="text-gray-900 font-semibold">{car.transmission || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Body type</span>
                      <span className="text-gray-900 font-semibold">{car.category || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Fuel</span>
                      <span className="text-gray-900 font-semibold">{car.fuel_type || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Chassis Number</span>
                      <span className="text-gray-900 font-semibold">{car.chassis_number || 'Not specified'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Color</span>
                      <span className="text-gray-900 font-semibold">{car.color || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Seats</span>
                      <span className="text-gray-900 font-semibold">{car.seats || 'Not specified'}</span>
                    </div>

                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Emission class</span>
                      <span className="text-gray-900 font-semibold">Euro6d</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Ref. no</span>
                      <span className="text-gray-900 font-semibold">{car.id}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Certificate of Conformity</span>
                      <span className="text-gray-900 font-semibold">Yes</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Service book</span>
                      <span className="text-gray-900 font-semibold">Yes</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">History</span>
                      <span className="text-gray-900 font-semibold">After the first owner, Service book</span>
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
              </div>

              {/* Description Section */}
              {car.description && (
                <div id="description" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Description</h2>
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {car.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section - Enhanced Design */}
              <div id="contact" className="mb-16">
                <div className="bg-gradient-to-br from-primary-light/5 to-primary-dark/5 rounded-2xl p-8 border border-primary-light/20">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact us</h2>
                  <p className="text-gray-600 mb-8">Interested in this vehicle? Get in touch with us for more information, schedule a viewing, or make an inquiry.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="bg-primary-light hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
                    >
                      <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Send Message
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={toggleFavorite}
                      className={`px-8 py-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center group ${
                        isFavorite 
                          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'border-primary-light/30 hover:border-primary-light hover:bg-primary-light/5 text-primary-dark hover:text-primary-dark'
                      }`}
                    >
                      <Heart className={`w-5 h-5 mr-2 group-hover:scale-110 transition-transform ${
                        isFavorite ? 'fill-red-500' : ''
                      }`} />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-primary-light/20">
                    <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <a href="tel:+46737200581" className="text-primary-light hover:text-primary-dark font-medium transition-colors">
                        📞 +46 737 200 581
                      </a>
                      <a href="mailto:support@wexcars.com" className="text-primary-light hover:text-primary-dark font-medium transition-colors">
                        ✉️ support@wexcars.com
                      </a>
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
