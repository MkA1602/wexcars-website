"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, X } from "lucide-react"

// This would normally come from a database
const carsData = [
  {
    id: "mercedes-s-class",
    title: "Mercedes-Benz S-Class",
    year: 2023,
    price: 89900,
    image: "/placeholder.svg?key=rspkm",
  },
  {
    id: "bmw-7-series",
    title: "BMW 7 Series",
    year: 2023,
    price: 84500,
    image: "/placeholder.svg?key=qzric",
  },
  {
    id: "audi-a8",
    title: "Audi A8",
    year: 2023,
    price: 79900,
    image: "/placeholder.svg?key=r5vfs",
  },
  {
    id: "porsche-911",
    title: "Porsche 911",
    year: 2023,
    price: 115000,
    image: "/placeholder.svg?key=p911s",
  },
  {
    id: "bentley-continental",
    title: "Bentley Continental GT",
    year: 2022,
    price: 195000,
    image: "/placeholder.svg?key=bcgt2",
  },
]

interface SearchBarProps {
  transparent?: boolean
}

export default function SearchBar({ transparent = false }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof carsData>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Filter cars based on search query
    if (query.trim() === "") {
      setResults([])
      return
    }

    const filteredResults = carsData.filter(
      (car) => car.title.toLowerCase().includes(query.toLowerCase()) || car.year.toString().includes(query),
    )

    setResults(filteredResults)
  }, [query])

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  // Determine styles based on transparency and focus state
  const bgColor = transparent ? (isFocused ? "bg-white" : "bg-white/20 backdrop-blur-sm") : "bg-gray-100"

  const textColor = transparent && !isFocused ? "text-white placeholder-white/70" : "text-gray-900 placeholder-gray-500"

  const borderColor = isFocused
    ? "ring-2 ring-primary-500"
    : transparent && !isFocused
      ? "ring-1 ring-white/30"
      : "ring-1 ring-gray-200"

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            setIsFocused(true)
          }}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-2 pl-10 rounded-full text-sm transition-all duration-200 ${bgColor} ${textColor} ${borderColor}`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 ${transparent && !isFocused ? "text-white/70" : "text-gray-400"}`} />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setResults([])
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X
              className={`h-4 w-4 ${transparent && !isFocused ? "text-white/70" : "text-gray-400"} hover:text-gray-600`}
            />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto ring-1 ring-black ring-opacity-5">
          {results.length > 0 ? (
            <div>
              <div className="p-2 border-b">
                <p className="text-xs text-gray-500">
                  {results.length} {results.length === 1 ? "result" : "results"} found
                </p>
              </div>
              <ul className="py-1">
                {results.map((car) => (
                  <li key={car.id} className="border-b last:border-0">
                    <Link
                      href={`/inventory/${car.id}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="relative h-12 w-16 mr-3 rounded overflow-hidden bg-gray-100">
                        <Image src={car.image || "/placeholder.svg"} alt={car.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {car.year} {car.title}
                        </p>
                        <p className="text-primary-600 font-bold text-sm">${car.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-2 border-t">
                <button
                  onClick={handleSearch}
                  className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  View all results
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
