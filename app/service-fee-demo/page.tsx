"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ServiceFeeCalculator from '@/components/dashboard/service-fee-calculator'
import type { FeeCalculationResult } from '@/lib/fee-calculator'
import { ArrowLeft, CreditCard, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function ServiceFeeDemoPage() {
  const [isFeePaid, setIsFeePaid] = useState(false)
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculationResult | null>(null)

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-primary-light hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Service Fee Calculator Demo</h1>
          <p className="text-gray-600">
            Test the service fee calculation system with different pricing models and VAT rates.
          </p>
        </div>

        {/* Demo Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              How It Works
            </CardTitle>
            <CardDescription>
              The service fee calculator supports 4 different pricing models for car ad publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">📊 Add VAT on Top</h4>
                <p>1% of car price + VAT</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📈 Higher % VAT-Included</h4>
                <p>1.25% if VAT ≤25%, 1.50% if VAT &gt;25%</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">💰 Flat Minimum</h4>
                <p>1% of price, minimum €30,000</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎯 Tiered System</h4>
                <p>1.5% for &lt;1M, 1.25% for 1–3M, 1% for &gt;3M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Calculator */}
        <ServiceFeeCalculator
          onFeePaid={setIsFeePaid}
          onFeeCalculated={setFeeCalculation}
          initialPrice={250000}
          initialCurrency="EUR"
          initialVatRate={25}
        />

        {/* Payment Status */}
        {isFeePaid && feeCalculation && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CreditCard className="h-5 w-5" />
                Payment Completed
              </CardTitle>
              <CardDescription>
                Your service fee has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Car Price:</span>
                    <span className="font-medium">{feeCalculation.carPrice.toLocaleString()} {feeCalculation.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (Net):</span>
                    <span className="font-medium">{feeCalculation.netFee.toLocaleString()} {feeCalculation.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT on Fee ({feeCalculation.vatRate}%):</span>
                    <span className="font-medium">{feeCalculation.vatOnFee.toLocaleString()} {feeCalculation.currency}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Paid:</span>
                    <span className="text-green-600">{feeCalculation.totalCustomerPays.toLocaleString()} {feeCalculation.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integration Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integration Details</CardTitle>
            <CardDescription>
              This component is designed to be easily integrated into existing forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Real-time fee calculation as user types</li>
                  <li>Support for multiple currencies and VAT rates</li>
                  <li>4 different pricing models to choose from</li>
                  <li>Payment simulation (ready for Stripe/Klarna integration)</li>
                  <li>Form validation integration</li>
                  <li>Responsive design matching existing UI</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage in Add Car Form:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Users must pay service fee before publishing</li>
                  <li>Publish button is disabled until payment is complete</li>
                  <li>Fee resets if user changes price, VAT, or model</li>
                  <li>Visual indicators show payment status</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
