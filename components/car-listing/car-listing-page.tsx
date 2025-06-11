"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import SearchBar from "./search-bar"
import FilterSidebar from "./filter-sidebar"
import CarGrid from "./car-grid"
import { Pagination } from "@/components/ui/pagination"
import { cars } from "@/lib/car-data"
import type { FilterOptions } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Loader2, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import ErrorBoundary from "@/components/error-boundary"

export default function CarListingPage() {
  // Basic state
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [vatDisplay, setVatDisplay] = useState<"include" | "exclude" | "both">("include")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Apply filters and search to get filtered cars
  const filteredCars = useMemo(() => {
    if (!isMounted) return []

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
  }, [searchQuery, filters, isMounted])

  // Get current page of cars
  const currentCars = useMemo(() => {
    if (!isMounted) return []

    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCars.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCars, currentPage, itemsPerPage, isMounted])

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)

  // Get all available brands, categories, etc. from the data
  const availableBrands = useMemo(() => [...new Set(cars.map((car) => car.brand))], [])
  const availableCategories = useMemo(() => [...new Set(cars.map((car) => car.category))], [])
  const availableYears = useMemo(() => [...new Set(cars.map((car) => car.year.toString()))], [])
  const availableColors = useMemo(() => [...new Set(cars.map((car) => car.color))], [])

  // Get counts for each filter value
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    cars.forEach((car) => {
      counts[car.brand] = (counts[car.brand] || 0) + 1
    })
    return counts
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    cars.forEach((car) => {
      counts[car.category] = (counts[car.category] || 0) + 1
    })
    return counts
  }, [])

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

  const removeFilter = useCallback((type: keyof FilterOptions, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (type === "priceRange") {
        newFilters.priceRange = { min: 0, max: 1000000 }
      } else if (type === "mileageRange") {
        newFilters.mileageRange = { min: 0, max: 100000 }
      } else if (Array.isArray(newFilters[type])) {
        // @ts-ignore - We know this is an array based on the check above
        newFilters[type] = newFilters[type].filter((item) => item !== value)
      }

      return newFilters
    })
    setCurrentPage(1)
  }, [])

  const clearAllFilters = useCallback(() => {
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

  const handleCategoryClick = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [category],
    }))
    setCurrentPage(1)
  }, [])

  const handleBrandClick = useCallback((brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: [brand],
    }))
    setCurrentPage(1)
  }, [])

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="animate-spin text-primary-light" />
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Luxury Collection</h1>
          <p className="text-gray-600">
            Explore our handpicked selection of the finest luxury vehicles available for purchase.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="py-4">
                  <h2 className="text-xl font-bold mb-4">Filters</h2>
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
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/4 min-w-[250px]">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                )}
              </div>
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
          </div>

          <div className="lg:w-3/4">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>

                  {filters.brands.map((brand) => (
                    <Badge key={`brand-${brand}`} variant="secondary" className="flex items-center gap-1">
                      Brand: {brand}
                      <button onClick={() => removeFilter("brands", brand)} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}

                  {filters.categories.map((category) => (
                    <Badge key={`category-${category}`} variant="secondary" className="flex items-center gap-1">
                      Category: {category}
                      <button onClick={() => removeFilter("categories", category)} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}

                  {filters.years.map((year) => (
                    <Badge key={`year-${year}`} variant="secondary" className="flex items-center gap-1">
                      Year: {year}
                      <button onClick={() => removeFilter("years", year)} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}

                  {filters.colors.map((color) => (
                    <Badge key={`color-${color}`} variant="secondary" className="flex items-center gap-1">
                      Color: {color}
                      <button onClick={() => removeFilter("colors", color)} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}

                  {filters.models?.map((model) => {
                    const [brand, ...modelParts] = model.split("-")
                    const modelName = modelParts.join("-")
                    return (
                      <Badge key={`model-${model}`} variant="secondary" className="flex items-center gap-1">
                        Model: {brand} {modelName}
                        <button onClick={() => removeFilter("models", model)} className="ml-1">
                          <X size={14} />
                        </button>
                      </Badge>
                    )
                  })}

                  {filters.gearboxes?.map((gearbox) => (
                    <Badge key={`gearbox-${gearbox}`} variant="secondary" className="flex items-center gap-1">
                      Transmission: {gearbox}
                      <button onClick={() => removeFilter("gearboxes", gearbox)} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}

                  {filters.fuels?.map((fuel) => (
                    <Badge key={`fuel-${fuel}`} variant="secondary" className="flex items-center gap-1">
                      Fuel: {fuel}
                      <button onClick={() => removeFilter("fuels", fuel)} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}

                  {(filters.priceRange.min > 0 || filters.priceRange.max < 1000000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Price: ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}
                      <button onClick={() => removeFilter("priceRange", "")} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  )}

                  {filters.mileageRange && (filters.mileageRange.min > 0 || filters.mileageRange.max < 100000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Mileage: {filters.mileageRange.min.toLocaleString()} - {filters.mileageRange.max.toLocaleString()}{" "}
                      miles
                      <button onClick={() => removeFilter("mileageRange", "")} className="ml-1">
                        <X size={14} />
                      </button>
                    </Badge>
                  )}

                  <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-sm">
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}

            {/* VAT Display Options */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Price display:</span>
              <div className="flex gap-2">
                <Button
                  variant={vatDisplay === "include" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVatDisplayChange("include")}
                  className={cn("text-sm", vatDisplay === "include" ? "bg-primary-light hover:bg-primary-dark" : "")}
                >
                  Inc. VAT
                </Button>
                <Button
                  variant={vatDisplay === "exclude" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVatDisplayChange("exclude")}
                  className={cn("text-sm", vatDisplay === "exclude" ? "bg-primary-light hover:bg-primary-dark" : "")}
                >
                  Ex. VAT
                </Button>
                <Button
                  variant={vatDisplay === "both" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVatDisplayChange("both")}
                  className={cn("text-sm", vatDisplay === "both" ? "bg-primary-light hover:bg-primary-dark" : "")}
                >
                  Show Both
                </Button>
              </div>
            </div>

            {/* Results Count and Items Per Page */}
            <div className="mb-6 flex flex-wrap justify-between items-center">
              <p className="text-gray-600">
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Loading vehicles...
                  </span>
                ) : (
                  `Showing ${Math.min(filteredCars.length, 1 + (currentPage - 1) * itemsPerPage)}-${Math.min(
                    currentPage * itemsPerPage,
                    filteredCars.length,
                  )} of ${filteredCars.length} ${filteredCars.length === 1 ? "vehicle" : "vehicles"}`
                )}
              </p>

              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <div className="flex gap-1">
                  {[12, 24, 48].map((count) => (
                    <Button
                      key={`per-page-${count}`}
                      variant={itemsPerPage === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleItemsPerPageChange(count)}
                      className={cn(
                        "text-xs px-2 py-1 h-8",
                        itemsPerPage === count ? "bg-primary-light hover:bg-primary-dark" : "",
                      )}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Grid or No Results */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={48} className="animate-spin text-primary-light" />
              </div>
            ) : filteredCars.length > 0 ? (
              <>
                <CarGrid cars={currentCars} vatDisplay={vatDisplay} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <SlidersHorizontal size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">No vehicles found</h3>
                  <p className="text-gray-600 max-w-md">
                    We couldn't find any vehicles matching your current filters. Try adjusting your search criteria or
                    browse our popular categories below.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear All Filters
                    </Button>
                    {filters.priceRange.min > 0 || filters.priceRange.max < 1000000 ? (
                      <Button variant="outline" onClick={() => removeFilter("priceRange", "")}>
                        Reset Price Range
                      </Button>
                    ) : null}
                  </div>

                  {/* Popular Categories */}
                  <div className="mt-8 w-full">
                    <h4 className="text-lg font-semibold mb-3">Popular Categories</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Object.entries(categoryCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([category, count]) => (
                          <Button
                            key={category}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category} ({count})
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* Popular Brands */}
                  <div className="mt-4 w-full">
                    <h4 className="text-lg font-semibold mb-3">Popular Brands</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Object.entries(brandCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([brand, count]) => (
                          <Button
                            key={brand}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleBrandClick(brand)}
                          >
                            {brand} ({count})
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
