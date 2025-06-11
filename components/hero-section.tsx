"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HeroSection() {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  let nextId = 0

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
    <section className="relative py-12 md:py-32 bg-gray-100 overflow-hidden">
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
        <Image
          src="/white-sports-car-hero.jpeg"
          alt="Luxury Sports Car"
          fill
          priority
          className="object-cover object-center"
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
      </div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic mb-4 leading-tight text-black">
            Experience the
            <br />
            <span className="text-black">Magic of luxury</span>
          </h1>
          <p className="text-black/80 mb-8 max-w-md">
            Discover our exclusive collection of premium vehicles for an unparalleled driving experience.
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
