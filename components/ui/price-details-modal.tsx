"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"


interface PriceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  price: number
  priceExclVat?: number
  vatRate?: number
  vatAmount?: number
  currency?: string
  isNettoPrice?: boolean
}

export default function PriceDetailsModal({
  isOpen,
  onClose,
  price,
  priceExclVat,
  vatRate = 5,
  vatAmount,
  currency = "AED",
  isNettoPrice = false
}: PriceDetailsModalProps) {
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

  const formatPrice = (amount: number, showCurrency = true) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
    
    return showCurrency 
      ? `${getCurrencySymbol(currency)} ${formatted}`
      : formatted
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-sm bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden p-0">
          {/* Simple Header */}
          <DialogHeader className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-gray-900">
                Pricing Details
              </DialogTitle>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </DialogHeader>

          {/* Simple Content */}
          <div className="px-5 py-5 space-y-3">
            {/* Price Breakdown - Simple List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  {isNettoPrice ? 'Netto Price' : 'Price (excl. VAT)'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(calculatedPriceExclVat)}
                </span>
              </div>

              {!isNettoPrice && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">
                    VAT ({vatRate}%)
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(calculatedVatAmount)}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2.5 mt-2.5">
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
        </DialogContent>
      </Dialog>
  )
}
