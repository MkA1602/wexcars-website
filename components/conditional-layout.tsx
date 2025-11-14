"use client"

import { usePathname } from "next/navigation"
import DynamicHeader from "./dynamic-header"
import ResponsiveFooter from "./responsive-footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMaintenancePage = pathname === "/maintenance"

  return (
    <>
      {!isMaintenancePage && <DynamicHeader />}
      <main className="min-h-screen">{children}</main>
      {!isMaintenancePage && <ResponsiveFooter />}
    </>
  )
}

