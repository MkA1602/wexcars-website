import type { Metadata } from "next"
import CookieClientPage from "./CookieClientPage"

export const metadata: Metadata = {
  title: "Cookie Policy | WexCars - Luxury Car Experience",
  description: "Learn about how WexCars uses cookies and similar technologies to enhance your browsing experience.",
}

export default function CookiesPage() {
  return <CookieClientPage />
}
