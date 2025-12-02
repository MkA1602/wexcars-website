"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Mail, Phone, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Youtube, CheckCircle, X } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"

// VFX Types
interface VFXInstance {
  add: (element: HTMLElement, options: { shader: string; overflow: number }) => void
  remove: (element?: HTMLElement) => void
}

declare global {
  interface Window {
    VFX?: any
  }
}

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'info'
    message: string
    title: string
  }>({
    show: false,
    type: 'success',
    message: '',
    title: ''
  })
  const [browserNotificationEnabled, setBrowserNotificationEnabled] = useState(false)
  const subscribeButtonRef = useRef<HTMLButtonElement>(null)

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({
      show: true,
      type,
      title,
      message
    })
    
    // Auto-hide after 6 seconds (increased for better UX)
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 6000)

    // Show browser notification if enabled and permission granted
    if (browserNotificationEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'newsletter-subscription',
        requireInteraction: false
      })
    }
  }

  // Close notification function
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  // VFX Effect removed as per request
  // useEffect(() => { ... })

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showNotification('error', 'Invalid Email', 'Please enter a valid email address')
      return
    }

    try {
      // Try to save to database first
      let subscriptionSuccess = false
      
      try {
        // Test Supabase connection first
        const { data: testData, error: testError } = await supabaseClient
          .from('newsletter_subscribers')
          .select('count')
          .limit(1)

        if (testError) {
          throw new Error(`Supabase connection failed: ${testError.message}`)
        }

        // Check if email already exists
        const { data: existingSubscriber, error: fetchError } = await supabaseClient
          .from('newsletter_subscribers')
          .select('id, status')
          .eq('email', email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw fetchError
        }

        if (existingSubscriber) {
          if (existingSubscriber.status === 'active') {
            showNotification('info', 'Already Subscribed', 'This email is already subscribed to our newsletter')
            return
          } else if (existingSubscriber.status === 'unsubscribed') {
            // Reactivate subscription
            const { error: updateError } = await supabaseClient
              .from('newsletter_subscribers')
              .update({ 
                status: 'active',
                subscribed_at: new Date().toISOString(),
                unsubscribed_at: null
              })
              .eq('id', existingSubscriber.id)

            if (updateError) throw updateError
            
            subscriptionSuccess = true
            showNotification('success', '🎉 Welcome to WexCars!', 'You\'re now subscribed to our exclusive newsletter. Get ready for luxury car updates!')
          }
        } else {
          // Create new subscription
          const { error: insertError } = await supabaseClient
            .from('newsletter_subscribers')
            .insert({
              email: email,
              status: 'active',
              subscribed_at: new Date().toISOString(),
              source: 'website_footer'
            })

          if (insertError) throw insertError
          subscriptionSuccess = true
          showNotification('success', '🚗 Subscription Successful!', 'Welcome to WexCars! You\'ll receive exclusive updates on luxury cars, special offers, and industry news.')
        }
      } catch (dbError: any) {
        console.warn('Database connection failed, using fallback method:', dbError.message)
        
        // Fallback: Store in localStorage temporarily
        const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]')
        
        if (existingSubscriptions.includes(email)) {
          showNotification('info', 'Already Subscribed', 'This email is already subscribed to our newsletter')
          return
        }
        
        existingSubscriptions.push(email)
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(existingSubscriptions))
        subscriptionSuccess = true
        showNotification('success', '🚗 Subscription Successful!', 'Welcome to WexCars! You\'ll receive exclusive updates on luxury cars, special offers, and industry news.')
      }

      if (subscriptionSuccess) {
        // Send welcome email and admin notification in parallel (don't fail if these don't work)
        const emailPromises = []
        
        // Try to send welcome email
        emailPromises.push(
          sendWelcomeEmail(email).catch(error => {
            console.error('Welcome email failed:', error)
            // Log error to database for debugging
            try {
              supabaseClient.from('newsletter_subscribers')
                .update({ tags: ['welcome_email_failed'] })
                .eq('email', email)
                .then(() => {})
            } catch (e) {}
          })
        )
        
        // Try to send admin notification
        emailPromises.push(
          sendAdminNotification(email).catch(error => {
            console.error('Admin notification failed:', error)
            // Note: We'll also handle this via database trigger as backup
          })
        )
        
        // Wait for both to complete (or fail gracefully)
        await Promise.allSettled(emailPromises)

        setIsSubscribed(true)
        setEmail("")
        setTimeout(() => setIsSubscribed(false), 5000)
      }
    } catch (error: any) {
      console.error('Subscription error:', error)
      showNotification('error', 'Subscription Failed', 'Failed to subscribe. Please try again or contact support.')
    }
  }

  const sendWelcomeEmail = async (subscriberEmail: string) => {
    try {
      console.log('Attempting to send welcome email to:', subscriberEmail)
      const { data, error } = await supabaseClient.functions.invoke('send-welcome-email', {
        body: {
          email: subscriberEmail,
          template: 'welcome'
        }
      })

      if (error) {
        console.error('Welcome email function error:', error)
        // If function not found, the database trigger will handle it
        if (error.message?.includes('Function not found') || error.message?.includes('404')) {
          console.warn('Edge Function not deployed. Using database trigger as fallback.')
        }
        throw error
      }
      
      console.log('Welcome email sent successfully:', data)
      return data
    } catch (error: any) {
      console.error('Welcome email service error:', error)
      // The database trigger will send the email as a backup
      throw error
    }
  }

  const sendAdminNotification = async (subscriberEmail: string) => {
    try {
      console.log('Attempting to send admin notification for:', subscriberEmail)
      const { data, error } = await supabaseClient.functions.invoke('send-admin-notification', {
        body: {
          type: 'new_subscriber',
          email: subscriberEmail,
          timestamp: new Date().toISOString()
        }
      })

      if (error) {
        console.error('Admin notification function error:', error)
        // If function not found, the database trigger will handle it
        if (error.message?.includes('Function not found') || error.message?.includes('404')) {
          console.warn('Edge Function not deployed. Using database trigger as fallback.')
        }
        throw error
      }
      
      console.log('Admin notification sent successfully:', data)
      return data
    } catch (error: any) {
      console.error('Admin notification service error:', error)
      // The database trigger will send the email as a backup
      throw error
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* Newsletter Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success' ? 'border-green-500' :
            notification.type === 'error' ? 'border-red-500' :
            'border-blue-500'
          }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${
                  notification.type === 'success' ? 'text-green-500' :
                  notification.type === 'error' ? 'text-red-500' :
                  'text-blue-500'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : notification.type === 'error' ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Mail className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    notification.type === 'success' ? 'text-green-700' :
                    notification.type === 'error' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={closeNotification}
                    className={`inline-flex rounded-md p-1.5 ${
                      notification.type === 'success' ? 'text-green-500 hover:text-green-700' :
                      notification.type === 'error' ? 'text-red-500 hover:text-red-700' :
                      'text-blue-500 hover:text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      notification.type === 'success' ? 'focus:ring-green-500' :
                      notification.type === 'error' ? 'focus:ring-red-500' :
                      'focus:ring-blue-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="relative bg-gradient-to-br from-black-lighter via-black-light to-black text-white overflow-hidden">
      {/* Background Pattern removed */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/geometric-pattern.png')] bg-repeat opacity-20"></div>
      </div> */}

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="border-b border-gray-dark/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Brand Section */}
              <div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-32 h-32">
                    <Image 
                      src={`${GITHUB_RAW_BASE}/new-white-logo-wexcars.png`}
                      alt="WexCars White Logo" 
                      fill 
                      className="object-contain filter brightness-0 invert" 
                      priority
                    />
                  </div>
                </div>
                <p className="text-gray-light max-w-md leading-relaxed mt-2">
                  Discover the world's finest luxury vehicles. From exotic supercars to elegant sedans, we curate an
                  exceptional collection for discerning automotive enthusiasts.
                </p>
              </div>

              {/* Newsletter Section */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Stay Updated</h4>
                <p className="text-gray-medium">Get the latest updates on new arrivals and exclusive offers.</p>
                
                {isSubscribed ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-in fade-in-0 duration-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-green-400 font-medium">🎉 Successfully Subscribed!</p>
                        <p className="text-green-300 text-sm">Welcome to WexCars! Check your email for confirmation.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-black-lighter/50 border border-gray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    <button
                      ref={subscribeButtonRef}
                      type="submit"
                      className="px-6 py-3 bg-[#b22222] rounded-lg font-medium flex items-center justify-center space-x-2 group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(178,34,34,0.6)] hover:scale-[1.02]"
                    >
                      <span className="relative z-10 text-white">Subscribe</span>
                      <ArrowRight className="w-4 h-4 relative z-10 text-white group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Company</h5>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                  { href: "/pricing", label: "Pricing" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-medium hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Services</h5>
              <ul className="space-y-3">
                {[
                  { href: "/collections", label: "Car Collections" },
                  { href: "/collections?category=luxury", label: "Luxury Cars" },
                  { href: "/collections?category=sports", label: "Sports Cars" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-medium hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Support</h5>
              <ul className="space-y-3">
                {[
                  { href: "/help", label: "Help Center" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/shipping", label: "Shipping Info" },
                  { href: "/description", label: "Car Descriptions" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-medium hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">Contact Info</h5>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-gray-medium">
                  <MapPin className="w-5 h-5 mt-0.5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Malmö, Sweden</p>
                    <p className="text-xs text-gray-400">European Headquarters</p>
                    <p className="text-xs text-gray-500">Postal Code: 215 52</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-medium">
                  <Phone className="w-5 h-5 text-red-500" />
                  <a href="tel:+46737200581" className="text-sm hover:text-white transition-colors duration-200">
                    +46 737 200581
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-medium">
                  <Mail className="w-5 h-5 text-red-500" />
                  <a href="mailto:support@wexcars.com" className="text-sm hover:text-white transition-colors duration-200">
                    support@wexcars.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Legal Section */}
        <div className="border-t border-gray-dark/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Social Media Links */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-medium text-sm font-medium">Follow Us:</span>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Instagram, href: "https://www.instagram.com/wexcars1/", label: "Instagram" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Youtube, href: "#", label: "YouTube" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-black-lighter hover:bg-primary-dark rounded-full flex items-center justify-center transition-all duration-200 group"
                    >
                      <social.icon className="w-5 h-5 text-gray-medium group-hover:text-white transition-colors duration-200" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-end space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-medium hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-medium hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-medium hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-dark/30 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="relative w-16 h-16">
                    <Image 
                      src={`${GITHUB_RAW_BASE}/new-white-logo-wexcars.png`}
                      alt="WexCars Logo" 
                      fill 
                      className="object-contain filter brightness-0 invert" 
                    />
                  </div>
                </div>
                <p className="text-gray-medium text-sm">
                  &copy; {currentYear} All rights reserved. | Designed with passion for automotive excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-dark via-primary to-primary-dark"></div>
    </footer>
    </>
  )
}

export default Footer
