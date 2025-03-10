'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Clock, DollarSign, Users, X } from 'lucide-react'

interface Auction {
  id: number
  title: string
  currentBid: number
  totalBids: number
  timeLeft: string
  image: string
}

const AuctionsPage = () => {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [error, setError] = useState('')

  const auctions = [
    {
      id: 1,
      title: '2023 Porsche 911 GT3',
      currentBid: 185000,
      totalBids: 12,
      timeLeft: '2 days',
      image: 'https://picsum.photos/id/115/800/500',
    },
    {
      id: 2,
      title: '2022 Ferrari F8 Tributo',
      currentBid: 275000,
      totalBids: 18,
      timeLeft: '1 day',
      image: 'https://picsum.photos/id/116/800/500',
    },
    {
      id: 3,
      title: '2023 Lamborghini Huracán',
      currentBid: 245000,
      totalBids: 15,
      timeLeft: '3 days',
      image: 'https://picsum.photos/id/117/800/500',
    },
    {
      id: 4,
      title: '2022 McLaren 720S',
      currentBid: 265000,
      totalBids: 20,
      timeLeft: '12 hours',
      image: 'https://picsum.photos/id/118/800/500',
    },
  ]

  const handlePlaceBid = (auction: Auction) => {
    setError('')
    setSelectedAuction(auction)
    setBidAmount((auction.currentBid + 1000).toString())
  }

  const handleSubmitBid = () => {
    if (!selectedAuction) return
    
    const bid = parseFloat(bidAmount)
    if (isNaN(bid)) {
      setError('Please enter a valid amount')
      return
    }
    if (bid <= selectedAuction.currentBid) {
      setError(`Bid must be higher than current bid: $${selectedAuction.currentBid.toLocaleString()}`)
      return
    }
    // Here you would typically make an API call to submit the bid
    alert('Bid placed successfully!')
    setSelectedAuction(null)
    setBidAmount('')
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction.id} className="card group">
              <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={auction.image}
                  alt={auction.title}
                  width={800}
                  height={500}
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{auction.title}</h3>
              
              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">
                  Current Bid: ${auction.currentBid.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {auction.totalBids} bids
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {auction.timeLeft} left
                </div>
              </div>

              <button 
                className="btn-primary w-full"
                onClick={() => handlePlaceBid(auction)}
              >
                Place Bid
              </button>
            </div>
          ))}
        </div>

        {/* Bid Modal */}
        {selectedAuction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Place a Bid</h2>
                <button 
                  onClick={() => setSelectedAuction(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {selectedAuction.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Current Bid: ${selectedAuction.currentBid.toLocaleString()}
                </p>
                
                <label className="block text-sm font-medium mb-2">
                  Your Bid Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    className="input w-full pl-10"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSubmitBid}
                >
                  Confirm Bid
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedAuction(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuctionsPage 