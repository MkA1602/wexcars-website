'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, TrendingUp, Clock, DollarSign } from 'lucide-react'

const PortfolioPage = () => {
  const portfolio = [
    {
      id: 1,
      title: '2022 Porsche 911 GT3',
      purchasePrice: 185000,
      currentValue: 195000,
      appreciation: '+5.4%',
      image: 'https://picsum.photos/id/111/800/500',
      purchaseDate: 'June 2023',
      mileage: '3,500',
    },
    {
      id: 2,
      title: '2021 Ferrari F8 Tributo',
      purchasePrice: 275000,
      currentValue: 285000,
      appreciation: '+3.6%',
      image: 'https://picsum.photos/id/112/800/500',
      purchaseDate: 'August 2023',
      mileage: '2,800',
    },
    {
      id: 3,
      title: '2023 Lamborghini Huracán',
      purchasePrice: 245000,
      currentValue: 255000,
      appreciation: '+4.1%',
      image: 'https://picsum.photos/id/113/800/500',
      purchaseDate: 'October 2023',
      mileage: '1,500',
    },
  ]

  const totalValue = portfolio.reduce((sum, car) => sum + car.currentValue, 0)
  const totalAppreciation = portfolio.reduce(
    (sum, car) => sum + (car.currentValue - car.purchasePrice),
    0
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Portfolio</h1>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-primary" />
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-1">
              ${totalValue.toLocaleString()}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Value</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-sm text-green-600">
                +${totalAppreciation.toLocaleString()}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {((totalAppreciation / (totalValue - totalAppreciation)) * 100).toFixed(1)}%
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Appreciation</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{portfolio.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Cars in Collection</p>
          </div>
        </div>

        {/* Portfolio List */}
        <div className="space-y-6">
          {portfolio.map((car) => (
            <div key={car.id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.title}
                      width={800}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Purchased {car.purchaseDate} • {car.mileage} miles
                      </p>
                    </div>
                    <span className="text-green-600 dark:text-green-400">
                      {car.appreciation}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Purchase Price
                      </p>
                      <p className="font-semibold">
                        ${car.purchasePrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Current Value
                      </p>
                      <p className="font-semibold">
                        ${car.currentValue.toLocaleString()}
                      </p>
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

export default PortfolioPage 