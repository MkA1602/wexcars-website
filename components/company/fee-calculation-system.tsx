"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calculator, 
  CreditCard, 
  DollarSign, 
  Info, 
  CheckCircle,
  AlertTriangle,
  Receipt
} from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface FeeCalculationProps {
  carId?: string
  carPrice?: number
  currency?: string
  onFeeCalculated?: (fee: FeeCalculation) => void
}

interface FeeCalculation {
  carPrice: number
  currency: string
  listingFee: number
  successFee: number
  totalFees: number
  netAmount: number
  breakdown: {
    listingFee: { amount: number; description: string }
    successFee: { amount: number; description: string }
    platformFee: { amount: number; description: string }
  }
}

const FEE_RATES = {
  listing: 0.02, // 2% listing fee
  success: 0.05, // 5% success fee
  platform: 0.01 // 1% platform fee
}

export default function FeeCalculationSystem({ 
  carId, 
  carPrice = 0, 
  currency = 'AED',
  onFeeCalculated 
}: FeeCalculationProps) {
  const [price, setPrice] = useState(carPrice)
  const [selectedCurrency, setSelectedCurrency] = useState(currency)
  const [calculation, setCalculation] = useState<FeeCalculation | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currencies = [
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' }
  ]

  const calculateFees = (carPrice: number, currency: string): FeeCalculation => {
    const listingFee = carPrice * FEE_RATES.listing
    const successFee = carPrice * FEE_RATES.success
    const platformFee = carPrice * FEE_RATES.platform
    const totalFees = listingFee + successFee + platformFee
    const netAmount = carPrice - totalFees

    return {
      carPrice,
      currency,
      listingFee,
      successFee,
      totalFees,
      netAmount,
      breakdown: {
        listingFee: {
          amount: listingFee,
          description: `Listing fee (${(FEE_RATES.listing * 100).toFixed(1)}%) - Paid upfront`
        },
        successFee: {
          amount: successFee,
          description: `Success fee (${(FEE_RATES.success * 100).toFixed(1)}%) - Paid when car is sold`
        },
        platformFee: {
          amount: platformFee,
          description: `Platform fee (${(FEE_RATES.platform * 100).toFixed(1)}%) - Service charge`
        }
      }
    }
  }

  const handleCalculate = () => {
    if (price <= 0) {
      toast.error("Please enter a valid car price")
      return
    }

    const calc = calculateFees(price, selectedCurrency)
    setCalculation(calc)
    
    if (onFeeCalculated) {
      onFeeCalculated(calc)
    }
  }

  const handleProcessPayment = async () => {
    if (!calculation || !carId) {
      toast.error("No calculation available")
      return
    }

    setIsProcessing(true)
    try {
      // Create fee record
      const { data: feeData, error: feeError } = await supabaseClient
        .from('company_fees')
        .insert({
          car_id: carId,
          company_id: (await supabaseClient.auth.getUser()).data.user?.id,
          amount: calculation.listingFee,
          currency: calculation.currency,
          fee_type: 'listing',
          status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          breakdown: calculation.breakdown
        })
        .select()
        .single()

      if (feeError) throw feeError

      // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update fee status
      await supabaseClient
        .from('company_fees')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', feeData.id)

      toast.success("Payment processed successfully!")
      
      // Update car status to published
      if (carId) {
        await supabaseClient
          .from('cars')
          .update({ is_published: true, published_at: new Date().toISOString() })
          .eq('id', carId)
      }

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (carPrice > 0) {
      const calc = calculateFees(carPrice, currency)
      setCalculation(calc)
    }
  }, [carPrice, currency])

  return (
    <div className="space-y-6">
      {/* Price Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Fee Calculator
          </CardTitle>
          <CardDescription>
            Calculate listing fees for your car
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Car Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Enter car price"
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleCalculate} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Fees
          </Button>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Fee Breakdown
            </CardTitle>
            <CardDescription>
              Detailed breakdown of all fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Car Price */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Car Price</p>
                <p className="text-sm text-gray-600">Your asking price</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(calculation.carPrice, calculation.currency)}
              </p>
            </div>

            {/* Fees Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-blue-600">Listing Fee</p>
                  <p className="text-sm text-gray-600">Paid upfront when listing</p>
                </div>
                <p className="font-semibold text-blue-600">
                  {formatCurrency(calculation.breakdown.listingFee.amount, calculation.currency)}
                </p>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-green-600">Success Fee</p>
                  <p className="text-sm text-gray-600">Paid only when car is sold</p>
                </div>
                <p className="font-semibold text-green-600">
                  {formatCurrency(calculation.breakdown.successFee.amount, calculation.currency)}
                </p>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-purple-600">Platform Fee</p>
                  <p className="text-sm text-gray-600">Service and maintenance fee</p>
                </div>
                <p className="font-semibold text-purple-600">
                  {formatCurrency(calculation.breakdown.platformFee.amount, calculation.currency)}
                </p>
              </div>
            </div>

            {/* Total Fees */}
            <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-600">Total Fees</p>
                <p className="text-sm text-gray-600">All fees combined</p>
              </div>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(calculation.totalFees, calculation.currency)}
              </p>
            </div>

            {/* Net Amount */}
            <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-green-600">Net Amount</p>
                <p className="text-sm text-gray-600">Amount you'll receive</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(calculation.netAmount, calculation.currency)}
              </p>
            </div>

            {/* Payment Button */}
            {carId && (
              <Button 
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full bg-primary-light hover:bg-primary-dark"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Listing Fee ({formatCurrency(calculation.listingFee, calculation.currency)})
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Fee Structure Explained:</p>
              <ul className="space-y-1">
                <li>• <strong>Listing Fee:</strong> Paid upfront to publish your car listing</li>
                <li>• <strong>Success Fee:</strong> Only charged when your car is successfully sold</li>
                <li>• <strong>Platform Fee:</strong> Covers platform maintenance and support</li>
                <li>• <strong>No Hidden Fees:</strong> All fees are transparent and calculated upfront</li>
                <li>• <strong>30-Day Listing:</strong> Your car will be featured for 30 days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="space-y-1">
                <li>• Listing fee is non-refundable once paid</li>
                <li>• Success fee is only charged upon successful sale</li>
                <li>• All prices are final and include applicable taxes</li>
                <li>• Payment must be completed within 7 days of fee generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

