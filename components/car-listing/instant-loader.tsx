"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import RacingLoader from "@/components/ui/racing-loader"

// Instant loading skeleton that matches car card layout exactly
export default function InstantLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with racing loader */}
      <div className="bg-gradient-to-br from-primary-light to-primary-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Car Collection
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Loading luxury cars for you...
          </p>
          <RacingLoader size="lg" showText={false} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter sidebar skeleton */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Car grid skeleton with exact card structure */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden h-full flex flex-col group animate-pulse">
                  {/* Image skeleton */}
                  <div className="relative">
                    <div className="h-48 bg-gray-200"></div>
                    {/* Heart button skeleton */}
                    <div className="absolute top-2 right-2 w-9 h-9 bg-gray-300 rounded-full"></div>
                    {/* Featured badge skeleton */}
                    {i < 3 && (
                      <Badge className="absolute top-2 left-2 bg-gray-300 text-transparent">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        {/* Title skeleton */}
                        <div className="h-6 bg-gray-200 rounded mb-2 w-4/5"></div>
                        {/* Details line skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                      {/* Rating skeleton */}
                      <div className="flex items-center ml-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-6 h-4 bg-gray-200 rounded ml-1"></div>
                      </div>
                    </div>

                    {/* Category badges skeleton */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>

                    {/* Seller info skeleton */}
                    <div className="mb-3">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 border-t mt-auto">
                    {/* Price skeleton */}
                    <div className="space-y-2 w-full">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
