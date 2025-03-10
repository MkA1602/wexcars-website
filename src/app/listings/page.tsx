'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Clock, DollarSign, Eye, BarChart } from 'lucide-react'

const ListingsPage = () => {
  const [activeTab, setActiveTab] = useState('active')

  const listings = {
    active: [
      {
        id: 1,
        title: '2022 BMW M4 Competition',
        price: 85000,
        views: 234,
        inquiries: 12,
        timeLeft: '6 days',
        image: 'https://picsum.photos/id/111/800/500',
      },
      {
        id: 2,
        title: '2023 Audi RS7',
        price: 125000,
        views: 156,
        inquiries: 8,
        timeLeft: '12 days',
        image: 'https://picsum.photos/id/112/800/500',
      },
    ],
    past: [
      {
        id: 3,
        title: '2021 Mercedes-AMG E63',
        price: 95000,
        views: 423,
        inquiries: 18,
        soldDate: 'Dec 15, 2023',
        image: 'https://picsum.photos/id/113/800/500',
      },
      {
        id: 4,
        title: '2022 Porsche Cayman GT4',
        price: 115000,
        views: 312,
        inquiries: 15,
        soldDate: 'Nov 28, 2023',
        image: 'https://picsum.photos/id/114/800/500',
      },
    ],
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Listings</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`btn ${
              activeTab === 'active' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Listings
          </button>
          <button
            className={`btn ${
              activeTab === 'past' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Listings
          </button>
        </div>

        {/* Listings Grid */}
        <div className="space-y-6">
          {listings[activeTab].map((listing) => (
            <div key={listing.id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      width={800}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                      <div className="flex items-center text-xl font-bold text-primary">
                        <DollarSign className="w-5 h-5" />
                        {listing.price.toLocaleString()}
                      </div>
                    </div>
                    {'timeLeft' in listing ? (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {listing.timeLeft} remaining
                      </div>
                    ) : (
                      <div className="text-gray-600 dark:text-gray-400">
                        Sold on {listing.soldDate}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Views
                      </p>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-primary mr-1" />
                        <span className="font-semibold">{listing.views}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Inquiries
                      </p>
                      <div className="flex items-center">
                        <BarChart className="w-4 h-4 text-primary mr-1" />
                        <span className="font-semibold">{listing.inquiries}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {'timeLeft' in listing ? (
                      <>
                        <button className="btn-primary flex-1">Edit Listing</button>
                        <button className="btn-secondary">View Details</button>
                      </>
                    ) : (
                      <button className="btn-secondary flex-1">View Details</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListingsPage 