"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabase/client"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Car } from "@/lib/types"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const categories = [
  {
    id: 1,
    name: "SUV",
    image: `${GITHUB_RAW_BASE}/category-images/suv-land-rover-01.png`,
    description: "Spacious luxury with commanding presence",
    count: 0,
  },
  {
    id: 2,
    name: "Sedan",
    image: `${GITHUB_RAW_BASE}/category-images/sedan-330e-01.png`,
    description: "Refined elegance with superior comfort",
    count: 0,
  },
  {
    id: 3,
    name: "Coupe",
    image: `${GITHUB_RAW_BASE}/category-images/coupe-mercedes-01.png`,
    description: "Sleek styling with athletic performance",
    count: 0,
  },
  {
    id: 4,
    name: "Convertible",
    image: `${GITHUB_RAW_BASE}/category-images/convert-mercedes-01.png`,
    description: "Open-air luxury driving experience",
    count: 0,
  },
]

export default function CarCategories() {
  const [selectedMakeModel, setSelectedMakeModel] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [filteredCategories, setFilteredCategories] = useState(categories)
  const [allCars, setAllCars] = useState<Car[]>([])
  const [categoryStats, setCategoryStats] = useState({
    totalVehicles: 0,
    brands: 0,
    satisfaction: "100%",
  })
  const [activeFilters, setActiveFilters] = useState({
    makeModel: false,
    search: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  // Fetch cars from database
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true)
        const { data: carsData, error } = await supabaseClient
          .from('cars')
          .select('*')
          .eq('is_sold', false) // Only fetch non-sold cars
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching cars:', error)
          return
        }

        setAllCars(carsData || [])
        
        // Calculate real category counts
        const categoryCounts: Record<string, number> = {}
        carsData.forEach((car: any) => {
          if (!categoryCounts[car.category]) {
            categoryCounts[car.category] = 0
          }
          categoryCounts[car.category]++
        })

        // Update categories with real counts
        const updatedCategories = categories.map((category) => ({
          ...category,
          count: categoryCounts[category.name] || 0,
        }))

        setFilteredCategories(updatedCategories)
        setCategoryStats({
          totalVehicles: carsData.length,
          brands: [...new Set((carsData as Car[]).map((car: Car) => car.brand))].length,
          satisfaction: "100%",
        })
      } catch (error) {
        console.error('Error fetching cars:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Handle make & model selection
  const handleMakeModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedMakeModel(value)
    setActiveFilters((prev) => ({ ...prev, makeModel: value !== "" }))
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSearching(true)
    setActiveFilters((prev) => ({ ...prev, search: searchQuery.trim() !== "" }))
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    setActiveFilters((prev) => ({ ...prev, search: false }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedMakeModel("")
    setSearchQuery("")
    setIsSearching(false)
    setActiveFilters({ makeModel: false, search: false })
  }

  // Filter categories based on selection and search
  useEffect(() => {
    if (!allCars.length) return

          // If no filters are active, show all categories with real counts
      if (!activeFilters.makeModel && !activeFilters.search) {
        const categoryCounts: Record<string, number> = {}
        allCars.forEach((car: Car) => {
          if (!categoryCounts[car.category]) {
            categoryCounts[car.category] = 0
          }
          categoryCounts[car.category]++
        })

      const updatedCategories = categories.map((category) => ({
        ...category,
        count: categoryCounts[category.name] || 0,
      }))

      setFilteredCategories(updatedCategories)
      setCategoryStats({
        totalVehicles: allCars.length,
        brands: [...new Set(allCars.map((car) => car.brand))].length,
        satisfaction: "100%",
      })
      return
    }

    // Filter cars based on active filters
    let filteredCars = [...allCars]

    // Apply make/model filter if active
    if (activeFilters.makeModel && selectedMakeModel) {
      // Get the make from the selected value (format: "make-model")
      const [make, model] = selectedMakeModel.split("-")

      filteredCars = filteredCars.filter((car) => {
        // If only make is selected (no specific model)
        if (!model) {
          return car.brand.toLowerCase().includes(make.toLowerCase())
        }

        // If specific model is selected
        return (
          car.id === selectedMakeModel ||
          (car.brand.toLowerCase().includes(make.toLowerCase()) && car.name.toLowerCase().includes(model.toLowerCase()))
        )
      })
    }

    // Apply search filter if active
    if (activeFilters.search && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      filteredCars = filteredCars.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query) ||
          car.description.toLowerCase().includes(query),
      )
    }

    // Count cars in each category after filtering
    const categoryCounts: Record<string, number> = {}
    filteredCars.forEach((car: Car) => {
      if (!categoryCounts[car.category]) {
        categoryCounts[car.category] = 0
      }
      categoryCounts[car.category]++
    })

    // Update filtered categories with new counts
    const updatedCategories = categories.map((category) => ({
      ...category,
      count: categoryCounts[category.name] || 0,
    }))

    setFilteredCategories(updatedCategories)

    // Update stats
    setCategoryStats({
      totalVehicles: filteredCars.length,
      brands: [...new Set(filteredCars.map((car) => car.brand))].length,
      satisfaction: "100%",
    })
  }, [selectedMakeModel, isSearching, activeFilters, allCars])

  // Check if any filters are active
  const hasActiveFilters = activeFilters.makeModel || activeFilters.search

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Modern search bar */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-6 mb-10">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-grow">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by brand, model, or keyword..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-12 flex items-center pr-2"
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-full rounded-l-none rounded-r-lg bg-primary-light hover:bg-primary-dark text-white"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="relative group">
                <select className="appearance-none bg-white border border-gray-200 rounded-lg py-3 pl-4 pr-10 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                  <option value="">Price Range</option>
                  <option value="0-50000">Under $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value="100000-200000">$100,000 - $200,000</option>
                  <option value="200000+">$200,000+</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-lg py-3 pl-4 pr-10 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
                  value={selectedMakeModel}
                  onChange={handleMakeModelChange}
                >
                  <option value="">Make & Model</option>
                  <optgroup label="Aston Martin">
                    <option value="aston-martin-db11">DB11</option>
                    <option value="aston-martin-dbs">DBS</option>
                    <option value="aston-martin-vantage">Vantage</option>
                    <option value="aston-martin-dbx">DBX</option>
                    <option value="aston-martin-valkyrie">Valkyrie</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="audi-a3">A3</option>
                    <option value="audi-a4">A4</option>
                    <option value="audi-a6">A6</option>
                    <option value="audi-a8">A8</option>
                    <option value="audi-q3">Q3</option>
                    <option value="audi-q5">Q5</option>
                    <option value="audi-q7">Q7</option>
                    <option value="audi-q8">Q8</option>
                    <option value="audi-e-tron">e-tron</option>
                    <option value="audi-r8">R8</option>
                    <option value="audi-rs6">RS6</option>
                    <option value="audi-rs7">RS7</option>
                  </optgroup>
                  <optgroup label="Bentley">
                    <option value="bentley-continental">Continental GT</option>
                    <option value="bentley-bentayga">Bentayga</option>
                    <option value="bentley-flying-spur">Flying Spur</option>
                    <option value="bentley-bacalar">Bacalar</option>
                  </optgroup>
                  <optgroup label="BMW">
                    <option value="bmw-3-series">3 Series</option>
                    <option value="bmw-5-series">5 Series</option>
                    <option value="bmw-7-series">7 Series</option>
                    <option value="bmw-x3">X3</option>
                    <option value="bmw-x5">X5</option>
                    <option value="bmw-x7">X7</option>
                    <option value="bmw-i4">i4</option>
                    <option value="bmw-i7">i7</option>
                    <option value="bmw-ix">iX</option>
                    <option value="bmw-m3">M3</option>
                    <option value="bmw-m5">M5</option>
                    <option value="bmw-m8">M8</option>
                  </optgroup>
                  <optgroup label="BYD">
                    <option value="byd-atto-3">Atto 3</option>
                    <option value="byd-han">Han</option>
                    <option value="byd-tang">Tang</option>
                    <option value="byd-seal">Seal</option>
                    <option value="byd-dolphin">Dolphin</option>
                  </optgroup>
                  <optgroup label="Ferrari">
                    <option value="ferrari-roma">Roma</option>
                    <option value="ferrari-296-gtb">296 GTB</option>
                    <option value="ferrari-sf90">SF90 Stradale</option>
                    <option value="ferrari-f8">F8 Tributo</option>
                    <option value="ferrari-812">812 Superfast</option>
                    <option value="ferrari-purosangue">Purosangue</option>
                  </optgroup>
                  <optgroup label="Ford">
                    <option value="ford-mustang">Mustang</option>
                    <option value="ford-f-150">F-150</option>
                    <option value="ford-explorer">Explorer</option>
                    <option value="ford-bronco">Bronco</option>
                    <option value="ford-mach-e">Mustang Mach-E</option>
                    <option value="ford-gt">GT</option>
                  </optgroup>
                  <optgroup label="Hyundai">
                    <option value="hyundai-tucson">Tucson</option>
                    <option value="hyundai-santa-fe">Santa Fe</option>
                    <option value="hyundai-palisade">Palisade</option>
                    <option value="hyundai-ioniq-5">IONIQ 5</option>
                    <option value="hyundai-ioniq-6">IONIQ 6</option>
                    <option value="hyundai-sonata">Sonata</option>
                  </optgroup>
                  <optgroup label="Kia">
                    <option value="kia-sportage">Sportage</option>
                    <option value="kia-sorento">Sorento</option>
                    <option value="kia-telluride">Telluride</option>
                    <option value="kia-ev6">EV6</option>
                    <option value="kia-stinger">Stinger</option>
                    <option value="kia-k5">K5</option>
                  </optgroup>
                  <optgroup label="Lamborghini">
                    <option value="lamborghini-huracan">Huracán</option>
                    <option value="lamborghini-aventador">Aventador</option>
                    <option value="lamborghini-urus">Urus</option>
                    <option value="lamborghini-revuelto">Revuelto</option>
                    <option value="lamborghini-sian">Sián</option>
                  </optgroup>
                  <optgroup label="Land Rover">
                    <option value="land-rover-range-rover">Range Rover</option>
                    <option value="land-rover-range-rover-sport">Range Rover Sport</option>
                    <option value="land-rover-range-rover-velar">Range Rover Velar</option>
                    <option value="land-rover-range-rover-evoque">Range Rover Evoque</option>
                    <option value="land-rover-defender">Defender</option>
                    <option value="land-rover-discovery">Discovery</option>
                  </optgroup>
                  <optgroup label="Maserati">
                    <option value="maserati-ghibli">Ghibli</option>
                    <option value="maserati-quattroporte">Quattroporte</option>
                    <option value="maserati-levante">Levante</option>
                    <option value="maserati-mc20">MC20</option>
                    <option value="maserati-grecale">Grecale</option>
                  </optgroup>
                  <optgroup label="Mercedes-Benz">
                    <option value="mercedes-a-class">A-Class</option>
                    <option value="mercedes-c-class">C-Class</option>
                    <option value="mercedes-e-class">E-Class</option>
                    <option value="mercedes-s-class">S-Class</option>
                    <option value="mercedes-glc">GLC</option>
                    <option value="mercedes-gle">GLE</option>
                    <option value="mercedes-gls">GLS</option>
                    <option value="mercedes-eqe">EQE</option>
                    <option value="mercedes-eqs">EQS</option>
                    <option value="mercedes-amg-gt">AMG GT</option>
                    <option value="mercedes-g-class">G-Class</option>
                    <option value="mercedes-maybach">Maybach</option>
                  </optgroup>
                  <optgroup label="Nissan">
                    <option value="nissan-altima">Altima</option>
                    <option value="nissan-maxima">Maxima</option>
                    <option value="nissan-rogue">Rogue</option>
                    <option value="nissan-pathfinder">Pathfinder</option>
                    <option value="nissan-ariya">Ariya</option>
                    <option value="nissan-z">Z</option>
                    <option value="nissan-gt-r">GT-R</option>
                  </optgroup>
                  <optgroup label="Rolls-Royce">
                    <option value="rolls-royce-phantom">Phantom</option>
                    <option value="rolls-royce-ghost">Ghost</option>
                    <option value="rolls-royce-cullinan">Cullinan</option>
                    <option value="rolls-royce-wraith">Wraith</option>
                    <option value="rolls-royce-dawn">Dawn</option>
                    <option value="rolls-royce-spectre">Spectre</option>
                  </optgroup>
                  <optgroup label="Škoda">
                    <option value="skoda-octavia">Octavia</option>
                    <option value="skoda-superb">Superb</option>
                    <option value="skoda-kodiaq">Kodiaq</option>
                    <option value="skoda-karoq">Karoq</option>
                    <option value="skoda-enyaq">Enyaq iV</option>
                  </optgroup>
                  <optgroup label="Toyota">
                    <option value="toyota-camry">Camry</option>
                    <option value="toyota-corolla">Corolla</option>
                    <option value="toyota-rav4">RAV4</option>
                    <option value="toyota-highlander">Highlander</option>
                    <option value="toyota-land-cruiser">Land Cruiser</option>
                    <option value="toyota-supra">Supra</option>
                    <option value="toyota-bz4x">bZ4X</option>
                    <option value="toyota-lexus-ls">Lexus LS</option>
                    <option value="toyota-lexus-lc">Lexus LC</option>
                    <option value="toyota-lexus-rx">Lexus RX</option>
                  </optgroup>
                  <optgroup label="Volkswagen">
                    <option value="volkswagen-golf">Golf</option>
                    <option value="volkswagen-passat">Passat</option>
                    <option value="volkswagen-tiguan">Tiguan</option>
                    <option value="volkswagen-atlas">Atlas</option>
                    <option value="volkswagen-id4">ID.4</option>
                    <option value="volkswagen-id-buzz">ID. Buzz</option>
                    <option value="volkswagen-arteon">Arteon</option>
                  </optgroup>
                  <optgroup label="Volvo">
                    <option value="volvo-s60">S60</option>
                    <option value="volvo-s90">S90</option>
                    <option value="volvo-xc40">XC40</option>
                    <option value="volvo-xc60">XC60</option>
                    <option value="volvo-xc90">XC90</option>
                    <option value="volvo-c40">C40 Recharge</option>
                  </optgroup>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <select className="appearance-none bg-white border border-gray-200 rounded-lg py-3 pl-4 pr-10 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all">
                  <option value="">Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="older">Older</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category heading with decorative elements */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <div className="w-10 h-1 bg-primary-light mr-4"></div>
            <h2 className="text-3xl font-bold">Browse by Category</h2>
          </div>
          <Link
            href="/collections"
            className="text-primary-light hover:text-primary-dark font-medium transition-colors"
          >
            View All Categories
          </Link>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-medium mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.makeModel && (
                    <div className="bg-white px-3 py-1 rounded-full flex items-center gap-1 text-sm border border-gray-200">
                      <span>
                        Make & Model: {selectedMakeModel.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedMakeModel("")
                          setActiveFilters((prev) => ({ ...prev, makeModel: false }))
                        }}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {activeFilters.search && (
                    <div className="bg-white px-3 py-1 rounded-full flex items-center gap-1 text-sm border border-gray-200">
                      <span>Search: "{searchQuery}"</span>
                      <button onClick={clearSearch} className="ml-1 text-gray-500 hover:text-gray-700">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="whitespace-nowrap">
                Clear All Filters
              </Button>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Found {categoryStats.totalVehicles} vehicles across {filteredCategories.filter((c) => c.count > 0).length}{" "}
              categories
            </div>
          </div>
        )}

        {/* No results message */}
        {hasActiveFilters && categoryStats.totalVehicles === 0 && (
          <div className="mb-6 p-8 bg-white rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any vehicles matching your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={clearAllFilters} className="bg-primary-light hover:bg-primary-dark text-white">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Redesigned category cards with full car view */}
        {!isLoading && (categoryStats.totalVehicles > 0 || !hasActiveFilters) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl bg-gray-100 ${
                  category.count === 0 ? "opacity-50" : ""
                }`}
              >
                {/* Car image container with padding to ensure full visibility */}
                <div className="h-64 flex items-center justify-center p-4">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content overlay at the bottom */}
                <div className="bg-gradient-to-t from-black/90 via-black/70 to-black/30 p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {category.count} vehicles
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mb-4">{category.description}</p>
                  <Button
                    className={`w-full bg-white hover:bg-gray-100 text-primary-light font-medium rounded-lg transition-all ${
                      category.count === 0 ? "cursor-not-allowed" : ""
                    }`}
                    disabled={category.count === 0}
                    onClick={() => {
                      if (category.name === "Sedan") {
                        // Specifically handle sedan cars
                        router.push("/collections?category=Sedan")
                      } else {
                        // Handle other categories as before
                        router.push(`/collections?category=${category.name}`)
                      }
                    }}
                  >
                    {category.count === 0 ? "No Vehicles Available" : `Explore ${category.name} Collection`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary-light mb-1">{categoryStats.totalVehicles}+</div>
            <div className="text-gray-600">Luxury Vehicles</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary-light mb-1">{categoryStats.brands}</div>
            <div className="text-gray-600">Premium Brands</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary-light mb-1">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary-light mb-1">{categoryStats.satisfaction}</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
