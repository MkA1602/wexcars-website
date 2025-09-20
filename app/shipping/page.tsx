import type { Metadata } from "next"
import { ArrowLeft, Truck, Shield, Globe, Clock, Phone, Mail, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export const metadata: Metadata = {
  title: "Shipping Information | WexCars - Luxury Vehicle Delivery",
  description: "Learn about WexCars' premium shipping services, global delivery options, and secure transport for luxury vehicles worldwide.",
  keywords: "luxury car shipping, vehicle transport, global delivery, secure shipping, WexCars",
}

export default function ShippingPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 hero-title-animate">
            Shipping Information
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg hero-text-animate">
            We deliver luxury vehicles worldwide with exceptional care and attention to detail, ensuring your prized possession arrives in perfect condition.
          </p>
        </div>
      </section>

      {/* Shipping Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Shipping Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive shipping solutions designed specifically for luxury vehicles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Door-To-Door Delivery",
                description: "Convenient delivery service to any location worldwide with real-time tracking and updates."
              },
              {
                icon: Shield,
                title: "Secure Transport",
                description: "Enclosed carriers with climate control to ensure maximum protection during transport."
              },
              {
                icon: Globe,
                title: "Global Coverage",
                description: "We deliver to over 180 countries with extensive logistics network and local partnerships."
              },
              {
                icon: Clock,
                title: "Express Options",
                description: "Expedited shipping available for urgent deliveries with priority handling."
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                    <service.icon className="h-6 w-6 text-primary-light group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Shipping Process</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We follow a meticulous process to ensure your luxury vehicle arrives safely and on time.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Order Confirmation",
                    description: "Once your purchase is confirmed, we begin preparing your vehicle for shipment with detailed documentation and inspection."
                  },
                  {
                    step: "2",
                    title: "Logistics Coordination",
                    description: "Our team coordinates with trusted shipping partners to arrange the most suitable transport method for your vehicle."
                  },
                  {
                    step: "3",
                    title: "Secure Loading",
                    description: "Your vehicle is carefully loaded into climate-controlled, enclosed carriers with specialized equipment to prevent any damage."
                  },
                  {
                    step: "4",
                    title: "Transit & Tracking",
                    description: "Track your shipment in real-time with regular updates on location and estimated delivery time."
                  },
                  {
                    step: "5",
                    title: "Delivery & Inspection",
                    description: "Upon arrival, we conduct a thorough inspection with you to ensure your vehicle is in perfect condition."
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Zones & Timeframes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shipping Zones & Timeframes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We deliver to locations worldwide with different timeframes based on your region.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  zone: "Europe",
                  timeframe: "5-10 business days",
                  countries: ["Sweden", "Norway", "Denmark", "Germany", "UK", "France", "Italy", "Spain"]
                },
                {
                  zone: "North America",
                  timeframe: "10-15 business days",
                  countries: ["USA", "Canada", "Mexico"]
                },
                {
                  zone: "Rest of World",
                  timeframe: "15-25 business days",
                  countries: ["Asia", "Australia", "Middle East", "Africa", "South America"]
                }
              ].map((zone, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{zone.zone}</h3>
                  <p className="text-primary-light font-medium mb-4">{zone.timeframe}</p>
                  <div className="space-y-2">
                    {zone.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-600">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Protection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Insurance & Protection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your luxury vehicle is fully protected throughout the entire shipping process.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Full Coverage Insurance</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Complete coverage for vehicle's full value</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Protection against damage, theft, and loss</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>24/7 claims support and assistance</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Secure Transport Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Climate-controlled enclosed carriers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>GPS tracking and monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Specialized loading equipment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shipping Support</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated shipping team is available to assist you throughout the process.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-gray-600">+46 737 200581</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM CET</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-gray-600">support@wexcars.com</p>
                  <p className="text-sm text-gray-500">24/7 Response</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-light/10 to-primary-dark/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin className="w-8 h-8 text-primary-light" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Our Location</h3>
                  <div className="space-y-2">
                    <p className="text-gray-800 font-semibold text-lg">Malmö, Sweden</p>
                    <p className="text-gray-600">European Headquarters</p>
                    <p className="text-sm text-gray-500">Postal Code: 215 52</p>
                    <div className="mt-3 inline-block bg-primary-light/5 border border-primary-light/20 rounded-lg px-3 py-2">
                      <p className="text-xs text-primary-light font-medium">
                        🏢 Premium Automotive Hub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 