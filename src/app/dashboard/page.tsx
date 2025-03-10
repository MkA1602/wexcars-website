'use client'

import React from 'react'
import { BarChart, Car, DollarSign, Users } from 'lucide-react'

const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Bids',
      value: '156',
      change: '+12%',
      icon: BarChart,
    },
    {
      title: 'Active Listings',
      value: '23',
      change: '+4%',
      icon: Car,
    },
    {
      title: 'Total Spent',
      value: '$45,290',
      change: '+8%',
      icon: DollarSign,
    },
    {
      title: 'Saved Searches',
      value: '8',
      change: '+2',
      icon: Users,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'bid',
      title: '2023 BMW M3 Competition',
      amount: '$75,000',
      status: 'Outbid',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'listing',
      title: '2022 Porsche 911 GT3',
      amount: '$185,000',
      status: 'Active',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'search',
      title: 'Mercedes-AMG GT',
      amount: null,
      status: 'Saved',
      time: '3 days ago',
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
                <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div>
                  <h3 className="font-medium mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-medium mb-1">{activity.amount}</p>
                  )}
                  <span
                    className={`text-sm ${
                      activity.status === 'Outbid'
                        ? 'text-red-600 dark:text-red-400'
                        : activity.status === 'Active'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 