'use client'

import React, { useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Phone, Search } from 'lucide-react'

const supportCategories = [
  {
    title: 'Account & Profile',
    topics: [
      'Account settings',
      'Password reset',
      'Profile verification',
      'Notification preferences'
    ]
  },
  {
    title: 'Buying & Bidding',
    topics: [
      'How to place bids',
      'Payment methods',
      'Buyer protection',
      'Purchase history'
    ]
  },
  {
    title: 'Selling',
    topics: [
      'Creating listings',
      'Setting prices',
      'Seller fees',
      'Shipping options'
    ]
  },
  {
    title: 'Technical Issues',
    topics: [
      'Website problems',
      'Mobile app support',
      'Browser compatibility',
      'Error messages'
    ]
  }
]

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I list my car for sale?',
      answer: 'To list your car, go to the "Sell Cars" section and fill out the vehicle information form. Include clear photos and an accurate description. Our team will review your listing within 24-48 hours.',
    },
    {
      id: 2,
      question: 'How does the auction process work?',
      answer: 'Auctions run for a set period, typically 7 days. Place your bid, and if you\'re outbid, you\'ll be notified. The highest bidder at the end of the auction wins. Payment must be completed within 24 hours.',
    },
    {
      id: 3,
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards, bank transfers, and secure digital payment methods. For vehicle purchases, we also work with various financing partners.',
    },
    {
      id: 4,
      question: 'Is there a buyer protection program?',
      answer: 'Yes, all purchases come with our 3-day inspection period and buyer protection program. If the vehicle doesn\'t match the description, you\'re fully covered.',
    },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Available Mon-Fri, 9AM-6PM',
      action: '1-800-AUTO-EX',
      buttonText: 'Call Now',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: '24/7 Support Available',
      action: 'Start a conversation',
      buttonText: 'Chat Now',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Response within 24 hours',
      action: 'support@wexcars.com',
      buttonText: 'Send Email',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">How can we help you?</h1>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.topics.map((topic) => (
                    <li key={topic}>
                      <a href="#" className="text-gray-600 hover:text-primary">
                        {topic}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
              <button className="btn-primary">Start Chat</button>
            </div>
            <div className="text-center p-6">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us Mon-Fri, 9am-6pm EST</p>
              <a href="tel:1-800-123-4567" className="btn-primary">1-800-123-4567</a>
            </div>
            <div className="text-center p-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email</p>
              <a href="mailto:support@wexcars.com" className="btn-primary">support@wexcars.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find quick answers to common questions about using WexCars
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <a
              href="/faqs"
              className="block bg-white rounded-xl shadow-sm p-6 mb-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">How do I place a bid?</h3>
              <p className="text-gray-600 mt-2">Learn about our bidding process and requirements...</p>
            </a>
            <a
              href="/faqs"
              className="block bg-white rounded-xl shadow-sm p-6 mb-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">What are the seller fees?</h3>
              <p className="text-gray-600 mt-2">Understand our fee structure and payment terms...</p>
            </a>
            <div className="text-center mt-8">
              <a href="/faqs" className="btn-secondary">
                View All FAQs
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SupportPage 