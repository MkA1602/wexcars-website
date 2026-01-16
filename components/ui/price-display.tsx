"use client"

import type React from "react"
import { useState, memo, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"

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
  // Use proper React state instead of forceUpdate
  const [isExpanded, setIsExpandedState] = useState(false)
  const isInitialized = useRef(false)
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    if (carId && !isInitialized.current) {
      const storedState = getStoredState(carId)
      setIsExpandedState(storedState)
      if (carId && !toggleStates.has(carId)) {
        toggleStates.set(carId, storedState)
      }
      isInitialized.current = true
    }
  }, [carId])
  
  const setIsExpanded = (newValue: boolean) => {
    if (carId) {
      toggleStates.set(carId, newValue)
      setStoredState(carId, newValue)
      setIsExpandedState(newValue)
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

  // If toggle is enabled, show compact view with inline expandable details
  if (enableToggle && priceExclVat) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center">
          {/* Main price - large and prominent */}
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className={`text-red-600 ${sizeClasses[size].main}`}>
              {formatPrice(price)}
            </span>
          </div>
          
          {/* Simple inline breakdown */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
            <span>{formatPrice(calculatedPriceExclVat)}</span>
            <span>+</span>
            <span>{vatRate}% VAT</span>
          </div>
          
          {/* Simple minimal button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium flex items-center gap-1 group"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            <svg 
              className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Inline expandable details - appears below with better design */}
        {isExpanded && (
          <div className="mt-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              {/* Price breakdown items */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-600">
                    {isNettoPrice ? 'Netto Price' : 'Price (excl. VAT)'}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(calculatedPriceExclVat)}
                  </span>
                </div>
                
                {!isNettoPrice && (
                  <>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-gray-600">VAT ({vatRate}%)</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {formatPrice(calculatedVatAmount)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Total - highlighted */}
              <div className="pt-2.5 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {isNettoPrice ? 'Total' : 'Total (incl. VAT)'}
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {isNettoPrice ? formatPrice(calculatedPriceExclVat) : formatPrice(price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Car card display - shows only price excl VAT and price incl VAT in clean design
  // Layout: Labels on left, prices on right (two-column layout)
  // Price excl VAT: large, bold, blue (prominent)
  // Price incl VAT: smaller, regular, grey (less prominent)
  if (showVatBreakdown && priceExclVat) {
    return (
      <div className={`${className} w-full`}>
        <div className="flex flex-col gap-2">
          {/* Price excl VAT - prominent (large, bold, red) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Price excl. VAT:
            </span>
            <span className={`text-red-600 font-bold ${sizeClasses[size].main}`}>
              {formatPrice(calculatedPriceExclVat)}
            </span>
          </div>
          
          {/* Price incl VAT - less prominent (smaller, regular, grey) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Price incl. VAT:
            </span>
            <span className={`text-gray-600 ${sizeClasses[size].breakdown}`}>
              {formatPrice(price)}
            </span>
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