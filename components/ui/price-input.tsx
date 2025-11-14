"use client"

import { useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, Search } from "lucide-react"

export type PriceType = 'exclude' | 'include' | 'no_vat'

interface PriceInputProps {
  priceType: PriceType
  priceExclVat: string
  priceInclVat: string
  vatRate: string
  currency: string
  onChange: (field: string, value: string) => void
  errors?: {
    priceExclVat?: string
    vatRate?: string
  }
}

interface VatRateOption {
  country: string
  rate: number
}

const EU_VAT_RATES: VatRateOption[] = [
  { country: "Austria", rate: 20 },
  { country: "Belgium", rate: 21 },
  { country: "Bulgaria", rate: 20 },
  { country: "Croatia", rate: 25 },
  { country: "Cyprus", rate: 19 },
  { country: "Czechia", rate: 21 },
  { country: "Denmark", rate: 25 },
  { country: "Estonia", rate: 22 },
  { country: "Finland", rate: 25.5 },
  { country: "France", rate: 20 },
  { country: "Germany", rate: 19 },
  { country: "Greece", rate: 24 },
  { country: "Hungary", rate: 27 },
  { country: "Ireland", rate: 23 },
  { country: "Italy", rate: 22 },
  { country: "Latvia", rate: 21 },
  { country: "Lithuania", rate: 21 },
  { country: "Luxembourg", rate: 17 },
  { country: "Malta", rate: 18 },
  { country: "Netherlands", rate: 21 },
  { country: "Poland", rate: 23 },
  { country: "Portugal", rate: 23 },
  { country: "Romania", rate: 19 },
  { country: "Slovakia", rate: 23 },
  { country: "Slovenia", rate: 22 },
  { country: "Spain", rate: 21 },
  { country: "Sweden", rate: 25 }
]

