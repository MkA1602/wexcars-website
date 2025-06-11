import type { Metadata } from "next"
import LayoutVerification from "@/components/layout-verification"

export const metadata: Metadata = {
  title: "Layout Verification | WexCars Admin",
  description: "Verify that header and footer appear correctly on all pages",
}

export default function LayoutCheckPage() {
  return <LayoutVerification />
}
