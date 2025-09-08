"use client"

import { useState } from "react"

interface OpenStreetMapProps {
  className?: string
  height?: string
}

export default function OpenStreetMap({ className = "", height = "400px" }: OpenStreetMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // WexCars location in Malmö, Sweden
  const lat = 55.6050
  const lng = 13.0038
  const zoom = 15

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div 
        className={`w-full bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600 p-6">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
          <p className="text-sm mb-4">Unable to load the map. Here's our location:</p>
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-sm mx-auto">
            <h4 className="font-semibold text-gray-800 mb-2">📍 WexCars Location</h4>
            <p className="text-sm text-gray-600 mb-1">215 52 Malmö, Sweden</p>
            <p className="text-sm text-gray-600 mb-1">📞 +46 737 200581</p>
            <p className="text-sm text-gray-600">✉️ info@wexcars.com</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`w-full bg-gray-200 rounded-xl overflow-hidden shadow-lg relative ${className}`}
      style={{ height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleLoad}
        onError={handleError}
        title="WexCars Location Map"
      />
      
      {/* Custom marker overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
        <div className="w-8 h-8 bg-red-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      
      {/* Location info overlay */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="font-semibold text-gray-800 text-sm mb-1">📍 WexCars</h4>
        <p className="text-xs text-gray-600">215 52 Malmö, Sweden</p>
        <p className="text-xs text-gray-600">📞 +46 737 200581</p>
      </div>
    </div>
  )
}