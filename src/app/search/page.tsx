'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Search as SearchIcon, Filter, DollarSign, MapPin } from 'lucide-react'

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    make: 'All Makes',
    priceRange: 'Any Price',
    year: 'Any Year',
    bodyStyle: 'All Styles',
    location: 'Any Location',
    transmission: 'Any Transmission',
    fuelType: 'Any Fuel Type',
    color: 'Any Color',
  })

  const searchResults = [
    {
      id: 1,
      title: '2023 BMW M3 Competition',
      price: 75000,
      location: 'Los Angeles, CA',
      image: 'https://picsum.photos/id/111/800/500',
      make: 'BMW',
      year: 2023,
      mileage: '5,000',
      bodyStyle: 'Sedan',
    },
    {
      id: 2,
      title: '2022 Porsche 911 GT3',
      price: 185000,
      location: 'Miami, FL',
      image: 'https://picsum.photos/id/112/800/500',
      make: 'Porsche',
      year: 2022,
      mileage: '3,500',
      bodyStyle: 'Coupe',
    },
    {
      id: 3,
      title: '2023 Mercedes-AMG GT',
      price: 165000,
      location: 'New York, NY',
      image: 'https://picsum.photos/id/113/800/500',
      make: 'Mercedes-Benz',
      year: 2023,
      mileage: '2,800',
      bodyStyle: 'Coupe',
    },
  ]

  const filters = {
    make: ['All Makes', 'BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Ferrari', 'Lamborghini', 'McLaren'],
    priceRange: ['Any Price', 'Under $50k', '$50k-$100k', '$100k-$200k', '$200k+', '$500k+'],
    year: ['Any Year', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
    bodyStyle: ['All Styles', 'Sedan', 'Coupe', 'SUV', 'Convertible', 'Wagon', 'Van'],
    location: ['Any Location', 'Los Angeles', 'New York', 'Miami', 'San Francisco', 'Chicago', 'Houston'],
    transmission: ['Any Transmission', 'Automatic', 'Manual', 'Semi-Automatic'],
    fuelType: ['Any Fuel Type', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'],
    color: ['Any Color', 'Black', 'White', 'Silver', 'Blue', 'Red', 'Green', 'Other'],
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Cars</h1>

        {/* Search Bar */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <select
              className="input"
              value={selectedFilters.make}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, make: e.target.value })}
            >
              {filters.make.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedFilters.priceRange}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, priceRange: e.target.value })}
            >
              {filters.priceRange.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedFilters.year}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, year: e.target.value })}
            >
              {filters.year.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedFilters.bodyStyle}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, bodyStyle: e.target.value })}
            >
              {filters.bodyStyle.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <select
              className="input"
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, location: e.target.value })}
            >
              {filters.location.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedFilters.transmission}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, transmission: e.target.value })}
            >
              {filters.transmission.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedFilters.fuelType}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, fuelType: e.target.value })}
            >
              {filters.fuelType.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="input"
              value={selectedFilters.color}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, color: e.target.value })}
            >
              {filters.color.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by make, model, or keyword"
                className="input w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-primary px-8">Search</button>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {searchResults.map((result) => (
            <div key={result.id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={800}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {result.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xl font-bold text-primary mb-2">
                        <DollarSign className="w-5 h-5" />
                        {result.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Year
                      </p>
                      <p className="font-semibold">{result.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Mileage
                      </p>
                      <p className="font-semibold">{result.mileage} miles</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Body Style
                      </p>
                      <p className="font-semibold">{result.bodyStyle}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="btn-primary flex-1">View Details</button>
                    <button className="btn-secondary">Save</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage 