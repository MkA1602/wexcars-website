"use client"

import { usePathname } from "next/navigation"
import DynamicHeader from "./dynamic-header"
import ResponsiveFooter from "./responsive-footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Check if we're on the maintenance page
  const isMaintenancePage = pathname === "/maintenance" || pathname.startsWith("/maintenance/")

  // Don't render header/footer if on maintenance page
  if (isMaintenancePage) {
    return <>{children}</>
  }

  return (
    <>
      <DynamicHeader />
      <main className="min-h-screen">{children}</main>
      <ResponsiveFooter />
    </>
  )
}

