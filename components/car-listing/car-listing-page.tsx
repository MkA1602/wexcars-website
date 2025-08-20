"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import SearchBar from "./search-bar"
import FilterSidebar from "./filter-sidebar"
import CarGrid from "./car-grid"
import { Pagination } from "@/components/ui/pagination"
import { supabaseClient } from "@/lib/supabase/client"
import type { FilterOptions, Car } from "@/lib/types"
// Temporarily disabled performance utils to debug
// import { 
//   getCachedCars, 
//   setCachedCars, 
//   transformToFullCar, 
//   batchProcess,
//   debounce 
// } from "@/lib/performance-utils"
import { Button } from "@/components/ui/button"
import { Loader2, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import ErrorBoundary from "@/components/error-boundary"

export default function CarListingPage() {
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

  // Simplified and stable fetch cars (debugging version)
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('🔄 Fetching cars from database...')
        
        // Simplified query to debug issues
        const { data: carsData, error: carsError } = await supabaseClient
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12) // Reduced for faster loading

        if (carsError) {
          console.error('Database error:', carsError)
          throw carsError
        }

        console.log(`✅ Database returned ${carsData?.length || 0} cars`)
        
        // Simple transformation (no external utils to avoid import issues)
        const transformedCars: Car[] = (carsData || []).map((car: any) => ({
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
          location: car.location,
          status: car.status
        }))

        setCars(transformedCars)
        console.log(`🚀 Successfully loaded ${transformedCars.length} cars`)
        
      } catch (err: any) {
        console.error('❌ Error fetching cars:', err)
        console.error('Error details:', JSON.stringify(err, null, 2))
        setError(`Failed to load cars: ${err.message || 'Unknown error'}`)
        setCars([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isMounted) {
      fetchCars()
    }
  }, [isMounted])

  // Apply filters and search to get filtered cars
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
          car.description.toLowerCase().includes(query),
      )
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter((car) => filters.brands.includes(car.brand))
    }

    // Apply model filter
    if (filters.models && filters.models.length > 0) {
      result = result.filter((car) => {
        return filters.models!.some((model) => {
          const [brand, ...modelParts] = model.split("-")
          const modelName = modelParts.join("-")
          return car.brand === brand && car.name.includes(modelName)
        })
      })
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((car) => filters.categories.includes(car.category))
    }

    // Apply price range filter
    result = result.filter((car) => car.price >= filters.priceRange.min && car.price <= filters.priceRange.max)

    // Apply year filter
    if (filters.years.length > 0) {
      result = result.filter((car) => filters.years.includes(car.year.toString()))
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter((car) => filters.colors.includes(car.color))
    }

    // Apply gearbox filter
    if (filters.gearboxes && filters.gearboxes.length > 0) {
      result = result.filter((car) => filters.gearboxes!.includes(car.transmission))
    }

    // Apply fuel filter
    if (filters.fuels && filters.fuels.length > 0) {
      result = result.filter((car) => {
        const fuelType = car.specifications?.engine.toLowerCase().includes("electric")
          ? "Electric"
          : car.specifications?.engine.toLowerCase().includes("hybrid")
            ? "Hybrid"
            : "Petrol"
        return filters.fuels!.includes(fuelType)
      })
    }

    return result
  }, [searchQuery, filters, isMounted, cars])

  // Get current page of cars
  const currentCars = useMemo(() => {
    if (!isMounted) return []

    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCars.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCars, currentPage, itemsPerPage, isMounted])

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)

  // Get all available brands, categories, etc. from the data
  const availableBrands = useMemo(() => [...new Set(cars.map((car) => car.brand))], [cars])
  const availableCategories = useMemo(() => [...new Set(cars.map((car) => car.category))], [cars])
  const availableYears = useMemo(() => [...new Set(cars.map((car) => car.year.toString()))], [cars])
  const availableColors = useMemo(() => [...new Set(cars.map((car) => car.color))], [cars])

  // Get counts for each filter value
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    cars.forEach((car) => {
      counts[car.brand] = (counts[car.brand] || 0) + 1
    })
    return counts
  }, [cars])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    cars.forEach((car) => {
      counts[car.category] = (counts[car.category] || 0) + 1
    })
    return counts
  }, [cars])

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    count += filters.brands.length
    count += filters.categories.length
    count += filters.years.length
    count += filters.colors.length
    count += filters.models?.length || 0
    count += filters.gearboxes?.length || 0
    count += filters.fuels?.length || 0
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000000) count += 1
    if (
      (filters.mileageRange?.min && filters.mileageRange.min > 0) ||
      (filters.mileageRange?.max && filters.mileageRange.max < 100000)
    )
      count += 1
    return count
  }, [filters])

  // Simple handler functions - memoized to prevent unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handleVatDisplayChange = useCallback((display: "include" | "exclude" | "both") => {
    setVatDisplay(display)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleItemsPerPageChange = useCallback((perPage: number) => {
    setItemsPerPage(perPage)
    setCurrentPage(1)
  }, [])

  const handleClearAllFilters = useCallback(() => {
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
    setSearchQuery("")
    setCurrentPage(1)
  }, [])

  // Handle loading and error states
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 animate-pulse rounded mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Cars</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        {/* Header and Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Car Collection</h1>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              availableBrands={availableBrands}
              availableCategories={availableCategories}
              availableYears={availableYears}
              availableColors={availableColors}
              brandCounts={brandCounts}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button and Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-80 p-0">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Filters</h2>
                      <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        availableBrands={availableBrands}
                        availableCategories={availableCategories}
                        availableYears={availableYears}
                        availableColors={availableColors}
                        brandCounts={brandCounts}
                        categoryCounts={categoryCounts}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Results count */}
                <div className="text-gray-600">
                  {isLoading ? (
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <span>
                      {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </span>
                  )}
                </div>
              </div>

              {/* Active filters display and options */}
              <div className="flex items-center gap-4">
                {/* VAT Display Options */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Price Display:</label>
                  <select
                    value={vatDisplay}
                    onChange={(e) => handleVatDisplayChange(e.target.value as "include" | "exclude" | "both")}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  >
                    <option value="both">Show Both</option>
                    <option value="include">Including VAT</option>
                    <option value="exclude">Excluding VAT</option>
                  </select>
                </div>

                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear all filters
                  </Button>
                )}

                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.brands.map((brand) => (
                    <Badge key={brand} variant="secondary" className="gap-1">
                      Brand: {brand}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            brands: filters.brands.filter((b) => b !== brand),
                          })
                        }
                      />
                    </Badge>
                  ))}
                  {filters.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      Category: {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            categories: filters.categories.filter((c) => c !== category),
                          })
                        }
                      />
                    </Badge>
                  ))}
                  {filters.years.map((year) => (
                    <Badge key={year} variant="secondary" className="gap-1">
                      Year: {year}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            years: filters.years.filter((y) => y !== year),
                          })
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-lg">Loading cars...</span>
              </div>
            )}

            {/* Car Grid */}
            {!isLoading && (
              <>
                <CarGrid cars={currentCars} vatDisplay={vatDisplay} />
                
                {/* Load More Cars Button for Performance */}
                {cars.length === 12 && (
                  <div className="text-center mt-8 bg-white rounded-lg p-6 shadow-sm border">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to see more cars?</h3>
                      <p className="text-gray-600 text-sm">
                        We're showing the latest {cars.length} cars for fast loading. Click below to load more.
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-primary-light hover:bg-primary-dark text-white px-8 py-3"
                      onClick={() => {
                        // TODO: Implement load more functionality
                        window.location.href = '/collections?page=2'
                      }}
                    >
                      Load More Cars
                      <span className="ml-2">→</span>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No results message */}
            {!isLoading && filteredCars.length === 0 && cars.length > 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">No cars match your criteria</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
                {activeFilterCount > 0 && (
                  <Button variant="outline" onClick={handleClearAllFilters} className="mt-4">
                    Clear all filters
                  </Button>
                )}
              </div>
            )}

            {/* Empty state when no cars in database */}
            {!isLoading && cars.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">No cars available</h3>
                <p className="text-gray-500 mt-2">Cars will appear here once they are added to the database</p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
