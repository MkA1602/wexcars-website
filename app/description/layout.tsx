import type React from "react"
import Header from "@/components/header"
import ResponsiveFooter from "@/components/responsive-footer"

export default function DescriptionLayout({
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
