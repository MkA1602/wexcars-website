"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Check, X, Plus, ChevronDown, ChevronUp } from "lucide-react"

// This would normally come from a database
const carsData = [
  {
    id: "mercedes-s-class",
    title: "Mercedes-Benz S-Class",
    year: 2023,
    mileage: 1200,
    price: 89900,
    image: "/placeholder.svg?key=rspkm",
    rating: 5,
    location: "New York",
    transmission: "Automatic",
    fuelType: "Hybrid",
    bodyType: "Sedan",
    color: "Black",
    interiorColor: "Beige",
    engine: "3.0L Inline-6 Turbo",
    horsepower: 429,
    torque: "384 lb-ft",
    acceleration: "4.9 sec",
    topSpeed: "130 mph",
    fuelEconomy: "22 city / 29 hwy",
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
  },
  {
    id: "bmw-7-series",
    title: "BMW 7 Series",
    year: 2023,
    mileage: 800,
    price: 84500,
    image: "/placeholder.svg?key=qzric",
    rating: 5,
    location: "Los Angeles",
    transmission: "Automatic",
    fuelType: "Gasoline",
    bodyType: "Sedan",
    color: "Alpine White",
    interiorColor: "Black",
    engine: "4.4L V8 Twin-Turbo",
    horsepower: 523,
    torque: "553 lb-ft",
    acceleration: "4.2 sec",
    topSpeed: "155 mph",
    fuelEconomy: "17 city / 24 hwy",
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
  },
  {
    id: "audi-a8",
    title: "Audi A8",
    year: 2023,
    mileage: 1500,
    price: 79900,
    image: "/placeholder.svg?key=r5vfs",
    rating: 5,
    location: "Chicago",
    transmission: "Automatic",
    fuelType: "Diesel",
    bodyType: "Sedan",
    color: "Mythos Black",
    interiorColor: "Cognac Brown",
    engine: "3.0L V6 Turbo",
    horsepower: 335,
    torque: "369 lb-ft",
    acceleration: "5.6 sec",
    topSpeed: "130 mph",
    fuelEconomy: "19 city / 27 hwy",
    features: [
      "Valcona leather upholstery",
      "MMI Navigation plus with MMI touch response",
      "Bang & Olufsen 3D Premium Sound System",
      "Audi virtual cockpit",
      "Head-up display",
      "Panoramic sunroof",
      "Four-zone automatic climate control",
      "Ambient LED interior lighting package",
      "Adaptive air suspension",
      "Audi pre sense 360°",
    ],
  },
  {
    id: "porsche-911",
    title: "Porsche 911",
    year: 2023,
    mileage: 500,
    price: 115000,
    image: "/placeholder.svg?key=p911s",
    rating: 5,
    location: "Miami",
    transmission: "Manual",
    fuelType: "Gasoline",
    bodyType: "Coupe",
    color: "Guards Red",
    interiorColor: "Black",
    engine: "3.0L Twin-Turbo Flat-6",
    horsepower: 443,
    torque: "390 lb-ft",
    acceleration: "3.7 sec",
    topSpeed: "182 mph",
    fuelEconomy: "18 city / 24 hwy",
    features: [
      "Sport Chrono Package",
      "PASM Sport Suspension",
      "Sport exhaust system",
      "Porsche Dynamic Light System Plus",
      "Bose Surround Sound System",
      "18-way Adaptive Sport Seats Plus",
      "GT Sport steering wheel",
      "Porsche Communication Management",
      "Apple CarPlay",
      "Lane Change Assist",
    ],
  },
  {
    id: "bentley-continental",
    title: "Bentley Continental GT",
    year: 2022,
    mileage: 2500,
    price: 195000,
    image: "/placeholder.svg?key=bcgt2",
    rating: 5,
    location: "Las Vegas",
    transmission: "Automatic",
    fuelType: "Gasoline",
    bodyType: "Coupe",
    color: "Onyx Black",
    interiorColor: "Linen",
    engine: "6.0L W12 Twin-Turbo",
    horsepower: 626,
    torque: "664 lb-ft",
    acceleration: "3.6 sec",
    topSpeed: "207 mph",
    fuelEconomy: "12 city / 20 hwy",
    features: [
      "Naim for Bentley premium audio system",
      "Rotating display",
      "Diamond-in-Diamond quilting",
      "Bentley Dynamic Ride",
      "Touring Specification",
      "City Specification",
      "Front Seat Comfort Specification",
      "Mood lighting",
      "Panoramic roof",
      "Head-up display",
    ],
  },
]

