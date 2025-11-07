"use client"

import VariableProximity from "@/components/ui/variable-proximity"
import { useRef, useState } from "react"
import { Search, MessageCircle, Phone, Mail, MapPin, ChevronRight, HelpCircle, Car, CreditCard, Truck, Shield, Users, FileText, Plus, Minus, Building2, CarFront, Wallet, Package, Star, Settings, Globe, Clock, ShieldCheck, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

// FAQ Accordion Component
function FAQAccordionGroup({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {questions.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-primary-light hover:shadow-lg"
        >
          <motion.button
            onClick={() => toggleAccordion(index)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 pr-4">
              {faq.question}
            </h3>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <svg
                className="h-5 w-5 text-primary-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="px-4 pb-4"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

const faqData = [
  {
    category: "General",
    icon: Building2,
    questions: [
      {
        question: "What is WexCars?",
        answer: "WexCars is a premium luxury car marketplace that connects discerning buyers with exceptional vehicles. We offer a curated collection of high-end cars with comprehensive information and professional service."
      },
      {
        question: "How do I contact WexCars?",
        answer: "You can reach us through multiple channels: phone, email, or our contact form. Our team is available to assist you with any questions about our vehicles or services."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we offer worldwide shipping services. We have extensive experience in international vehicle transport and can deliver to most countries with proper documentation and insurance."
      }
    ]
  },
  {
    category: "Vehicles",
    icon: CarFront,
    questions: [
      {
        question: "Are all vehicles inspected?",
        answer: "Yes, every vehicle in our collection undergoes a thorough multi-point inspection by certified technicians before being listed. We ensure quality and transparency in all our listings."
      },
      {
        question: "Can I view vehicles in person?",
        answer: "Absolutely! We encourage in-person viewings and can arrange private showings at our facilities. We also offer virtual tours for international buyers."
      },
      {
        question: "What warranty do you provide?",
        answer: "We offer comprehensive warranties ranging from 30 days to 1 year depending on the vehicle and your membership level. All warranties cover major components and systems."
      }
    ]
  },
  {
    category: "Pricing & Payment",
    icon: Wallet,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards, bank transfers, and offer flexible financing options through our partner institutions. All transactions are secure and transparent."
      },
      {
        question: "Are there hidden fees?",
        answer: "No, we believe in transparent pricing. All fees including taxes, registration, and additional services are clearly displayed during the purchase process."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    icon: Package,
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Shipping timeframes vary by destination: Europe (5-10 days), North America (10-15 days), and Rest of World (15-25 days). Express options are available for urgent deliveries."
      },
      {
        question: "Is my vehicle insured during shipping?",
        answer: "Yes, all vehicles are fully insured for their complete value during the entire shipping process, including loading, transit, and delivery. We provide comprehensive coverage."
      },
      {
        question: "Can I track my shipment?",
        answer: "Absolutely! You'll receive real-time tracking information and regular updates on your vehicle's location and estimated delivery time throughout the shipping process."
      }
    ]
  }
]

export default function FAQPage() {
  const containerRef = useRef<HTMLElement>(null!)
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${GITHUB_RAW_BASE}/lycan-hypersport-concept.png`}
            alt="Luxury Hypercar"
            className="w-full h-full object-cover object-center opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/90 to-primary-dark/90"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <VariableProximity
                label="Frequently Asked Questions"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-white"
              />
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              <VariableProximity
                label="Find answers to common questions about our services, vehicles, and policies."
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

      {/* FAQ Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {faqData.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <category.icon className="w-6 h-6 text-primary-light mr-3" />
                    {category.category}
                  </h2>
                  <FAQAccordionGroup questions={category.questions} />
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-primary-light hover:bg-primary-dark text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light/10">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Visit Help Center
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
