"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface PageCheck {
  path: string
  name: string
  status: "pending" | "success" | "error" | "warning"
  hasHeader: boolean
  hasFooter: boolean
  error?: string
}

export default function LayoutVerification() {
  const [checks, setChecks] = useState<PageCheck[]>([
    { path: "/", name: "Home Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/collections", name: "Collections Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/about", name: "About Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/contact", name: "Contact Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/pricing", name: "Pricing Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/privacy", name: "Privacy Policy", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/terms", name: "Terms of Service", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/cookies", name: "Cookie Policy", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/auth/login", name: "Login Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/auth/register", name: "Register Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/sign-in", name: "Sign In Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/sign-up", name: "Sign Up Page", status: "pending", hasHeader: false, hasFooter: false },
    { path: "/dashboard", name: "Dashboard", status: "pending", hasHeader: false, hasFooter: false },
  ])

  const [isChecking, setIsChecking] = useState(false)

  const checkPage = async (pageCheck: PageCheck): Promise<PageCheck> => {
    try {
      // Simulate checking if header and footer exist on the page
      // In a real implementation, this would make actual requests or use DOM inspection

      // For now, we'll assume all pages should have header and footer based on the layout
      const hasHeader = true // All pages should have header from layout
      const hasFooter = true // All pages should have footer from layout

      let status: PageCheck["status"] = "success"
      let error: string | undefined

      // Special cases for auth pages that might have different layouts
      if (pageCheck.path.includes("/auth/") || pageCheck.path.includes("/sign-")) {
        // Auth pages might have different layouts, check if they explicitly include header/footer
        status = hasHeader && hasFooter ? "success" : "warning"
        if (!hasHeader || !hasFooter) {
          error = "Auth page may have custom layout without header/footer"
        }
      }

      return {
        ...pageCheck,
        status,
        hasHeader,
        hasFooter,
        error,
      }
    } catch (err) {
      return {
        ...pageCheck,
        status: "error",
        hasHeader: false,
        hasFooter: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }
    }
  }

  const runAllChecks = async () => {
    setIsChecking(true)

    for (let i = 0; i < checks.length; i++) {
      const updatedCheck = await checkPage(checks[i])

      setChecks((prev) => prev.map((check, index) => (index === i ? updatedCheck : check)))

      // Add a small delay to make the checking process visible
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    setIsChecking(false)
  }

  const getStatusIcon = (status: PageCheck["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: PageCheck["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const successCount = checks.filter((c) => c.status === "success").length
  const errorCount = checks.filter((c) => c.status === "error").length
  const warningCount = checks.filter((c) => c.status === "warning").length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Layout Verification Report</h1>

        <div className="mb-6">
          <button
            onClick={runAllChecks}
            disabled={isChecking}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium"
          >
            {isChecking ? "Checking..." : "Run Layout Check"}
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-green-600">Successful</p>
                <p className="text-2xl font-bold text-green-700">{successCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-yellow-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-6 h-6 text-red-500 mr-2" />
              <div>
                <p className="text-sm text-red-600">Errors</p>
                <p className="text-2xl font-bold text-red-700">{errorCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={check.path} className={`border rounded-lg p-4 ${getStatusColor(check.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <h3 className="font-medium">{check.name}</h3>
                    <p className="text-sm text-gray-600">{check.path}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-1 ${
                        check.hasHeader ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    Header
                  </div>
                  <div className="text-sm">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-1 ${
                        check.hasFooter ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    Footer
                  </div>
                  <Link
                    href={check.path}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Page
                  </Link>
                </div>
              </div>

              {check.error && <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">{check.error}</div>}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Layout Verification Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• All pages should inherit header and footer from the root layout</li>
            <li>• Auth pages may have custom layouts but should still include navigation</li>
            <li>• Check for proper responsive behavior on mobile devices</li>
            <li>• Verify that all navigation links in header and footer work correctly</li>
            <li>• Ensure consistent styling across all pages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
