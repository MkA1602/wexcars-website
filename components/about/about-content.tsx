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
                src="/about/group-people-aboutus.png"
                alt="WexCars Team - Global Luxury Car Export Simplified"
                className="rounded-xl shadow-lg w-full h-auto object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `${GITHUB_RAW_BASE}/about/group-people-aboutus.png`;
                }}
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-8 bg-[#b22222]"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="text-gray-900">Our</span>
                <span className="text-[#b22222] ml-3">Story</span>
              </h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Founded in 2022, WexCars was born from a passion for exceptional automobiles and a vision to transform how discerning clients discover, experience, and acquire luxury vehicles.
              </p>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                What began as a small collection of handpicked vehicles has evolved into one of the most prestigious luxury car platforms, offering an unparalleled selection of premium automobiles from the world's most esteemed manufacturers.
              </p>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Our founder, MK Sulaiman, recognized a gap in the market for a truly personalized, transparent, and exceptional car buying journey. Today, that vision has expanded into a global operation that maintains the same dedication to quality and client satisfaction that defined our beginnings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-[#b22222]"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              <span className="text-gray-900">Our Mission</span>
              <span className="text-[#b22222] ml-3">& Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-green-100 group-hover:to-green-200 transition-all">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#b22222] transition-colors">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to excellence in every aspect of our business, from the vehicles we select to the service we provide.
              </p>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-blue-600"
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
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#b22222] transition-colors">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in complete transparency throughout the buying process, ensuring our clients make informed decisions.
              </p>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
                <Heart className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#b22222] transition-colors">Personalization</h3>
              <p className="text-gray-600 leading-relaxed">
                We tailor every interaction to the unique preferences and requirements of each client, creating bespoke experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-[#b22222]"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              <span className="text-gray-900">Meet Our</span>
              <span className="text-[#b22222] ml-3">Team</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={member.name + '-' + member.position + '-' + idx} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b22222] to-[#8b0000]"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-900 group-hover:text-[#b22222] transition-colors">{member.name}</h3>
                  <p className="text-[#b22222] font-semibold mb-3">{member.position}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-[#b22222]"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b22222]">Timeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              <span className="text-gray-900">Our</span>
              <span className="text-[#b22222] ml-3">Journey</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={`${milestone.year}-${index}`} className="relative pl-12 pb-8">
                {index !== milestones.length - 1 && (
                  <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#b22222] to-[#8b0000] flex items-center justify-center text-white font-bold z-10 shadow-lg">
                  {index + 1}
                </div>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                  <div className="text-[#b22222] font-bold text-lg mb-2">{milestone.year}</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#b22222] transition-colors">{milestone.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${GITHUB_RAW_BASE}/lycan-hypersport-concept.png`}
            alt="Luxury Hypercar"
            className="w-full h-full object-cover object-center opacity-14"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(178, 34, 34, 0.9), rgba(139, 0, 0, 0.9))',
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
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
              <Button className="bg-white hover:bg-gray-100 text-primary-light font-semibold px-8 py-3 transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
