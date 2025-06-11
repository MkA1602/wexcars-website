import type { Metadata } from "next"
import ContactContent from "@/components/contact/contact-content"

export const metadata: Metadata = {
  title: "Contact Us | WexCars - Luxury Car Experience",
  description: "Get in touch with WexCars for inquiries about our luxury vehicle collection.",
}

export default function ContactPage() {
  return <ContactContent />
}
