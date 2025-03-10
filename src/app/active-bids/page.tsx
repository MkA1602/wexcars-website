'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Clock, DollarSign, Users, AlertTriangle, X } from 'lucide-react'

interface Bid {
  id: number
  title: string
  currentBid: number
  yourBid: number
  timeLeft: string
  totalBids: number
  image: string
  status: 'outbid' | 'winning'
}

const ActiveBidsPage = () => {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [newBidAmount, setNewBidAmount] = useState('')
  const [error, setError] = useState('')

  const activeBids = [
    {
      id: 1,
      title: '2023 Porsche 911 GT3',
      currentBid: 185000,
      yourBid: 182000,
      timeLeft: '2 days',
      totalBids: 12,
      image: 'https://picsum.photos/id/115/800/500',
      status: 'outbid',
    },
    {
      id: 2,
      title: '2022 Ferrari F8 Tributo',
      currentBid: 275000,
      yourBid: 275000,
      timeLeft: '1 day',
      totalBids: 18,
      image: 'https://picsum.photos/id/116/800/500',
      status: 'winning',
    },
    {
      id: 3,
      title: '2023 Lamborghini Huracán',
      currentBid: 245000,
      yourBid: 242000,
      timeLeft: '3 days',
      totalBids: 15,
      image: 'https://picsum.photos/id/117/800/500',
      status: 'outbid',
    },
  ]

  const handlePlaceNewBid = (bid: Bid) => {
    setError('')
    setSelectedBid(bid)
    setNewBidAmount((bid.currentBid + 1000).toString())
  }

  const handleSubmitNewBid = () => {
    if (!selectedBid) return

    const bid = parseFloat(newBidAmount)
    if (isNaN(bid)) {
      setError('Please enter a valid amount')
      return
    }
    if (bid <= selectedBid.currentBid) {
      setError(`Bid must be higher than current bid: $${selectedBid.currentBid.toLocaleString()}`)
      return
    }
    // Here you would typically make an API call to submit the bid
    alert('Bid placed successfully!')
    setSelectedBid(null)
    setNewBidAmount('')
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Active Bids</h1>

        <div className="space-y-6">
          {activeBids.map((bid) => (
            <div key={bid.id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={bid.image}
                      alt={bid.title}
                      width={800}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{bid.title}</h2>
                    <div
                      className={`flex items-center ${
                        bid.status === 'winning'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {bid.status === 'winning' ? (
                        'Winning'
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Outbid
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Current Bid
                      </p>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-primary mr-1" />
                        <span className="font-semibold">
                          ${bid.currentBid.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Your Bid
                      </p>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-primary mr-1" />
                        <span className="font-semibold">
                          ${bid.yourBid.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Time Left
                      </p>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-primary mr-1" />
                        <span className="font-semibold">{bid.timeLeft}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Total Bids
                      </p>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-primary mr-1" />
                        <span className="font-semibold">{bid.totalBids}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      className="btn-primary flex-1"
                      onClick={() => handlePlaceNewBid(bid)}
                    >
                      Place New Bid
                    </button>
                    <button className="btn-secondary">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Bid Modal */}
        {selectedBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Place a New Bid</h2>
                <button 
                  onClick={() => setSelectedBid(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {selectedBid.title}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Current Bid
                    </p>
                    <p className="font-semibold">
                      ${selectedBid.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Your Last Bid
                    </p>
                    <p className="font-semibold">
                      ${selectedBid.yourBid.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <label className="block text-sm font-medium mb-2">
                  Your New Bid Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    className="input w-full pl-10"
                    value={newBidAmount}
                    onChange={(e) => setNewBidAmount(e.target.value)}
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
                  onClick={handleSubmitNewBid}
                >
                  Confirm Bid
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedBid(null)}
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

export default ActiveBidsPage 