export default function PriceInput({
  priceType,
  priceExclVat,
  priceInclVat,
  vatRate,
  currency,
  onChange,
  errors = {}
}: PriceInputProps) {
  const [vatCountrySearch, setVatCountrySearch] = useState("")
  const [showVatDropdown, setShowVatDropdown] = useState(false)

  const filteredVatOptions = useMemo(() => {
    if (!vatCountrySearch.trim()) return EU_VAT_RATES
    return EU_VAT_RATES.filter((option) =>
      option.country.toLowerCase().includes(vatCountrySearch.toLowerCase())
    )
  }, [vatCountrySearch])

  const handleVatRateSelection = (option: VatRateOption) => {
    onChange("vatRate", option.rate.toString())
    setShowVatDropdown(false)
    setVatCountrySearch(option.country)
  }

  const handleManualVatRate = (value: string) => {
    onChange("vatRate", value)
    setVatCountrySearch("")
    setShowVatDropdown(false)
  }

  // Calculate prices based on current values
  const calculatePrices = () => {
    const priceExclNum = parseFloat(priceExclVat || '0')
    const priceInclNum = parseFloat(priceInclVat || '0')
    const vatNum = parseFloat(vatRate || '0')
    
    if (isNaN(priceExclNum) && isNaN(priceInclNum)) {
      return {
        priceExclVat: '0',
        priceInclVat: '0',
        vatAmount: '0',
        displayPrice: '0'
      }
    }

    let finalPriceExclVat: number
    let finalPriceInclVat: number
    let vatAmount: number

    if (priceType === 'exclude') {
      // User enters price excluding VAT
      finalPriceExclVat = priceExclNum
      vatAmount = (priceExclNum * vatNum) / 100
      finalPriceInclVat = priceExclNum + vatAmount
    } else if (priceType === 'include') {
      // User enters price including VAT
      finalPriceInclVat = priceInclNum
      finalPriceExclVat = priceInclNum / (1 + vatNum / 100)
      vatAmount = priceInclNum - finalPriceExclVat
    } else {
      // No VAT - use price as is
      finalPriceExclVat = priceExclNum
      finalPriceInclVat = priceExclNum
      vatAmount = 0
    }

    return {
      priceExclVat: finalPriceExclVat.toFixed(2),
      priceInclVat: finalPriceInclVat.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      displayPrice: priceType === 'no_vat' ? finalPriceExclVat.toFixed(2) : finalPriceInclVat.toFixed(2)
    }
  }

  const prices = calculatePrices()

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num)
  }

  return (
    <div className="space-y-6">
      {/* Price Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Price Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Exclude VAT Option */}
          <button
            type="button"
            onClick={() => onChange('priceType', 'exclude')}
            className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
              priceType === 'exclude' ? 'border-red-600 bg-red-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 mb-2 ${
              priceType === 'exclude' ? 'border-red-600' : 'border-gray-300'
            }`}>
              {priceType === 'exclude' && (
                <div className="w-full h-full rounded-full bg-red-600" />
              )}
            </div>
            <div className="font-medium text-sm">Excluding VAT</div>
            <div className="text-xs text-gray-600 mt-1">Enter base price before VAT</div>
          </button>

          {/* Include VAT Option */}
          <button
            type="button"
            onClick={() => onChange('priceType', 'include')}
            className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
              priceType === 'include' ? 'border-red-600 bg-red-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 mb-2 ${
              priceType === 'include' ? 'border-red-600' : 'border-gray-300'
            }`}>
              {priceType === 'include' && (
                <div className="w-full h-full rounded-full bg-red-600" />
              )}
            </div>
            <div className="font-medium text-sm">Including VAT</div>
            <div className="text-xs text-gray-600 mt-1">Enter final price with VAT</div>
          </button>

          {/* No VAT Option */}
          <button
            type="button"
            onClick={() => onChange('priceType', 'no_vat')}
            className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
              priceType === 'no_vat' ? 'border-red-600 bg-red-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 mb-2 ${
              priceType === 'no_vat' ? 'border-red-600' : 'border-gray-300'
            }`}>
              {priceType === 'no_vat' && (
                <div className="w-full h-full rounded-full bg-red-600" />
              )}
            </div>
            <div className="font-medium text-sm">No VAT</div>
            <div className="text-xs text-gray-600 mt-1">Simple price without VAT</div>
          </button>
        </div>
      </div>

      {/* Price Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => onChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="price" className="text-sm font-medium">
              {priceType === 'exclude' ? 'Price (excl. VAT)' : 
               priceType === 'include' ? 'Price (incl. VAT)' : 'Price'}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={priceType === 'include' ? priceInclVat : priceExclVat}
              onChange={(e) => {
                if (priceType === 'include') {
                  onChange('priceInclVat', e.target.value)
                } else {
                  onChange('priceExclVat', e.target.value)
                }
              }}
              placeholder="Enter price"
              className={`${errors?.priceExclVat ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"}`}
            />
            {errors?.priceExclVat && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.priceExclVat}
              </p>
            )}
          </div>
        </div>

        {/* VAT Rate Input - Only show if not "No VAT" */}
        {priceType !== "no_vat" && (
          <div className="flex-1 space-y-2">
            <Label htmlFor="vatRate" className="text-sm font-medium">VAT Rate (%)</Label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  id="vatRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={vatRate}
                  onChange={(e) => handleManualVatRate(e.target.value)}
                  placeholder="Enter VAT rate"
                  className={errors?.vatRate ? "border-red-500 focus:ring-red-500 flex-1" : "focus:ring-red-500 flex-1"}
                  onFocus={() => setShowVatDropdown(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowVatDropdown((prev) => !prev)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  EU Rates
                </button>
              </div>

              {showVatDropdown && (
                <div className="border border-gray-200 rounded-md shadow-lg bg-white max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Input
                        type="text"
                        value={vatCountrySearch}
                        onChange={(e) => setVatCountrySearch(e.target.value)}
                        placeholder="Search country..."
                        className="pl-9"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <ul className="py-2 text-sm">
                    {filteredVatOptions.length === 0 && (
                      <li className="px-3 py-2 text-gray-500">
                        No matches found. Enter rate manually above.
                      </li>
                    )}
                    {filteredVatOptions.map((option) => (
                      <li key={option.country}>
                        <button
                          type="button"
                          onClick={() => handleVatRateSelection(option)}
                          className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center justify-between transition-colors"
                        >
                          <span>{option.country}</span>
                          <span className="text-sm font-medium text-gray-700">{option.rate}%</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {errors?.vatRate && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.vatRate}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Select a country to auto-fill the standard rate or type a custom percentage.
            </p>
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Price Summary</h4>
          {priceType === 'no_vat' && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              No VAT
            </span>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          {priceType === 'no_vat' ? (
            <div className="flex justify-between">
              <span className="text-gray-600">Final Price:</span>
              <span className="font-semibold text-lg text-gray-900">
                {currency} {formatPrice(prices.displayPrice)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Price (excl. VAT):</span>
                <span className="font-medium">{currency} {formatPrice(prices.priceExclVat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT ({vatRate}%):</span>
                <span className="font-medium">{currency} {formatPrice(prices.vatAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Total (incl. VAT):</span>
                <span className="font-semibold text-lg text-red-600">
                  {currency} {formatPrice(prices.priceInclVat)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}