"use client"

import { useEffect, useState } from "react"
import Footer from "./footer"
import FooterMobile from "./footer-mobile"

const ResponsiveFooter = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return isMobile ? <FooterMobile /> : <Footer />
}

export default ResponsiveFooter
