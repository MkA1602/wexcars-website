"use client"

import { useState, useEffect, useMemo, useCallback, useTransition } from "react"
import SearchBar from "./search-bar"
import FilterSidebar from "./filter-sidebar"
import CarGrid from "./car-grid"
import { Pagination } from "@/components/ui/pagination"
import { supabaseClient } from "@/lib/supabase/client"
import type { FilterOptions, Car } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Loader2, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import ErrorBoundary from "@/components/error-boundary"

// Cache for cars data
let carsCache: Car[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Optimized car transformation function
const transformCarData = (car: any): Car => ({
  id: car.id,
  name: car.name,
  brand: car.brand,
  category: car.category,
  year: car.year,
  price: car.price,
  price_excl_vat: car.price_excl_vat,
  vat_rate: car.vat_rate,
  vat_amount: car.vat_amount,
  currency: car.currency || 'AED',
  priceWithVat: car.price,
  image: car.image,
  images: car.images,
  rating: 4.5,
  transmission: car.transmission || 'Automatic',
  color: car.color || 'Black',
  featured: false,
  description: car.description,
  features: car.features,
  specifications: car.specifications || {
    engine: 'Not specified',
    power: 'Not specified',
    acceleration: 'Not specified',
    topSpeed: 'Not specified',
    transmission: car.transmission || 'Automatic',
    drivetrain: 'Not specified',
    fuelEconomy: 'Not specified',
    seating: 'Not specified'
  },
  user_id: car.user_id,
  seller_type: car.seller_type || 'individual',
  dealership_name: car.dealership_name,
  created_at: car.created_at,
  updated_at: car.updated_at,
  mileage: car.mileage,
  fuel_type: car.fuel_type,
  horsepower: car.horsepower,
  gearbox: car.gearbox,
  car_type: car.car_type,
  engine_size: car.engine_size,
  drivetrain: car.drivetrain,
  availability: car.availability,
  availability_days: car.availability_days,
  availability_date: car.availability_date,
  chassis_number: car.chassis_number,
  location: car.location
})

export default function OptimizedCarListingPage() {
  // Basic state
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [vatDisplay, setVatDisplay] = useState<"include" | "exclude" | "both">("both")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter state - single source of truth
  const [filters, setFilters] = useState<FilterOptions>({
    brands: [],
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    years: [],
    colors: [],
    gearboxes: [],
    fuels: [],
    mileageRange: { min: 0, max: 100000 },
    models: [],
  })

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Optimized fetch cars with caching
  const fetchCars = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check cache first
      const now = Date.now()
      if (carsCache && (now - cacheTimestamp) < CACHE_DURATION) {
        setCars(carsCache)
        setIsLoading(false)
        return
      }

      // Fetch with pagination and only essential fields
      const { data: carsData, error: carsError } = await supabaseClient
        .from('cars')
        .select(`
          id,
          name,
          brand,
          category,
          year,
          price,
          price_excl_vat,
          vat_rate,
          vat_amount,
          currency,
          image,
          images,
          transmission,
          color,
          description,
          features,
          specifications,
          user_id,
          seller_type,
          dealership_name,
          created_at,
          updated_at,
          mileage,
          fuel_type,
          horsepower,
          gearbox,
          car_type,
          engine_size,
          drivetrain,
          availability,
          availability_days,
          availability_date,
          chassis_number,
          location
        `)
        .order('created_at', { ascending: false })
        .limit(100) // Limit initial load

      if (carsError) {
        throw carsError
      }

      // Transform data efficiently
      const transformedCars = (carsData || []).map(transformCarData)
      
      // Update cache
      carsCache = transformedCars
      cacheTimestamp = now
      
      setCars(transformedCars)
    } catch (err: any) {
      console.error('Error fetching cars:', err)
      setError('Failed to load cars. Please try again.')
      setCars([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch cars from Supabase database
  useEffect(() => {
    if (isMounted) {
      fetchCars()
    }
  }, [isMounted, fetchCars])

  // Optimized filtering with useMemo and useTransition
  const filteredCars = useMemo(() => {
    if (!isMounted || cars.length === 0) return []

    let result = [...cars]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query) ||
          (car.description && car.description.toLowerCase().includes(query)),
      )
    }

    // Apply filters
    if (filters.brands.length > 0) {
      result = result.filter((car) => filters.brands.includes(car.brand))
    }

    if (filters.categories.length > 0) {
      result = result.filter((car) => filters.categories.includes(car.category))
    }

    if (filters.years.length > 0) {
      result = result.filter((car) => filters.years.includes(car.year))
    }

    if (filters.colors.length > 0) {
      result = result.filter((car) => filters.colors.includes(car.color))
    }

    if (filters.gearboxes.length > 0) {
      result = result.filter((car) => filters.gearboxes.includes(car.transmission))
    }

    if (filters.fuels.length > 0) {
      result = result.filter((car) => car.fuel_type && filters.fuels.includes(car.fuel_type))
    }

    if (filters.models.length > 0) {
      result = result.filter((car) => filters.models.includes(car.name))
    }

    // Price range filter
    result = result.filter((car) => {
      const price = vatDisplay === "exclude" ? car.price_excl_vat : car.price
      return price >= filters.priceRange.min && price <= filters.priceRange.max
    })

    // Mileage range filter
    if (car.mileage !== undefined) {
      result = result.filter((car) => {
        const mileage = car.mileage || 0
        return mileage >= filters.mileageRange.min && mileage <= filters.mileageRange.max
      })
    }

    return result
  }, [cars, searchQuery, filters, vatDisplay, isMounted])

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCars = filteredCars.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  // Optimized filter handlers
  const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, ...newFilters }))
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    startTransition(() => {
      setFilters({
        brands: [],
        categories: [],
        priceRange: { min: 0, max: 1000000 },
        years: [],
        colors: [],
        gearboxes: [],
        fuels: [],
        mileageRange: { min: 0, max: 100000 },
        models: [],
      })
    })
  }, [])

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!isMounted || cars.length === 0) {
      return {
        brands: [],
        categories: [],
        years: [],
        colors: [],
        gearboxes: [],
        fuels: [],
        models: [],
      }
    }

    return {
      brands: [...new Set(cars.map(car => car.brand))].sort(),
      categories: [...new Set(cars.map(car => car.category))].sort(),
      years: [...new Set(cars.map(car => car.year))].sort((a, b) => b - a),
      colors: [...new Set(cars.map(car => car.color))].sort(),
      gearboxes: [...new Set(cars.map(car => car.transmission))].sort(),
      fuels: [...new Set(cars.map(car => car.fuel_type).filter(Boolean))].sort(),
      models: [...new Set(cars.map(car => car.name))].sort(),
    }
  }, [cars, isMounted])

  // Loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-light rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          </div>
          
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="hidden lg:block">
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Cars</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchCars} className="bg-primary-light hover:bg-primary-dark">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search for luxury vehicles..."
            />
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearAllFilters}
                filterOptions={filterOptions}
                vatDisplay={vatDisplay}
                onVatDisplayChange={setVatDisplay}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {(filters.brands.length > 0 || filters.categories.length > 0 || 
                        filters.years.length > 0 || filters.colors.length > 0 || 
                        filters.gearboxes.length > 0 || filters.fuels.length > 0 || 
                        filters.models.length > 0) && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.brands.length + filters.categories.length + 
                           filters.years.length + filters.colors.length + 
                           filters.gearboxes.length + filters.fuels.length + 
                           filters.models.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileFilterOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClearFilters={clearAllFilters}
                      filterOptions={filterOptions}
                      vatDisplay={vatDisplay}
                      onVatDisplayChange={setVatDisplay}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {filteredCars.length} {filteredCars.length === 1 ? 'Vehicle' : 'Vehicles'} Found
                  </h1>
                  {searchQuery && (
                    <p className="text-gray-600 mt-1">
                      Results for "{searchQuery}"
                    </p>
                  )}
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                  </select>
                </div>
              </div>

              {/* Car Grid */}
              <div className={cn("transition-opacity duration-200", isPending && "opacity-50")}>
                <CarGrid cars={paginatedCars} vatDisplay={vatDisplay} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
