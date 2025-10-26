"use client"

import React, { useState, useEffect, useRef } from 'react'

interface VariableProximityProps {
  children: React.ReactNode
  className?: string
  proximity?: number
  scale?: number
  duration?: number
}

export function VariableProximity({
  children,
  className = "",
  proximity = 100,
  scale = 1.1,
  duration = 0.3
}: VariableProximityProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      )

      if (distance <= proximity) {
        const x = (e.clientX - centerX) / (proximity / 2)
        const y = (e.clientY - centerY) / (proximity / 2)
        setMousePosition({ x, y })
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [proximity])

  const transform = isHovered
    ? `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) scale(${scale})`
    : 'translate(0px, 0px) scale(1)'

  return (
    <div
      ref={elementRef}
      className={`transition-transform duration-${Math.round(duration * 1000)} ease-out ${className}`}
      style={{
        transform,
        transformOrigin: 'center',
      }}
    >
      {children}
    </div>
  )
}
