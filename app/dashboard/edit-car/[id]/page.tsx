import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicEditCarForm } from "@/components/dashboard/dynamic-dashboard-components"

export const metadata: Metadata = {
  title: "Edit Car | WexCars Dashboard",
  description: "Edit your car listing on WexCars",
}

export default function EditCarPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Car</h1>
      <ClientWrapper>
        <DynamicEditCarForm carId={params.id} />
      </ClientWrapper>
    </div>
  )
}
