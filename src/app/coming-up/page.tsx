'use client'

import React from 'react'
import Image from 'next/image'
import { Clock, Calendar, DollarSign } from 'lucide-react'

interface UpcomingCar {
  id: number;
  title: string;
  image: string;
  estimatedPrice: string;
  releaseDate: string;
  description: string;
  highlights: string[];
}

const ComingUpPage = () => {
  const upcomingCars: UpcomingCar[] = [
    {
      id: 1,
      title: '2024 Porsche Macan Electric',
      image: 'https://picsum.photos/id/121/800/500',
      estimatedPrice: '$80,000 - $100,000',
      releaseDate: 'March 2024',
      description: "The all-new electric Macan combines Porsche's sports car DNA with zero emissions capability.",
      highlights: [
        'Dual Motor All-Wheel Drive',
        'Est. Range: 300+ miles',
        'Premium Interior with Latest Tech',
        'Performance-Focused Electric SUV',
      ],
    },
    {
      id: 2,
      title: '2024 Ferrari Purosangue',
      image: 'https://picsum.photos/id/122/800/500',
      estimatedPrice: '$400,000+',
      releaseDate: 'April 2024',
      description: "Ferrari's first-ever SUV, bringing unprecedented levels of performance to the luxury SUV segment.",
      highlights: [
        'V12 Engine',
        'All-Wheel Drive System',
        'Active Suspension Technology',
        'Unique Ferrari Design Language',
      ],
    },
    {
      id: 3,
      title: '2024 BMW M5',
      image: 'https://picsum.photos/id/123/800/500',
      estimatedPrice: '$120,000 - $140,000',
      releaseDate: 'May 2024',
      description: "The next generation of BMW's legendary M5, now with hybrid power for even more performance.",
      highlights: [
        'Hybrid V8 Powertrain',
        'Enhanced M xDrive System',
        'Latest iDrive Technology',
        'Track-Ready Performance',
      ],
    },
  ]

  return (
    <div className="mt-16 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Coming Soon</h1>
          <div className="text-sm text-gray-600">
            Stay updated with the latest upcoming releases
          </div>
        </div>

        <div className="space-y-8">
          {upcomingCars.map((car) => (
            <div key={car.id} className="card group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.title}
                      width={800}
                      height={500}
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold mb-4">{car.title}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm">Estimated Price</p>
                        <p className="font-semibold">{car.estimatedPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm">Expected Release</p>
                        <p className="font-semibold">{car.releaseDate}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{car.description}</p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Key Highlights</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {car.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="btn-primary w-full">
                    Get Notified
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComingUpPage 