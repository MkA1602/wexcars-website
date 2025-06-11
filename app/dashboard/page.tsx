import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicDashboardContent } from "@/components/dashboard/dynamic-dashboard-components"

export const metadata: Metadata = {
  title: "Dashboard | WexCars",
  description: "Manage your WexCars account and listings",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <ClientWrapper>
        <DynamicDashboardContent />
      </ClientWrapper>
    </div>
  )
}
