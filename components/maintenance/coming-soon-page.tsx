"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import GridScan from "./grid-scan"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
      {/* GridScan Background */}
      <GridScan className="absolute inset-0 -z-10" style={{ opacity: 0.6 }} />

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 text-white">
          <CardHeader className="flex flex-col items-center gap-4 pt-8">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/10">
                Maintenance Mode
              </Badge>
            </div>
            <CardTitle className="text-center text-3xl md:text-4xl font-bold">
              We're preparing something exceptional
            </CardTitle>
            <CardDescription className="text-center text-base md:text-lg text-gray-300">
              Our team is finalizing a premium experience. Please check back soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            <div className="flex flex-col items-center gap-8">
              {/* Logo - Large and Centered */}
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                  <Image
                    src="/new-white-logo-wexcars.png"
                    alt="WexCars White Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                  />
                </div>
              </motion.div>

              {/* Status */}
              <div className="w-full max-w-xl">
                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                  <span>Deployment progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Contact */}
              <div className="text-center text-sm text-gray-300">
                For urgent inquiries, contact{" "}
                <a className="text-red-400 hover:text-red-300 underline underline-offset-4" href="mailto:support@wexcars.com">
                  support@wexcars.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
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

