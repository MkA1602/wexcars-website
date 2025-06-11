import HeroSection from "@/components/hero-section"
import CarCategories from "@/components/car-categories"
import FeaturedCars from "@/components/car-listing/featured-cars"
import InspectionSection from "@/components/inspection-section"
import ShippingSection from "@/components/shipping-section"
import { cars } from "@/lib/car-data"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CarCategories />
      <FeaturedCars cars={cars} />
      <InspectionSection />
      <ShippingSection />
    </div>
  )
}
