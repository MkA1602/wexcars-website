import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import ErrorBoundary from "@/components/error-boundary"
import { Suspense } from "react"
import { PerformanceMonitor } from "@/components/performance-monitor"
import ConditionalLayout from "@/components/conditional-layout"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://wexcars.com'),
  title: "WexCars - Luxury Car Experience",
  description: "Experience the magic of luxury with WexCars - premium vehicles for discerning customers. Discover exclusive luxury cars, supercars, and automotive excellence.",
  keywords: "luxury cars, supercars, premium vehicles, automotive, WexCars, luxury car dealer, exotic cars",
  generator: 'Next.js',
  authors: [{ name: "WexCars Team" }],
  creator: "WexCars",
  publisher: "WexCars",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/wexcars-logo-favicon.png', sizes: 'any', type: 'image/png' },
      { url: '/wexcars-logo-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/wexcars-logo-favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/wexcars-logo-favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/wexcars-logo-favicon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "WexCars - Luxury Car Experience",
    description: "Experience the magic of luxury with WexCars - premium vehicles for discerning customers. Discover exclusive luxury cars, supercars, and automotive excellence.",
    url: "https://wexcars.com",
    siteName: "WexCars",
    images: [
      {
        url: "/wexcars-logo-new.png",
        width: 1200,
        height: 630,
        alt: "WexCars - Luxury Car Experience",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WexCars - Luxury Car Experience",
    description: "Experience the magic of luxury with WexCars - premium vehicles for discerning customers",
    images: ["/wexcars-logo-new.png"],
  },
  verification: {
    google: "your-google-verification-code", // Replace with your actual Google verification code
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and app icons for better search result appearance */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/wexcars-logo-new.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/wexcars-logo-new.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/wexcars-logo-new.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Critical resource preloading for performance */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public/wexcars-logo-new.png" as="image" />
        <link rel="preload" href="https://imgur.com/67e2udd.png" as="image" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//imgur.com" />
        <link rel="dns-prefetch" href="//raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imgur.com" />
        
        {/* Structured Data for Google Search Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WexCars",
              "alternateName": "WexCars Luxury Car Experience",
              "url": "https://wexcars.com",
              "logo": "https://wexcars.com/wexcars-logo-new.png",
              "description": "Experience the magic of luxury with WexCars - premium vehicles for discerning customers. Discover exclusive luxury cars, supercars, and automotive excellence.",
              "foundingDate": "2024",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "215 52",
                "addressLocality": "Malmö",
                "addressCountry": "Sweden"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+46-737-200581",
                "contactType": "customer service",
                "email": "support@wexcars.com"
              },
              "sameAs": [
                "https://www.instagram.com/wexcars1/"
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 55.6050,
                  "longitude": 13.0038
                },
                "geoRadius": "1000000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Luxury Cars",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Luxury Cars",
                      "description": "Premium luxury vehicles and supercars"
                    }
                  }
                ]
              }
            })
          }}
        />
        
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>}>
              <ConditionalLayout>{children}</ConditionalLayout>
            </Suspense>
          </ErrorBoundary>
          <Toaster />
        </AuthProvider>
        <PerformanceMonitor />
      </body>
    </html>
  )
}
