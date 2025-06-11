"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    gtag: any
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime)
            // Report to analytics
            if (typeof window.gtag !== "undefined") {
              window.gtag("event", "web_vitals", {
                name: "LCP",
                value: Math.round(entry.startTime),
                event_category: "Performance",
              })
            }
          }
        }
      })

      observer.observe({ entryTypes: ["largest-contentful-paint"] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            const fid = entry.processingStart - entry.startTime
            console.log("FID:", fid)
            // Report to analytics
            if (typeof window.gtag !== "undefined") {
              window.gtag("event", "web_vitals", {
                name: "FID",
                value: Math.round(fid),
                event_category: "Performance",
              })
            }
          }
        }
      })

      fidObserver.observe({ entryTypes: ["first-input"] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
      })

      clsObserver.observe({ entryTypes: ["layout-shift"] })

      // Report CLS when the page is hidden
      const reportCLS = () => {
        console.log("CLS:", clsValue)
        if (typeof window.gtag !== "undefined") {
          window.gtag("event", "web_vitals", {
            name: "CLS",
            value: Math.round(clsValue * 1000),
            event_category: "Performance",
          })
        }
      }

      window.addEventListener("beforeunload", reportCLS)
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          reportCLS()
        }
      })

      return () => {
        observer.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
        window.removeEventListener("beforeunload", reportCLS)
      }
    }
  }, [])

  return null
}
