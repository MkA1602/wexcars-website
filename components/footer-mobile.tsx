"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

interface FooterSection {
  title: string
  links: { href: string; label: string }[]
}

const FooterMobile = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((title) => title !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  const footerSections: FooterSection[] = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: "Services",
      links: [
        { href: "/collections", label: "Car Collections" },
        { href: "/collections?category=luxury", label: "Luxury Cars" },
        { href: "/collections?category=sports", label: "Sports Cars" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help", label: "Help Center" },
        { href: "/faq", label: "FAQ" },
        { href: "/shipping", label: "Shipping Info" },
      ],
    },
  ]

  return (
    <footer className="lg:hidden bg-gradient-to-br from-black-lighter via-black-light to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative w-32 h-32">
              <Image 
                src={`${GITHUB_RAW_BASE}/wexcars-logo-new.png`}
                alt="WexCars White Logo" 
                fill 
                className="object-contain filter brightness-0 invert" 
                priority
              />
            </div>
          </div>
          <p className="text-gray-medium text-sm max-w-xs mx-auto">Premium automotive excellence at your fingertips</p>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4 mb-8">
          {footerSections.map((section) => (
            <div key={section.title} className="border-b border-gray-dark/50 pb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-left py-2"
              >
                <h5 className="font-semibold text-white">{section.title}</h5>
                {expandedSections.includes(section.title) ? (
                  <ChevronUp className="w-5 h-5 text-gray-medium" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-medium" />
                )}
              </button>
              {expandedSections.includes(section.title) && (
                <ul className="mt-3 space-y-2 pl-4">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-medium hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="text-center space-y-4 mb-8">
          <h5 className="font-semibold text-white mb-4">Contact Us</h5>
          <div className="space-y-3 text-sm text-gray-medium">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <div className="text-center">
                <p className="text-white font-medium">Malmö, Sweden</p>
                <p className="text-xs text-gray-400">European Headquarters</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4 text-red-500" />
              <a href="tel:+46737200581" className="hover:text-white transition-colors duration-200">
                +46 737 200581
              </a>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-red-500" />
              <a href="mailto:support@wexcars.com" className="hover:text-white transition-colors duration-200">
                support@wexcars.com
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex flex-wrap justify-center space-x-4 text-xs text-gray-medium">
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-gray-dark/30">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-14 h-14">
              <Image 
                src={`${GITHUB_RAW_BASE}/wexcars-logo-new.png`}
                alt="WexCars Logo" 
                fill 
                className="object-contain filter brightness-0 invert" 
              />
            </div>
            <p className="text-gray-medium text-xs">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterMobile
