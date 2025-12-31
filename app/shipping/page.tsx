"use client"

import VariableProximity from "@/components/ui/variable-proximity"
import { useRef } from "react"
import { ArrowLeft, Truck, Shield, Globe, Clock, Phone, Mail, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import WorldMap from "@/components/ui/world-map"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export default function ShippingPage() {
  const containerRef = useRef<HTMLElement>(null!)
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
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 hero-title-animate">
              <VariableProximity
                label="Shipping Information"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-white"
              />
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg hero-text-animate">
              <VariableProximity
                label="We deliver luxury vehicles worldwide with exceptional care and attention to detail, ensuring your prized possession arrives in perfect condition."
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 600, 'slnt' -2"
                containerRef={containerRef}
                radius={50}
                falloff="linear"
                className="text-white/80"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-2">
            <div ref={containerRef as React.RefObject<HTMLDivElement>}>
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <div className="h-px w-8 bg-[#b22222]"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1.5">
                <span className="text-gray-900">Our Shipping</span>
                <span className="text-[#b22222] ml-3">Services</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Comprehensive shipping solutions designed specifically for luxury vehicles
              </p>
            </div>
          </div>

          {/* World Map Section */}
          <div className="py-1 mb-5">
            <div className="max-w-7xl mx-auto">
              <WorldMap
                dots={[
                  {
                    start: { lat: 55.6050, lng: 13.0038 }, // Malmö, Sweden
                    end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                  },
                  {
                    start: { lat: 55.6050, lng: 13.0038 }, // Malmö, Sweden
                    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                  },
                  {
                    start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                  },
                  {
                    start: { lat: 51.5074, lng: -0.1278 }, // London
                    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  },
                  {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                  },
                  {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                  },
                ]}
              />
            </div>
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
              <div ref={containerRef as React.RefObject<HTMLDivElement>}>
                <h2 className="text-3xl font-bold mb-4">
                  <VariableProximity
                    label="Our Shipping Process"
                    fromFontVariationSettings="'wght' 700, 'slnt' 0"
                    toFontVariationSettings="'wght' 900, 'slnt' -5"
                    containerRef={containerRef}
                    radius={60}
                    falloff="gaussian"
                    className="text-gray-900"
                  />
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  <VariableProximity
                    label="We follow a meticulous process to ensure your luxury vehicle arrives safely and on time."
                    fromFontVariationSettings="'wght' 400, 'slnt' 0"
                    toFontVariationSettings="'wght' 600, 'slnt' -2"
                    containerRef={containerRef}
                    radius={50}
                    falloff="linear"
                    className="text-gray-600"
                  />
                </p>
              </div>
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-8 bg-[#b22222]"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Delivery</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                <span className="text-gray-900">Shipping Zones</span>
                <span className="text-[#b22222] ml-3">& Timeframes</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We deliver to locations worldwide with different timeframes based on your region
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  zone: "Europe",
                  timeframe: "5-10 business days",
                  countries: ["Sweden", "Norway", "Denmark", "Germany", "UK", "France", "Italy", "Spain"],
                  icon: "🇪🇺",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  zone: "North America",
                  timeframe: "10-15 business days",
                  countries: ["USA", "Canada", "Mexico"],
                  icon: "🇺🇸",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  zone: "Rest of World",
                  timeframe: "15-25 business days",
                  countries: ["Asia", "Australia", "Middle East", "Africa", "South America"],
                  icon: "🌍",
                  color: "from-green-500 to-green-600"
                }
              ].map((zone, index) => (
                <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${zone.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{zone.icon}</span>
                      <div className="px-3 py-1 bg-gray-50 rounded-full">
                        <span className="text-xs font-semibold text-gray-600">{zone.timeframe}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#b22222] transition-colors">
                      {zone.zone}
                    </h3>
                    <div className="space-y-2.5">
                      {zone.countries.map((country, idx) => (
                        <div key={idx} className="flex items-center group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b22222] mr-3 group-hover/item:scale-150 transition-transform"></div>
                          <span className="text-gray-700 font-medium">{country}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Protection */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-8 bg-[#b22222]"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Protection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                <span className="text-gray-900">Insurance</span>
                <span className="text-[#b22222] ml-3">& Protection</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Your luxury vehicle is fully protected throughout the entire shipping process
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#b22222] transition-colors">Full Coverage Insurance</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 mt-2"></div>
                    <span className="text-gray-700 font-medium">Complete coverage for vehicle's full value</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 mt-2"></div>
                    <span className="text-gray-700 font-medium">Protection against damage, theft, and loss</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 mt-2"></div>
                    <span className="text-gray-700 font-medium">24/7 claims support and assistance</span>
                  </li>
                </ul>
              </div>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#b22222] transition-colors">Secure Transport Features</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 mt-2"></div>
                    <span className="text-gray-700 font-medium">Climate-controlled enclosed carriers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 mt-2"></div>
                    <span className="text-gray-700 font-medium">GPS tracking and monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 mt-2"></div>
                    <span className="text-gray-700 font-medium">Specialized loading equipment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-8 bg-[#b22222]"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Support</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                <span className="text-gray-900">Shipping</span>
                <span className="text-[#b22222] ml-3">Support</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our dedicated shipping team is available to assist you throughout the process
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                    <Phone className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#b22222] transition-colors">Phone Support</h3>
                  <p className="text-gray-800 font-semibold text-lg mb-1">+46 737 200581</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM CET</p>
                </div>
              </div>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
                    <Mail className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#b22222] transition-colors">Email Support</h3>
                  <p className="text-gray-800 font-semibold text-lg mb-1">support@wexcars.com</p>
                  <p className="text-sm text-gray-500">24/7 Response</p>
                </div>
              </div>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b22222] to-[#8b0000]"></div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-red-100 group-hover:to-red-200 transition-all">
                    <MapPin className="w-7 h-7 text-[#b22222]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#b22222] transition-colors">Our Location</h3>
                  <p className="text-gray-800 font-semibold text-lg mb-1">Malmö, Sweden</p>
                  <p className="text-gray-600 text-sm mb-1">European Headquarters</p>
                  <p className="text-xs text-gray-500 mb-3">Postal Code: 215 52</p>
                  <div className="inline-block bg-[#b22222]/5 border border-[#b22222]/20 rounded-lg px-3 py-1.5">
                    <p className="text-xs text-[#b22222] font-medium">
                      🏢 Premium Automotive Hub
                    </p>
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