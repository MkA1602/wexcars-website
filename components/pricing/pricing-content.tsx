import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { CheckCircle, Star, Crown, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const pricingPlans = [
  {
    name: "Standard",
    price: 199,
    description: "Perfect for first-time luxury car buyers",
    features: [
      "Access to standard inventory",
      "Basic vehicle inspection",
      "30-day warranty",
      "Standard customer support",
      "Financing options available",
    ],
    popular: false,
    buttonText: "Get Started",
  },
  {
    name: "Premium",
    price: 399,
    description: "Our most popular package for enthusiasts",
    features: [
      "Access to premium inventory",
      "150-point vehicle inspection",
      "90-day comprehensive warranty",
      "Priority customer support",
      "Preferred financing rates",
      "Free delivery within 100 miles",
      "One free maintenance service",
    ],
    popular: true,
    buttonText: "Choose Premium",
  },
  {
    name: "Exclusive",
    price: 899,
    description: "The ultimate luxury experience",
    features: [
      "Access to exclusive & limited edition models",
      "200-point vehicle inspection with certification",
      "1-year comprehensive warranty",
      "24/7 dedicated concierge",
      "Best available financing rates",
      "Free delivery nationwide",
      "Complimentary maintenance package",
      "VIP events and experiences",
      "Priority access to new arrivals",
    ],
    popular: false,
    buttonText: "Go Exclusive",
  },
]

export default function PricingContent() {
  return (
    <main className="flex-grow">
      {/* Hero Section with Background Image */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 hero-bg-animate">
          <img
            src={`${GITHUB_RAW_BASE}/lycan-hypersport-concept.png`}
            alt="Luxury Hypercar"
            className="w-full h-full object-cover object-center opacity-14"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/90 to-primary-dark/90"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 hero-content-animate">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 hero-title-animate">Pricing & Membership</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg hero-text-animate">
            Choose the perfect plan that suits your luxury vehicle needs. All plans include access to our exclusive
            collection of premium vehicles.
          </p>
          <div className="mt-8 inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white border border-white/20 hero-cta-animate">
            <span className="font-bold"> Free Trial: Enjoy 3 Months on Us:</span>  – Absolutely Free! No credit card required. 
            Unlimited access. Cancel anytime.
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-xl ${
                  plan.popular ? "border-2 border-primary-light relative" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary-light text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-primary-light hover:bg-primary-dark text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
                <div className="bg-gray-50 p-6">
                  <h4 className="font-medium mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-primary-light flex-shrink-0 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Extended Warranty</h3>
              <p className="text-gray-600 mb-4">
                Extend your vehicle's warranty for up to 5 years with our comprehensive coverage plans.
              </p>
              <p className="font-medium">Starting at $1,999</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Maintenance Package</h3>
              <p className="text-gray-600 mb-4">
                Pre-paid maintenance packages to keep your luxury vehicle in perfect condition.
              </p>
              <p className="font-medium">Starting at $2,499</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Concierge Service</h3>
              <p className="text-gray-600 mb-4">
                Personalized concierge service for all your vehicle needs, available 24/7.
              </p>
              <p className="font-medium">Starting at $999/year</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade your plan at any time. The price difference will be prorated for the remainder of
                your billing cycle.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Is there a minimum commitment period?</h3>
              <p className="text-gray-600">
                Our Standard and Premium plans require a 3-month minimum commitment. The Exclusive plan requires a
                6-month minimum commitment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, bank transfers, and cryptocurrency payments for select plans.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time after the minimum commitment period. No refunds are
                provided for the current billing cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have elevated their driving experience with WexCars.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white hover:bg-gray-100 text-primary-light">Get Started Today</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-gray-500">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
