"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import RacingLoader from "@/components/ui/racing-loader"

// Dynamic import with racing loader for better UX
const CarListingPage = dynamic(() => import("@/components/car-listing/car-listing-page"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <RacingLoader size="lg" showText={true} text="Loading luxury cars..." />
    </div>
  ),
  ssr: false, // Disable SSR for this component to reduce initial bundle
})

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RacingLoader size="lg" showText={true} text="Loading car collection..." />
      </div>
    }>
      <CarListingPage />
    </Suspense>
  )
}
