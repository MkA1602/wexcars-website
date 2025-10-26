"use client"

import { useState } from "react"
import type { Car } from "@/lib/types"
import { ZoomIn, Calendar, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarGalleryProps {
  car: Car
}

export default function CarGallery({ car }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Parse additional images from JSON string if available
  const parseImages = (imagesString: string | null | undefined): string[] => {
    if (!imagesString) return []
    try {
      const parsed = JSON.parse(imagesString)
      // Ensure we have an array and filter out any empty/null values
      return Array.isArray(parsed) ? parsed.filter(img => img && img.trim() !== '') : []
    } catch {
      return []
    }
  }

  // Build images array from car data
  const additionalImages = parseImages(car.images)
  const images = car.image ? [car.image, ...additionalImages] : additionalImages
  
  // Fallback to placeholder if no images
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=400&width=600&query=luxury+car"]

  // Ensure we have unique images for thumbnails
  const uniqueImages = [...new Set(displayImages)]
  const thumbnailImages = uniqueImages // Show all images as thumbnails, not just 4

  // Debug logging to check for duplicates
  console.log('Original images:', displayImages)
  console.log('Unique images:', uniqueImages)
  console.log('Thumbnail images:', thumbnailImages)

  const openLightbox = () => {
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Main Image Section - Left Side - Made Smaller */}
        <div className="lg:col-span-4 relative">
          <div className="relative h-[300px] md:h-[400px] lg:h-[450px] bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={displayImages[hoveredIndex !== null ? hoveredIndex : activeIndex] || "/placeholder.svg"}
              alt={`${car.brand} ${car.name}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={openLightbox}
            />
            
            {/* New Car Label - Professional Design */}
            {car.is_new_car && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2 z-10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                NEW CAR
              </div>
            )}
            
            {/* Availability Banner */}
            <div className={`absolute ${car.is_new_car ? 'top-4 right-4' : 'top-4 left-4'} bg-red-600 text-white px-3 py-1 rounded-lg font-semibold text-sm flex items-center gap-2`}>
              <Calendar className="w-4 h-4" />
              {car.availability === 'available_now' ? 'AVAILABLE NOW' : 
               car.availability === 'available_soon' ? `AVAILABLE IN ${car.availability_days || 12} DAYS` :
               car.availability === 'available_date' ? `AVAILABLE FROM ${car.availability_date || 'TBD'}` :
               'AVAILABLE'}
            </div>
            
            {/* Photo Count Button */}
            <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              +{displayImages.length} photos
            </div>
            
            {/* Zoom Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-md"
              onClick={openLightbox}
            >
              <ZoomIn size={20} />
            </Button>
          </div>
        </div>

        {/* Thumbnail Grid - Right Side - Made Bigger */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 max-h-[450px] overflow-y-auto">
            {thumbnailImages.map((image, index) => (
              <div
                key={`thumbnail-${index}-${image}`}
                className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                  activeIndex === index ? "ring-2 ring-red-600/30" : "hover:ring-2 hover:ring-red-300/30"
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img 
                  src={image} 
                  alt={`${car.brand} ${car.name} view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-6xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={displayImages[activeIndex] || "/placeholder.svg"}
              alt={`${car.brand} ${car.name}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            {/* Navigation in Lightbox */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-white/50 shadow-lg backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1)
              }}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-white/50 shadow-lg backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1)
              }}
            >
              →
            </Button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
              {activeIndex + 1} of {displayImages.length}
            </div>
            
            {/* Close Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white border-white/50 shadow-lg backdrop-blur-sm"
              onClick={closeLightbox}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
