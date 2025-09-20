"use client"

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Star, Crown, ArrowRight, Download, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const amount = searchParams.get('amount')

  const getPlanDetails = () => {
    switch (plan) {
      case 'premium':
        return {
          name: 'Premium Plan',
          icon: Star,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          features: [
            'Access to premium inventory',
            '150-point vehicle inspection',
            '90-day comprehensive warranty',
            'Priority customer support',
            'Preferred financing rates',
            'Free delivery within 100 miles',
            'One free maintenance service',
          ]
        }
      case 'exclusive':
        return {
          name: 'Exclusive Plan',
          icon: Crown,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          features: [
            'Access to exclusive & limited edition models',
            '200-point vehicle inspection with certification',
            '1-year comprehensive warranty',
            '24/7 dedicated concierge',
            'Best available financing rates',
            'Free delivery nationwide',
            'Complimentary maintenance package',
            'VIP events and experiences',
            'Priority access to new arrivals',
          ]
        }
      default:
        return {
          name: 'Plan',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          features: []
        }
    }
  }

  const planDetails = getPlanDetails()
  const IconComponent = planDetails.icon

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your subscription has been activated and you now have access to all premium features.
          </p>
        </div>

        {/* Plan Confirmation */}
        <Card className={`${planDetails.bgColor} ${planDetails.borderColor} border-2 mb-8`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${planDetails.color}`}>
              <IconComponent className="h-5 w-5" />
              {planDetails.name} Activated
            </CardTitle>
            <CardDescription>
              You're now subscribed to the {planDetails.name.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-3xl font-bold ${planDetails.color}`}>
                ${amount}/month
              </div>
              <div className="text-gray-500">Billed monthly</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold mb-3">What's included:</h4>
              <ul className="space-y-1">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Here are some things you can do now that your subscription is active
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard">
                <Button className="w-full justify-start" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/collections">
                <Button className="w-full justify-start" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Browse Cars
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your subscription details and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Plan:</span>
                <div className="font-medium">{planDetails.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <div className="font-medium">${amount}/month</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium text-green-600">Active</div>
              </div>
              <div>
                <span className="text-gray-600">Next Billing:</span>
                <div className="font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                You can manage your subscription, update payment methods, and view billing history from your account settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full bg-primary-light hover:bg-primary-dark text-white">
              Continue to Dashboard
            </Button>
          </Link>
          <Link href="/pricing" className="flex-1">
            <Button variant="outline" className="w-full">
              View All Plans
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
