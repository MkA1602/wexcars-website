"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamic import with loading state for the heavy car listing page
const CarListingPage = dynamic(() => import("@/components/car-listing/car-listing-page"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Loading skeleton that matches the actual layout */}
        <div className="mb-8">
          {/* Search bar skeleton */}
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        </div>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter sidebar skeleton */}
          <div className="hidden lg:block">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Car grid skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR for this component to reduce initial bundle
})

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-light rounded-full animate-spin"></div>
      </div>
    }>
      <CarListingPage />
    </Suspense>
  )
}
