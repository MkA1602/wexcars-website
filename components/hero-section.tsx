"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import VariableProximity from "@/components/ui/variable-proximity"
import "@/components/ui/variable-proximity.css"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export default function HeroSection() {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  let nextId = 0

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleImageError = () => {
    console.error("Hero image failed to load")
    setImageError(true)
    setIsLoading(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    // Get button dimensions and position
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()

    // Calculate ripple position relative to button
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Add new ripple
    const id = nextId++
    setRipples([...ripples, { x, y, id }])

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((ripples) => ripples.filter((ripple) => ripple.id !== id))
    }, 1000)

    // Navigate to collections page after a short delay to show the ripple effect
    setTimeout(() => {
      router.push("/collections")
    }, 300)
  }

  return (
    <section className="relative py-12 md:py-32 bg-gray-100 overflow-hidden min-h-[500px] md:min-h-[700px]">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 z-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-light rounded-full animate-spin"></div>
        </div>
      )}
      
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {!imageError ? (
          <Image
            src="/hero-landpage/white-new-image-landingpage.jpg"
            alt="Chevrolet Corvette Z06 - Global Luxury Car Export"
            fill
            priority
            className="object-cover object-center"
            onLoad={() => {
              setImageLoaded(true);
              setIsLoading(false);
            }}
            onError={(e) => {
              // Try GitHub raw URL as fallback
              const target = e.target as HTMLImageElement;
              if (target.src !== `${GITHUB_RAW_BASE}/hero-landpage/white-new-image-landingpage.jpg`) {
                target.src = `${GITHUB_RAW_BASE}/hero-landpage/white-new-image-landingpage.jpg`;
              } else {
                handleImageError();
              }
            }}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="text-gray-600 text-center">
              <p className="text-lg font-medium">Hero Image</p>
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div ref={containerRef} className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic mb-4 leading-tight text-black">
            <VariableProximity
              label="Global Luxury Car Export - Simplified."
              fromFontVariationSettings="'wght' 900, 'slnt' -10"
              toFontVariationSettings="'wght' 100, 'slnt' 0"
              containerRef={containerRef}
              radius={80}
              falloff="gaussian"
              className="text-black"
            />
          </h1>
          <p className="text-[#b22222] mb-8 max-w-md">
            <VariableProximity
              label="Discover our exclusive collection of premium vehicles for an unparalleled driving experience."
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 700, 'slnt' -5"
              containerRef={containerRef}
              radius={60}
              falloff="linear"
              className="text-[#b22222]"
            />
          </p>
          <button
            ref={buttonRef}
            onClick={handleClick}
            className="relative overflow-hidden bg-primary-light hover:bg-primary-dark text-white px-8 py-3 rounded-full text-lg font-medium group transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:pr-12 focus:outline-none"
          >
            <span className="relative z-10">Explore Our Collection</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
              <ArrowRight size={20} />
            </span>

            {/* Ripple elements */}
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/30 animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </section>
  )
}
