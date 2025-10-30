"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calculator, Receipt, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

// Custom styles for hover effects
const customStyles = `
  .hover\\:scale-102:hover {
    transform: scale(1.02);
  }
`

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
    <>
      <style>{customStyles}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
         {/* Header */}
         <DialogHeader className="bg-gradient-to-r from-primary-light to-primary-dark text-white p-6 -m-6 mb-6 relative overflow-hidden">
           {/* Car Background */}
           <div className="absolute inset-0 z-0">
             <img
               src={`${GITHUB_RAW_BASE}/lycan-hypersport-concept.png`}
               alt="Luxury Hypercar Background"
               className="w-full h-full object-cover object-center opacity-20"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-primary-light/90 to-primary-dark/90"></div>
           </div>
           
           <div className="flex items-center justify-between relative z-10">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-lg">
                 <Calculator className="w-5 h-5" />
               </div>
               <div>
                 <DialogTitle className="text-xl font-bold text-white">
                   Price Breakdown
                 </DialogTitle>
                 <p className="text-white/80 text-sm">
                   Detailed pricing information
                 </p>
               </div>
             </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={onClose}
               className="text-white hover:bg-white/20 p-2 rounded-lg"
             >
               <X className="w-4 h-4" />
             </Button>
           </div>
         </DialogHeader>

        {/* Content */}
        <div className="space-y-6">
          {/* Main Price Display */}
          <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="text-3xl font-bold text-primary-light mb-2 animate-in slide-in-from-bottom-2 duration-500">
              {isNettoPrice ? formatPrice(calculatedPriceExclVat) : formatPrice(price)}
            </div>
            <Badge 
              variant="secondary" 
              className={`text-sm px-3 py-1 animate-in fade-in-0 duration-700 ${
                isNettoPrice 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isNettoPrice ? 'Netto Price' : 'Total Price (incl. VAT)'}
            </Badge>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Price Breakdown</h3>
            </div>

            <div className="space-y-3">
              {/* Base Price */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg transform transition-all duration-200 hover:bg-gray-100 hover:scale-102">
                <span className="text-gray-700 font-medium">
                  {isNettoPrice ? 'Netto Price:' : 'Price (excl. VAT):'}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(calculatedPriceExclVat)}
                </span>
              </div>

              {/* VAT (only if not netto price) */}
              {!isNettoPrice && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg transform transition-all duration-200 hover:bg-blue-100 hover:scale-102">
                  <span className="text-gray-700 font-medium">
                    VAT ({vatRate}%):
                  </span>
                  <span className="font-semibold text-blue-700">
                    {formatPrice(calculatedVatAmount)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-primary-light/10 rounded-lg border-2 border-primary-light/20 transform transition-all duration-200 hover:bg-primary-light/20 hover:scale-102 hover:shadow-md">
                <span className="text-gray-900 font-semibold text-lg">
                  {isNettoPrice ? 'Netto Total:' : 'Total (incl. VAT):'}
                </span>
                <span className="font-bold text-primary-light text-xl">
                  {isNettoPrice ? formatPrice(calculatedPriceExclVat) : formatPrice(price)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="space-y-1 text-xs">
                  <li>• All prices are final and include applicable taxes</li>
                  <li>• Payment terms and financing options available</li>
                  <li>• Additional fees may apply for shipping and registration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={onClose}
              className="flex-1 bg-primary-light hover:bg-primary-dark text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Got it
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-primary-light text-primary-light hover:bg-primary-light/10 transform transition-all duration-200 hover:scale-105"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
