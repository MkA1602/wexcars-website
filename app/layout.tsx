import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import AuthHeader from "@/components/auth-header"
import ErrorBoundary from "@/components/error-boundary"
import { Suspense } from "react"
import { PerformanceMonitor } from "@/components/performance-monitor"
import ResponsiveFooter from "@/components/responsive-footer"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

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
      <head>
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
        
        {/* Clean up any duplicate Google Maps scripts */}
        <Script
          id="cleanup-google-maps"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove duplicate Google Maps scripts
                const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
                if (scripts.length > 1) {
                  console.log('Removing duplicate Google Maps scripts:', scripts.length);
                  for (let i = 1; i < scripts.length; i++) {
                    scripts[i].remove();
                  }
                }
                
                // Reset global loading state
                if (window.googleMapsLoading) {
                  window.googleMapsLoading = false;
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>}>
              <AuthHeader />
              <main className="min-h-screen">{children}</main>
              <ResponsiveFooter />
            </Suspense>
          </ErrorBoundary>
          <Toaster />
        </AuthProvider>
        <PerformanceMonitor />
      </body>
    </html>
  )
}
