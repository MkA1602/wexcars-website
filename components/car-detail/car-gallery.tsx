"use client"

import { useState } from "react"
import type { Car } from "@/lib/types"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarGalleryProps {
  car: Car
}

export default function CarGallery({ car }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  // Parse additional images from JSON string if available
  const parseImages = (imagesString: string | null | undefined): string[] => {
    if (!imagesString) return []
    try {
      return JSON.parse(imagesString)
    } catch {
      return []
    }
  }

  // Build images array from car data
  const additionalImages = parseImages(car.images)
  const images = car.image ? [car.image, ...additionalImages] : additionalImages
  
  // Fallback to placeholder if no images
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=400&width=600&query=luxury+car"]

  const nextImage = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const openLightbox = () => {
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
  }

  return (
    <>
      <div className="bg-primary-light rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          {/* Main image */}
          <div className="relative h-[300px] md:h-[500px] bg-primary-light">
            <img
              src={displayImages[activeIndex] || "/placeholder.svg"}
              alt={`${car.brand} ${car.name}`}
              className="w-full h-full object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={openLightbox}
            >
              <ZoomIn size={20} />
            </Button>
          </div>

          {/* Navigation arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Thumbnails */}
        <div className="flex p-2 overflow-x-auto bg-white">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-24 h-16 mx-1 cursor-pointer ${
                activeIndex === index ? "ring-2 ring-primary-light" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={displayImages[activeIndex] || "/placeholder.svg"}
              alt={`${car.brand} ${car.name}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 hover:bg-white/40"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 hover:bg-white/40"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight size={24} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white"
              onClick={closeLightbox}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
