interface CarSpecificationsProps {
  car: {
    year: number
    mileage: number
    transmission?: string
    fuelType?: string
    bodyType?: string
    color?: string
    interiorColor?: string
    engine?: string
    horsepower?: number
  }
}

export default function CarSpecifications({ car }: CarSpecificationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Year</dt>
            <dd className="font-medium">{car.year}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Mileage</dt>
            <dd className="font-medium">{car.mileage.toLocaleString()} miles</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Body Type</dt>
            <dd className="font-medium">{car.bodyType || "N/A"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Exterior Color</dt>
            <dd className="font-medium">{car.color || "N/A"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Interior Color</dt>
            <dd className="font-medium">{car.interiorColor || "N/A"}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Performance</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Engine</dt>
            <dd className="font-medium">{car.engine || "N/A"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Horsepower</dt>
            <dd className="font-medium">{car.horsepower ? `${car.horsepower} hp` : "N/A"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Transmission</dt>
            <dd className="font-medium">{car.transmission || "N/A"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Fuel Type</dt>
            <dd className="font-medium">{car.fuelType || "N/A"}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Warranty</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Basic Warranty</dt>
            <dd className="font-medium">4 years / 50,000 miles</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Powertrain Warranty</dt>
            <dd className="font-medium">6 years / 70,000 miles</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Roadside Assistance</dt>
            <dd className="font-medium">4 years / Unlimited miles</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Corrosion Warranty</dt>
            <dd className="font-medium">12 years / Unlimited miles</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
