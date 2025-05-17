"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarGalleryProps {
  images: string[]
  title: string
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const selectImage = (index: number) => {
    setCurrentImage(index)
  }

  return (
    <div className="space-y-4">
      <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={`${title} - Image ${currentImage + 1}`}
          fill
          className="object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`w-2 h-2 rounded-full ${currentImage === index ? "bg-white" : "bg-white/50"}`}
              aria-label={`View image ${index + 1}`}
              aria-current={currentImage === index}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`relative h-16 rounded-md overflow-hidden ${
              currentImage === index ? "ring-2 ring-primary-600" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
