import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import AdminDashboard from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | WexCars - لوحة تحكم الإدارة",
  description: "Admin dashboard for managing cars and users - لوحة تحكم الإدارة لإدارة السيارات والمستخدمين",
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientWrapper>
        <AdminDashboard />
      </ClientWrapper>
    </div>
  )
} 