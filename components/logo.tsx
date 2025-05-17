"use client"

import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "light" | "dark"
  size?: "small" | "medium" | "large"
  className?: string
}

export default function Logo({ variant = "light", size = "medium", className = "" }: LogoProps) {
  // Determine logo source based on variant
  const logoSrc = variant === "dark" ? "/autowex-logo-dark.png" : "/autowex-logo.png"

  // Determine dimensions based on size
  let width = 120
  let height = 40

  if (size === "small") {
    width = 90
    height = 30
  } else if (size === "large") {
    width = 160
    height = 53
  }

  return (
    <Link href="/" className={`flex-shrink-0 ${className}`}>
      <span className="sr-only">AutoWex</span>
      <Image
        src={logoSrc || "/placeholder.svg"}
        alt="AutoWex"
        width={width}
        height={height}
        className="h-auto w-auto transition-all duration-300"
        priority
      />
    </Link>
  )
}
