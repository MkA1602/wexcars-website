"use client"

import type React from "react"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

export default function InventoryFilters() {
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [yearRange, setYearRange] = useState([2010, 2023])
  const [showMakes, setShowMakes] = useState(true)
  const [showBodyTypes, setShowBodyTypes] = useState(true)
  const [showFuelTypes, setShowFuelTypes] = useState(true)
  const [showTransmissions, setShowTransmissions] = useState(true)

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (e.target.id === "price-min") {
      setPriceRange([value, priceRange[1]])
    } else {
      setPriceRange([priceRange[0], value])
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (e.target.id === "year-min") {
      setYearRange([value, yearRange[1]])
    } else {
      setYearRange([yearRange[0], value])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Filter Vehicles</h2>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search by make, model..."
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">${priceRange[0].toLocaleString()}</span>
          <span className="text-sm text-gray-500">${priceRange[1].toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price-min" className="sr-only">
              Minimum Price
            </label>
            <input
              type="number"
              id="price-min"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={handlePriceChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Min"
            />
          </div>
          <div>
            <label htmlFor="price-max" className="sr-only">
              Maximum Price
            </label>
            <input
              type="number"
              id="price-max"
              min={priceRange[0]}
              max="1000000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Year Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Year Range</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{yearRange[0]}</span>
          <span className="text-sm text-gray-500">{yearRange[1]}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year-min" className="sr-only">
              Minimum Year
            </label>
            <input
              type="number"
              id="year-min"
              min="1990"
              max={yearRange[1]}
              value={yearRange[0]}
              onChange={handleYearChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Min"
            />
          </div>
          <div>
            <label htmlFor="year-max" className="sr-only">
              Maximum Year
            </label>
            <input
              type="number"
              id="year-max"
              min={yearRange[0]}
              max="2023"
              value={yearRange[1]}
              onChange={handleYearChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Makes */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2"
          onClick={() => setShowMakes(!showMakes)}
        >
          <span>Make</span>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform ${showMakes ? "transform rotate-180" : ""}`}
          />
        </button>
        {showMakes && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="make-mercedes"
                name="make"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="make-mercedes" className="ml-2 block text-sm text-gray-700">
                Mercedes-Benz
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="make-bmw"
                name="make"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="make-bmw" className="ml-2 block text-sm text-gray-700">
                BMW
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="make-audi"
                name="make"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="make-audi" className="ml-2 block text-sm text-gray-700">
                Audi
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="make-porsche"
                name="make"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="make-porsche" className="ml-2 block text-sm text-gray-700">
                Porsche
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="make-bentley"
                name="make"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="make-bentley" className="ml-2 block text-sm text-gray-700">
                Bentley
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="make-ferrari"
                name="make"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="make-ferrari" className="ml-2 block text-sm text-gray-700">
                Ferrari
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Body Types */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2"
          onClick={() => setShowBodyTypes(!showBodyTypes)}
        >
          <span>Body Type</span>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform ${showBodyTypes ? "transform rotate-180" : ""}`}
          />
        </button>
        {showBodyTypes && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="body-sedan"
                name="body"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="body-sedan" className="ml-2 block text-sm text-gray-700">
                Sedan
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="body-suv"
                name="body"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="body-suv" className="ml-2 block text-sm text-gray-700">
                SUV
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="body-coupe"
                name="body"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="body-coupe" className="ml-2 block text-sm text-gray-700">
                Coupe
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="body-convertible"
                name="body"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="body-convertible" className="ml-2 block text-sm text-gray-700">
                Convertible
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Fuel Types */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2"
          onClick={() => setShowFuelTypes(!showFuelTypes)}
        >
          <span>Fuel Type</span>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform ${showFuelTypes ? "transform rotate-180" : ""}`}
          />
        </button>
        {showFuelTypes && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="fuel-gasoline"
                name="fuel"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="fuel-gasoline" className="ml-2 block text-sm text-gray-700">
                Gasoline
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="fuel-diesel"
                name="fuel"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="fuel-diesel" className="ml-2 block text-sm text-gray-700">
                Diesel
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="fuel-hybrid"
                name="fuel"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="fuel-hybrid" className="ml-2 block text-sm text-gray-700">
                Hybrid
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="fuel-electric"
                name="fuel"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="fuel-electric" className="ml-2 block text-sm text-gray-700">
                Electric
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Transmissions */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2"
          onClick={() => setShowTransmissions(!showTransmissions)}
        >
          <span>Transmission</span>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform ${showTransmissions ? "transform rotate-180" : ""}`}
          />
        </button>
        {showTransmissions && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="transmission-automatic"
                name="transmission"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="transmission-automatic" className="ml-2 block text-sm text-gray-700">
                Automatic
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="transmission-manual"
                name="transmission"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="transmission-manual" className="ml-2 block text-sm text-gray-700">
                Manual
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Apply Filters Button */}
      <button
        type="button"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Apply Filters
      </button>
      <button
        type="button"
        className="w-full mt-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Reset Filters
      </button>
    </div>
  )
}
