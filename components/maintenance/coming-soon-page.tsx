"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Add data attribute to hide header/footer
    document.documentElement.setAttribute('data-maintenance', 'true')
    document.body.setAttribute('data-maintenance', 'true')
    
    return () => {
      // Cleanup on unmount
      document.documentElement.removeAttribute('data-maintenance')
      document.body.removeAttribute('data-maintenance')
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
              y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
              opacity: 0,
            }}
            animate={{
              y: typeof window !== "undefined" 
                ? [null, Math.random() * window.innerHeight]
                : [null, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            <Image
              src="/new-white-logo-wexcars.png"
              alt="WexCars Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          <span className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
            Coming Soon
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          We're crafting an extraordinary experience for luxury car enthusiasts.
          <br />
          <span className="text-red-400 font-semibold">Something amazing is on the way.</span>
        </motion.p>

        {/* Animated Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-12"
        />

        {/* Features/Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: "🚗", title: "Premium Collection", desc: "Exclusive luxury vehicles" },
            { icon: "✨", title: "Expert Service", desc: "Dedicated support team" },
            { icon: "🌍", title: "Global Reach", desc: "Worldwide delivery" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-8"
        >
          <div className="text-gray-400 text-sm mb-2">We're working hard to launch soon</div>
          <div className="w-full max-w-md mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-red-600"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, delay: 1.4, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-gray-400 text-sm"
        >
          <p>For inquiries, contact us at</p>
          <a
            href="mailto:support@wexcars.com"
            className="text-red-400 hover:text-red-300 transition-colors font-semibold"
          >
            support@wexcars.com
          </a>
        </motion.div>
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <motion.svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(255,255,255,0.05)"
            animate={{
              d: [
                "M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z",
                "M0,60 Q300,40 600,60 T1200,60 L1200,120 L0,120 Z",
                "M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      </div>
    </div>
  )
}

