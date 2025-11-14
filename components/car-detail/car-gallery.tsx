"use client"

import { useMemo, useState } from "react"
import type { Car } from "@/lib/types"
import { ZoomIn, Calendar, Image as ImageIcon, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string }

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

  const parseVideos = (videosData: string | null | undefined, fallback?: string | null): string[] => {
    const urls: string[] = []

    const addUrl = (url?: string | null) => {
      if (url && typeof url === "string") {
        const trimmed = url.trim()
        if (trimmed) {
          urls.push(trimmed)
        }
      }
    }

    // add fallback (legacy single video field)
    addUrl(fallback)

    if (videosData) {
      try {
        const parsed = JSON.parse(videosData)
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => addUrl(typeof item === "string" ? item : null))
        } else if (typeof parsed === "string") {
          addUrl(parsed)
        }
      } catch {
        // If parsing fails, treat as single URL string
        addUrl(videosData)
      }
    }

    return Array.from(new Set(urls))
  }

  // Build images array from car data
  const additionalImages = parseImages(car.images)
  const images = car.image ? [car.image, ...additionalImages] : additionalImages
  
  // Fallback to placeholder if no images
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=400&width=600&query=luxury+car"]

  // Ensure we have unique images and use the same array for both main and thumbnails
  const uniqueImages = useMemo(() => [...new Set(displayImages)], [displayImages])

  const videoUrls = useMemo(
    () => parseVideos(car.videos, car.video_url),
    [car.videos, car.video_url]
  )

  const mediaItems: MediaItem[] = useMemo(() => {
    const imageItems = uniqueImages.map<MediaItem>((src) => ({ type: "image", src }))
    const videoItems = videoUrls.map<MediaItem>((src) => ({ type: "video", src }))
    const combined = [...imageItems, ...videoItems]

    if (combined.length === 0) {
      return [{ type: "image", src: "/placeholder.svg?height=400&width=600&query=luxury+car" }]
    }

    return combined
  }, [uniqueImages, videoUrls])

  const totalMedia = mediaItems.length
  const imageCount = uniqueImages.length
  const videoCount = videoUrls.length

  const activeMediaIndex = hoveredIndex !== null ? hoveredIndex : activeIndex
  const activeMedia = mediaItems[Math.max(0, Math.min(activeMediaIndex, totalMedia - 1))]

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v")
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url
      }
      if (parsed.hostname.includes("youtu.be")) {
        const videoId = parsed.pathname.replace("/", "")
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url
      }
    } catch {
      // ignore parsing errors
    }
    return url
  }

  const renderVideoPlayer = (url: string, opts?: { className?: string; autoPlay?: boolean }) => {
    const embedUrl = getYouTubeEmbedUrl(url)
    const isYouTube = embedUrl.includes("youtube.com/embed")

    if (isYouTube) {
      return (
        <iframe
          key={embedUrl}
          src={embedUrl}
          className={opts?.className}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Car video"
        />
      )
    }

    return (
      <video
        key={url}
        src={url}
        controls
        playsInline
        className={opts?.className}
        autoPlay={opts?.autoPlay}
      >
        Your browser does not support the video tag.
      </video>
    )
  }

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
            {activeMedia?.type === "video" ? (
              <div
                className="w-full h-full bg-black flex items-center justify-center cursor-pointer"
                onClick={openLightbox}
              >
                {renderVideoPlayer(activeMedia.src, {
                  className: "w-full h-full object-cover",
                })}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-4">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                key={`main-media-${activeMedia?.src}`}
                src={activeMedia?.src || "/placeholder.svg"}
                alt={`${car.brand} ${car.name}`}
                className="w-full h-full object-cover cursor-pointer transition-opacity duration-300"
                onClick={openLightbox}
              />
            )}

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
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
              {imageCount > 0 && (
                <div className="bg-gray-800 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  +{imageCount} {imageCount === 1 ? "photo" : "photos"}
                </div>
              )}
              {videoCount > 0 && (
                <div className="bg-gray-800 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {videoCount} {videoCount === 1 ? "video" : "videos"}
                </div>
              )}
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
            {mediaItems.map((item, index) => (
              <div
                key={`thumbnail-${index}-${item.src}`}
                className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                  activeIndex === index ? "ring-2 ring-red-600/30" : "hover:ring-2 hover:ring-red-300/30"
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {item.type === "image" ? (
                  <img 
                    src={item.src} 
                    alt={`${car.brand} ${car.name} media ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center text-white">
                    <Play className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-6xl max-h-[90vh] p-4 w-full" onClick={(e) => e.stopPropagation()}>
            {mediaItems[activeIndex]?.type === "video" ? (
              <div className="w-full h-[70vh] flex items-center justify-center">
                {renderVideoPlayer(mediaItems[activeIndex]?.src || "", {
                  className: "w-full h-full max-h-full rounded-lg",
                  autoPlay: true,
                })}
              </div>
            ) : (
              <img
                src={mediaItems[activeIndex]?.src || "/placeholder.svg"}
                alt={`${car.brand} ${car.name}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
              />
            )}
            
            {/* Navigation in Lightbox */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-white/50 shadow-lg backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(prev => prev === 0 ? totalMedia - 1 : prev - 1)
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
                setActiveIndex(prev => prev === totalMedia - 1 ? 0 : prev + 1)
              }}
            >
              →
            </Button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
              {activeIndex + 1} of {totalMedia}
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
