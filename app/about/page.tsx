import type { Metadata } from "next"
import AboutContent from "@/components/about/about-content"

export const metadata: Metadata = {
  title: "About Us | WexCars - Luxury Car Experience",
  description: "Learn about WexCars, our mission, and our commitment to providing the finest luxury vehicles.",
}

export default function AboutPage() {
  return <AboutContent />
}
