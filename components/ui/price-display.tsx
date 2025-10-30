"use client"

import type React from "react"
import { useState, memo, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import PriceDetailsModal from "./price-details-modal"

// Global state store for toggle states - ensures complete isolation
const toggleStates = new Map<string, boolean>()

// Helper functions for persistent state
const getStoredState = (carId: string): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(`toggle_${carId}`)
    return stored === 'true'
  } catch {
    return false
  }
}

const setStoredState = (carId: string, state: boolean): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`toggle_${carId}`, state.toString())
  } catch {
    // Ignore localStorage errors
  }
}

interface PriceDisplayProps {
  price: number
  priceExclVat?: number
  vatRate?: number
  vatAmount?: number
  currency?: string
  showVatBreakdown?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  enableToggle?: boolean // New prop to enable the More Details functionality
  carId?: string // Unique identifier to ensure component isolation
  isNettoPrice?: boolean // If true, show only netto price without VAT breakdown
}

function PriceDisplay({
  price,
  priceExclVat,
  vatRate = 5,
  vatAmount,
  currency = "AED",
  showVatBreakdown = false,
  size = "md",
  className = "",
  enableToggle = false,
  carId = "",
  isNettoPrice = false
}: PriceDisplayProps) {
  // Force re-render when component mounts/unmounts
  const [, forceUpdate] = useState({})
  const componentId = useRef(`${carId}_${Date.now()}_${Math.random()}`).current
  
  // Initialize state for this specific car if not exists
  useEffect(() => {
    if (carId && !toggleStates.has(carId)) {
      const storedState = getStoredState(carId)
      toggleStates.set(carId, storedState)
      console.log(`[${componentId}] Initialized state for car ${carId}: ${storedState}`)
    }
  }, [carId, componentId])
  
  const isExpanded = carId ? toggleStates.get(carId) || false : false
  
  const setIsExpanded = (newValue: boolean) => {
    if (carId) {
      toggleStates.set(carId, newValue)
      setStoredState(carId, newValue)
      forceUpdate({}) // Force re-render
    }
  }
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

  // If netto price, show only netto price
  if (isNettoPrice && priceExclVat) {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-baseline gap-2">
          <span className={`text-primary-light ${sizeClasses[size].main}`}>
            {formatPrice(priceExclVat)}
          </span>
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
            Netto Price
          </Badge>
        </div>
      </div>
    )
  }

  // If toggle is enabled, show compact view with popup details
  if (enableToggle && priceExclVat) {
    return (
      <>
        <div className={`space-y-1 ${className}`}>
          {/* Main price with VAT - always visible */}
          <div className="flex items-baseline gap-2">
            <span className={`text-primary-light ${sizeClasses[size].main}`}>
              {formatPrice(price)}
            </span>
            <Badge variant="secondary" className="text-xs">
              incl. VAT
            </Badge>
          </div>
          
          {/* Price excluding VAT - always visible */}
          <div className={`text-gray-600 ${sizeClasses[size].breakdown}`}>
            <span>Price (excl. VAT): </span>
            <span className="font-semibold">{formatPrice(calculatedPriceExclVat)}</span>
          </div>
          
          {/* More Details Button - Now opens popup */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const newState = !isExpanded
              console.log(`[${componentId}] Opening popup for car ${carId}`)
              setIsExpanded(newState)
            }}
            className="h-auto p-1 text-xs text-gray-600 hover:text-primary-light flex items-center gap-1 group"
          >
            <Info className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>View Details</span>
          </Button>
        </div>

        {/* Price Details Modal */}
        <PriceDetailsModal
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          price={price}
          priceExclVat={priceExclVat}
          vatRate={vatRate}
          vatAmount={vatAmount}
          currency={currency}
          isNettoPrice={isNettoPrice}
        />
      </>
    )
  }

  // Legacy VAT breakdown display (for existing components that use showVatBreakdown)
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

  // Simple price display (default)
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

// Export memoized component to ensure each instance is isolated
export default memo(PriceDisplay)