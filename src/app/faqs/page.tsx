'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    category: "General",
    questions: [
      {
        id: "general-1",
        question: "What is WexCars?",
        answer: "WexCars is a premium automotive marketplace that connects buyers and sellers of luxury and exotic vehicles. We provide a secure platform for transactions, vehicle history verification, and expert support throughout the buying and selling process."
      },
      {
        id: "general-2",
        question: "How do I create an account?",
        answer: "Creating an account is easy! Click the Sign Up button in the top right corner, fill in your details, verify your email address, and you are ready to start using WexCars."
      }
    ]
  },
  {
    category: "Buying",
    questions: [
      {
        id: "buying-1",
        question: "How do I place a bid?",
        answer: "To place a bid, you must first create an account and verify your identity. Once verified, navigate to the listing you are interested in and click the Place Bid button. Enter your bid amount and confirm. You will be notified if you are outbid or if you win the auction."
      },
      {
        id: "buying-2",
        question: "What payment methods are accepted?",
        answer: "We accept major credit cards, bank transfers, and verified escrow services. All transactions are secured and monitored for your protection."
      }
    ]
  },
  {
    category: "Selling",
    questions: [
      {
        id: "selling-1",
        question: "How do I list my car?",
        answer: "Click the Add Listing button, fill in your vehicle details, upload high-quality photos, set your price or reserve for auction, and submit for review. Our team will verify your listing within 24 hours."
      },
      {
        id: "selling-2",
        question: "What are the seller fees?",
        answer: "Listing is free. We charge a 3% seller fee only when your vehicle sells. Premium listing features are available for an additional fee."
      }
    ]
  },
  {
    category: "Account & Security",
    questions: [
      {
        id: "security-1",
        question: "How is my information protected?",
        answer: "We use industry-standard encryption and security measures to protect your personal and financial information. Our platform is regularly audited for security compliance."
      },
      {
        id: "security-2",
        question: "What if I forget my password?",
        answer: "Click the Forgot Password link on the login page. We will send you a secure link to reset your password to your registered email address."
      }
    ]
  }
]

export default function FAQsPage() {
  const [openCategory, setOpenCategory] = useState<string | null>("General")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find answers to common questions about using WexCars. Cannot find what you are looking for? 
            Contact our support team.
          </p>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {faqs.map((category) => (
            <div key={category.category} className="border-b border-gray-200 last:border-0">
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      openCategory === category.category ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {openCategory === category.category && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {category.questions.map((faq) => (
                      <div key={faq.id} className="rounded-lg bg-gray-50">
                        <button
                          className="w-full px-4 py-3 text-left focus:outline-none"
                          onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-500 transform transition-transform ${
                                openQuestion === faq.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {openQuestion === faq.id && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
} 