"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cars } from "@/lib/car-data"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchBarProps {
  onSearch: (query: string) => void
  initialQuery?: string
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  className?: string
}

export default function SearchBar({
  onSearch,
  initialQuery = "",
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  className = "",
}: SearchBarProps) {
  // Use internal state if external state is not provided
  const [internalQuery, setInternalQuery] = useState(initialQuery)
  const query = externalSearchQuery !== undefined ? externalSearchQuery : internalQuery
  const setQuery = externalSetSearchQuery || setInternalQuery

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)
  const isInitialMount = useRef(true)
  const isMounted = useRef(true)

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem("recentSearches")
      if (savedSearches && isMounted.current) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    } catch (error) {
      console.error("Error loading recent searches:", error)
    }
  }, [])

  // Update internal query when initialQuery changes, but only on first mount
  useEffect(() => {
    if (isInitialMount.current && initialQuery && isMounted.current) {
      setQuery(initialQuery)
      isInitialMount.current = false
    }
  }, [initialQuery, setQuery])

  // Generate suggestions based on query
  useEffect(() => {
    if (debouncedQuery.length < 2 || !isMounted.current) {
      setSuggestions([])
      return
    }

    const queryLower = debouncedQuery.toLowerCase()

    // Get unique brands, models, and categories that match the query
    const brandSuggestions = Array.from(
      new Set(cars.map((car) => car.brand).filter((brand) => brand.toLowerCase().includes(queryLower))),
    )

    const modelSuggestions = Array.from(
      new Set(
        cars.map((car) => `${car.brand} ${car.name}`).filter((model) => model.toLowerCase().includes(queryLower)),
      ),
    )

    const categorySuggestions = Array.from(
      new Set(cars.map((car) => car.category).filter((category) => category.toLowerCase().includes(queryLower))),
    )

    // Combine and deduplicate suggestions
    const allSuggestions = [...brandSuggestions, ...modelSuggestions, ...categorySuggestions]

    // Sort suggestions by relevance
    const sortedSuggestions = allSuggestions.sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()

      if (aLower === queryLower && bLower !== queryLower) return -1
      if (aLower !== queryLower && bLower === queryLower) return 1
      if (aLower.startsWith(queryLower) && !bLower.startsWith(queryLower)) return -1
      if (!aLower.startsWith(queryLower) && bLower.startsWith(queryLower)) return 1

      return 0
    })

    if (isMounted.current) {
      setSuggestions(sortedSuggestions.slice(0, 5))
    }
  }, [debouncedQuery])

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Memoize functions to prevent unnecessary re-renders
  const submitSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim()
      onSearch(trimmedQuery)
      setShowSuggestions(false)

      // Save to recent searches
      if (trimmedQuery) {
        try {
          const updatedSearches = [trimmedQuery, ...recentSearches.filter((s) => s !== trimmedQuery)].slice(0, 5)
          setRecentSearches(updatedSearches)
          localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
        } catch (error) {
          console.error("Error saving recent searches:", error)
        }
      }
    },
    [onSearch, recentSearches],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      submitSearch(query)
    },
    [query, submitSearch],
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion)
      submitSearch(suggestion)
    },
    [setQuery, submitSearch],
  )

  const clearSearch = useCallback(() => {
    setQuery("")
    onSearch("")
    inputRef.current?.focus()
  }, [onSearch, setQuery])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem("recentSearches")
    } catch (error) {
      console.error("Error clearing recent searches:", error)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value.length >= 2) {
                setShowSuggestions(true)
              } else {
                setShowSuggestions(false)
              }
            }}
            onFocus={() => {
              if (query.length >= 2 || recentSearches.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="block w-full p-4 pl-10 pr-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary-light focus:border-primary-light"
            placeholder="Search by make, model, or keyword..."
            aria-label="Search vehicles"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <Button
            type="submit"
            className="absolute right-2.5 bottom-2.5 bg-primary-light hover:bg-primary-dark text-white rounded-lg px-4 py-2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (query.length >= 2 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          {query.length >= 2 && suggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Suggestions</h3>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center"
                    >
                      <Search size={14} className="text-gray-400 mr-2" />
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Recent Searches</h3>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                >
                  Clear
                </button>
              </div>
              <ul>
                {recentSearches.map((search, index) => (
                  <li key={`recent-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center"
                    >
                      <Search size={14} className="text-gray-400 mr-2" />
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
