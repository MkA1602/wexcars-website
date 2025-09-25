"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import type { Car } from "@/lib/types"

interface CarImageCarouselProps {
  car: Car
  className?: string
  onImageLoad?: () => void
  onImageError?: () => void
}

// Generate multiple image variations for each car
const generateCarImages = (car: Car): string[] => {
  const baseImage = car.image || "/placeholder.svg?height=400&width=600&query=luxury+car"
  
  // If it's a placeholder or empty, create variations with different angles/views
  if (baseImage.includes("placeholder.svg") || !baseImage || baseImage === "") {
    const carName = `${car.brand}+${car.name}`.replace(/\s+/g, '+')
    return [
      `/placeholder.svg?height=400&width=600&text=${carName}+Front`,
      `/placeholder.svg?height=400&width=600&text=${carName}+Side`,
      `/placeholder.svg?height=400&width=600&text=${carName}+Rear`,
      `/placeholder.svg?height=400&width=600&text=${carName}+Interior`,
      `/placeholder.svg?height=400&width=600&text=${carName}+Engine`
    ]
  }
  
  // For real images, create variations with different parameters
  return [
    baseImage,
    `${baseImage}?angle=1`,
    `${baseImage}?angle=2`,
    `${baseImage}?angle=3`,
    `${baseImage}?angle=4`
  ]
}

export default function CarImageCarousel({ 
  car, 
  className = "", 
  onImageLoad, 
  onImageError 
}: CarImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const images = generateCarImages(car)
  
  // Debug logging
  console.log(`Car ${car.brand} ${car.name}:`, {
    originalImage: car.image,
    generatedImages: images
  })
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    onImageLoad?.()
  }, [onImageLoad])
  
  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoaded(true)
    onImageError?.()
  }, [onImageError])
  
  // Auto-cycle through images when hovering
  useEffect(() => {
    if (!isHovering || images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 800) // Change image every 800ms
    
    return () => clearInterval(interval)
  }, [isHovering, images.length])
  
  // Reset to first image when not hovering
  useEffect(() => {
    if (!isHovering) {
      setCurrentImageIndex(0)
    }
  }, [isHovering])
  
  const handleMouseEnter = () => {
    setIsHovering(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovering(false)
  }
  
  if (imageError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <div className="text-4xl mb-2">🚗</div>
        <span className="text-gray-600 text-sm font-medium">{car.brand} {car.name}</span>
        <span className="text-gray-500 text-xs">Image not available</span>
      </div>
    )
  }
  
  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main image */}
      <Image
        src={images[currentImageIndex]}
        alt={`${car.brand} ${car.name} - View ${currentImageIndex + 1}`}
        fill
        className={`object-cover transition-all duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${isHovering ? 'scale-105' : 'scale-100'}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Loading spinner */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-light rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Image counter indicator (only show when hovering and multiple images) */}
      {isHovering && images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
      
      {/* Hover overlay with cycling indicator */}
      {isHovering && images.length > 1 && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
          <div className="absolute bottom-2 left-2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
