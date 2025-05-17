"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type HeaderContextType = {
  hasHeroSection: boolean
  setHasHeroSection: (value: boolean) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [hasHeroSection, setHasHeroSection] = useState(false)

  return <HeaderContext.Provider value={{ hasHeroSection, setHasHeroSection }}>{children}</HeaderContext.Provider>
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider")
  }
  return context
}
