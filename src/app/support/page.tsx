'use client'

import React, { useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react'

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
      action: 'support@autoex.com',
      buttonText: 'Send Email',
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Support Center</h1>

        {/* FAQs */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openFaq === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === faq.id && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method) => (
            <div key={method.title} className="card text-center">
              <method.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{method.description}</p>
              <p className="font-medium mb-4">{method.action}</p>
              <button className="btn-primary w-full">{method.buttonText}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupportPage 