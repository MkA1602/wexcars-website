"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navigationRoutes = [
  { path: "/", label: "Home" },
  { path: "/collections", label: "Collections" },
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/sign-in", label: "Sign In" },
  { path: "/sign-up", label: "Sign Up" },
  { path: "/auth/login", label: "Login" },
  { path: "/auth/register", label: "Register" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Service" },
  { path: "/cookies", label: "Cookie Policy" },
]

export default function NavigationTest() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsVisible(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          Test Navigation
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Navigation Test</h3>
        <Button onClick={() => setIsVisible(false)} variant="outline" size="sm">
          ×
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Current: {pathname}</p>
        <div className="grid grid-cols-1 gap-1">
          {navigationRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                pathname === route.path ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
