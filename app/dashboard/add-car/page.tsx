import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicAddCarForm } from "@/components/dashboard/dynamic-dashboard-components"

export const metadata: Metadata = {
  title: "Add Car | WexCars Dashboard",
  description: "Add a new car listing to WexCars",
}

export default function AddCarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>
      <ClientWrapper>
        <DynamicAddCarForm />
      </ClientWrapper>
    </div>
  )
}
