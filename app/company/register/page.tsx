"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  CreditCard, 
  Users,
  Star,
  Zap
} from "lucide-react"
import CompanyRegistrationForm from "@/components/company/company-registration-form"

const BENEFITS = [
  {
    icon: Building2,
    title: "Professional Presence",
    description: "Showcase your business with verified company profiles and branding"
  },
  {
    icon: Shield,
    title: "Verified Status",
    description: "Build trust with customers through verified business credentials"
  },
  {
    icon: CreditCard,
    title: "Flexible Pricing",
    description: "Choose from multiple subscription plans that fit your business needs"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Manage multiple users and permissions for your business account"
  },
  {
    icon: Star,
    title: "Priority Support",
    description: "Get dedicated support and faster response times for your business"
  },
  {
    icon: Zap,
    title: "Advanced Features",
    description: "Access analytics, bulk upload, and premium listing features"
  }
]

const PLANS = [
  {
    name: "Basic Plan",
    price: 99,
    currency: "AED",
    period: "month",
    features: [
      "Up to 10 car listings",
      "Basic analytics dashboard",
      "Email support",
      "Standard listing duration (30 days)",
      "Mobile app access"
    ],
    popular: false,
    color: "border-gray-200"
  },
  {
    name: "Professional Plan",
    price: 299,
    currency: "AED",
    period: "month",
    features: [
      "Up to 50 car listings",
      "Advanced analytics & insights",
      "Priority email & phone support",
      "Featured listings priority",
      "Social media integration",
      "Custom company branding",
      "Bulk upload tools"
    ],
    popular: true,
    color: "border-primary-light"
  },
  {
    name: "Enterprise Plan",
    price: 599,
    currency: "AED",
    period: "month",
    features: [
      "Unlimited car listings",
      "Premium analytics & reporting",
      "Dedicated account manager",
      "Custom branding & white-label",
      "API access for integrations",
      "Advanced marketing tools",
      "Custom domain support",
      "Priority listing placement"
    ],
    popular: false,
    color: "border-gray-200"
  }
]

export default function CompanyRegistrationPage() {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <CompanyRegistrationForm onSuccess={() => router.push('/dashboard/company')} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-light to-primary-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Register Your Business
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join thousands of successful car dealers and businesses who trust WexCars 
            to showcase their inventory and connect with serious buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-light hover:bg-gray-100"
              onClick={() => setShowForm(true)}
            >
              Start Registration
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose WexCars for Your Business?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in the luxury car market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible pricing plans designed to grow with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary-light shadow-xl' : ''} ${plan.color}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-light text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.currency} {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary-light hover:bg-primary-dark' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => setShowForm(true)}
                  >
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              All plans include our standard listing fees (2% listing + 5% success fee)
            </p>
            <p className="text-sm text-gray-500">
              First month is free for all new company registrations
            </p>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Basic</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Professional</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Car Listings</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 10</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 50</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Analytics</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Basic</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Advanced</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Premium</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Email</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Priority</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Dedicated Manager</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Branding</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Standard</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">Custom</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">White-label</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">❌</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">❌</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">✅</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-light text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of successful car dealers who trust WexCars to showcase their inventory
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary-light hover:bg-gray-100"
            onClick={() => setShowForm(true)}
          >
            Start Your Registration
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}

