import type React from "react"
import Header from "@/components/header"
import ResponsiveFooter from "@/components/responsive-footer"

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <ResponsiveFooter />
    </>
  )
}
