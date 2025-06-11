"use client"

import { useEffect, useState } from "react"

interface LayoutTestProps {
  pageName?: string
}

export default function LayoutTest({ pageName = "Current Page" }: LayoutTestProps) {
  const [testResults, setTestResults] = useState({
    headerExists: false,
    footerExists: false,
    headerVisible: false,
    footerVisible: false,
    headerInViewport: false,
    footerInViewport: false,
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    const runTests = () => {
      const header = document.querySelector("header")
      const footer = document.querySelector("footer")

      const isVisible = (element: Element | null) => {
        if (!element) return false
        const style = window.getComputedStyle(element)
        return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0"
      }

      const isInViewport = (element: Element | null) => {
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
      }

      setTestResults({
        headerExists: !!header,
        footerExists: !!footer,
        headerVisible: isVisible(header),
        footerVisible: isVisible(footer),
        headerInViewport: isInViewport(header),
        footerInViewport: isInViewport(footer),
        timestamp: new Date().toISOString(),
      })
    }

    // Run tests immediately and after DOM is fully loaded
    runTests()
    const timer = setTimeout(runTests, 500)

    // Run tests on scroll to check viewport visibility
    const handleScroll = () => runTests()
    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const TestResult = ({ label, passed }: { label: string; passed: boolean }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className={`w-3 h-3 rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}></span>
    </div>
  )

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Layout Test: {pageName}</h3>
      <div className="space-y-1">
        <TestResult label="Header Exists" passed={testResults.headerExists} />
        <TestResult label="Footer Exists" passed={testResults.footerExists} />
        <TestResult label="Header Visible" passed={testResults.headerVisible} />
        <TestResult label="Footer Visible" passed={testResults.footerVisible} />
        <TestResult label="Header in Viewport" passed={testResults.headerInViewport} />
        <TestResult label="Footer in Viewport" passed={testResults.footerInViewport} />
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
        Last check: {new Date(testResults.timestamp).toLocaleTimeString()}
      </div>
    </div>
  )
}
