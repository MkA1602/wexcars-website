import type { Metadata } from "next"
import PricingContent from "@/components/pricing/pricing-content"

export const metadata: Metadata = {
  title: "Pricing | WexCars - Luxury Car Experience",
  description: "Explore our transparent pricing structure for luxury vehicle purchases and services.",
}

export default function PricingPage() {
  return <PricingContent />
}
