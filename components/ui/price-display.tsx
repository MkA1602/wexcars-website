"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"

interface PriceDisplayProps {
  price: number
  priceExclVat?: number
  vatRate?: number
  vatAmount?: number
  currency?: string
  showVatBreakdown?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function PriceDisplay({
  price,
  priceExclVat,
  vatRate = 5,
  vatAmount,
  currency = "AED",
  showVatBreakdown = false,
  size = "md",
  className = ""
}: PriceDisplayProps) {
  // Calculate values if not provided
  const calculatedPriceExclVat = priceExclVat || (price / (1 + vatRate / 100))
  const calculatedVatAmount = vatAmount || (price - calculatedPriceExclVat)

  // Currency symbols
  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case "AED": return "د.إ"
      case "USD": return "$"
      case "EUR": return "€"
      case "GBP": return "£"
      default: return curr
    }
  }

  // Size classes
  const sizeClasses = {
    sm: {
      main: "text-lg font-bold",
      secondary: "text-sm",
      breakdown: "text-xs"
    },
    md: {
      main: "text-xl font-bold",
      secondary: "text-base",
      breakdown: "text-sm"
    },
    lg: {
      main: "text-3xl font-bold",
      secondary: "text-lg",
      breakdown: "text-base"
    }
  }

  const formatPrice = (amount: number, showCurrency = true) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
    
    return showCurrency 
      ? `${getCurrencySymbol(currency)} ${formatted}`
      : formatted
  }

  if (showVatBreakdown && priceExclVat) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Main price with VAT */}
        <div className="flex items-baseline gap-2">
          <span className={`text-primary-light ${sizeClasses[size].main}`}>
            {formatPrice(price)}
          </span>
          <Badge variant="secondary" className="text-xs">
            incl. VAT
          </Badge>
        </div>
        
        {/* VAT breakdown */}
        <div className={`text-gray-600 space-y-1 ${sizeClasses[size].breakdown}`}>
          <div className="flex justify-between">
            <span>Price (excl. VAT):</span>
            <span className="font-semibold">{formatPrice(calculatedPriceExclVat)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT ({vatRate}%):</span>
            <span className="font-semibold">{formatPrice(calculatedVatAmount)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-bold">
            <span>Total:</span>
            <span className="text-primary-light">{formatPrice(price)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`text-primary-light ${sizeClasses[size].main}`}>
        {formatPrice(price)}
      </span>
      {priceExclVat && (
        <div className="flex flex-col">
          <span className={`text-gray-500 line-through ${sizeClasses[size].secondary}`}>
            {formatPrice(calculatedPriceExclVat)}
          </span>
          <Badge variant="secondary" className="text-xs self-start">
            +{vatRate}% VAT
          </Badge>
        </div>
      )}
    </div>
  )
} 