export default function CompareContent() {
  const searchParams = useSearchParams()
  const [selectedCars, setSelectedCars] = useState<string[]>([])
  const [availableCars, setAvailableCars] = useState(carsData)
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic", "performance", "features"])

  useEffect(() => {
    // Get car IDs from URL query parameters
    const carIds = searchParams.get("cars")?.split(",") || []
    if (carIds.length > 0) {
      setSelectedCars(carIds)
    }
  }, [searchParams])

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  const addCar = (carId: string) => {
    if (selectedCars.length < 3 && !selectedCars.includes(carId)) {
      setSelectedCars([...selectedCars, carId])
    }
  }

  const removeCar = (carId: string) => {
    setSelectedCars(selectedCars.filter((id) => id !== carId))
  }

  // Filter available cars to exclude already selected ones
  const filteredAvailableCars = availableCars.filter((car) => !selectedCars.includes(car.id))

  // Get the full car objects for the selected car IDs
  const carsToCompare = selectedCars
    .map((id) => carsData.find((car) => car.id === id))
    .filter(Boolean) as typeof carsData

  // Get all unique features from the selected cars
  const allFeatures = Array.from(new Set(carsToCompare.flatMap((car) => car.features)))

  return (
    <div className="space-y-8">
      {/* Car Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Select Vehicles to Compare</h2>
        <p className="text-gray-600 mb-6">Choose up to 3 vehicles to compare side by side.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selected car slots */}
          {[0, 1, 2].map((index) => {
            const car = carsToCompare[index]

            return (
              <div
                key={index}
                className={`border rounded-lg ${car ? "bg-white" : "bg-gray-50 border-dashed"} p-4 flex flex-col items-center justify-center min-h-[200px]`}
              >
                {car ? (
                  <>
                    <div className="relative w-full h-32 mb-4">
                      <Image src={car.image || "/placeholder.svg"} alt={car.title} fill className="object-contain" />
                    </div>
                    <h3 className="font-bold text-center mb-2">
                      {car.year} {car.title}
                    </h3>
                    <p className="text-primary-600 font-bold mb-4">${car.price.toLocaleString()}</p>
                    <button
                      onClick={() => removeCar(car.id)}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-200 rounded-full p-3 mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-center mb-4">Select a vehicle to compare</p>
                    {filteredAvailableCars.length > 0 && (
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value=""
                        onChange={(e) => addCar(e.target.value)}
                      >
                        <option value="">Select a vehicle</option>
                        {filteredAvailableCars.map((car) => (
                          <option key={car.id} value={car.id}>
                            {car.year} {car.title} - ${car.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {carsToCompare.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Basic Information */}
          <div className="border-b">
            <button
              className="w-full flex items-center justify-between p-4 text-left font-bold text-lg"
              onClick={() => toggleSection("basic")}
            >
              Basic Information
              {expandedSections.includes("basic") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {expandedSections.includes("basic") && (
              <div className="p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Year</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.year}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Price</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center font-bold text-primary-600">
                          ${car.price.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Mileage</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.mileage.toLocaleString()} miles
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Body Type</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.bodyType}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Exterior Color</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.color}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Interior Color</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.interiorColor}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="text-left p-2 bg-gray-50">Location</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.location}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Performance */}
          <div className="border-b">
            <button
              className="w-full flex items-center justify-between p-4 text-left font-bold text-lg"
              onClick={() => toggleSection("performance")}
            >
              Performance
              {expandedSections.includes("performance") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {expandedSections.includes("performance") && (
              <div className="p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Engine</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.engine}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Horsepower</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.horsepower} hp
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Torque</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.torque}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Transmission</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.transmission}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Fuel Type</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.fuelType}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">0-60 mph</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.acceleration}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <th className="text-left p-2 bg-gray-50">Top Speed</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.topSpeed}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="text-left p-2 bg-gray-50">Fuel Economy</th>
                      {carsToCompare.map((car) => (
                        <td key={car.id} className="p-2 text-center">
                          {car.fuelEconomy}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <button
              className="w-full flex items-center justify-between p-4 text-left font-bold text-lg"
              onClick={() => toggleSection("features")}
            >
              Features
              {expandedSections.includes("features") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {expandedSections.includes("features") && (
              <div className="p-4">
                <table className="w-full">
                  <tbody>
                    {allFeatures.map((feature, index) => (
                      <tr key={index} className={index < allFeatures.length - 1 ? "border-b" : ""}>
                        <th className="text-left p-2 bg-gray-50">{feature}</th>
                        {carsToCompare.map((car) => (
                          <td key={car.id} className="p-2 text-center">
                            {car.features.includes(feature) ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {carsToCompare.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {carsToCompare.map((car) => (
            <Link
              key={car.id}
              href={`/inventory/${car.id}`}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              View {car.title} Details
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
