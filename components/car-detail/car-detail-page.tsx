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

interface CarDetailPageProps {
  car: Car
}

export default function CarDetailPage({ car }: CarDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
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
                    {car.brand} {car.name}, {car.year}
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
                  <div className="text-3xl font-bold mb-1">
                    <span className="text-gray-600 font-normal text-lg">Price excl. VAT: </span>
                    <span className="text-red-600">€{(car.price_excl_vat || car.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="text-xl text-gray-600">
                    <span className="font-normal text-base">Price incl. VAT: </span>
                    €{car.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
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
                  <a href="#specification" className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-primary-light/10 text-primary-dark font-medium border-l-4 border-primary-light whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal">
                    <span className="text-sm lg:text-base">Specification</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>
                  <a href="#features" className="flex items-center justify-between p-3 lg:p-4 rounded-lg hover:bg-primary-light/5 text-gray-700 transition-colors border-l-4 border-transparent hover:border-primary-light/30 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal">
                    <span className="text-sm lg:text-base">Features</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>
                  <a href="#description" className="flex items-center justify-between p-3 lg:p-4 rounded-lg hover:bg-primary-light/5 text-gray-700 transition-colors border-l-4 border-transparent hover:border-primary-light/30 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal">
                    <span className="text-sm lg:text-base">Description</span>
                    <span className="text-xs hidden lg:inline">▼</span>
                  </a>
                  <a href="#contact" className="flex items-center justify-between p-3 lg:p-4 rounded-lg hover:bg-primary-light/5 text-gray-700 transition-colors border-l-4 border-transparent hover:border-primary-light/30 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:whitespace-normal">
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
                    <div className="flex justify-between py-4 border-b border-primary-light/20">
                      <span className="font-medium text-gray-400">Engine</span>
                      <span className="text-gray-900 font-semibold">
                        {car.engine_size || 'Not specified'}, {car.specifications?.power || 'Not specified'}, {car.specifications?.drivetrain || 'Not specified'}
                      </span>
                    </div>
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
                      <span className="text-gray-900 font-semibold">{car.specifications?.seating || 'Not specified'}</span>
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

              {/* Features Section - Clean Design */}
              <div id="features" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Features</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Interior Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Sofa className="w-10 h-10 text-red-600" />
                      <h3 className="font-semibold text-lg text-gray-900">INTERIOR</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Automatic air-conditioning
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Leather seats
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Panoramic roof window
                      </li>
                    </ul>
                  </div>

                  {/* Exterior Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <CarIcon2 className="w-10 h-10 text-red-600" />
                      <h3 className="font-semibold text-lg text-gray-900">EXTERIOR</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Automatic daytime-running lights
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Aluminum alloy wheels
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        LED headlights
                      </li>
                    </ul>
                  </div>

                  {/* Safety Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="w-10 h-10 text-red-600" />
                      <h3 className="font-semibold text-lg text-gray-900">SAFETY</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Airbags
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        ABS
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Blind spot monitoring system
                      </li>
                    </ul>
                  </div>

                  {/* Infotainment Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Monitor className="w-10 h-10 text-red-600" />
                      <h3 className="font-semibold text-lg text-gray-900">INFOTAINMENT</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Android Auto
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Apple CarPlay
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Wireless Charging
                      </li>
                    </ul>
                  </div>

                  {/* Extra Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-10 h-10 text-red-600" />
                      <h3 className="font-semibold text-lg text-gray-900">EXTRA</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Adaptive headlights
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Automatic parking system
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Tow bar
                      </li>
                    </ul>
                  </div>

                  {/* Other Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-10 h-10 text-red-600" />
                      <h3 className="font-semibold text-lg text-gray-900">OTHER</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        360° parking camera
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        USB connection
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Premium sound system
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
