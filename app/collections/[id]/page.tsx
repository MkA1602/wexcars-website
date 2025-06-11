import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CarDetailPage from "@/components/car-detail/car-detail-page"
import { cars } from "@/lib/car-data"

interface CarDetailPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  return cars.map((car) => ({
    id: car.id,
  }))
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const car = cars.find((car) => car.id === params.id)

  if (!car) {
    return {
      title: "Car Not Found | WexCars",
      description: "The requested vehicle could not be found.",
    }
  }

  return {
    title: `${car.brand} ${car.name} | WexCars`,
    description: `Explore the ${car.year} ${car.brand} ${car.name}. View specifications, gallery, and inquire about this luxury vehicle.`,
  }
}

export default function CarDetail({ params }: CarDetailPageProps) {
  const car = cars.find((car) => car.id === params.id)

  if (!car) {
    notFound()
  }

  return <CarDetailPage car={car} />
}
