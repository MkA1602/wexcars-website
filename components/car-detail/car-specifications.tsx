import type { Car } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CarSpecificationsProps {
  car: Car
}

export default function CarSpecifications({ car }: CarSpecificationsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Specifications</h2>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Engine</div>
              <div className="font-medium">{car.specifications.engine}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Power</div>
              <div className="font-medium">{car.specifications.power}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Acceleration</div>
              <div className="font-medium">{car.specifications.acceleration}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Top Speed</div>
              <div className="font-medium">{car.specifications.topSpeed}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Transmission</div>
              <div className="font-medium">{car.specifications.transmission}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Drivetrain</div>
              <div className="font-medium">{car.specifications.drivetrain}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Fuel Economy</div>
              <div className="font-medium">{car.specifications.fuelEconomy}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Seating</div>
              <div className="font-medium">{car.specifications.seating}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Length</div>
              <div className="font-medium">4,519 mm</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Width</div>
              <div className="font-medium">1,852 mm</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Height</div>
              <div className="font-medium">1,300 mm</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Wheelbase</div>
              <div className="font-medium">2,450 mm</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Curb Weight</div>
              <div className="font-medium">1,455 kg</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Cargo Volume</div>
              <div className="font-medium">132 L</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Fuel Tank</div>
              <div className="font-medium">64 L</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Ground Clearance</div>
              <div className="font-medium">105 mm</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Infotainment</div>
              <div className="font-medium">10.9-inch touchscreen display</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Sound System</div>
              <div className="font-medium">Bose® Surround Sound System</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Climate Control</div>
              <div className="font-medium">Dual-zone automatic</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Seats</div>
              <div className="font-medium">Heated and ventilated leather</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Driver Assistance</div>
              <div className="font-medium">Lane keep assist, adaptive cruise control</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Safety</div>
              <div className="font-medium">Multiple airbags, stability control</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Connectivity</div>
              <div className="font-medium">Apple CarPlay, Android Auto</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Wheels</div>
              <div className="font-medium">20-inch alloy wheels</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
