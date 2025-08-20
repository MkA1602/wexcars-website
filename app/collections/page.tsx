"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import InstantLoader from "@/components/car-listing/instant-loader"

// Dynamic import with instant loader that shows immediately
const CarListingPage = dynamic(() => import("@/components/car-listing/car-listing-page"), {
  loading: () => <InstantLoader />,
  ssr: false, // Disable SSR for this component to reduce initial bundle
})

export default function CollectionsPage() {
  return (
    <Suspense fallback={<InstantLoader />}>
      <CarListingPage />
    </Suspense>
  )
}
