"use client"

import { motion } from "framer-motion"
import React, { useState, useEffect, Suspense, lazy } from "react"

// Lazy load ParallaxGallery to prevent SSR issues and chunk loading problems
const ParallaxGallery = lazy(() => import("./parallax-gallery"))

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

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

  // Prepare image URLs for parallax gallery
  const imageUrls = images.map(img => {
    // Use GitHub URL as primary source for better CDN reliability
    if (typeof window !== 'undefined' && (window.location.hostname.includes('netlify') || window.location.hostname.includes('wexcars.com'))) {
      return img.githubSrc || img.src;
    }
    return img.src;
  });

  // Extend images array to have at least 12 images for 4 columns
  const extendedImages = [...imageUrls, ...imageUrls, ...imageUrls].slice(0, 12);

  return (
    <main className="w-full bg-[#eee] text-black relative">
      {/* Parallax Gallery - Lazy loaded - Must be first to be behind other elements */}
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      }>
        <ParallaxGallery images={extendedImages} />
      </Suspense>
      
      {/* Maintenance Mode Badge - Modern & Minimal */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-sm border border-gray-200/50"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 tracking-wide uppercase">
            Maintenance
          </span>
        </motion.div>
      </div>

      {/* Maintenance Message - Fixed at bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-2xl border border-gray-200"
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
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 flex-wrap">
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
    </main>
  )
}
