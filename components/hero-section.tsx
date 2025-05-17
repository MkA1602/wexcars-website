"use client"

import type React from "react"

import { useEffect } from "react"
import { useHeader } from "@/contexts/header-context"

interface HeroSectionProps {
  children: React.ReactNode
  className?: string
}

export default function HeroSection({ children, className = "" }: HeroSectionProps) {
  const { setHasHeroSection } = useHeader()

  useEffect(() => {
    // Set header to transparent mode
    setHasHeroSection(true)

    // Clean up when component unmounts
    return () => {
      setHasHeroSection(false)
    }
  }, [setHasHeroSection])

  return <section className={`relative pt-20 ${className}`}>{children}</section>
}
