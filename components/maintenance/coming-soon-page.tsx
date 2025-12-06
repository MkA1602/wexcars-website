"use client"

import { AnimatePresence, motion } from "framer-motion"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const HoverExpand_002 = ({
  images,
  className,
}: {
  images: { src: string; alt: string; code: string; githubSrc?: string }[]
  className?: string
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (index: number, image: { src: string; githubSrc?: string }) => {
    if (imageErrors.has(index)) {
      return // Already tried both sources
    }
    
    console.error('Failed to load image:', image.src);
    setImageErrors(prev => new Set(prev).add(index));
    
    // Try GitHub URL as fallback
    if (image.githubSrc) {
      const img = document.querySelector(`img[data-image-index="${index}"]`) as HTMLImageElement;
      if (img && img.src !== image.githubSrc) {
        img.src = image.githubSrc;
      }
    }
  }

  // Use GitHub URLs as primary source for better CDN reliability
  const getImageSrc = (image: { src: string; githubSrc?: string }, index: number) => {
    // On Netlify or if local failed, use GitHub URL
    if (typeof window !== 'undefined' && (window.location.hostname.includes('netlify') || window.location.hostname.includes('wexcars.com') || imageErrors.has(index))) {
      return image.githubSrc || image.src;
    }
    return image.src;
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center"
      >
        <div className="flex w-full flex-col items-center justify-center gap-1 max-w-[32rem]">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative cursor-pointer overflow-hidden rounded-3xl w-full"
              initial={{ height: "2.5rem" }}
              animate={{
                height: activeImage === index ? "24rem" : "2.5rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/50 to-transparent z-10"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute flex h-full w-full flex-col items-end justify-end px-4 pb-5 z-20"
                  >
                    <p className="text-left text-sm font-semibold text-white drop-shadow-lg">
                      {image.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                data-image-index={index}
                src={getImageSrc(image, index)}
                className="size-full object-cover"
                alt={image.alt}
                onError={() => handleImageError(index, image)}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false)

  // Updated images based on the provided descriptions
  // Images are in: public/maintenance/
  // Using GitHub raw URLs as primary source for reliable CDN delivery
  const images = [
    {
      src: "/maintenance/IMG-20251011-WA0020.jpg",
      githubSrc: `${GITHUB_RAW_BASE}/maintenance/IMG-20251011-WA0020.jpg`,
      alt: "Mercedes-Benz G-Wagen AMG - Matte Black Luxury SUV",
      code: "# Mercedes-Benz G-Wagen AMG",
    },
    {
      src: "/maintenance/b082eb73-a3f7-40d8-a6a4-7e925962e1e1.jpg",
      githubSrc: `${GITHUB_RAW_BASE}/maintenance/b082eb73-a3f7-40d8-a6a4-7e925962e1e1.jpg`,
      alt: "Porsche 911 - Dark Grey Premium Edition",
      code: "# Porsche 911",
    },
    {
      src: "/maintenance/IMG-20251128-WA0025.jpg",
      githubSrc: `${GITHUB_RAW_BASE}/maintenance/IMG-20251128-WA0025.jpg`,
      alt: "Porsche 911 GT3 RS - Bright Yellow Track Beast",
      code: "# Porsche 911 GT3 RS",
    },
    {
      src: "/maintenance/IMG-20251128-WA0026.jpg",
      githubSrc: `${GITHUB_RAW_BASE}/maintenance/IMG-20251128-WA0026.jpg`,
      alt: "Porsche 911 - Dark Grey Sports Car",
      code: "# Porsche 911",
    },
    {
      src: "/maintenance/IMG-20251128-WA0023.jpg",
      githubSrc: `${GITHUB_RAW_BASE}/maintenance/IMG-20251128-WA0023.jpg`,
      alt: "Luxury Car Carrier - Transporting Premium Vehicles",
      code: "# Global Vehicle Transport",
    },
  ]

  useEffect(() => {
    setMounted(true)
    // Add data attribute to hide header/footer
    document.documentElement.setAttribute('data-maintenance', 'true')
    document.body.setAttribute('data-maintenance', 'true')
    
    return () => {
      // Cleanup on unmount
      document.documentElement.removeAttribute('data-maintenance')
      document.body.removeAttribute('data-maintenance')
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary-light to-primary-dark">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f4f3] via-[#faf9f8] to-[#f5f4f3] relative">
      {/* Red gradient overlay for brand consistency */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: 'linear-gradient(to right, rgba(178, 34, 34, 0.1), rgba(139, 0, 0, 0.1))',
        }}
      ></div>
      
      {/* Maintenance Mode Badge */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg"
        >
          Maintenance Mode
        </motion.div>
      </div>

      {/* Main Content with Car Gallery - Centered */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <HoverExpand_002 images={images} />
      </div>

      {/* Maintenance Message */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            We're preparing something exceptional
          </h2>
          <p className="text-gray-600 mb-2">
            Our website is coming in <span className="font-bold text-primary-light">2026</span>
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Our team is finalizing a premium experience. Please check back soon.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>For urgent inquiries, contact</span>
            <a 
              className="text-primary-light hover:text-primary-dark font-semibold underline underline-offset-4 transition-colors" 
              href="mailto:support@wexcars.com"
            >
              support@wexcars.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
