'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Phone, Star, Clock, ExternalLink } from 'lucide-react'

const DealersPage = () => {
  const dealers = [
    {
      id: 1,
      name: 'Premium Auto Gallery',
      rating: 4.8,
      reviews: 156,
      address: '123 Main St, Los Angeles, CA 90012',
      phone: '(213) 555-0123',
      hours: '9:00 AM - 7:00 PM',
      image: 'https://picsum.photos/id/123/800/500',
      specialties: ['BMW', 'Mercedes-Benz', 'Audi'],
    },
    {
      id: 2,
      name: 'Luxury Motors',
      rating: 4.9,
      reviews: 203,
      address: '456 Oak Ave, Miami, FL 33101',
      phone: '(305) 555-0456',
      hours: '8:30 AM - 8:00 PM',
      image: 'https://picsum.photos/id/124/800/500',
      specialties: ['Porsche', 'Ferrari', 'Lamborghini'],
    },
    {
      id: 3,
      name: 'Elite Automotive',
      rating: 4.7,
      reviews: 178,
      address: '789 Park Rd, New York, NY 10001',
      phone: '(212) 555-0789',
      hours: '9:00 AM - 6:00 PM',
      image: 'https://picsum.photos/id/125/800/500',
      specialties: ['Lexus', 'Infiniti', 'Acura'],
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Local Dealers</h1>

        <div className="grid grid-cols-1 gap-6">
          {dealers.map((dealer) => (
            <div key={dealer.id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={dealer.image}
                      alt={dealer.name}
                      width={800}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{dealer.name}</h2>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{dealer.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{dealer.reviews} reviews</span>
                      </div>
                    </div>
                    <button className="btn-primary">
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <span>{dealer.address}</span>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <span>{dealer.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <span>{dealer.hours}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {dealer.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
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

export default DealersPage 