import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Search, Star, CheckCircle, Zap, Shield } from "lucide-react"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export const metadata: Metadata = {
  title: "Car Descriptions | WexCars - Detailed Vehicle Information",
  description: "Discover how WexCars provides comprehensive, detailed descriptions for every luxury vehicle in our collection. Make informed decisions with complete vehicle information.",
  keywords: "car descriptions, vehicle information, car details, WexCars, luxury vehicles, detailed specifications",
}

export default function DescriptionPage() {
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
            Detailed Car Descriptions
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg hero-text-animate">
            Every vehicle in our collection comes with comprehensive, detailed descriptions to help you make the perfect choice.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Vehicle Information
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                At WexCars, we believe in complete transparency. Every vehicle comes with detailed descriptions, 
                ensuring you have all the information needed to make the perfect choice.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Detailed Information */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-primary-light/10 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-primary-light" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Detailed Descriptions
                </h3>
                <p className="text-gray-600 mb-4">
                  Every vehicle features comprehensive descriptions including condition, history, and unique characteristics.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Complete vehicle history
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Condition assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Special features & modifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Professional seller notes
                  </li>
                </ul>
              </div>

              {/* Easy Access */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-primary-light/10 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-primary-light" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Easy to Find
                </h3>
                <p className="text-gray-600 mb-4">
                  Descriptions are prominently displayed on each vehicle's detail page for quick and easy access.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Dedicated description section
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Clear, readable formatting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Mobile-optimized display
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Structured information layout
                  </li>
                </ul>
              </div>

              {/* Quality Assurance */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-primary-light/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-primary-light" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Verified Information
                </h3>
                <p className="text-gray-600 mb-4">
                  All descriptions are reviewed and verified to ensure accuracy and completeness before publication.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Expert verification process
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Accurate condition reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Transparent disclosure
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Regular updates
                  </li>
                </ul>
              </div>
            </div>

            {/* Why Choose Our Descriptions */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Our Descriptions Matter
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We go beyond basic specifications to provide you with insights that matter for your luxury car investment.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-primary-light" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality Assurance</h3>
                      <p className="text-gray-600">Every description undergoes rigorous review by our automotive experts to ensure accuracy and completeness.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-primary-light" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Insights</h3>
                      <p className="text-gray-600">Get immediate access to critical information about performance, features, and unique characteristics.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary-light" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent Disclosure</h3>
                      <p className="text-gray-600">We believe in complete transparency, disclosing all relevant information to help you make confident decisions.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 rounded-2xl p-8 border border-primary-light/20">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">What You'll Find</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                        <span className="text-gray-700">Detailed condition assessment</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                        <span className="text-gray-700">Complete service history</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                        <span className="text-gray-700">Unique features & modifications</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                        <span className="text-gray-700">Previous ownership details</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                        <span className="text-gray-700">Performance specifications</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                        <span className="text-gray-700">Investment potential insights</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Access Section */}
            <div className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-dark/5"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-100">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    How to Access Vehicle Descriptions
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Finding detailed vehicle information is simple and intuitive on our platform.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-primary-light text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Our Collection</h3>
                        <p className="text-gray-600 leading-relaxed">Navigate to our Collections page to explore our curated selection of luxury vehicles.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-primary-light text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Select Your Vehicle</h3>
                        <p className="text-gray-600 leading-relaxed">Click on any car card to access its comprehensive detail page with full specifications.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-primary-light text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Find the Description</h3>
                        <p className="text-gray-600 leading-relaxed">Scroll down to the description section, located below the vehicle features and specifications.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-primary-light text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Explore Details</h3>
                        <p className="text-gray-600 leading-relaxed">Read the complete description to understand every aspect of your potential investment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-light to-primary-dark">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Luxury Vehicle?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Explore our exclusive collection of luxury vehicles, each with detailed descriptions to help you make the perfect choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/collections">
                <Button 
                  size="lg" 
                  className="bg-white text-primary-light hover:bg-gray-100 hover:text-primary-dark font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Explore Collection
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-light font-semibold px-8 py-4 text-lg transition-all duration-300"
                >
                  Contact Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
