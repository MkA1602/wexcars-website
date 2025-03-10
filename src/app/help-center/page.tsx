'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, Book, Car, DollarSign, Shield, MessageCircle } from 'lucide-react'

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'buying',
      title: 'Buying a Car',
      icon: Car,
      articles: [
        {
          id: 1,
          title: 'How to participate in car auctions',
          description: 'Learn the basics of bidding and winning car auctions.',
        },
        {
          id: 2,
          title: 'Understanding car conditions and ratings',
          description: 'A guide to our vehicle condition rating system.',
        },
        {
          id: 3,
          title: 'Financing options and payment methods',
          description: 'Available financing options and accepted payment methods.',
        },
      ],
    },
    {
      id: 'selling',
      title: 'Selling Your Car',
      icon: DollarSign,
      articles: [
        {
          id: 4,
          title: 'How to create an effective listing',
          description: 'Tips for creating attractive and successful car listings.',
        },
        {
          id: 5,
          title: 'Pricing your car competitively',
          description: 'Guide to pricing strategies and market research.',
        },
        {
          id: 6,
          title: 'Managing inquiries and offers',
          description: 'Best practices for handling buyer communications.',
        },
      ],
    },
    {
      id: 'protection',
      title: 'Buyer Protection',
      icon: Shield,
      articles: [
        {
          id: 7,
          title: 'Understanding buyer protection program',
          description: 'Details about our buyer protection policies.',
        },
        {
          id: 8,
          title: 'Vehicle inspection process',
          description: 'How our vehicle inspection process works.',
        },
        {
          id: 9,
          title: 'Dispute resolution process',
          description: 'Steps to resolve issues with a purchase.',
        },
      ],
    },
  ]

  const quickLinks = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
    },
    {
      icon: Book,
      title: 'Knowledge Base',
      description: 'Browse all articles',
      action: 'View Articles',
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>

        {/* Search */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">How can we help you?</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="input w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickLinks.map((link) => (
            <div key={link.title} className="card">
              <div className="flex items-center gap-4">
                <link.icon className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
                <button className="btn-primary">{link.action}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="card">
              <button
                className="w-full"
                onClick={() =>
                  setOpenCategory(openCategory === category.id ? null : category.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <category.icon className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openCategory === category.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {openCategory === category.id && (
                <div className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  {category.articles.map((article) => (
                    <div key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors">
                      <h4 className="font-medium mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {article.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpCenterPage 