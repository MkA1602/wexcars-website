import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import CarGallery from "@/components/car-gallery"
import CarSpecifications from "@/components/car-specifications"
import RelatedCars from "@/components/related-cars"
import { Star, Calendar, MapPin, Gauge, Check } from "lucide-react"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // This would normally fetch data from a database
  const car = getCar(params.id)

  if (!car) {
    return {
      title: "Car Not Found | AutoWex",
    }
  }

  return {
    title: `${car.title} | AutoWex`,
    description: `${car.year} ${car.title} with ${car.mileage.toLocaleString()} miles. Premium luxury vehicle available at AutoWex.`,
  }
}

function getCar(id: string) {
  // This would normally come from a database
  const cars = [
    {
      id: "mercedes-s-class",
      title: "Mercedes-Benz S-Class",
      year: 2023,
      mileage: 1200,
      price: 89900,
      image: "/placeholder.svg?key=rspkm",
      gallery: [
        "/placeholder.svg?key=rspkm-1",
        "/placeholder.svg?key=rspkm-2",
        "/placeholder.svg?key=rspkm-3",
        "/placeholder.svg?key=rspkm-4",
        "/placeholder.svg?key=rspkm-5",
      ],
      rating: 5,
      location: "New York",
      transmission: "Automatic",
      fuelType: "Hybrid",
      bodyType: "Sedan",
      color: "Black",
      interiorColor: "Beige",
      engine: "3.0L Inline-6 Turbo",
      horsepower: 429,
      features: [
        "Heated and ventilated seats",
        "Panoramic sunroof",
        "Burmester 3D surround sound system",
        "MBUX infotainment system",
        "Driver assistance package",
        "Head-up display",
        "Wireless charging",
        "Ambient lighting",
        "Soft-close doors",
        "Air suspension",
      ],
      description:
        "Experience unparalleled luxury with the 2023 Mercedes-Benz S-Class. This flagship sedan combines cutting-edge technology, exceptional comfort, and powerful performance. The elegant design is complemented by a meticulously crafted interior featuring premium materials and state-of-the-art amenities. The hybrid powertrain delivers impressive efficiency without compromising on the performance expected from a Mercedes-Benz.",
    },
    {
      id: "bmw-7-series",
      title: "BMW 7 Series",
      year: 2023,
      mileage: 800,
      price: 84500,
      image: "/placeholder.svg?key=qzric",
      gallery: [
        "/placeholder.svg?key=qzric-1",
        "/placeholder.svg?key=qzric-2",
        "/placeholder.svg?key=qzric-3",
        "/placeholder.svg?key=qzric-4",
        "/placeholder.svg?key=qzric-5",
      ],
      rating: 5,
      location: "Los Angeles",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "Sedan",
      color: "Alpine White",
      interiorColor: "Black",
      engine: "4.4L V8 Twin-Turbo",
      horsepower: 523,
      features: [
        "Executive Lounge seating",
        "Panoramic Sky Lounge LED roof",
        "Bowers & Wilkins Diamond Surround Sound System",
        "BMW iDrive 8 with curved display",
        "Automatic doors",
        "5-zone automatic climate control",
        "Rear-seat entertainment system",
        "Massage seats",
        "Air suspension",
        "Driving Assistant Professional",
      ],
      description:
        "The 2023 BMW 7 Series represents the pinnacle of BMW's luxury and innovation. This executive sedan offers a perfect blend of opulence, cutting-edge technology, and dynamic driving experience. The spacious interior is crafted with the finest materials and equipped with advanced features for maximum comfort and convenience. The powerful V8 engine delivers exhilarating performance while maintaining the refined driving characteristics expected from BMW's flagship sedan.",
    },
    // Additional cars would be here
  ]

  return cars.find((car) => car.id === id)
}

export default function CarDetailPage({ params }: Props) {
  const car = getCar(params.id)

  if (!car) {
    notFound()
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container-custom">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link href="/inventory" className="text-gray-500 hover:text-primary-600">
                  Inventory
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-primary-600 font-medium">{car.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Car Gallery and Info */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Car Gallery */}
            <div>
              <CarGallery images={car.gallery} title={car.title} />
            </div>

            {/* Car Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {car.year} {car.title}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {[...Array(car.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">5 reviews</span>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Gauge className="h-5 w-5 mr-2" />
                  <span>{car.mileage.toLocaleString()} miles</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{car.location}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-6">${car.price.toLocaleString()}</div>
              <p className="text-gray-700 mb-8">{car.description}</p>
              <div className="space-y-4">
                <button className="btn btn-primary w-full">Schedule Test Drive</button>
                <button className="btn btn-outline w-full">Inquire About This Vehicle</button>
                <button className="btn bg-green-600 hover:bg-green-700 text-white w-full">Calculate Financing</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Specifications */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">Vehicle Specifications</h2>
          <CarSpecifications car={car} />
        </div>
      </section>

      {/* Car Features */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">Features & Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {car.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Cars */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">Similar Vehicles</h2>
          <RelatedCars currentCarId={car.id} />
        </div>
      </section>
    </>
  )
}
