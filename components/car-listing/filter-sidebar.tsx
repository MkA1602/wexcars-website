"use client"

import { useState, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import type { FilterOptions } from "@/lib/types"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FilterSidebarProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  availableBrands?: string[]
  availableCategories?: string[]
  availableYears?: string[]
  availableColors?: string[]
  brandCounts?: Record<string, number>
  categoryCounts?: Record<string, number>
  selectedBrands?: string[]
  setSelectedBrands?: (brands: string[]) => void
  selectedCategories?: string[]
  setSelectedCategories?: (categories: string[]) => void
  priceRange?: [number, number]
  setPriceRange?: (range: [number, number]) => void
  yearRange?: [number, number]
  setYearRange?: (range: [number, number]) => void
  className?: string
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableBrands = [],
  availableCategories = [],
  availableYears = [],
  availableColors = [],
  brandCounts = {},
  categoryCounts = {},
  className = "",
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    categories: true,
    price: true,
    year: true,
    color: true,
    gearbox: true,
    mileage: true,
    fuel: true,
  })

  // Brand models data structure
  const brandModels = [
    {
      name: "Aston Martin",
      models: ["DB11", "DBS", "Vantage", "DBX", "Valkyrie"],
    },
    {
      name: "Audi",
      models: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "R8", "RS6", "RS7"],
    },
    {
      name: "Bentley",
      models: ["Continental GT", "Bentayga", "Flying Spur", "Bacalar"],
    },
    {
      name: "BMW",
      models: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7", "i4", "i7", "iX", "M3", "M5", "M8"],
    },
    {
      name: "Bugatti",
      models: ["Chiron", "Veyron", "Divo", "Mistral"],
    },
    {
      name: "Cadillac",
      models: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "LYRIQ"],
    },
    {
      name: "Ferrari",
      models: ["Roma", "296 GTB", "SF90 Stradale", "F8 Tributo", "812 Superfast", "Purosangue"],
    },
    {
      name: "Ford",
      models: ["Mustang", "F-150", "Explorer", "Bronco", "Mustang Mach-E", "GT"],
    },
    {
      name: "Honda",
      models: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Odyssey"],
    },
    {
      name: "Hyundai",
      models: ["Tucson", "Santa Fe", "Palisade", "IONIQ 5", "IONIQ 6", "Sonata"],
    },
    {
      name: "Jaguar",
      models: ["F-PACE", "E-PACE", "I-PACE", "XE", "XF", "F-TYPE"],
    },
    {
      name: "Kia",
      models: ["Sportage", "Sorento", "Telluride", "EV6", "Stinger", "K5"],
    },
    {
      name: "Lamborghini",
      models: ["Huracán", "Aventador", "Urus", "Revuelto", "Sián"],
    },
    {
      name: "Land Rover",
      models: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery"],
    },
    {
      name: "Lexus",
      models: ["ES", "LS", "RX", "NX", "UX", "LX", "LC", "RC"],
    },
    {
      name: "Maserati",
      models: ["Ghibli", "Quattroporte", "Levante", "MC20", "Grecale"],
    },
    {
      name: "Maybach",
      models: ["S-Class", "GLS"],
    },
    {
      name: "Mazda",
      models: ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5 Miata", "CX-30"],
    },
    {
      name: "McLaren",
      models: ["720S", "765LT", "Artura", "GT", "Elva"],
    },
    {
      name: "Mercedes-Benz",
      models: ["A-Class", "C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS", "EQE", "EQS", "AMG GT", "G-Class"],
    },
    {
      name: "MINI",
      models: ["Cooper", "Countryman", "Clubman", "Convertible", "Electric"],
    },
    {
      name: "Nissan",
      models: ["Altima", "Maxima", "Rogue", "Pathfinder", "Ariya", "Z", "GT-R"],
    },
    {
      name: "Pagani",
      models: ["Huayra", "Utopia", "Zonda"],
    },
    {
      name: "Porsche",
      models: ["911", "Taycan", "Panamera", "Cayenne", "Macan", "718 Cayman", "718 Boxster"],
    },
    {
      name: "Rolls-Royce",
      models: ["Phantom", "Ghost", "Cullinan", "Wraith", "Dawn", "Spectre"],
    },
    {
      name: "Tesla",
      models: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"],
    },
    {
      name: "Toyota",
      models: ["Camry", "Corolla", "RAV4", "Highlander", "Land Cruiser", "Supra", "bZ4X"],
    },
    {
      name: "Volkswagen",
      models: ["Golf", "Passat", "Tiguan", "Atlas", "ID.4", "ID. Buzz", "Arteon"],
    },
    {
      name: "Volvo",
      models: ["S60", "S90", "XC40", "XC60", "XC90", "C40 Recharge"],
    },
  ]

  const [priceRange, setPriceRange] = useState([filters?.priceRange?.min || 0, filters?.priceRange?.max || 1000000])

  const [searchTerms, setSearchTerms] = useState({
    brands: "",
    models: "",
    categories: "",
    years: "",
    colors: "",
    gearboxes: "",
    fuels: "",
  })

  // Update local price range when filters change
  useEffect(() => {
    if (filters?.priceRange) {
      setPriceRange([filters.priceRange.min || 0, filters.priceRange.max || 1000000])
    }
  }, [filters?.priceRange])

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const handleBrandChange = useCallback(
    (brand: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentBrands = filters.brands || []
      const newBrands = checked ? [...currentBrands, brand] : currentBrands.filter((b) => b !== brand)

      onFilterChange({
        ...filters,
        brands: newBrands,
      })
    },
    [filters, onFilterChange],
  )

  const handleModelChange = useCallback(
    (modelId: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentModels = filters.models || []
      const newModels = checked ? [...currentModels, modelId] : currentModels.filter((m) => m !== modelId)

      onFilterChange({
        ...filters,
        models: newModels,
      })
    },
    [filters, onFilterChange],
  )

  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentCategories = filters.categories || []
      const newCategories = checked ? [...currentCategories, category] : currentCategories.filter((c) => c !== category)

      onFilterChange({
        ...filters,
        categories: newCategories,
      })
    },
    [filters, onFilterChange],
  )

  const handlePriceChange = useCallback((values: number[]) => {
    if (Array.isArray(values) && values.length >= 2) {
      setPriceRange(values)
    }
  }, [])

  const handlePriceChangeEnd = useCallback(
    (values: number[]) => {
      if (!filters || !onFilterChange || !Array.isArray(values) || values.length < 2) return

      onFilterChange({
        ...filters,
        priceRange: { min: values[0] || 0, max: values[1] || 1000000 },
      })
    },
    [filters, onFilterChange],
  )

  const handleYearChange = useCallback(
    (year: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentYears = filters.years || []
      const newYears = checked ? [...currentYears, year] : currentYears.filter((y) => y !== year)

      onFilterChange({
        ...filters,
        years: newYears,
      })
    },
    [filters, onFilterChange],
  )

  const handleColorChange = useCallback(
    (color: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentColors = filters.colors || []
      const newColors = checked ? [...currentColors, color] : currentColors.filter((c) => c !== color)

      onFilterChange({
        ...filters,
        colors: newColors,
      })
    },
    [filters, onFilterChange],
  )

  const handleGearboxChange = useCallback(
    (gearbox: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentGearboxes = filters.gearboxes || []
      const newGearboxes = checked ? [...currentGearboxes, gearbox] : currentGearboxes.filter((g) => g !== gearbox)

      onFilterChange({
        ...filters,
        gearboxes: newGearboxes,
      })
    },
    [filters, onFilterChange],
  )

  const handleFuelChange = useCallback(
    (fuel: string, checked: boolean) => {
      if (!filters || !onFilterChange) return

      const currentFuels = filters.fuels || []
      const newFuels = checked ? [...currentFuels, fuel] : currentFuels.filter((f) => f !== fuel)

      onFilterChange({
        ...filters,
        fuels: newFuels,
      })
    },
    [filters, onFilterChange],
  )

  const handleMileageChange = useCallback(
    (values: number[]) => {
      if (!filters || !onFilterChange || !Array.isArray(values) || values.length < 2) return

      onFilterChange({
        ...filters,
        mileageRange: { min: values[0] || 0, max: values[1] || 100000 },
      })
    },
    [filters, onFilterChange],
  )

  // Safe filtering with null checks
  const safeFilter = (items: string[], searchTerm: string) => {
    if (!Array.isArray(items)) return []
    return items.filter((item) => {
      if (typeof item !== "string") return false
      return item.toLowerCase().includes((searchTerm || "").toLowerCase())
    })
  }

  // Filter brands based on search term with safety checks
  const filteredBrands = safeFilter(
    availableBrands.length > 0 ? availableBrands : brandModels.map((b) => b.name),
    searchTerms.brands,
  ).sort((a, b) => {
    // Sort by selected first, then by count (if available), then alphabetically
    const currentBrands = filters?.brands || []
    if (currentBrands.includes(a) && !currentBrands.includes(b)) return -1
    if (!currentBrands.includes(a) && currentBrands.includes(b)) return 1

    const countA = brandCounts[a] || 0
    const countB = brandCounts[b] || 0
    if (countA !== countB) return countB - countA

    return a.localeCompare(b)
  })

  // Filter categories based on search term with safety checks
  const filteredCategories = safeFilter(
    availableCategories.length > 0
      ? availableCategories
      : ["Sedan", "SUV", "Coupe", "Convertible", "Sports Car", "Luxury"],
    searchTerms.categories,
  ).sort((a, b) => {
    // Sort by selected first, then by count (if available), then alphabetically
    const currentCategories = filters?.categories || []
    if (currentCategories.includes(a) && !currentCategories.includes(b)) return -1
    if (!currentCategories.includes(a) && currentCategories.includes(b)) return 1

    const countA = categoryCounts[a] || 0
    const countB = categoryCounts[b] || 0
    if (countA !== countB) return countB - countA

    return a.localeCompare(b)
  })

  // Filter years based on search term with safety checks
  const filteredYears = safeFilter(
    availableYears.length > 0 ? availableYears : ["2023", "2022", "2021", "2020", "2019", "2018"],
    searchTerms.years,
  ).sort((a, b) => {
    // Sort by selected first, then by year (newest first)
    const currentYears = filters?.years || []
    if (currentYears.includes(a) && !currentYears.includes(b)) return -1
    if (!currentYears.includes(a) && currentYears.includes(b)) return 1
    return Number.parseInt(b) - Number.parseInt(a)
  })

  // Filter colors based on search term with safety checks
  const filteredColors = safeFilter(
    availableColors.length > 0 ? availableColors : ["Black", "White", "Silver", "Red", "Blue", "Green", "Yellow"],
    searchTerms.colors,
  ).sort((a, b) => {
    // Sort by selected first, then alphabetically
    const currentColors = filters?.colors || []
    if (currentColors.includes(a) && !currentColors.includes(b)) return -1
    if (!currentColors.includes(a) && currentColors.includes(b)) return 1
    return a.localeCompare(b)
  })

  // Filter gearboxes based on search term with safety checks
  const filteredGearboxes = safeFilter(
    ["Automatic", "Manual", "Semi-Automatic", "CVT", "Dual-Clutch"],
    searchTerms.gearboxes,
  ).sort((a, b) => {
    // Sort by selected first, then alphabetically
    const currentGearboxes = filters?.gearboxes || []
    if (currentGearboxes.includes(a) && !currentGearboxes.includes(b)) return -1
    if (!currentGearboxes.includes(a) && currentGearboxes.includes(b)) return 1
    return a.localeCompare(b)
  })

  // Filter fuels based on search term with safety checks
  const filteredFuels = safeFilter(
    ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"],
    searchTerms.fuels,
  ).sort((a, b) => {
    // Sort by selected first, then alphabetically
    const currentFuels = filters?.fuels || []
    if (currentFuels.includes(a) && !currentFuels.includes(b)) return -1
    if (!currentFuels.includes(a) && currentFuels.includes(b)) return 1
    return a.localeCompare(b)
  })

  // Safety check for filters
  if (!filters) {
    return <div className={className}>Loading filters...</div>
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Brand Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("brands")}
          aria-expanded={expandedSections.brands}
          aria-controls="brand-filters"
        >
          <h3 className="font-semibold">Brand</h3>
          {expandedSections.brands ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.brands && (
          <div id="brand-filters" className="space-y-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerms.brands}
                onChange={(e) => setSearchTerms((prev) => ({ ...prev, brands: e.target.value || "" }))}
                placeholder="Search brands..."
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {filteredBrands.map((brand) => (
                <div key={brand} className="mb-2">
                  <div className="flex items-center">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={(filters.brands || []).includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, checked === true)}
                      className="mr-2"
                    />
                    <label htmlFor={`brand-${brand}`} className="text-sm font-medium cursor-pointer flex items-center">
                      {brand}
                      {brandCounts[brand] && <span className="ml-1 text-xs text-gray-500">({brandCounts[brand]})</span>}
                    </label>
                  </div>

                  {/* Show models if brand is checked */}
                  {(filters.brands || []).includes(brand) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {brandModels
                        .find((b) => b.name === brand)
                        ?.models.map((model) => (
                          <div key={`${brand}-${model}`} className="flex items-center">
                            <Checkbox
                              id={`model-${brand}-${model}`}
                              checked={(filters.models || []).includes(`${brand}-${model}`)}
                              onCheckedChange={(checked) => handleModelChange(`${brand}-${model}`, checked === true)}
                              className="mr-2"
                            />
                            <label htmlFor={`model-${brand}-${model}`} className="text-xs cursor-pointer">
                              {model}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredBrands.length === 0 && (
                <p className="text-sm text-gray-500 italic">No brands match your search</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("categories")}
          aria-expanded={expandedSections.categories}
          aria-controls="category-filters"
        >
          <h3 className="font-semibold">Category</h3>
          {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.categories && (
          <div id="category-filters" className="space-y-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerms.categories}
                onChange={(e) => setSearchTerms((prev) => ({ ...prev, categories: e.target.value || "" }))}
                placeholder="Search categories..."
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {filteredCategories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={`category-${category}`}
                    checked={(filters.categories || []).includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${category}`} className="text-sm cursor-pointer flex items-center">
                    {category}
                    {categoryCounts[category] && (
                      <span className="ml-1 text-xs text-gray-500">({categoryCounts[category]})</span>
                    )}
                  </label>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <p className="text-sm text-gray-500 italic">No categories match your search</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("price")}
          aria-expanded={expandedSections.price}
          aria-controls="price-filters"
        >
          <h3 className="font-semibold">Price Range</h3>
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div id="price-filters">
            <div className="flex justify-between mb-2">
              <span className="text-sm">${(priceRange[0] || 0).toLocaleString()}</span>
              <span className="text-sm">${(priceRange[1] || 1000000).toLocaleString()}</span>
            </div>
            <Slider
              defaultValue={[0, 1000000]}
              value={priceRange}
              min={0}
              max={1000000}
              step={10000}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceChangeEnd}
              className="my-4"
            />
            <div className="flex justify-between mt-2">
              <input
                type="number"
                value={priceRange[0] || 0}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0
                  if (value >= 0 && value <= (priceRange[1] || 1000000)) {
                    setPriceRange([value, priceRange[1] || 1000000])
                  }
                }}
                onBlur={() => handlePriceChangeEnd(priceRange)}
                className="w-24 p-1 text-sm border border-gray-300 rounded"
              />
              <input
                type="number"
                value={priceRange[1] || 1000000}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 1000000
                  if (value >= (priceRange[0] || 0) && value <= 1000000) {
                    setPriceRange([priceRange[0] || 0, value])
                  }
                }}
                onBlur={() => handlePriceChangeEnd(priceRange)}
                className="w-24 p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Year Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("year")}
          aria-expanded={expandedSections.year}
          aria-controls="year-filters"
        >
          <h3 className="font-semibold">Year</h3>
          {expandedSections.year ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.year && (
          <div id="year-filters" className="space-y-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerms.years}
                onChange={(e) => setSearchTerms((prev) => ({ ...prev, years: e.target.value || "" }))}
                placeholder="Search years..."
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {filteredYears.map((year) => (
                <div key={year} className="flex items-center">
                  <Checkbox
                    id={`year-${year}`}
                    checked={(filters.years || []).includes(year)}
                    onCheckedChange={(checked) => handleYearChange(year, checked === true)}
                    className="mr-2"
                  />
                  <label htmlFor={`year-${year}`} className="text-sm cursor-pointer">
                    {year}
                  </label>
                </div>
              ))}

              {filteredYears.length === 0 && <p className="text-sm text-gray-500 italic">No years match your search</p>}
            </div>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("color")}
          aria-expanded={expandedSections.color}
          aria-controls="color-filters"
        >
          <h3 className="font-semibold">Color</h3>
          {expandedSections.color ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.color && (
          <div id="color-filters" className="space-y-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerms.colors}
                onChange={(e) => setSearchTerms((prev) => ({ ...prev, colors: e.target.value || "" }))}
                placeholder="Search colors..."
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {filteredColors.map((color) => (
                <div key={color} className="flex items-center">
                  <Checkbox
                    id={`color-${color}`}
                    checked={(filters.colors || []).includes(color)}
                    onCheckedChange={(checked) => handleColorChange(color, checked === true)}
                    className="mr-2"
                  />
                  <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor: color.toLowerCase(),
                          border: color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                        }}
                      ></div>
                      {color}
                    </div>
                  </label>
                </div>
              ))}

              {filteredColors.length === 0 && (
                <p className="text-sm text-gray-500 italic">No colors match your search</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gearbox Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("gearbox")}
          aria-expanded={expandedSections.gearbox}
          aria-controls="gearbox-filters"
        >
          <h3 className="font-semibold">Gearbox</h3>
          {expandedSections.gearbox ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.gearbox && (
          <div id="gearbox-filters" className="space-y-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerms.gearboxes}
                onChange={(e) => setSearchTerms((prev) => ({ ...prev, gearboxes: e.target.value || "" }))}
                placeholder="Search transmission types..."
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {filteredGearboxes.map((gearbox) => (
                <div key={gearbox} className="flex items-center">
                  <Checkbox
                    id={`gearbox-${gearbox}`}
                    checked={(filters.gearboxes || []).includes(gearbox)}
                    onCheckedChange={(checked) => handleGearboxChange(gearbox, checked === true)}
                    className="mr-2"
                  />
                  <label htmlFor={`gearbox-${gearbox}`} className="text-sm cursor-pointer">
                    {gearbox}
                  </label>
                </div>
              ))}

              {filteredGearboxes.length === 0 && (
                <p className="text-sm text-gray-500 italic">No transmission types match your search</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mileage Range Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("mileage")}
          aria-expanded={expandedSections.mileage}
          aria-controls="mileage-filters"
        >
          <h3 className="font-semibold">Mileage</h3>
          {expandedSections.mileage ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.mileage && (
          <div id="mileage-filters">
            <div className="flex justify-between mb-2">
              <span className="text-sm">{filters.mileageRange?.min || 0} miles</span>
              <span className="text-sm">{filters.mileageRange?.max || 100000} miles</span>
            </div>
            <Slider
              defaultValue={[0, 100000]}
              value={[filters.mileageRange?.min || 0, filters.mileageRange?.max || 100000]}
              min={0}
              max={100000}
              step={5000}
              onValueChange={(values) => handleMileageChange(values)}
              className="my-4"
            />
            <div className="flex justify-between mt-2">
              <input
                type="number"
                value={filters.mileageRange?.min || 0}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0
                  if (value >= 0 && value <= (filters.mileageRange?.max || 100000)) {
                    handleMileageChange([value, filters.mileageRange?.max || 100000])
                  }
                }}
                className="w-24 p-1 text-sm border border-gray-300 rounded"
              />
              <input
                type="number"
                value={filters.mileageRange?.max || 100000}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 100000
                  if (value >= (filters.mileageRange?.min || 0) && value <= 100000) {
                    handleMileageChange([filters.mileageRange?.min || 0, value])
                  }
                }}
                className="w-24 p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Fuel Type Filter */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-3"
          onClick={() => toggleSection("fuel")}
          aria-expanded={expandedSections.fuel}
          aria-controls="fuel-filters"
        >
          <h3 className="font-semibold">Fuel Type</h3>
          {expandedSections.fuel ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.fuel && (
          <div id="fuel-filters" className="space-y-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerms.fuels}
                onChange={(e) => setSearchTerms((prev) => ({ ...prev, fuels: e.target.value || "" }))}
                placeholder="Search fuel types..."
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {filteredFuels.map((fuel) => (
                <div key={fuel} className="flex items-center">
                  <Checkbox
                    id={`fuel-${fuel}`}
                    checked={(filters.fuels || []).includes(fuel)}
                    onCheckedChange={(checked) => handleFuelChange(fuel, checked === true)}
                    className="mr-2"
                  />
                  <label htmlFor={`fuel-${fuel}`} className="text-sm cursor-pointer">
                    {fuel}
                  </label>
                </div>
              ))}

              {filteredFuels.length === 0 && (
                <p className="text-sm text-gray-500 italic">No fuel types match your search</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Tips */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-gray-600 cursor-help">
                <Info size={16} className="mr-2 text-gray-400" />
                <span>Filter Tips</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Combine multiple filters to narrow your search. You can select multiple brands, categories, and other
                options simultaneously.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
