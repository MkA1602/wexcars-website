"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ChevronRight, Shield, PenToolIcon as Tool, FileCheck, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

interface InspectionFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const inspectionFeatures: InspectionFeature[] = [
  {
    icon: <Check className="h-5 w-5" />,
    title: "150-Point Inspection",
    description: "Our thorough 150-point inspection ensures every vehicle meets our rigorous quality standards.",
  },
  {
    icon: <Tool className="h-5 w-5" />,
    title: "Expert Technicians",
    description: "Our certified technicians have years of experience with luxury and exotic vehicles.",
  },
  {
    icon: <FileCheck className="h-5 w-5" />,
    title: "Detailed Reports",
    description: "Receive comprehensive inspection reports with detailed information about your vehicle.",
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: "Video Documentation",
    description: "We provide video documentation of the inspection process for complete transparency.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Quality Guarantee",
    description: "Every inspected vehicle comes with our quality guarantee for your peace of mind.",
  },
]

export default function InspectionSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Inspection Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We believe in transparency and quality. Every vehicle in our collection undergoes a rigorous inspection
            process to ensure it meets our exceptional standards.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section with Animation */}
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={`${GITHUB_RAW_BASE}/inspections-01.png`}
                alt="Vehicle Inspection Process" 
                className="w-full h-auto" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 bg-primary-light text-white px-4 py-2 rounded-full shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Certified Quality
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-white text-primary-light px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Shield className="h-4 w-4" />
              <span>100% Transparent Process</span>
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-bold mb-6">Why Our Inspection Matters</h3>

            <div className="space-y-4">
              {inspectionFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeFeature === index
                      ? "bg-primary-light text-white shadow-lg"
                      : "bg-white hover:bg-gray-50 border border-gray-100 shadow-sm"
                  }`}
                  onClick={() => setActiveFeature(index)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${activeFeature === index ? "bg-white/20" : "bg-primary-light/10"}`}
                    >
                      <div className={activeFeature === index ? "text-white" : "text-primary-light"}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{feature.title}</h4>
                      <p className={`text-sm ${activeFeature === index ? "text-white/90" : "text-gray-600"}`}>
                        {feature.description}
                      </p>
                    </div>
                    {activeFeature === index && <ChevronRight className="ml-auto h-5 w-5 self-center" />}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <Button className="bg-primary-light hover:bg-primary-dark text-white">
                Learn More About Our Process
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl font-bold text-primary-light mb-2">5,000+</div>
            <div className="text-gray-600">Vehicles Inspected</div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl font-bold text-primary-light mb-2">150</div>
            <div className="text-gray-600">Inspection Points</div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl font-bold text-primary-light mb-2">99.8%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl font-bold text-primary-light mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
