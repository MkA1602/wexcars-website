"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function Analytics() {
  useEffect(() => {
    // Simple page view tracking
    const trackPageView = () => {
      if (window.gtag) {
        window.gtag("config", "G-MEASUREMENT_ID", {
          page_path: window.location.pathname,
        })
      }
    }

    // Track initial page view
    trackPageView()

    // Track page changes
    const handleRouteChange = () => {
      trackPageView()
    }

    // Add listener for route changes
    window.addEventListener("routeChangeComplete", handleRouteChange)

    // Clean up
    return () => {
      window.removeEventListener("routeChangeComplete", handleRouteChange)
    }
  }, [])

  return (
    <>
      {/* Google Analytics Script */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MEASUREMENT_ID');
          `,
        }}
      />
    </>
  )
}
