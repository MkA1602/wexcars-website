export default function ShippingSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary-light/5 -skew-y-6 transform origin-top-left"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-64 bg-primary-light/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with modern styling */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 bg-primary-light/10 rounded-full text-black text-sm font-medium mb-4">
            Global Logistics
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Premium Shipping <span className="text-primary-light">Solutions</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We deliver luxury vehicles worldwide with exceptional care and attention to detail, ensuring your prized
            possession arrives in perfect condition.
          </p>
        </div>

        {/* Modern card grid with hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
            <div className="p-8">
              <div className="w-14 h-14 bg-primary-light/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary-light group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                Door-To-Door Delivery
              </h3>
              <p className="text-gray-600">
                We offer convenient door-to-door delivery service to any location worldwide, with real-time tracking and
                updates.
              </p>
            </div>
            <div className="h-2 bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
            <div className="p-8">
              <div className="w-14 h-14 bg-primary-light/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary-light group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                Customs Handling
              </h3>
              <p className="text-gray-600">
                Our team manages all customs documentation and import requirements for a smooth, hassle-free process.
              </p>
            </div>
            <div className="h-2 bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
            <div className="p-8">
              <div className="w-14 h-14 bg-primary-light/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary-light group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                Secure Transport
              </h3>
              <p className="text-gray-600">
                Your vehicle is transported in secure, enclosed carriers with climate control to ensure maximum
                protection.
              </p>
            </div>
            <div className="h-2 bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
            <div className="p-8">
              <div className="w-14 h-14 bg-primary-light/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary-light group-hover:text-white"
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
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                Full Insurance Coverage
              </h3>
              <p className="text-gray-600">
                All shipments are fully insured for the vehicle's full value during the entire journey for your peace of
                mind.
              </p>
            </div>
            <div className="h-2 bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <a
            href="/shipping"
            className="inline-flex items-center px-6 py-3 border border-primary-light text-primary-light bg-white hover:bg-primary-light hover:text-white rounded-full transition-colors duration-300 font-medium"
          >
            Learn More About Our Shipping Process
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
