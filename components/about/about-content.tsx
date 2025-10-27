"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Users, Shield, Star, Target, Heart, Award } from "lucide-react"
import VariableProximity from "@/components/ui/variable-proximity"
import { useRef } from "react"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const teamMembers = [
  {
    name: "MK Sulaiman",
    position: "Founder & CEO",
    image: "/team/ceo.jpg",
    bio: "With many years dealing with cars and offer car that are not available in the market, MK founded WexCars with a vision to revolutionize the premium car buying experience.",
  },
  {
    name: "Roger Khori",
    position: "Chief Operating Officer",
    image: "/team/coo.jpg",
    bio: "Gorje brings his extensive experience from leading automotive brands to oversee all operational aspects of WexCars.",
  },
  {
    name: "coming soon",
    position: "Head of Vehicle Acquisitions",
    image: "/team/acquisitions.jpg",
    bio: "person has an unparalleled eye for quality and value, ensuring only the finest vehicles make it into our collection.",
  },
  {
    name: "coming soon",
    position: "Customer Experience Director",
    image: "/team/customer-experience.jpg",
    bio: "Person is dedicated to creating memorable experiences for every client, from first inquiry to delivery and beyond.",
  },
]

const milestones = [
  {
    year: 2022,
    title: "Company Founded",
    description: "WexCars was established with a mission to transform the luxury car buying experience.",
  },
  {
    year: 2023,
    title: "Expanded Collection",
    description: "Reached 100+ luxury vehicles in our carefully curated collection.",
  },
  {
    year: 2024,
    title: "International Expansion",
    description: "Began offering international shipping and expanded our client base globally.",
  },
  {
    year: 2025,
    title: "Digital Transformation",
    description: "Launched our state-of-the-art digital platform for seamless online browsing and purchasing.",
  },
  {
    year: 2025,
    title: "Premium Partnerships",
    description: "Established exclusive partnerships with top luxury car manufacturers worldwide.",
  },
]

export default function AboutContent() {
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
                label="About WexCars"
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
                label="Redefining the luxury automotive experience since 2015."
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

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="/about/luxury-showroom.jpg"
                alt="WexCar Luxury Showroom Interior"
                className="rounded-xl shadow-lg w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2022, WexCars was born from a passion for exceptional automobiles and a vision to transform
                how discerning clients discover, experience, and acquire luxury vehicles.
              </p>
              <p className="text-gray-700 mb-4">
                What began as a small collection of handpicked vehicles has evolved into one of the most prestigious
                luxury car platforms, offering an unparalleled selection of premium automobiles from the world's most
                esteemed manufacturers.
              </p>
              <p className="text-gray-700 mb-4">
                Our founder, MK Sulaiman, recognized a gap in the market for a truly personalized, transparent,
                and exceptional car buying journey. Today, that vision has expanded into a global operation that
                maintains the same dedication to quality and client satisfaction that defined our beginnings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h2 className="text-3xl font-bold mb-12 text-center">
              <VariableProximity
                label="Our Mission & Values"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-gray-900"
              />
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We are committed to excellence in every aspect of our business, from the vehicles we select to the
                service we provide.
              </p>
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
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in complete transparency throughout the buying process, ensuring our clients make informed
                decisions.
              </p>
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
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalization</h3>
              <p className="text-gray-600">
                We tailor every interaction to the unique preferences and requirements of each client, creating bespoke
                experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h2 className="text-3xl font-bold mb-12 text-center">
              <VariableProximity
                label="Meet Our Team"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-gray-900"
              />
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={member.name + '-' + member.position + '-' + idx} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-light font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h2 className="text-3xl font-bold mb-12 text-center">
              <VariableProximity
                label="Our Journey"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-gray-900"
              />
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={`${milestone.year}-${index}`} className="relative pl-10 pb-10">
                {index !== milestones.length - 1 && (
                  <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-300"></div>
                )}
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-primary-light font-bold mb-1">{milestone.year}</div>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4 text-center">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h2 className="text-3xl font-bold text-white mb-4">
              <VariableProximity
                label="Join Our Journey"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-white"
              />
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              <VariableProximity
                label="Experience the WexCars difference and discover why we're the preferred choice for luxury car enthusiasts worldwide."
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 600, 'slnt' -2"
                containerRef={containerRef}
                radius={50}
                falloff="linear"
                className="text-white/80"
              />
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/collections">
              <Button className="bg-white hover:bg-gray-100 text-primary-light font-semibold px-8 py-3 transition-all duration-300">
                Explore Our Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-light font-semibold px-8 py-3 transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
