'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Gavel, Briefcase, Timer, Search, ListChecks, Wrench, HelpCircle } from 'lucide-react'

const Sidebar = () => {
  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Auction', href: '/auctions', icon: Gavel },
    { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { label: 'Active Bids', href: '/active-bids', icon: Timer },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Listings', href: '/listings', icon: ListChecks },
    { label: 'Book Service', href: '/service', icon: Wrench },
    { label: 'Help Center', href: '/help', icon: HelpCircle },
  ]

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm">
      <div className="py-6">
        <div className="px-4 mb-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-[#6B4BFF]">AutoEx</span>
          </Link>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#6B4BFF]"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar 