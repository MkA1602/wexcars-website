import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Star } from "lucide-react"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection className="bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-0">
          <Image src="/luxury-car-showroom.png" alt="Luxury cars in showroom" fill className="object-cover" priority />
        </div>
        <div className="container-custom relative z-20 py-32 md:py-40 mt-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Find Your Perfect Luxury Vehicle</h1>
            <p className="text-lg text-gray-300 mb-8">
              AutoWex offers a premium selection of luxury and sports cars. Browse our inventory and discover your dream
              car today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/inventory" className="btn btn-primary">
                Browse Inventory
              </Link>
              <Link href="/contact" className="btn btn-outline text-white border-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* Featured Cars Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Vehicles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium vehicles, each offering exceptional performance, luxury, and
              value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Car Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <Image src="/placeholder.svg?key=rspkm" alt="Mercedes S-Class" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mercedes-Benz S-Class</h3>
                <p className="text-gray-600 mb-4">2023 • 1,200 miles</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">$89,900</span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <Link href="/inventory/mercedes-s-class" className="btn btn-primary w-full">
                  View Details
                </Link>
              </div>
            </div>

            {/* Car Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <Image src="/placeholder.svg?key=qzric" alt="BMW 7 Series" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">BMW 7 Series</h3>
                <p className="text-gray-600 mb-4">2023 • 800 miles</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">$84,500</span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <Link href="/inventory/bmw-7-series" className="btn btn-primary w-full">
                  View Details
                </Link>
              </div>
            </div>

            {/* Car Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <Image src="/placeholder.svg?key=r5vfs" alt="Audi A8" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Audi A8</h3>
                <p className="text-gray-600 mb-4">2023 • 1,500 miles</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">$79,900</span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <Link href="/inventory/audi-a8" className="btn btn-primary w-full">
                  View Details
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/inventory" className="btn btn-outline inline-flex items-center">
              View All Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AutoWex</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide an exceptional car buying experience with premium service and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Selection</h3>
              <p className="text-gray-600">
                We offer a carefully curated inventory of luxury and sports cars from the world's top manufacturers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Our team of automotive experts will help you find the perfect vehicle to match your needs and
                preferences.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparent Process</h3>
              <p className="text-gray-600">
                We believe in complete transparency throughout the buying process, with no hidden fees or surprises.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Financing</h3>
              <p className="text-gray-600">
                We offer competitive financing options tailored to your specific situation and requirements.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Service</h3>
              <p className="text-gray-600">
                Our commitment to excellence extends beyond the sale with comprehensive after-sales support.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Shipping</h3>
              <p className="text-gray-600">
                We offer worldwide shipping services to deliver your dream car wherever you are located.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about their experience
              with AutoWex.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The team at AutoWex made buying my dream car an absolute pleasure. Their knowledge, professionalism,
                and attention to detail were outstanding."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src="/professional-man-headshot.png" alt="John Smith" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-gray-500 text-sm">Mercedes-Benz S-Class Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I was impressed by the selection of vehicles and the no-pressure sales approach. The financing options
                were excellent, and the process was smooth from start to finish."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src="/professional-woman-headshot.png" alt="Sarah Johnson" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">BMW 7 Series Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Even though I was overseas, AutoWex handled the entire purchase and shipping process flawlessly. My
                Porsche arrived in perfect condition, exactly as described."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src="/professional-man-suit-headshot.png" alt="Michael Chen" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">Porsche 911 Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Car?</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            Browse our inventory or contact our team to start your journey towards owning the perfect luxury vehicle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/inventory" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Browse Inventory
            </Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
