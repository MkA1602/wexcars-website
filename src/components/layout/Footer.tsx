'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    social: [
      { label: 'Facebook', href: '#', icon: Facebook },
      { label: 'Twitter', href: '#', icon: Twitter },
      { label: 'Instagram', href: '#', icon: Instagram },
      { label: 'LinkedIn', href: '#', icon: Linkedin },
    ],
  }

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-[#6B4BFF]">AutoEx</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Your trusted marketplace for buying and selling vehicles.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-[#6B4BFF]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-[#6B4BFF]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Follow Us</h3>
            <div className="mt-4 flex space-x-6">
              {footerLinks.social.map((link) => (
                <Link key={link.label} href={link.href} className="text-gray-400 hover:text-[#6B4BFF]">
                  <link.icon className="h-6 w-6" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} AutoEx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 