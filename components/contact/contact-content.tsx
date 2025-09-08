"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, MapPin, Phone, Mail, Clock } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import OpenStreetMap to avoid SSR issues and chunk loading problems
const OpenStreetMap = dynamic(() => import("@/components/openstreet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
      <div className="text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
})

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export default function ContactContent() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, we would send the form data to a server
    console.log("Form submitted:", formState)
    setSubmitted(true)
  }

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 hero-title-animate">Contact Us</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg hero-text-animate">
            Have questions about our vehicles or services? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Our luxury vehicle specialists are available to answer any questions you may have about our collection,
                services, or membership options.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary-light" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Visit Us</h3>
                    <p className="text-gray-600">215 52
Malmo
Sweden</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary-light" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+46737200581</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary-light" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">info@wexcars.com</p>
                    <p className="text-gray-600">sales@wexcars.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary-light" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Sunday: Off</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Your message has been received. One of our representatives will contact you shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false)
                      setFormState({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      })
                    }}
                    className="bg-primary-light hover:bg-primary-dark text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-primary-light">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-primary-light">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-primary-light">*</span>
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-primary-light">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        className="h-4 w-4 text-primary-light border-gray-300 rounded mt-1"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-600">
                        I agree to the{" "}
                        <a href="/privacy" className="text-primary-light hover:underline">
                          Privacy Policy
                        </a>{" "}
                        and consent to WexCars processing my data for the purpose of contacting me.
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="bg-primary-light hover:bg-primary-dark text-white px-8 py-3 rounded-lg"
                    >
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Location</h2>
          <div className="max-w-6xl mx-auto">
            <OpenStreetMap height="500px" className="shadow-lg" />

          </div>
        </div>
      </section>
    </main>
  )
}
