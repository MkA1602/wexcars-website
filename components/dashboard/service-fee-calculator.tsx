"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  calculateServiceFee, 
  formatCurrency, 
  validateFeeInput, 
  FEE_MODELS, 
  EU_COUNTRIES,
  type FeeCalculationInput,
  type FeeCalculationResult,
  type FeeModel
} from '@/lib/fee-calculator'
import { CreditCard, Calculator, AlertCircle, CheckCircle, Lock, Unlock } from 'lucide-react'

interface ServiceFeeCalculatorProps {
  onFeePaid: (isPaid: boolean) => void
  onFeeCalculated: (fee: FeeCalculationResult | null) => void
  initialPrice?: number
  initialCurrency?: string
  initialVatRate?: number
  className?: string
}

export default function ServiceFeeCalculator({
  onFeePaid,
  onFeeCalculated,
  initialPrice = 0,
  initialCurrency = 'EUR',
  initialVatRate = 25,
  className = ''
}: ServiceFeeCalculatorProps) {
  const [input, setInput] = useState<FeeCalculationInput>({
    carPrice: initialPrice,
    vatRate: initialVatRate,
    currency: initialCurrency,
    feeModel: 'vat_on_top'
  })
  
  const [calculation, setCalculation] = useState<FeeCalculationResult | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('SE')

  // Calculate fee whenever input changes
  useEffect(() => {
    const validationErrors = validateFeeInput(input)
    setErrors(validationErrors)
    
    if (validationErrors.length === 0 && input.carPrice > 0) {
      const result = calculateServiceFee(input)
      setCalculation(result)
      onFeeCalculated(result)
    } else {
      setCalculation(null)
      onFeeCalculated(null)
    }
  }, [input, onFeeCalculated])

  // Reset payment status when input changes
  useEffect(() => {
    if (isPaid) {
      setIsPaid(false)
      onFeePaid(false)
    }
  }, [input.carPrice, input.vatRate, input.feeModel, input.currency])

  const handleInputChange = (field: keyof FeeCalculationInput, value: string | number) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    const country = EU_COUNTRIES.find(c => c.code === countryCode)
    if (country) {
      handleInputChange('vatRate', country.vatRate)
    }
  }

  const handleFeeModelChange = (model: FeeModel) => {
    handleInputChange('feeModel', model)
  }

  const simulatePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsPaid(true)
    onFeePaid(true)
    setIsProcessing(false)
  }

  const resetPayment = () => {
    setIsPaid(false)
    onFeePaid(false)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Service Fee Calculator
          </CardTitle>
          <CardDescription>
            Calculate the service fee for publishing your car ad. Payment is required before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Car Price Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carPrice">Car Price (VAT included)</Label>
              <div className="flex gap-2">
                <select
                  value={input.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
                <Input
                  id="carPrice"
                  type="number"
                  value={input.carPrice || ''}
                  onChange={(e) => handleInputChange('carPrice', parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 250000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country (VAT Rate)</Label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {EU_COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.vatRate}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom VAT Rate */}
          <div className="space-y-2">
            <Label htmlFor="vatRate">Custom VAT Rate (%)</Label>
            <Input
              id="vatRate"
              type="number"
              step="0.01"
              value={input.vatRate}
              onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 25"
              className="max-w-xs"
            />
            <p className="text-xs text-gray-500">
              Override the country VAT rate with a custom value
            </p>
          </div>

          {/* Fee Model Selection */}
          <div className="space-y-3">
            <Label>Fee Model</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(FEE_MODELS).map(model => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleFeeModelChange(model.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    input.feeModel === model.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{model.icon}</span>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-600">{model.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Fee Calculation
            </CardTitle>
            <CardDescription>
              Review the calculated service fee and proceed with payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fee Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Car Price:</span>
                  <div className="font-semibold">{formatCurrency(calculation.carPrice, calculation.currency)}</div>
                </div>
                <div>
                  <span className="text-gray-600">VAT Rate:</span>
                  <div className="font-semibold">{calculation.vatRate}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Fee Model:</span>
                  <div className="font-semibold">{FEE_MODELS[calculation.feeModel].name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Model Description:</span>
                  <div className="font-semibold text-xs">{calculation.feeModelDescription}</div>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium">Fee Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Net Fee:</span>
                  <span className="font-medium">{formatCurrency(calculation.netFee, calculation.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT on Fee ({calculation.vatRate}%):</span>
                  <span className="font-medium">{formatCurrency(calculation.vatOnFee, calculation.currency)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                  <span>Total Customer Pays:</span>
                  <span className="text-primary">{formatCurrency(calculation.totalCustomerPays, calculation.currency)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Business Keeps (Net):</span>
                  <span>{formatCurrency(calculation.businessKeeps, calculation.currency)}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="pt-4 border-t">
              {!isPaid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span>Payment required to publish your car ad</span>
                  </div>
                  
                  <Button
                    onClick={simulatePayment}
                    disabled={isProcessing || errors.length > 0}
                    className="w-full bg-primary-light hover:bg-primary-dark text-white"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay {formatCurrency(calculation.totalCustomerPays, calculation.currency)}
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    This is a simulation. In production, integrate with Stripe, Klarna, or your preferred payment provider.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Payment Successful!</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={resetPayment}
                      variant="outline"
                      className="flex-1"
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Reset Payment
                    </Button>
                    <Button
                      disabled
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Ready to Publish
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Your car ad is now ready to be published. The "Publish Ad" button will be enabled.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
