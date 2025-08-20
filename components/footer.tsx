"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Mail, Phone, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

// VFX Types
interface VFXInstance {
  add: (element: HTMLElement, options: { shader: string; overflow: number }) => void
  remove: (element?: HTMLElement) => void
}

declare global {
  interface Window {
    VFX?: any
  }
}

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const subscribeButtonRef = useRef<HTMLButtonElement>(null)

  // VFX Effect for Subscribe Button
  useEffect(() => {
    let vfxInstance: VFXInstance | null = null
    let cleanup: (() => void) | null = null

    const initVFX = async () => {
      try {
        // Load VFX library dynamically
        if (!window.VFX) {
          const script = document.createElement('script')
          script.type = 'module'
          script.innerHTML = `
            try {
              const { VFX } = await import('https://esm.sh/@vfx-js/core');
              window.VFX = VFX;
              window.dispatchEvent(new CustomEvent('vfx-loaded'));
            } catch (error) {
              console.log('VFX library failed to load:', error);
              window.dispatchEvent(new CustomEvent('vfx-failed'));
            }
          `
          document.head.appendChild(script)
          
          // Wait for VFX to load or fail
          await new Promise((resolve) => {
            const handleLoad = () => {
              window.removeEventListener('vfx-loaded', handleLoad)
              window.removeEventListener('vfx-failed', handleLoad)
              resolve(true)
            }
            window.addEventListener('vfx-loaded', handleLoad)
            window.addEventListener('vfx-failed', handleLoad)
          })
        }

        if (window.VFX && subscribeButtonRef.current) {
          const vfx = new window.VFX()
          vfxInstance = vfx
          
          const button = subscribeButtonRef.current
          
          const handleMouseEnter = () => {
            if (vfxInstance) {
              vfxInstance.add(button, { shader: "glitch", overflow: 100 })
            }
          }

          const handleMouseLeave = () => {
            if (vfxInstance) {
              vfxInstance.remove(button)
            }
          }

          button.addEventListener("mouseenter", handleMouseEnter)
          button.addEventListener("mouseleave", handleMouseLeave)
          
          cleanup = () => {
            button.removeEventListener("mouseenter", handleMouseEnter)
            button.removeEventListener("mouseleave", handleMouseLeave)
            if (vfxInstance) {
              vfxInstance.remove()
            }
          }
        }
      } catch (error) {
        console.log("VFX library could not be loaded:", error)
        // Gracefully fall back to CSS-only animations
      }
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initVFX, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (cleanup) {
        cleanup()
      }
    }
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    setIsSubscribed(true)
    setEmail("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-black-lighter via-black-light to-black text-white overflow-hidden">
      {/* Background Pattern removed */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/geometric-pattern.png')] bg-repeat opacity-20"></div>
      </div> */}

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="border-b border-gray-dark/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Brand Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="relative w-48 h-48">
                    <Image 
                      src={`${GITHUB_RAW_BASE}/wexcars-logo-new.png`}
                      alt="WexCars White Logo" 
                      fill 
                      className="object-contain filter brightness-0 invert" 
                      priority
                    />
                  </div>
                </div>
                <p className="text-gray-light max-w-md leading-relaxed">
                  Discover the world's finest luxury vehicles. From exotic supercars to elegant sedans, we curate an
                  exceptional collection for discerning automotive enthusiasts.
                </p>
              </div>

              {/* Newsletter Section */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Stay Updated</h4>
                <p className="text-gray-medium">Get the latest updates on new arrivals and exclusive offers.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-black-lighter/50 border border-gray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <button
                    ref={subscribeButtonRef}
                    type="submit"
                    className="vfx-button px-6 py-3 bg-gradient-to-r from-primary-dark to-primary hover:from-primary-darker hover:to-primary-dark rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 group relative overflow-hidden"
                  >
                    <span>{isSubscribed ? "Subscribed!" : "Subscribe"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </form>
                {isSubscribed && <p className="text-green-400 text-sm">Thank you for subscribing!</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Company</h5>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/careers", label: "Careers" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-medium hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Services</h5>
              <ul className="space-y-3">
                {[
                  { href: "/collections", label: "Car Collections" },
                  { href: "/collections?category=luxury", label: "Luxury Cars" },
                  { href: "/collections?category=sports", label: "Sports Cars" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-medium hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Support</h5>
              <ul className="space-y-3">
                {[
                  { href: "/help", label: "Help Center" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/shipping", label: "Shipping Info" },
                  { href: "/description", label: "Car Descriptions" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-medium hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Contact Info</h5>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-gray-medium">
                  <MapPin className="w-5 h-5 mt-0.5 text-red-500" />
                  <div>
                    <p className="text-sm">215 52 Malmo. Sweden</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-medium">
                  <Phone className="w-5 h-5 text-red-500" />
                  <a href="tel:+1234567890" className="text-sm hover:text-white transition-colors duration-200">
                    +46 737 200588
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-medium">
                  <Mail className="w-5 h-5 text-red-500" />
                  <a href="mailto:info@wexcars.com" className="text-sm hover:text-white transition-colors duration-200">
                    info@wexcars.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Legal Section */}
        <div className="border-t border-gray-dark/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Social Media Links */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-medium text-sm font-medium">Follow Us:</span>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Youtube, href: "#", label: "YouTube" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-black-lighter hover:bg-primary-dark rounded-full flex items-center justify-center transition-all duration-200 group"
                    >
                      <social.icon className="w-5 h-5 text-gray-medium group-hover:text-white transition-colors duration-200" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-end space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-medium hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-medium hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-medium hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-dark/30 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="relative w-16 h-16">
                    <Image 
                      src={`${GITHUB_RAW_BASE}/wexcars-logo-new.png`}
                      alt="WexCars Logo" 
                      fill 
                      className="object-contain filter brightness-0 invert" 
                    />
                  </div>
                </div>
                <p className="text-gray-medium text-sm">
                  &copy; {currentYear} All rights reserved. | Designed with passion for automotive excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-dark via-primary to-primary-dark"></div>
    </footer>
  )
}

export default Footer
