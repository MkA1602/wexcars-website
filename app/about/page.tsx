import Image from "next/image"
import type { Metadata } from "next"
import TeamSection from "@/components/team-section"
import { Check } from "lucide-react"
import HeroSection from "@/components/hero-section"

export const metadata: Metadata = {
  title: "About Us | AutoWex",
  description: "Learn about AutoWex, our history, mission, and the team behind our premium luxury car dealership.",
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-0">
          <Image src="/luxury-car-showroom.png" alt="AutoWex showroom" fill className="object-cover" priority />
        </div>
        <div className="container-custom relative z-20 py-32 mt-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-6">About AutoWex</h1>
            <p className="text-xl text-gray-300">
              We are a premium luxury car dealership dedicated to providing exceptional vehicles and outstanding
              customer service. Our passion for automobiles drives everything we do.
            </p>
          </div>
        </div>
      </HeroSection>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, AutoWex began with a simple mission: to provide discerning clients with access to the
                world's finest automobiles in an environment of unparalleled service and expertise.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a small showroom with just five vehicles has grown into one of the most respected luxury
                car dealerships in the country, with a reputation for excellence that extends worldwide.
              </p>
              <p className="text-gray-700 mb-4">
                Our founder, Alexander Wexler, combined his passion for luxury automobiles with his commitment to
                exceptional customer service to create a dealership experience unlike any other. Today, that vision
                continues to guide everything we do.
              </p>
              <p className="text-gray-700">
                We've expanded our operations to include global exports, concierge services, and custom vehicle
                procurement, but our core values remain the same: integrity, expertise, and an unwavering dedication to
                customer satisfaction.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?key=showroom-interior"
                alt="AutoWex showroom interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At AutoWex, we're guided by a set of core principles that define who we are and how we operate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from the vehicles we select to the service we provide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We operate with complete transparency and honesty, building trust with our clients through every
                interaction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expertise</h3>
              <p className="text-gray-600">
                Our team consists of passionate automotive experts with deep knowledge of luxury and performance
                vehicles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously seek new ways to enhance our services and provide cutting-edge solutions for our
                clients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalization</h3>
              <p className="text-gray-600">
                We recognize that each client is unique, and we tailor our approach to meet individual needs and
                preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Perspective</h3>
              <p className="text-gray-600">
                With clients and partners worldwide, we bring an international outlook to everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of automotive experts is passionate about luxury vehicles and dedicated to providing exceptional
              service.
            </p>
          </div>

          <TeamSection />
        </div>
      </section>

      {/* Showroom Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-6">Our Showroom</h2>
              <p className="text-gray-700 mb-4">
                Located in the heart of the city, our state-of-the-art showroom provides the perfect environment to
                explore our collection of premium vehicles.
              </p>
              <p className="text-gray-700 mb-4">
                Designed with both aesthetics and functionality in mind, our facility features:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                  <span>Over 10,000 square feet of climate-controlled display space</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                  <span>Private consultation areas for personalized discussions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                  <span>Comfortable lounge with premium refreshments</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                  <span>Advanced lighting systems to showcase vehicles in their best light</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                  <span>Digital displays with detailed vehicle information</span>
                </li>
              </ul>
              <p className="text-gray-700">
                We invite you to visit our showroom and experience the AutoWex difference for yourself.
              </p>
            </div>
            <div className="order-1 lg:order-2 relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?key=showroom-exterior"
                alt="AutoWex showroom exterior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the AutoWex Difference</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            Visit our showroom or contact our team to learn more about our vehicles and services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/inventory" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Browse Inventory
            </a>
            <a href="/contact" className="btn border-2 border-white text-white hover:bg-white/10">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
