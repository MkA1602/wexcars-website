import type { Metadata } from "next"
import { Search, MessageCircle, Phone, Mail, MapPin, ChevronRight, HelpCircle, Car, CreditCard, Truck, Shield, Users, FileText } from "lucide-react"
import Link from "next/link"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

export const metadata: Metadata = {
  title: "Help Center | WexCars - Support & FAQ",
  description: "Get help with your WexCars experience. Find answers to frequently asked questions, contact support, and access resources.",
  keywords: "help, support, FAQ, WexCars, assistance, customer service",
}

const faqCategories = [
  {
    icon: Car,
    title: "Vehicle Information",
    questions: [
      {
        question: "How do I find specific vehicle details?",
        answer: "Each vehicle listing includes comprehensive details including specifications, history, condition report, and high-resolution photos. Click on any vehicle to view its detailed page."
      },
      {
        question: "Are all vehicles inspected before listing?",
        answer: "Yes, every vehicle in our collection undergoes a thorough multi-point inspection by certified technicians before being listed on our platform."
      },
      {
        question: "Can I schedule a viewing of a vehicle?",
        answer: "Absolutely! Contact our team to schedule a private viewing at our showroom or arrange a virtual tour with our specialists."
      }
    ]
  },
  {
    icon: CreditCard,
    title: "Pricing & Payment",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards, bank transfers, cryptocurrency, and offer flexible financing options through our partner institutions."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No, we believe in transparent pricing. All fees including taxes, registration, and any additional services are clearly displayed during the purchase process."
      },
      {
        question: "Do you offer financing options?",
        answer: "Yes, we work with premium financial institutions to offer competitive financing rates for qualified buyers."
      }
    ]
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Shipping timeframes vary by destination: Europe (5-10 days), North America (10-15 days), and Rest of World (15-25 days). Express options are available."
      },
      {
        question: "Is my vehicle insured during shipping?",
        answer: "Yes, all vehicles are fully insured for their complete value during the entire shipping process, including loading, transit, and delivery."
      },
      {
        question: "Can I track my shipment?",
        answer: "Absolutely! You'll receive real-time tracking information and regular updates on your vehicle's location and estimated delivery time."
      }
    ]
  },
  {
    icon: Shield,
    title: "Warranty & Support",
    questions: [
      {
        question: "What warranty do you provide?",
        answer: "We offer comprehensive warranties ranging from 30 days to 1 year depending on your membership level, covering major components and systems."
      },
      {
        question: "How do I claim warranty service?",
        answer: "Contact our support team with your vehicle details and issue description. We'll guide you through the warranty claim process and arrange service."
      },
      {
        question: "Do you provide post-purchase support?",
        answer: "Yes, our dedicated customer success team provides ongoing support for maintenance, service recommendations, and any questions about your vehicle."
      }
    ]
  }
]

const quickLinks = [
  {
    title: "Vehicle Collection",
    description: "Browse our curated selection of luxury vehicles",
    href: "/collections",
    icon: Car
  },
  {
    title: "Pricing Plans",
    description: "Learn about our membership tiers and benefits",
    href: "/pricing",
    icon: CreditCard
  },
  {
    title: "Shipping Information",
    description: "Details about our global delivery service",
    href: "/shipping",
    icon: Truck
  },
  {
    title: "Contact Us",
    description: "Get in touch with our team",
    href: "/contact",
    icon: MessageCircle
  }
]

export default function HelpPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 hero-title-animate">
            Help Center
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg hero-text-animate">
            Find answers to your questions and get the support you need for your luxury vehicle experience.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">How can we help you?</h2>
              <p className="text-gray-600">Search our knowledge base or browse frequently asked questions below.</p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Links</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access the most commonly needed information and resources.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group p-6"
              >
                <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                  <link.icon className="h-6 w-6 text-primary-light group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-light transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                <div className="flex items-center text-primary-light text-sm font-medium">
                  Learn More
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to the most common questions about our services and vehicles.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-primary-light/10 rounded-lg flex items-center justify-center mr-4">
                      <category.icon className="h-5 w-5 text-primary-light" />
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <button className="w-full text-left">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                            <HelpCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          </div>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our support team is here to assist you with any questions or concerns.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-gray-600">+46 737 200581</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM CET</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-gray-600">support@wexcars.com</p>
                  <p className="text-sm text-gray-500">24/7 Response</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-gray-600">Available 24/7</p>
                  <p className="text-sm text-gray-500">Instant Support</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-primary-light hover:bg-primary-dark text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Contact Support Team
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 