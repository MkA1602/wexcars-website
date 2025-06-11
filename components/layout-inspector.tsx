"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function LayoutInspector() {
  const [layoutInfo, setLayoutInfo] = useState({
    hasHeader: false,
    hasFooter: false,
    headerHeight: 0,
    footerHeight: 0,
    mainContentHeight: 0,
  })

  const pathname = usePathname()

  useEffect(() => {
    const checkLayout = () => {
      const header = document.querySelector("header")
      const footer = document.querySelector("footer")
      const main = document.querySelector("main")

      setLayoutInfo({
        hasHeader: !!header,
        hasFooter: !!footer,
        headerHeight: header?.offsetHeight || 0,
        footerHeight: footer?.offsetHeight || 0,
        mainContentHeight: main?.offsetHeight || 0,
      })
    }

    // Check immediately and after a short delay to ensure DOM is ready
    checkLayout()
    const timer = setTimeout(checkLayout, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold">Layout Inspector</div>
      <div>Page: {pathname}</div>
      <div className="flex items-center">
        Header:
        <span className={`ml-1 w-2 h-2 rounded-full ${layoutInfo.hasHeader ? "bg-green-400" : "bg-red-400"}`}></span>
        {layoutInfo.hasHeader && <span className="ml-1">({layoutInfo.headerHeight}px)</span>}
      </div>
      <div className="flex items-center">
        Footer:
        <span className={`ml-1 w-2 h-2 rounded-full ${layoutInfo.hasFooter ? "bg-green-400" : "bg-red-400"}`}></span>
        {layoutInfo.hasFooter && <span className="ml-1">({layoutInfo.footerHeight}px)</span>}
      </div>
      <div>Main: {layoutInfo.mainContentHeight}px</div>
    </div>
  )
}
