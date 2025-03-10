'use client'

import React from 'react'
import { Camera, DollarSign, Info } from 'lucide-react'

const SellCarsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sell Your Car</h1>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Make</label>
                <input type="text" className="input w-full" placeholder="e.g. BMW" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <input type="text" className="input w-full" placeholder="e.g. 3 Series" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input type="number" className="input w-full" placeholder="e.g. 2022" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mileage</label>
                <input type="number" className="input w-full" placeholder="e.g. 15000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="input w-full h-32"
                placeholder="Describe your vehicle's condition, features, and history"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="number" className="input w-full pl-10" placeholder="Enter your asking price" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Photos</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop photos here, or click to select files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Maximum 10 photos, each up to 5MB
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your listing will be reviewed by our team before being published. This typically takes 24-48 hours.
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SellCarsPage 