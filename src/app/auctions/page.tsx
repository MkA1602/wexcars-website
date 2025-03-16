'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, ArrowUp, Heart } from 'lucide-react'

export default function Auctions() {
  const auctions = [
    {
      id: 1,
      name: 'Porsche 911 GT3',
      image: '/images/freepik__a-pristine-white-porsche-carrera-gt3-2025-elegantl__76345.png',
      currentBid: 165000,
      timeLeft: '2h 45m',
      watchers: 234,
      totalBids: 23,
      endTime: '2024-03-20T18:00:00Z'
    },
    // Add more auctions here
  ]

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Auctions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bid on exclusive luxury and exotic vehicles. New auctions added daily.
          </p>
        </div>

        {/* Auction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-primary mb-2">24</p>
            <p className="text-gray-600">Active Auctions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-primary mb-2">1,234</p>
            <p className="text-gray-600">Registered Bidders</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-primary mb-2">$12.5M</p>
            <p className="text-gray-600">Total Value</p>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <Link
              href={`/auctions/${auction.id}`}
              key={auction.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={auction.image}
                  alt={auction.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium animate-pulse">
                    Live
                  </span>
                  <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{auction.name}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="text-xl font-bold text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-1 text-primary" />
                      {auction.timeLeft}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {auction.watchers} watching
                  </div>
                  <div className="flex items-center">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {auction.totalBids} bids
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
} 