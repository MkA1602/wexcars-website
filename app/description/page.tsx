import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Car Descriptions | WexCars - Vehicle Information",
  description: "Learn about how we display car descriptions on WexCars. Understand our comprehensive vehicle information system.",
  keywords: "car descriptions, vehicle information, car details, WexCars, vehicle descriptions",
}

export default function DescriptionPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Car Descriptions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how we present comprehensive vehicle descriptions to help you make informed decisions about your next luxury car.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Description Information */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                How Car Descriptions Work
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Description Display */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      📝
                    </span>
                    Description Display
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Car descriptions are displayed on the individual car detail page below the features section, providing comprehensive information about each vehicle.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Located below the features section</li>
                    <li>• Full description text displayed</li>
                    <li>• Clean, readable formatting</li>
                    <li>• Preserves line breaks and formatting</li>
                  </ul>
                </div>

                {/* Description Content */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      📋
                    </span>
                    Description Content
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Descriptions include detailed information about the vehicle's condition, history, unique features, and any special notes from the seller.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Vehicle condition details</li>
                    <li>• Ownership history</li>
                    <li>• Special features or modifications</li>
                    <li>• Seller notes and recommendations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Benefits of Detailed Descriptions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Information</h3>
                  <p className="text-gray-600">Get comprehensive details about each vehicle's condition and history.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Informed Decisions</h3>
                  <p className="text-gray-600">Make better purchasing decisions with complete vehicle information.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Experience</h3>
                  <p className="text-gray-600">Enjoy a more informative and engaging car browsing experience.</p>
                </div>
              </div>
            </div>

            {/* How to Access Section */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                How to Access Car Descriptions
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Browse Car Collection</h3>
                    <p className="text-gray-600">Navigate to the Collections page to view all available vehicles.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Click on a Car</h3>
                    <p className="text-gray-600">Click on any car card to view its detailed information page.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Scroll to Description</h3>
                    <p className="text-gray-600">Scroll down past the features section to find the description.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Read Full Details</h3>
                    <p className="text-gray-600">Read the complete description to understand the vehicle better.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Explore Our Collection?
              </h2>
              <p className="text-gray-600 mb-6">
                Browse our luxury vehicles and read detailed descriptions to find your perfect car.
              </p>
              <a 
                href="/collections" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                View Collection
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
