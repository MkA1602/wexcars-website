import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import Header from "@/components/header"
import ErrorBoundary from "@/components/error-boundary"
import { Suspense } from "react"
import { PerformanceMonitor } from "@/components/performance-monitor"
import ResponsiveFooter from "@/components/responsive-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WexCars - Luxury Car Experience",
  description: "Experience the magic of luxury with WexCars - premium vehicles for discerning customers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>}>
              <Header />
              <main className="min-h-screen">{children}</main>
              <ResponsiveFooter />
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
        <PerformanceMonitor />
      </body>
    </html>
  )
}
